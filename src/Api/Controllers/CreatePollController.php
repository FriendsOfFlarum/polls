<?php

namespace FoF\Polls\Api\Controllers;

use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Bus\Dispatcher;
use Flarum\Http\RequestUtil;
use Flarum\Post\Post;
use FoF\Polls\Api\Serializers\PollSerializer;
use FoF\Polls\Commands\CreatePoll;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class CreatePollController extends AbstractCreateController
{
    public $serializer = PollSerializer::class;

    public $include = ['options'];

    /**
     * @var Dispatcher
     */
    protected $bus;

    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        return $this->bus->dispatch(
            new CreatePoll(
                RequestUtil::getActor($request),
                Post::findOrFail(Arr::get($request->getParsedBody(), 'data.relationships.post.data.id')),
                Arr::get($request->getParsedBody(), 'data.attributes')
            )
        );
    }
}
