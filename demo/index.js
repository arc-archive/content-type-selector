import '@advanced-rest-client/arc-demo-helper/arc-demo-helper.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '../content-type-selector.js';

document.getElementById('theme').addEventListener('change', (e) => {
  if (e.target.checked) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
});
document.getElementById('styled').addEventListener('change', (e) => {
  if (e.target.checked) {
    document.body.classList.add('styled');
  } else {
    document.body.classList.remove('styled');
  }
});
document.getElementById('narrow').addEventListener('change', (e) => {
  const { checked } = e.target;
  const nodes = document.querySelectorAll('content-type-selector');
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (checked) {
      node.setAttribute('narrow', '');
    } else {
      node.removeAttribute('narrow');
    }
  }
});
window.addEventListener('content-type-changed', (e) => {
  const node = e.target.nextElementSibling;
  const target = node.querySelector('span');
  target.innerText = e.detail.value;
});
