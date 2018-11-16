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

namespace Reflar\Polls\Listeners;

use Flarum\Discussion\Event\Saving;
use Flarum\User\AssertPermissionTrait;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\Polls\Answer;
use Reflar\Polls\Events\PollWasCreated;
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
     * @var Dispatcher
     */
    protected $Dispatcher;

    /**
     * SavePollToDatabase constructor.
     *
     * @param AnswerValidator $validator
     * @param Dispatcher      $events
     */
    public function __construct(AnswerValidator $validator, Dispatcher $events)
    {
        $this->validator = $validator;
        $this->events = $events;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(Saving::class, [$this, 'whenSaving']);
    }

    /**
     * @param Saving $event
     *
     * @throws \Flarum\User\Exception\PermissionDeniedException
     */
    public function whenSaving(Saving $event)
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

                    $this->events->fire(
                        new PollWasCreated($discussion, $poll, $event->actor)
                    );

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
