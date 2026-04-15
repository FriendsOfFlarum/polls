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
use FoF\Polls\Commands\DeletePollGroup;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

/**
 * @TODO: Remove this in favor of one of the API resource classes that were added.
 *      Or extend an existing API Resource to add this to.
 *      Or use a vanilla RequestHandlerInterface controller.
 *      @link https://docs.flarum.org/2.x/extend/api#endpoints
 */
class DeletePollGroupController extends AbstractDeleteController
{
    public function __construct(protected Dispatcher $bus)
    {
    }

    protected function delete(ServerRequestInterface $request): void
    {
        $this->bus->dispatch(
            new DeletePollGroup(
                RequestUtil::getActor($request),
                Arr::get($request->getQueryParams(), 'id')
            )
        );
    }
}
