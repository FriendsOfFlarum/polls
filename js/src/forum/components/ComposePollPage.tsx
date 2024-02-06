import Mithril from 'mithril';
import app from 'flarum/forum/app';
import Page from 'flarum/common/components/Page';
import Poll from './Poll';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import PollForm from "./PollForm";
import Acl from "../../common/Acl";
import PollFormState from "../states/PollFormState";
import {slug} from "../../common";
import ComposePollHero from "./ComposePollHero";

const t = app.translator.trans.bind(app.translator);
const prfx = `${slug}.forum.compose`;

export default class ComposePollPage extends Page {

    poll: Poll | null = null;

    loading: boolean = false;

    oninit(vnode) {
        super.oninit(vnode);

        // If user not allowed to manage goodie collections, redirect to home
        if (!Acl.canManagePools()) {
            m.route.set(app.route('home'));
        }

        // Get the `edit` parameter from the URL
        const editId = m.route.param('id');
        if (editId) {
            this.poll = app.store.getById('poll', editId);

            if (!this.poll) {
                this.loading = true;

                app.store.find('fof/polls', editId).then((item) => {
                    this.poll = item;
                    this.loading = false;
                    app.setTitle(t(`${prfx}.${!!this.poll?.id() ? 'edit' : 'add'}_title`));
                    m.redraw();
                });
            }
        } else {
            this.poll = PollFormState.createNewPoll();
        }

        app.history.push('compose-goodie-collection');
        this.bodyClass = 'App--compose-goodie-collection';
        app.setTitle(t(`${prfx}.${!!this.poll?.id() ? 'edit' : 'add'}_title`));
    }

    view(): Mithril.Children {
        if (this.loading) {
            return <LoadingIndicator />;
        }

        return (
            <div className='ComposeGoodieCollectionPage'>
                <ComposePollHero poll={this.poll} />
                <div className='container'>
                    <PollForm poll={this.poll} />
                </div>
            </div>
        );
    }
}