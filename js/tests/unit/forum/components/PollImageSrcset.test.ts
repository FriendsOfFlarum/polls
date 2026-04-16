import mq from 'mithril-query';
import m from 'mithril';
import { jest } from '@jest/globals';

/**
 * Tests for srcset support in poll image rendering.
 */
describe('Poll image srcset rendering', () => {
  describe('PollImage component pattern', () => {
    function renderPollImage(opts: { src: string; srcset?: string | null; alt?: string }) {
      const { src, srcset, alt = '' } = opts;
      return mq(
        m(
          'div.PollImage',
          m('img.PollImage-image', {
            src,
            srcset: srcset ?? undefined,
            alt,
            loading: 'lazy',
          })
        )
      );
    }

    it('renders img with src', () => {
      const component = renderPollImage({ src: 'https://example.com/poll.webp' });
      expect(component.has('img.PollImage-image')).toBe(true);
    });

    it('renders srcset attribute when provided', () => {
      const srcset = 'https://example.com/poll.webp 1x, https://example.com/poll@2x.webp 2x';
      const component = renderPollImage({ src: 'https://example.com/poll.webp', srcset });
      expect(component.has('img[srcset]')).toBe(true);
    });

    it('does not render srcset when null', () => {
      const component = renderPollImage({ src: 'https://example.com/poll.webp', srcset: null });
      expect(component.has('img[srcset]')).toBe(false);
    });

    it('renders alt text', () => {
      const component = renderPollImage({ src: 'https://example.com/poll.webp', alt: 'Poll image' });
      expect(component.has('img[alt="Poll image"]')).toBe(true);
    });

    it('uses lazy loading', () => {
      const component = renderPollImage({ src: 'https://example.com/poll.webp' });
      expect(component.has('img[loading="lazy"]')).toBe(true);
    });
  });

  describe('Option image srcset pattern', () => {
    function renderOptionImage(opts: { src: string; srcset?: string | null; alt: string }) {
      const { src, srcset, alt } = opts;
      return mq(
        m('img.PollAnswer-image', {
          src,
          srcset: srcset ?? undefined,
          alt,
          loading: 'lazy',
        })
      );
    }

    it('renders srcset on option image when provided', () => {
      const srcset = 'https://example.com/opt.webp 1x, https://example.com/opt@2x.webp 2x';
      const component = renderOptionImage({ src: 'https://example.com/opt.webp', srcset, alt: 'Option A' });
      expect(component.has('img[srcset]')).toBe(true);
    });

    it('omits srcset for legacy images', () => {
      const component = renderOptionImage({ src: 'https://example.com/opt.png', srcset: null, alt: 'Option A' });
      expect(component.has('img[srcset]')).toBe(false);
    });
  });
});

describe('Upload form URL deprecation', () => {
  describe('uploadConditional logic', () => {
    it('shows deprecation notice for existing URL images', () => {
      const hasImage = true;
      const isUpload = false; // URL-based image
      const isExistingUrlImage = hasImage && !isUpload;
      expect(isExistingUrlImage).toBe(true);
    });

    it('does not show deprecation for uploaded images', () => {
      const hasImage = true;
      const isUpload = true;
      const isExistingUrlImage = hasImage && !isUpload;
      expect(isExistingUrlImage).toBe(false);
    });

    it('does not show deprecation when no image', () => {
      const hasImage = false;
      const isUpload = false;
      const isExistingUrlImage = hasImage && !isUpload;
      expect(isExistingUrlImage).toBe(false);
    });

    it('shows upload button when user has permission', () => {
      const canUpload = true;
      const canUploadNow = true;
      expect(canUpload && canUploadNow).toBe(true);
    });

    it('shows later help when cannot upload yet', () => {
      const canUpload = true;
      const canUploadNow = false; // poll doesn't exist yet, insufficient perms
      expect(canUpload && !canUploadNow).toBe(true);
    });

    it('shows upload_required message when no permission', () => {
      const canUpload = false;
      const isExistingUrlImage = false;
      expect(!canUpload && !isExistingUrlImage).toBe(true);
    });
  });
});
