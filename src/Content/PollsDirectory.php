<?php

/*
 * This file is part of fof/polls.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Polls\Content;

use Flarum\Api\Client;
use Flarum\Frontend\Document;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Illuminate\Contracts\View\Factory;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class PollsDirectory
{
    /**
     * @var Client
     */
    protected $api;

    /**
     * @var Factory
     */
    protected $view;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * A map of sort query param values to their API sort param.
     *
     * @var array
     */
    private $sortMap = [
        'newest'            => '-createdAt',
        'oldest'            => 'createdAt',
        'most_voted'        => '-voteCount',
        'least_voted'       => 'voteCount',
    ];

    public function __construct(Client $api, Factory $view, SettingsRepositoryInterface $settings)
    {
        $this->api = $api;
        $this->view = $view;
        $this->settings = $settings;
    }

    private function getDocument(User $actor, array $params, ServerRequestInterface $request)
    {
        $actor->assertCan('seePollsList');

        return json_decode($this->api->withQueryParams($params)->withParentRequest($request)->get('/fof/polls')->getBody());
    }

    public function __invoke(Document $document, ServerRequestInterface $request): Document
    {
        $queryParams = $request->getQueryParams();
        $actor = RequestUtil::getActor($request);

        $defaultSortKey = $this->settings->get('fof-polls.directory-default-sort');
        $sortKey = Arr::pull($queryParams, 'sort') ?: $defaultSortKey;
        $sort = isset($this->sortMap[$sortKey]) ? $this->sortMap[$sortKey] : '-createdAt';
        $q = Arr::pull($queryParams, 'q');
        $page = Arr::pull($queryParams, 'page', 1);
        $filters = Arr::pull($queryParams, 'filter', []);

        $params = [
            'sort'   => $sort,
            'filter' => $filters,
            'page'   => ['offset' => ($page - 1) * 20, 'limit' => 20],
        ];

        if ($q) {
            $params['filter']['q'] = $q;
        }

        $apiDocument = $this->getDocument($actor, $params, $request);

        $document->content = $this->view->make('fof-polls::directory.index', compact('page', 'apiDocument'));

        $document->payload['apiDocument'] = $apiDocument;

        return $document;
    }
}
