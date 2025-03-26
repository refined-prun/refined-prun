import css from '@src/utils/css-utils.module.css';

function init() {
  applyCssRule(
    'PRODQ',
    `.${C.ProductionQueue.table} tbody tr td:nth-child(3) .${C.Link.link}`,
    css.hidden,
  );
}

features.add(import.meta.url, init, 'PRODQ: Hides fee collector links.');
