import $style from './cxpo-bigger-buttons.module.css';

function init() {
  applyCssRule(
    'CXPO',
    `.${C.FormComponent.containerCommand} .${C.FormComponent.input}`,
    $style.container,
  );
}

features.add(import.meta.url, init, 'CXPO: Makes "Buy" and "Sell" buttons bigger.');
