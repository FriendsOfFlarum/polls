import type Mithril from "mithril";
import app from 'flarum/forum/app';
import Page from "flarum/common/components/Page";
import PollModel from "../models/Poll";
import extractText from "flarum/common/utils/extractText";
import LoadingIndicator from "flarum/common/components/LoadingIndicator";
import PollView from "./PollView";

export default class PollViewPage extends Page {
    poll: PollModel | null = null;
    loading: boolean = false;

    oninit(vnode: Mithril.Vnode) {
        super.oninit(vnode);

        const editId = m.route.param('id');
        this.poll = app.store.getById('poll', editId) as PollModel;

        if (!this.poll) {
            this.loading = true;

            app.store.find<PollModel>('fof/polls', editId).then((item) => {
                this.poll = item;
                this.loading = false;
                app.setTitle(extractText(app.translator.trans('fof-polls.forum.page.poll_detail')));
                m.redraw();
            });
        }
    }

    view(): Mithril.Children {
        if (this.loading) {
            return <LoadingIndicator/>;
        }

        if (this.poll) {
            return (
                <div className="PollsPage">
                    <div className="container">
                        <PollView poll={this.poll}/>
                    </div>
                </div>
            );
        }
    }
}