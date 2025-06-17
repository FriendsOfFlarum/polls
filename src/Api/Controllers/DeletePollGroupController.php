<?php

namespace FoF\Polls\Api\Controllers;

use FoF\Polls\Commands\DeletePollGroup;
use Flarum\Api\Controller\AbstractDeleteController;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class DeletePollGroupController extends AbstractDeleteController
{
    protected $bus;

    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }

    protected function delete(ServerRequestInterface $request)
    {
        $this->bus->dispatch(
            new DeletePollGroup(
                $request->getAttribute('actor'),
                Arr::get($request->getQueryParams(), 'id')
            )
        );
    }
}