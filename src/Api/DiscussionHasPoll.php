<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Api;

use Flarum\Api\Context;
use Flarum\Discussion\Discussion;
use FoF\Polls\Poll;
use WeakMap;

/**
 * Whether a discussion's first post has a poll, for every discussion in a
 * response in one existence query, on whichever endpoint serializes them.
 *
 * The getter returns a closure. The serializer defers an attribute's closure
 * to the end of the queue (relationship closures go to the front), so by the
 * time the first one runs, every discussion in the response has queued its
 * first post, and one query answers them all.
 */
class DiscussionHasPoll
{
    /** @var WeakMap<object, array{pending: array<int, true>, found: array<int, true>}>|null per request */
    private static ?WeakMap $requests = null;

    public static function get(Discussion $discussion, Context $context): bool|\Closure
    {
        if ($discussion->relationLoaded('polls')) {
            return $discussion->getRelation('polls')->isNotEmpty();
        }

        $postId = (int) $discussion->first_post_id;

        if ($postId === 0) {
            return false;
        }

        $requests = self::$requests ??= new WeakMap();
        $request = $context->request;

        $state = $requests[$request] ?? ['pending' => [], 'found' => []];
        $state['pending'][$postId] = true;
        $requests[$request] = $state;

        return function () use ($requests, $request, $postId): bool {
            $state = $requests[$request];

            // Discussions included in a later round arrive after the first
            // query; ask again only for those.
            if ($state['pending']) {
                $found = Poll::query()
                    ->whereIn('post_id', array_keys($state['pending']))
                    ->distinct()
                    ->pluck('post_id');

                foreach ($found as $id) {
                    $state['found'][(int) $id] = true;
                }

                $state['pending'] = [];
                $requests[$request] = $state;
            }

            return isset($state['found'][$postId]);
        };
    }
}
