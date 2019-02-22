[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/content-type-selector.svg)](https://www.npmjs.com/package/@advanced-rest-client/content-type-selector)

[![Build Status](https://travis-ci.org/advanced-rest-client/content-type-selector.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/content-type-selector)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/content-type-selector)

## &lt;content-type-selector&gt;

An element that provides an UI for selecting common content type values.

<!---
```
<custom-element-demo>
  <template>
    <link rel="import" href="content-type-selector.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<content-type-selector content-type="application/zip">
  <paper-item slot="item" data-type="application/zip">Zip file</paper-item>
  <paper-item slot="item" data-type="application/7z">7-zip file</paper-item>
</content-type-selector>
```

### API components

This components is a part of API components ecosystem: https://elements.advancedrestclient.com/

## Usage

### Installation
```
npm install --save @advanced-rest-client/content-type-selector
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@advanced-rest-client/content-type-selector/content-type-selector.js';
    </script>
    <script src="node_modules/web-animations-js/web-animations-next.min.js"></script>
  </head>
  <body>
    <content-type-selector></content-type-selector>
  </body>
</html>
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import '@advanced-rest-client/content-type-selector/content-type-selector.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
    <content-type-selector></content-type-selector>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/advanced-rest-client/content-type-selector
cd api-url-editor
npm install
npm install -g polymer-cli
```

### Running the demo locally

```sh
polymer serve --npm
open http://127.0.0.1:<port>/demo/
```

### Running the tests
```sh
polymer test --npm
```
