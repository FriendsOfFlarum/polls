<?php
/*
 * This file is part of reflar/polls.
 *
 * Copyright (c) ReFlar.
 *
 * https://reflar.redevs.org
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Reflar\Polls\Api\Controllers;

use DateTime;
use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Post\Exception\FloodingException;
use Flarum\User\AssertPermissionTrait;
use Flarum\User\Exception\PermissionDeniedException;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\Polls\Api\Serializers\VoteSerializer;
use Reflar\Polls\Events\PollWasVoted;
use Reflar\Polls\Question;
use Reflar\Polls\Vote;
use Tobscure\JsonApi\Document;

class CreateVoteController extends AbstractCreateController
{
    use AssertPermissionTrait;

    /**
     * @var string
     */
    public $serializer = VoteSerializer::class;

    /**
     * @param ServerRequestInterface $request
     * @param Document               $document
     *
     * @throws FloodingException
     * @throws PermissionDeniedException
     *
     * @return mixed|static
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');

        $attributes = array_get($request->getParsedBody(), 'data.attributes', []);

        $this->assertNotFlooding($actor);

        $question = Question::find($attributes['poll_id']);

        if ($question->isEnded()) {
            throw new PermissionDeniedException();
        }

        $this->assertCan($actor, 'votePolls');

        $vote = Vote::build($attributes['poll_id'], $actor->id, $attributes['option_id']);

        $actor->last_vote_time = new DateTime();
        $actor->save();

        $vote->save();

        app()->make('events')->fire(new PollWasVoted($vote, $question, $actor));

        return $vote;
    }

    /**
     * @param $actor
     *
     * @throws FloodingException
     */
    public function assertNotFlooding($actor)
    {
        if (new DateTime($actor->last_vote_time) >= new DateTime('-10 seconds')) {
            throw new FloodingException();
        }
    }
}
