import { extend, override } from 'flarum/extend';
import Modal from 'flarum/components/Modal';
import DiscussionPage from 'flarum/components/DiscussionPage';
import Button from 'flarum/components/Button';
import highlight from 'flarum/helpers/highlight';
import classList from 'flarum/utils/classList';
import DiscussionComposer from 'flarum/components/DiscussionComposer';

export default class PollModal extends Modal {
  init() {
    super.init();
    this.answer = [];

    if (null != this.props.poll) {
      this.question = m.prop(this.props.poll.question()|| '');

      this.props.poll.answers().map((el, i) => {
        this.answer[i + 1] = m.prop(el.answer()); // Start at index 1
      });
    } else {
      this.question = m.prop(this.props.question || '');
      this.answer[1] = m.prop('');
      this.answer[2] = m.prop('');
    }
  }

  className() {
    return 'PollDiscussionModal Modal--small';
  }

  title() {
    return null != this.props.poll ? 'Edit poll'  : 'Add a poll';
  }

  content() {
    return [
      <div className="Modal-body">
        <div className="PollDiscussionModal-form">
          <div>
            <fieldset>
              <input type="text" name="question" className="FormControl" bidi={this.question} placeholder="Ask a question"/>
            </fieldset>
          </div>

          <h4>Answers</h4>

          {
            Object.keys(this.answer).map((el, i) => (
              <div class={this.answer[i + 1] == '' ? 'Form-group hide' : 'Form-group' }>
                <fieldset>
                  <input className="FormControl"
                    type="text"
                    name={'answer' + (i + 1) }
                    bidi={this.answer[i + 1]}
                    placeholder={this.choicePlaceholder(i + 1)} />
                </fieldset>
                <a href="javascript:;" className={ i + 1 >= 3 ? 'Option-remove' : 'Option-remove disabled' } onclick={ i + 1 >= 3 ? this.removeOption.bind(this, i + 1) : '' }><span class="TagLabel untagged">X</span></a>
                <div class="clear"></div>
              </div>
            ))
          }

          <a href="javascript:;" onclick={this.addOption.bind(this)}><span class="TagLabel untagged">+ Add an option</span></a><br/><br/>

          {
            Button.component({
              type: 'submit',
              className: 'Button Button--primary',
              children: 'Submit'
            })
          }
        </div>
      </div>
    ];
  }

  choicePlaceholder(number) {
    return 'Option';
  }

  addOption() {
    if (this.answer.length < 11) {
      this.answer.push(m.prop(''));
    }
  }

  removeOption(option) {
    this.answer[option] = '';
  }

  onAdd(pollArray) {
    // Add data to DiscussionComposer post data
    extend(DiscussionComposer.prototype, 'data', function(data) {
      data.poll = pollArray;
    });

    // Change the text of add poll button to edit poll
    if (this.question() != '') {
      extend(DiscussionComposer.prototype, 'headerItems', function(items) {
        items.replace('polls', (<a className="DiscussionComposer-changeTags" onclick={this.addPoll}><span className="TagLabel">Edit poll</span></a>), 1);
      });
    }
  }

  onEdit(pollArray) {
    const poll = this.props.poll;
    app.request({
      url: app.forum.attribute('apiUrl') + poll.apiEndpoint() + '/' + poll.id(),
      method: 'PATCH',
      data:{ pollArray }
    });
  }

  onsubmit(e) {
    e.preventDefault();
    let pollArray = {
      question: this.question(),
      answers: {},
      post: this.props.post.id()
    };

    // Add answers to PollArray
    Object.keys(this.answer).map((el, i) => {
      var key = (i + 1);
      pollArray['answers'][key] = this.answer[key] == '' ? '' : this.answer[key]()
    });

    if (null != this.props.poll) {
      this.onEdit(pollArray);

      // location.reload();
    } else {
      this.onAdd(pollArray);
    }
   
    app.modal.close();

    m.redraw.strategy('none');
  }
}
