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
use Flarum\Api\Controller\AbstractShowController;
use Flarum\Post\Exception\FloodingException;
use Flarum\User\AssertPermissionTrait;
use Flarum\User\Exception\PermissionDeniedException;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\Polls\Api\Serializers\VoteSerializer;
use Reflar\Polls\Events\PollWasVoted;
use Reflar\Polls\Question;
use Reflar\Polls\Vote;
use Tobscure\JsonApi\Document;

class UpdateVoteController extends AbstractShowController
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
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');

        $attributes = $request->getParsedBody();

        $this->assertCan($actor, 'votePolls');

        $question = Question::find($attributes['poll_id']);

        $this->assertNotFlooding($actor);

        if ($question->isEnded()) {
            throw new PermissionDeniedException();
        }

        $vote = Vote::where('user_id', $actor->id)
            ->where('poll_id', $attributes['poll_id'])
            ->first();

        $vote->option_id = $attributes['option_id'];

        $actor->last_vote_time = new DateTime();
        $actor->save();

        $vote->save();

        app()->make('events')->fire(new PollWasVoted($vote, $question, $actor, true));

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
