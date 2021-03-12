import {TemplateResult, CSSResult, LitElement} from 'lit-element';
import {EventsTargetMixin} from '@advanced-rest-client/events-target-mixin';

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
 * 
 * @fires content-type-changed
 * @fires contenttype-changed
 */
export declare class ContentTypeSelector extends EventsTargetMixin(LitElement) {
  get styles(): CSSResult;
  /**
   * A value of a Content-Type header.
   * @attribute
   */
  contentType: string;
  /**
  * Index of currently selected item.
  * @attribute
  */
  selected: number;
  /**
  * Passes the value to the dropdown element
  * @attribute
  */
  noLabelFloat: boolean;
  /**
  * Enables compatibility with Anypoint styling
  * @attribute
  */
  compatibility: boolean;
  /**
  * Enables Material Design outlined style
  * @attribute
  */
  outlined: boolean;
  /**
  * When set the editor is in read only mode.
  * @attribute
  */
  readOnly: boolean;
  /**
  * When set all controls are disabled in the form
  * @attribute
  */
  disabled: boolean;

  oncontenttypechanged: EventListener;

  constructor();
  
  _attachListeners(node: EventTarget): void;
  _detachListeners(node: EventTarget): void;
  firstUpdated(args: Map<string | number | symbol, unknown>): void;

  /**
   * Handles change of content type value
   *
   * @param contentType New value
   */
  _contentTypeChanged(contentType: String|null): void;

  /**
   * If the event comes from different source then this element then it
   * updates `contentType` value.
   */
  _contentTypeHandler(e: CustomEvent|null): void;

  /**
   * When changing the editor it mey require to also change the content type header.
   * This function updates Content-Type.
   */
  _contentTypeSelected(e: CustomEvent|null): void;
  __getDropdownChildrenTypes(): string[];
  _handleDropdownOpened(e: Event): void;

  render(): TemplateResult;
}
