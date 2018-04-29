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

            $post = $event->data['attributes']['poll'];

            if (trim($post['question']) != '') {
                // Add a poll after the disscusion has been created/saved.
                $discussion->afterSave(function ($discussion) use ($post, $event) {
                    // Add question to databse
                    $poll = Question::build($post['question'], $discussion->id, $event->actor->id);
                    $poll->save();

                    // Add answers to database
                    foreach (array_filter($post['answers']) as $answer) {
                        $answer = Answer::build($answer);
                        $this->validator->assertValid(['answer' => $answer]);
                        $poll->answers()->save($answer);
                    }
                });
            }
        }
    }
}
