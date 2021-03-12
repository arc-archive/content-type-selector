import { fixture, assert, nextFrame } from '@open-wc/testing';
import sinon from 'sinon';
import '../content-type-selector.js';

/** @typedef {import('../index').ContentTypeSelector} ContentTypeSelector */

describe('ContentTypeSelector', () => {
  /**
   * @returns {Promise<ContentTypeSelector>}
   */
  async function basicFixture() {
    return fixture(`<content-type-selector></content-type-selector>`);
  }

  /**
   * @returns {Promise<ContentTypeSelector>}
   */
  async function selectedFixture() {
    return fixture(`<content-type-selector selected="1"></content-type-selector>`);
  }

  /**
   * @returns {Promise<ContentTypeSelector>}
   */
  async function extendedFixture() {
    return fixture(`<content-type-selector>
      <anypoint-item slot="item" data-type="application/zip">Zip file</anypoint-item>
    </content-type-selector>`);
  }

  describe('basic', () => {
    let element = /** @type ContentTypeSelector */ (null);
    const CT_VALUE = 'application/json';

    beforeEach(async () => {
      element = await basicFixture();
    });

    it('dispatches content type change event', () => {
      const spy = sinon.stub();
      element.addEventListener('content-type-changed', spy);
      const item = /** @type HTMLElement */ (element.shadowRoot.querySelector('anypoint-listbox anypoint-item'));
      item.click();
      assert.isTrue(spy.called);
    });

    it('handles content-type-changed event', () => {
      const init = {
        detail: {
          value: CT_VALUE
        },
        bubbles: true,
        cancelable: true
      };
      const e = new CustomEvent('content-type-changed', init);
      document.dispatchEvent(e);
      assert.equal(element.contentType, CT_VALUE);
    });

    it('selects complex content types', () => {
      element.contentType = 'multipart/form-data; boundary=something';
      assert.isDefined(element.selected);
    });

    it('Selection changes content type value', async () => {
      element.selected = 1;
      await nextFrame();
      assert.equal(element.contentType, 'application/xml');
    });
  });

  describe('_contentTypeChanged()', () => {
    let element = /** @type ContentTypeSelector */ (null);
    beforeEach(async () => {
      element = await selectedFixture();
    });

    it('Resets selection when no argument', () => {
      element._contentTypeChanged(undefined);
      assert.isUndefined(element.selected);
    });

    it('Selects content type', () => {
      element._contentTypeChanged('application/json');
      assert.equal(element.selected, 0);
    });

    it('Selects content type with charset', () => {
      element._contentTypeChanged('application/json; charset=utf8');
      assert.equal(element.selected, 0);
    });

    it('Resets selection when not supported', () => {
      element._contentTypeChanged('not/supported');
      assert.isUndefined(element.selected);
    });
  });

  describe('extended', () => {
    let element = /** @type ContentTypeSelector */ (null);
    const CT_VALUE = 'application/zip';

    beforeEach(async () => {
      element = await extendedFixture();
    });

    it('Selects extended option', () => {
      element.contentType = CT_VALUE;
      assert.equal(element.selected, 13);
    });
  });

  describe('oncontenttypechanged', () => {
    let element = /** @type ContentTypeSelector */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.oncontenttypechanged);
      const f = () => {};
      element.oncontenttypechanged = f;
      assert.isTrue(element.oncontenttypechanged === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.oncontenttypechanged = f;
      element.contentType = 'application/json';
      element.oncontenttypechanged = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.oncontenttypechanged = f1;
      element.oncontenttypechanged = f2;
      element.contentType = 'application/json';
      element.oncontenttypechanged = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('a11y', () => {
    it('passes accessibility test', async () => {
      const el = await selectedFixture();
      await assert.isAccessible(el);
    });
  });
});
