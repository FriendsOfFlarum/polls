<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Api\Middleware;

use Flarum\Http\RequestUtil;
use FoF\Polls\Poll;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * Tell Poll whose votes `myVotes` means, once, for every API request — the
 * poll endpoints, the post and discussion endpoints that include polls, and
 * the internal requests that preload a page. Restored afterwards, so a request
 * made from inside another (the API client) does not leave its actor behind.
 */
class SetPollViewer implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $previous = Poll::stateUser();
        Poll::setStateUser(RequestUtil::getActor($request));

        try {
            return $handler->handle($request);
        } finally {
            Poll::setStateUser($previous);
        }
    }
}
