<?php


namespace FoF\Polls\Listeners;


use Flarum\Discussion\Event\Saving;
use Flarum\User\AssertPermissionTrait;
use FoF\Polls\Poll;
use FoF\Polls\PollOption;
use FoF\Polls\Validators\PollOptionValidator;
use FoF\Polls\Validators\PollValidator;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;

class SavePollsToDatabase
{
    use AssertPermissionTrait;

    /**
     * @var Dispatcher
     */
    protected $events;

    /**
     * @var PollValidator
     */
    protected $validator;

    /**
     * @var PollOptionValidator
     */
    protected $optionValidator;

    /**
     * SavePollToDatabase constructor.
     *
     * @param Dispatcher $events
     * @param PollValidator $validator
     * @param PollOptionValidator $optionValidator
     */
    public function __construct(Dispatcher $events, PollValidator $validator, PollOptionValidator $optionValidator)
    {
        $this->events = $events;

        $this->validator = $validator;
        $this->optionValidator = $optionValidator;
    }

    public function handle(Saving $event) {
        if ($event->discussion->exists || !isset($event->data['attributes']['poll'])) {
            return;
        }

        $this->assertCan($event->actor, 'startPolls');

        $attributes = $event->data['attributes']['poll'];
        $options = Arr::get($attributes, 'relationships.options', []);

        $this->validator->assertValid($attributes);

        foreach ($options as $option) {
            $this->optionValidator->assertValid(['answer' => $option]);
        }

        $event->discussion->afterSave(function ($discussion) use ($options, $attributes, $event) {
            $poll = Poll::build(
                Arr::get($attributes, 'question'),
                $discussion->id,
                $event->actor->id,
                Arr::get($attributes, 'endDate'),
                Arr::get($attributes, 'publicPoll')
            );

            $poll->save();

//            $this->events->fire(
//                new PollWasCreated($discussion, $poll, $event->actor)
//            );

            foreach ($options as $answer) {
                if (empty($answer)) {
                    continue;
                }

                $option = PollOption::build($answer);

                $poll->options()->save($option);
            }

            return $discussion;
        });

        return $event->discussion;
    }
}