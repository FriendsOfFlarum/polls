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
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\View\Factory;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface as Request;

class PollsDirectory
{
    private array $sortMap = [
        'newest'       => '-createdAt',
        'oldest'       => 'createdAt',
        'most_voted'   => '-voteCount',
        'least_voted'  => 'voteCount',
    ];

    public function __construct(
        protected Client $api,
        protected Factory $view,
        protected SettingsRepositoryInterface $settings,
    ) {
    }

    public function __invoke(Document $document, Request $request): Document
    {
        $queryParams = $request->getQueryParams();

        $defaultSortKey = $this->settings->get('fof-polls.directory-default-sort');
        $sort = Arr::pull($queryParams, 'sort') ?: $defaultSortKey;
        $q = Arr::pull($queryParams, 'q');
        $page = max(1, intval(Arr::pull($queryParams, 'page')));

        $filters = Arr::pull($queryParams, 'filter', []);

        // The listing UI defaults to "All" (published + visible drafts). Match
        // that server-side so the preloaded apiDocument doesn't fall back to
        // the searcher's default hide-drafts guard on fresh page loads.
        // Callers can still narrow explicitly via `filter[isDraft]=0` or `=1`.
        if (!array_key_exists('isDraft', $filters) && !array_key_exists('-isDraft', $filters)) {
            $filters['isDraft'] = 'any';
        }

        $params = [
            'sort'   => isset($this->sortMap[$sort]) ? $this->sortMap[$sort] : '-createdAt',
            'filter' => $filters,
            'page'   => ['number' => $page],
        ];

        if ($q) {
            $params['filter']['q'] = $q;
        }

        $apiDocument = json_decode(
            json: $this->api
                ->withoutErrorHandling()
                ->withParentRequest($request)
                ->withQueryParams($params)
                ->get('/polls')
                ->getBody(),
            associative: false,
        );

        $document->content = $this->view->make('fof-polls::directory.index', compact('page', 'apiDocument'));
        $document->payload['apiDocument'] = $apiDocument;
        $document->page = $page;
        $document->hasNextPage = isset($apiDocument->links->next);

        return $document;
    }
}
