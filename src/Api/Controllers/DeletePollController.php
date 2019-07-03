<?php


namespace FoF\Polls\Api\Controllers;


use Flarum\Api\Controller\AbstractDeleteController;
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
     * Delete the resource.
     *
     * @param ServerRequestInterface $request
     */
    protected function delete(ServerRequestInterface $request)
    {
        return $this->bus->dispatch(
            new DeletePoll(
                $request->getAttribute('actor'),
                Arr::get($request->getQueryParams(), 'id'),
            )
        );
    }
}