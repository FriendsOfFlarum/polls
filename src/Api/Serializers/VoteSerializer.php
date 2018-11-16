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

namespace Reflar\Polls\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;

class VoteSerializer extends AbstractSerializer
{
    protected $type = 'votes';

    /**
     * Get the default set of serialized attributes for a model.
     *
     * @param Field|array $model
     *
     * @return array
     */
    protected function getDefaultAttributes($model)
    {
        return $model->toArray();
    }

    /**
     * @param $model
     *
     * @return \Tobscure\JsonApi\Relationship
     */
    public function question($model)
    {
        return $this->hasOne(
            $model,
            QuestionSerializer::class,
            'poll_id'
        );
    }
}
