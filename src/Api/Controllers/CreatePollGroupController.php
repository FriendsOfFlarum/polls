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

use Flarum\Api\Controller\AbstractCreateController;
use FoF\Polls\Api\Serializers\PollGroupSerializer;
use FoF\Polls\Commands\CreatePollGroup;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class CreatePollGroupController extends AbstractCreateController
{
    public $serializer = PollGroupSerializer::class;

    protected $bus;

    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        return $this->bus->dispatch(
            new CreatePollGroup(
                $request->getAttribute('actor'),
                Arr::get($request->getParsedBody(), 'data', [])
            )
        );
    }
}
