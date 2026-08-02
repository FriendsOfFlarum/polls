<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Api\Controllers;

use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\PermissionDeniedException;
use Flarum\User\User;
use FoF\Polls\Events\PollImageWillBeResized;
use FoF\Polls\Poll;
use FoF\Polls\PollImageUploader;
use FoF\Polls\Validators\PollImageValidator;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;
use Intervention\Image\ImageManager;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class UploadPollImageController implements RequestHandlerInterface
{
    protected string $filenamePrefix = 'pollImage';

    public function __construct(
        protected PollImageUploader $uploader,
        protected PollImageValidator $validator,
        protected ImageManager $imageManager,
        protected Dispatcher $events,
        protected SettingsRepositoryInterface $settings,
    ) {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $pollId = Arr::get($request->getQueryParams(), 'pollId');

        $actor->assertCan('uploadPollImages');

        if ($pollId) {
            $poll = Poll::findOrFail($pollId);
            $actor->assertCan('edit', $poll);
        } else {
            $poll = null;

            // The poll doesn't exist yet (the composer uploads the image
            // before saving), so there is no model to authorize against —
            // only "may this actor start a poll at all". `startPoll` cannot
            // serve here: it is a policy ability on Post, so with no model
            // core's Gate falls back to hasPermission('startPoll'), which no
            // group can ever hold. That made this admin-only (issue #131).
            $this->assertCanStartAnyPoll($actor);
        }

        $file = Arr::get($request->getUploadedFiles(), $this->filenamePrefix);

        $this->validator->assertValid([$this->filenamePrefix => $file]);

        $image = $this->imageManager->read($file->getStream()->getMetadata('uri'));

        $baseWidth = (int) ($this->settings->get('fof-polls.image_width') ?: 250);
        $baseHeight = (int) ($this->settings->get('fof-polls.image_height') ?: 250);

        $this->events->dispatch(new PollImageWillBeResized(
            $image,
            $this->filenamePrefix,
            $baseHeight,
            $baseWidth,
            $image->isAnimated(),
        ));

        $uploadName = $this->uploader->upload($this->filenamePrefix, $image);

        if ($poll) {
            // Delete old image variants if replacing
            if ($poll->image && !filter_var($poll->image, FILTER_VALIDATE_URL)) {
                $this->uploader->deleteAllVariants($poll->image);
            }

            $poll->image = $uploadName;
            $poll->save();
        }

        return new JsonResponse([
            'fileUrl'  => $this->uploader->url($uploadName),
            'fileName' => $uploadName,
        ]);
    }

    /**
     * Assert the actor may start a poll somewhere — used when the poll being
     * illustrated does not exist yet, so there is nothing to authorize
     * against. Global polls and discussion polls are separate abilities, and
     * holding either is enough to be legitimately uploading an image.
     */
    protected function assertCanStartAnyPoll(User $actor): void
    {
        if ($actor->can('startGlobalPoll') || $actor->can('discussion.polls.start')) {
            return;
        }

        throw new PermissionDeniedException();
    }
}
