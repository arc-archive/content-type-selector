[![Build Status](https://travis-ci.org/advanced-rest-client/content-type-selector.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/content-type-selector)  

# content-type-selector

`<content-type-selector>` is an element that provides an UI for selecting common content type values.

The element do not show a value that is not defined in the list. Instead it shows the label.

The element also fires the `content-type-changed` custom event when the user change the value
in the drop down container.

### Example
```
<content-type-selector></content-type-selector>
```

The list of content type values can be extended by setting child `<paper-item>` elements with the
`data-type` attribute set to content type value.

### Example
```
<content-type-selector>
  <paper-item data-type="application/zip">Zip file</paper-item>
  <paper-item data-type="application/7z">7-zip file</paper-item>
</content-type-selector>
```

### Styling
`<content-type-selector>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--content-type-selector` | Mixin applied to the element | `{}`

The element support styles for `paper-dropdown-menu`, `paper-listbox` and `paper-item`



### Events
| Name | Description | Params |
| --- | --- | --- |
| content-type-changed | Fired when the content type header has been updated. | value **String** - New Content type. |
