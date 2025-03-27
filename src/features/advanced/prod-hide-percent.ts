import css from '@src/utils/css-utils.module.css';

function init() {
  applyCssRule('PROD', `.${C.OrderStatus.inProgress}`, css.hidden);
}

features.add(import.meta.url, init, 'PROD: Hides percent value in the order list.');
