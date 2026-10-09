import mq from 'mithril-query';
import bootstrapForum from '../../../bootstrap';
import { makeOption, makePoll } from '../../../factory';
import PollImage from '../../../../src/forum/components/Poll/PollImage';
import PollOption from '../../../../src/forum/components/Poll/PollOption';
import PollState from '../../../../src/forum/states/PollState';

beforeAll(() => bootstrapForum());

describe('PollImage', () => {
  it('renders nothing when the poll has no image', () => {
    expect(mq(PollImage, { poll: makePoll() })).not.toHaveElement('img');
  });

  it('renders the image with its alt text, lazily', () => {
    const poll = makePoll({ imageUrl: 'https://example.com/poll.webp', imageAlt: 'A pie chart' });
    const out = mq(PollImage, { poll });

    expect(out).toHaveElement('.PollImage img.PollImage-image[loading=lazy]');
    expect(out.rootEl.querySelector('img')!.getAttribute('alt')).toBe('A pie chart');
  });

  it('passes a srcset through when the API supplies one', () => {
    const poll = makePoll({ imageUrl: 'https://example.com/poll.webp', imageSrcset: 'https://example.com/poll@2x.webp 2x' });

    expect(mq(PollImage, { poll }).rootEl.querySelector('img')!.getAttribute('srcset')).toBe('https://example.com/poll@2x.webp 2x');
  });

  it('leaves srcset off legacy images that have none', () => {
    const poll = makePoll({ imageUrl: 'https://example.com/poll.webp' });

    expect(mq(PollImage, { poll }).rootEl.querySelector('img')!.hasAttribute('srcset')).toBe(false);
  });
});

describe('PollOption image', () => {
  function renderOption(attributes: Record<string, unknown>) {
    const option = makeOption(attributes);
    const poll = makePoll({}, [option]);

    return mq(PollOption, { option, name: 'poll', state: new PollState(poll) });
  }

  it('describes the answer image with the answer itself', () => {
    const out = renderOption({ answer: 'Blue', imageUrl: 'https://example.com/blue.webp' });

    expect(out.rootEl.querySelector('img.PollOption-image')!.getAttribute('alt')).toBe('Blue');
  });

  it('passes a srcset through when the API supplies one', () => {
    const out = renderOption({ imageUrl: 'https://example.com/blue.webp', imageSrcset: 'https://example.com/blue@2x.webp 2x' });

    expect(out.rootEl.querySelector('img.PollOption-image')!.getAttribute('srcset')).toBe('https://example.com/blue@2x.webp 2x');
  });
});
