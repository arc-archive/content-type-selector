/* eslint-disable no-param-reassign */
/**
@license
Copyright 2016 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { html, LitElement } from 'lit-element';
import { EventsTargetMixin } from '@advanced-rest-client/events-target-mixin';
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import elementStyles from './styles/Selector.js';

/** @typedef {import('lit-element').TemplateResult} TemplateResult */
/** @typedef {import('@anypoint-web-components/anypoint-listbox').AnypointListbox} AnypointListbox */

export const SupportedTypes = [
  'application/json', 'application/xml', 'application/atom+xml', 'multipart/form-data', 'multipart/alternative',
  'multipart/mixed', 'application/x-www-form-urlencoded', 'application/base64', 'application/octet-stream', 'text/plain',
  'text/css', 'text/html', 'application/javascript',
];

/**
 * `<content-type-selector>` is an element that provides an UI for selecting common
 * content type values.
 *
 * The element do not renders a value that is not defined on the list.
 * Instead it shows the default label.
 *
 * If the content type is more complex, meaning has additional information like
 * `multipart/form-data; boundary=something` then, in this case` only the
 * `multipart/form-data` is taken into the account when computing selected item.
 *
 * The element fires the `content-type-changed` custom event when the user change
 * the value in the drop down container. It is not fired when the change has not
 * been cause by the user.
 *
 * ### Example
 * ```
 * <content-type-selector></content-type-selector>
 * ```
 *
 * The list of content type values can be extended by setting child `<anypoint-item>`
 * elements with the `data-type` attribute set to content type value.
 *
 * ### Example
 * ```
 * <content-type-selector>
 *    <anypoint-item data-type="application/zip">Zip file</anypoint-item>
 *    <anypoint-item data-type="application/7z">7-zip file</anypoint-item>
 * </content-type-selector>
 * ```
 *
 * ### Listening for content type change event
 *
 * By default the element listens for the `content-type-changed` custom event on
 * global `window` object. This can be controlled by setting the `eventsTarget`
 * property to an element that will be used as an event listeners target.
 * This way the application can scope events accepted by this element.
 *
 * This will not work for events dispatched on this element. The scoped element
 * should handle `content-type-changed` custom event and stop it's propagation
 * if appropriate.
 *
 * Once the `content-type-changed` custom event it changes value of current
 * content type on this element unless the event has been canceled.
 *
 * ### Styling
 *
 * The element support styles for `anypoint-dropdown-menu`, `anypoint-listbox` and `anypoint-item`
 */
export class ContentTypeSelector extends EventsTargetMixin(LitElement) {
  get styles() {
    return elementStyles;
  }

  static get properties() {
    return {
      /**
       * A value of a Content-Type header.
       */
      contentType: { type: String },
      /**
       * Index of currently selected item.
       */
      selected: { type: Number },
      /**
       * Passes the value to the dropdown element
       */
      noLabelFloat: { type: Boolean, reflect: true },
      /**
       * Enables compatibility with Anypoint styling
       */
      compatibility: { type: Boolean, reflect: true },
      /**
       * Enables Material Design outlined style
       */
      outlined: { type: Boolean },
      /**
       * When set the editor is in read only mode.
       */
      readOnly: { type: Boolean },
      /**
       * When set all controls are disabled in the form
       */
      disabled: { type: Boolean }
    };
  }

  get contentType() {
    return this._contentType;
  }

  set contentType(value) {
    const old = this._contentType;
    if (old === value) {
      return;
    }
    // no need calling requestUpdate
    this._contentType = value;
    this.dispatchEvent(
      new CustomEvent('contenttype-changed', {
        detail: {
          value
        }
      })
    );
    this._contentTypeChanged(value);
  }

  get oncontenttypechanged() {
    return this._oncontenttypechanged;
  }

  set oncontenttypechanged(value) {
    if (this._oncontenttypechanged) {
      this.removeEventListener('contenttype-changed', this._oncontenttypechanged);
    }
    if (typeof value !== 'function') {
      this._oncontenttypechanged = null;
      return;
    }
    this._oncontenttypechanged = value;
    this.addEventListener('contenttype-changed', this._oncontenttypechanged);
  }

  constructor() {
    super();
    /**
     * @type {string}
     */
    this.contentType = undefined;
    /**
     * @type {number}
     */
    this.selected = undefined;
    /**
     * @type {boolean}
     */
    this.noLabelFloat = false;
    /**
     * @type {boolean}
     */
    this.compatibility = false;
    /**
     * @type {boolean}
     */
    this.outlined = false;
    /**
     * @type {boolean}
     */
    this.readOnly = false;
    /**
     * @type {boolean}
     */
    this.disabled = false;

    this._contentTypeHandler = this._contentTypeHandler.bind(this);
  }

  _attachListeners(node) {
    node.addEventListener('content-type-changed', this._contentTypeHandler);
  }

  _detachListeners(node) {
    node.removeEventListener('content-type-changed', this._contentTypeHandler);
  }

  firstUpdated(args) {
    super.firstUpdated(args);
    this._contentTypeChanged(this.contentType);
  }

  /**
   * Handles change of content type value
   *
   * @param {String} contentType New value
   */
  _contentTypeChanged(contentType) {
    this.__cancelSelectedEvents = true;
    if (!contentType) {
      this.selected = undefined;
      this.__cancelSelectedEvents = false;
      return;
    }
    const index = contentType.indexOf(';');
    if (index > 0) {
      contentType = contentType.substr(0, index);
    }
    contentType = contentType.toLowerCase();
    const supported = this.__getDropdownChildrenTypes();
    const selected = supported.findIndex((item) => item.toLowerCase() === contentType);
    if (selected !== -1) {
      this.selected = selected;
    } else {
      this.selected = undefined;
    }
    this.__cancelSelectedEvents = false;
  }

  /**
   * If the event comes from different source then this element then it
   * updates `contentType` value.
   *
   * @param {CustomEvent} e
   */
  _contentTypeHandler(e) {
    if (e.defaultPrevented || e.composedPath()[0] === this) {
      return;
    }
    const ct = e.detail.value;
    if (ct !== this.contentType) {
      this.contentType = ct;
    }
  }

  /**
   * When changing the editor it mey require to also change the content type header.
   * This function updates Content-Type.
   *
   * @param {CustomEvent} e
   */
  _contentTypeSelected(e) {
    if (this.__cancelSelectedEvents) {
      return;
    }
    const list = /** @type AnypointListbox */ (e.target);
    const { selected, selectedItem } = list;
    if (!selectedItem) {
      return;
    }
    if (this.selected !== selected) {
      this.selected = Number(selected);
    }
    const ct = selectedItem.dataset.type;
    if (this.contentType !== ct) {
      this.__cancelSelectedEvents = true;
      this.dispatchEvent(
        new CustomEvent('content-type-changed', {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            value: ct
          }
        })
      );
      this.contentType = ct;
      this.__cancelSelectedEvents = false;
    }
  }

  /**
   * Creates a list of all content types added to this element.
   * This includes pre-existing onces and any added to light DOM.
   *
   * @returns {string[]} Array of ordered content types (values of the `data-type` attribute).
   */
  __getDropdownChildrenTypes() {
    let children = Array.from(this.shadowRoot.querySelectorAll('anypoint-listbox anypoint-item'));
    const slot = /** @type HTMLSlotElement */ (this.shadowRoot.querySelector('slot[name="item"]'));
    if (!slot) {
      return [];
    }
    const lightChildren = slot.assignedElements();
    children = children.concat(lightChildren);
    const result = [];
    children.forEach((item) => {
      if (item.nodeType !== Node.ELEMENT_NODE) {
        return;
      }
      const elm = /** @type HTMLElement */ (item);
      if (!elm.dataset.type) {
        return;
      }
      result[result.length] = elm.dataset.type;
    });
    return result;
  }

  _handleDropdownOpened(e) {
    e.target.setAttribute('aria-expanded', String(e.target.opened));
  }

  render() {
    const { readOnly, disabled, compatibility, outlined, noLabelFloat } = this;
    return html`<style>${this.styles}</style>
      <anypoint-dropdown-menu
        ?noLabelFloat="${noLabelFloat}"
        aria-label="Select request body content type"
        aria-expanded="false"
        ?outlined="${outlined}"
        ?compatibility="${compatibility}"
        ?disabled="${disabled || readOnly}"
        @opened-changed="${this._handleDropdownOpened}"
      >
        <label slot="label">Body content type</label>
        <anypoint-listbox
          slot="dropdown-content"
          @select="${this._contentTypeSelected}"
          .selected="${this.selected}"
          ?disabled="${disabled}"
          ?compatibility="${compatibility}"
          selectable="[data-type]"
        >
          ${SupportedTypes.map((v) => html`<anypoint-item ?compatibility="${compatibility}" data-type="${v}">${v}</anypoint-item>`)}
          <slot name="item"></slot>
        </anypoint-listbox>
      </anypoint-dropdown-menu>
    `;
  }
}
