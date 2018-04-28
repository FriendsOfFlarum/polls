<?php
/*
 * This file is part of reflar/polls.
 *
 * Copyright (c) ReFlar.
 *
 * http://reflar.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Reflar\Polls\Api\Controllers;

use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Core\Access\AssertPermissionTrait;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\Polls\Api\Serializers\VoteSerializer;
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
     * @return mixed|static
     *
     * @throws \Flarum\Core\Exception\PermissionDeniedException
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');

        $attributes = array_get($request->getParsedBody(), 'data.attributes', []);

        $oldVote = Vote::where('poll_id', $attributes['poll_id'])->where('user_id', $actor->id)->exists();

        if ($oldVote) {
            return $oldVote;
        }

        $this->assertCan($actor, 'votePolls');

        $vote = Vote::build($attributes['poll_id'], $actor->id, $attributes['option_id']);

        $vote->save();

        return $vote;
    }
}
