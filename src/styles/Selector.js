import { css } from 'lit-element';

export default css`
:host {
  display: inline-block;
  margin: 12px 8px;
  height: 56px;
}

:host([compatibility]),
:host([nolabelfloat]) {
  height: 40px;
}

anypoint-dropdown-menu {
  margin: 0;
}
`;
