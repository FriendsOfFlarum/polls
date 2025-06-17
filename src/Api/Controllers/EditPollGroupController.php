<?php

namespace FoF\Polls\Api\Controllers;

use FoF\Polls\Api\Serializers\PollGroupSerializer;
use FoF\Polls\Commands\EditPollGroup;
use Flarum\Api\Controller\AbstractShowController;
use Illuminate\Support\Arr;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class EditPollGroupController extends AbstractShowController
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
            new EditPollGroup(
                $request->getAttribute('actor'),
                Arr::get($request->getQueryParams(), 'id'),
                Arr::get($request->getParsedBody(), 'data', [])
            )
        );
    }
}