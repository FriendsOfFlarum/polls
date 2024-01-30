<?php

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
        'username_az'       => 'username',
        'username_za'       => '-username',
        'newest'            => '-joinedAt',
        'oldest'            => 'joinedAt',
        'most_discussions'  => '-discussionCount',
        'least_discussions' => 'discussionCount',
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

        $sort = Arr::pull($queryParams, 'sort') ?: $this->settings->get('fof-polls.directory-default-sort');
        $q = Arr::pull($queryParams, 'q');
        $page = Arr::pull($queryParams, 'page', 1);

        $params = [
            // ?? used to prevent null values. null would result in the whole sortMap array being sent in the params
            'sort'   => Arr::get($this->sortMap, $sort ?? '', ''),
            'filter' => compact('q'),
            'page'   => ['offset' => ($page - 1) * 20, 'limit' => 20],
        ];

        $apiDocument = $this->getDocument($actor, $params, $request);

        $document->content = $this->view->make('fof-polls::directory.index', compact('page', 'apiDocument'));

        $document->payload['apiDocument'] = $apiDocument;

        return $document;
    }
}
