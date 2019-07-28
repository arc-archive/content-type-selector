import { fixture, assert, nextFrame } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import '../content-type-selector.js';

describe('<content-type-selector>', () => {
  async function basicFixture() {
    return await fixture(`<content-type-selector></content-type-selector>`);
  }

  async function selectedFixture() {
    return await fixture(`<content-type-selector selected="1"></content-type-selector>`);
  }

  async function extendedFixture() {
    return await fixture(`<content-type-selector>
      <paper-item slot="item" data-type="application/zip">Zip file</paper-item>
    </content-type-selector>`);
  }

  describe('basic', () => {
    let element;
    const CT_VALUE = 'application/json';

    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Fires content type change event', () => {
      const dropdown = element.shadowRoot.querySelector('paper-listbox');
      const spy = sinon.stub();
      element.addEventListener('content-type-changed', spy);
      dropdown.selected = 1;
      assert.isTrue(spy.called);
    });

    it('Handles content-type-changed event', () => {
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

    it('Selected complex content types', () => {
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
    let element;
    beforeEach(async () => {
      element = await selectedFixture();
    });

    it('Resets selection when no argument', () => {
      element._contentTypeChanged();
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
    let element;
    const CT_VALUE = 'application/zip';

    beforeEach(async () => {
      element = await extendedFixture();
    });

    it('Selectes extended option', () => {
      element.contentType = CT_VALUE;
      assert.equal(element.selected, 13);
    });
  });

  describe('oncontenttypechanged', () => {
    let element;
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
      await assert.isAccessible(el, {
        ignoredRules: ['tabindex', 'button-name']
      });
    });
  });
});
