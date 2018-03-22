import { extend, override } from 'flarum/extend';
import ItemList from 'flarum/utils/ItemList';
import Component from 'flarum/Component';
import classList from 'flarum/utils/classList';

export default class PollVote extends Component {
  init() {
    this.poll = this.props.poll;
    this.votes = [];
    this.voted = false;
    this.answers = this.poll ? this.poll.answers() : [];

    if (app.session.user != undefined) {
      app.store.find('reflar/polls/votes', {
        poll_id: this.poll.id(),
        user_id: app.session.user.id()
      }).then((data) => {
        if (data[0] != undefined) {
          this.voted = true;
        }

        m.redraw();
      });
    } else {
      this.voted = true;
    }
  }

  voteView() {
    
    if (this.voted) {
      return (
        <div>
          <h4>{this.poll.question()}</h4> 
          {
            this.answers.map((item, index) => ( 
              <div className={'PollOption PollVoted'}>
                <div class="PollPercent">
                  {item.percent()}%
                </div>
                <div className={'PollBar'}>
                  <div style={'width: ' + item.percent() + '%;'} className="PollOption-active"></div>
                    <label><span>{item.answer()}</span></label> 
                </div>
              </div>
            ))
          } 
          <div class="clear"></div> 
        </div>
      );
    } else {
      return (
        <div>
          <h4>{this.poll.question()}</h4> 
          {
            this.answers.map((item, index) => ( 
              <div class="PollOption">
                <div className={'PollBar'}>
                  <label class="checkbox">
                    <input type="checkbox" onchange={this.addVote.bind(this, item.id())} /> 
                    <span>{item.answer()}</span> 
                    <span class="checkmark"></span> 
                  </label> 
                </div>
              </div>
            ))
          }
          <div class="clear"></div> 
        </div>
    );
    }
  }

  view() {
    let content = this.voteView();
    
    return (
      <div className={classList({
        voted: this.voted
      })}>
        {content}
      </div>
    );
  }

  addVote(answer) {
    app.store.createRecord('reflar-polls-vote').save({
      poll_id: this.poll.id(),
      user_id: app.session.user.id(),
      option_id: answer 
    });

    location.reload();

    m.redraw();
  }
}
