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

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use FoF\Polls\Api\Serializers\PollSerializer;
use FoF\Polls\Commands\EditPoll;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

/**
 * @TODO: Remove this in favor of one of the API resource classes that were added.
 *      Or extend an existing API Resource to add this to.
 *      Or use a vanilla RequestHandlerInterface controller.
 *      @link https://docs.flarum.org/2.x/extend/api#endpoints
 */
class EditPollController extends AbstractShowController
{
    /**
     * @var string
     */
    public $serializer = PollSerializer::class;

    public $include = ['options'];

    public function __construct(protected Dispatcher $bus)
    {
    }

    /**
     * Get the data to be serialized and assigned to the response document.
     *
     * @param ServerRequestInterface $request
     * @param Document               $document
     *
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        return $this->bus->dispatch(
            new EditPoll(
                RequestUtil::getActor($request),
                Arr::get($request->getQueryParams(), 'id'),
                Arr::get($request->getParsedBody(), 'data', [])
            )
        );
    }
}
