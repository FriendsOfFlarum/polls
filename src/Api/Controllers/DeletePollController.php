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

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use FoF\Polls\Api\Serializers\PollSerializer;
use FoF\Polls\Commands\DeletePoll;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class DeletePollController extends AbstractDeleteController
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
     * Delete the resource.
     *
     * @param ServerRequestInterface $request
     */
    protected function delete(ServerRequestInterface $request): void
    {
        return $this->bus->dispatch(
            new DeletePoll(
                RequestUtil::getActor($request),
                Arr::get($request->getQueryParams(), 'id')
            )
        );
    }
}
