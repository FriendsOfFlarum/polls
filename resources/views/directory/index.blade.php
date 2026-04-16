@inject('url', 'Flarum\Http\UrlGenerator')

<div class="container">
    <h1>{{ $translator->trans('fof-polls.forum.page.nav') }}</h1>

    <ul>
        @foreach ($apiDocument->data as $poll)
            <li>
                <a href="{{ $url->to('forum')->route('fof.poll.view', ['id' => $poll->id]) }}">
                    {{ $poll->attributes->question }}
                </a>
            </li>
        @endforeach
    </ul>

    @if (isset($apiDocument->links->prev))
        <a href="{{ $url->to('forum')->route('fof.polls.list') }}?page={{ $page - 1 }}">&laquo; {{ $translator->trans('core.views.index.previous_page_button') }}</a>
    @endif

    @if (isset($apiDocument->links->next))
        <a href="{{ $url->to('forum')->route('fof.polls.list') }}?page={{ $page + 1 }}">{{ $translator->trans('core.views.index.next_page_button') }} &raquo;</a>
    @endif
</div>
