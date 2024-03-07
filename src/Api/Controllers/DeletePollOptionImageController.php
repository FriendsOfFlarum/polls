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
use FoF\Polls\PollOption;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class DeletePollOptionImageController implements RequestHandlerInterface
{
    /**
     * @var Cloud
     */
    protected $uploadDir;

    public function __construct(Factory $filesystemFactory)
    {
        $this->uploadDir = $filesystemFactory->disk('fof-polls');
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $pollOptionId = Arr::get($request->getQueryParams(), 'id');
        $pollOption = PollOption::find($pollOptionId);

        $actor = RequestUtil::getActor($request);
        $actor->assertCan('edit', $pollOption->poll);

        $this->uploadDir->delete($pollOption->image);

        $pollOption->image = null;
        $pollOption->save();

        return new EmptyResponse(204);
    }
}
