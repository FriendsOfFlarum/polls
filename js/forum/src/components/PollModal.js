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
    
    this.question = m.prop(this.props.question || '');
    this.answer = [];
    this.answer[1] = m.prop('');
    this.answer[2] = m.prop('');
  }

  className() {
    return 'PollDiscussionModal Modal--small';
  }

  title() {
    return 'Add a poll';
  }

  choicePlaceholder(number) {
    return 'Choice ' + number;
  }

  addOption() {
    if (this.answer.length < 11) {
      this.answer.push(m.prop(''));
    }
  }

  removeOption(option) {
    delete this.answer[option];
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
              <div class="Form-group">
                <fieldset>
                  <input className="FormControl"
                    type="text"
                    name={'answer' + (i + 1) }
                    bidi={this.answer[i + 1]}
                    placeholder={this.choicePlaceholder(i + 1)} />
                </fieldset>
                
                {i + 1 >= 3 ? <a href="javascript:;" className="Option-remove" onclick={this.removeOption.bind(this, i + 1)}><span class="TagLabel untagged">Remove option</span></a> : '' }
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

  onsubmit(e) {
    e.preventDefault();

    let pollArray = {
      question: this.question(),
      answers: {}
    };

    // Add answers to PollArray
    Object.keys(this.answer).map((el, i) => {
      var key = (i + 1);
      pollArray['answers'][key] = this.answer[key]()
    });

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
    
    app.modal.close();

    m.redraw.strategy('none');
  }
}
