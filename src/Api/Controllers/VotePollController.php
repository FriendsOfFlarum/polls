<?php


namespace FoF\Polls\Api\Controllers;


use Flarum\Api\Controller\AbstractShowController;
use FoF\Polls\Commands\VotePoll;
use FoF\Polls\Api\Serializers\PollSerializer;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class VotePollController extends AbstractShowController
{
    /**
     * @var string
     */
    public $serializer = PollSerializer::class;

    public $include = ['options', 'votes', 'votes.option', 'votes.user'];

    /**
     * @var Dispatcher
     */
    protected $bus;

    /**
     * @param Dispatcher $bus
     */
    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }

    /**
     * Get the data to be serialized and assigned to the response document.
     *
     * @param ServerRequestInterface $request
     * @param Document $document
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        return $this->bus->dispatch(
            new VotePoll(
                $request->getAttribute('actor'),
                Arr::get($request->getQueryParams(), 'id'),
                Arr::get($request->getParsedBody(), 'data', [])
            )
        );
    }
}