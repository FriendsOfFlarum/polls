<?php

namespace Reflar\Polls\Listeners;

use Reflar\Polls\Question;
use Reflar\Polls\Answer;
use Flarum\Event\DiscussionWillBeSaved;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Validation\Factory;
use Illuminate\Support\Arr;

class SavePollToDatabase
{
    /**
     * @var Factory
     */
    protected $validator;
    protected $answers;

    public function __construct(Factory $validator)
    {
        $this->validator = $validator;
    }

    public function subscribe(Dispatcher $events)
    {
        $events->listen(DiscussionWillBeSaved::class, [$this, 'whenDiscussionWillBeSaved']);
    }

    public function whenDiscussionWillBeSaved(DiscussionWillBeSaved $event)
    {
        $discussion = $event->discussion;

        // Check if posts data exists in data attributes
        if (isset($event->data['attributes']['poll'])) {
            $post = $event->data['attributes']['poll'];

            $answers = array();

            if (trim($post['question']) != '') {
                // Add a poll after the disscusion has been created/saved.
                $discussion->afterSave(function ($discussion) use ($post) {
                    // Add question to databse
                    $questionModel = new Question();
                    $questionModel->question = $post['question'];
                    $questionModel->discussion_id = $discussion->id;
                    $questionModel->save();

                    // Add answers to database
                    foreach (array_filter($post['answers']) as $answer) {
                        $answers[] = new Answer(['answer' => $answer]);
                    }

                    // Create relationship between the answers & question
                    $questionModel->answers()->saveMany($answers);
                });
            }
        }
    }
}
