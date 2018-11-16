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

use Flarum\Api\Controller\AbstractListController;
use Flarum\User\AssertPermissionTrait;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\Polls\Api\Serializers\QuestionSerializer;
use Reflar\Polls\Repositories\QuestionRepository;
use Tobscure\JsonApi\Document;

class ListPollController extends AbstractListController
{
    use AssertPermissionTrait;

    /**
     * @var string
     */
    public $serializer = QuestionSerializer::class;

    /**
     * @var array
     */
    public $include = [
        'answers',
        'votes',
    ];

    /**
     * @var QuestionRepository
     */
    protected $fields;

    /**
     * ListPollController constructor.
     *
     * @param QuestionRepository $fields
     */
    public function __construct(QuestionRepository $fields)
    {
        $this->fields = $fields;
    }

    /**
     * @param ServerRequestInterface $request
     * @param Document               $document
     *
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        return $this->fields->all();
    }
}
