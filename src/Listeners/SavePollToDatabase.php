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

namespace Reflar\Polls\Listeners;

use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Event\DiscussionWillBeSaved;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\Polls\Answer;
use Reflar\Polls\Question;
use Reflar\Polls\Validators\AnswerValidator;

class SavePollToDatabase
{
    use AssertPermissionTrait;

    /**
     * @var AnswerValidator
     */
    protected $validator;

    /**
     * SavePollToDatabase constructor.
     *
     * @param AnswerValidator $validator
     */
    public function __construct(AnswerValidator $validator)
    {
        $this->validator = $validator;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(DiscussionWillBeSaved::class, [$this, 'whenDiscussionWillBeSaved']);
    }

    /**
     * @param DiscussionWillBeSaved $event
     *
     * @throws \Flarum\Core\Exception\PermissionDeniedException
     */
    public function whenDiscussionWillBeSaved(DiscussionWillBeSaved $event)
    {
        $discussion = $event->discussion;

        // Check if posts data exists in data attributes
        if (isset($event->data['attributes']['poll'])) {
            $this->assertCan($event->actor, 'startPolls');

            $attributes = $event->data['attributes']['poll'];

            if (trim($attributes['question']) != '') {
                // Add a poll after the discussion has been created/saved.
                $discussion->afterSave(function ($discussion) use ($attributes, $event) {
                    $endDate = new \DateTime($attributes['endDate']);

                    if ($attributes['endDate'] === null) {
                        $endDate = null;
                    }

                    // Add question to database
                    $poll = Question::build($attributes['question'], $discussion->id, $event->actor->id, $endDate, $attributes['publicPoll']);
                    $poll->save();

                    // Add answers to database
                    foreach (array_filter($attributes['answers']) as $answer) {
                        $answer = Answer::build($answer);
                        $this->validator->assertValid(['answer' => $answer]);
                        $poll->answers()->save($answer);
                    }
                });
            }
        }
    }
}
