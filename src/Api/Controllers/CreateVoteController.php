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
use Psr\Http\Message\ServerRequestInterface;
use Reflar\Polls\Api\Serializers\VoteSerializer;
use Reflar\Polls\Vote;
use Tobscure\JsonApi\Document;

class CreateVoteController extends AbstractCreateController
{
    /**
     * @var string
     */
    public $serializer = VoteSerializer::class;

    /**
     * @param ServerRequestInterface $request
     * @param Document $document
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $attributes = array_get($request->getParsedBody(), 'data.attributes', []);

        $oldVote = Vote::where('poll_id', $attributes['poll_id'])->where('user_id', $attributes['user_id'])->exists();

        if ($oldVote) {
            return $oldVote;
        }

        $vote = Vote::build($attributes['poll_id'], $attributes['user_id'], $attributes['option_id']);

        $vote->save();

        return $vote;
    }
}
