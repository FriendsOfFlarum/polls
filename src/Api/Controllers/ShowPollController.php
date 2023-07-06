<?php

namespace FoF\Polls\Api\Controllers;

use Flarum\Api\Controller\AbstractShowController;
use FoF\Polls\Api\Serializers\PollSerializer;
use FoF\Polls\Poll;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ShowPollController extends AbstractShowController {
    /**
     * {@inheritdoc}
     */
    public $serializer = PollSerializer::class;

    public $include = ['options', 'myVotes', 'myVotes.option'];

    public $optionalInclude = ['votes', 'votes.option', 'votes.user'];

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        return Poll::findOrFail(Arr::get($request->getQueryParams(), 'id'));
    }
}
