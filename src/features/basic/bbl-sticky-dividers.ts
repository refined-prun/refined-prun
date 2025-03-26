import $style from './bbl-sticky-dividers.module.css';

function init() {
  applyCssRule('BBL', `.${C.SectionList.divider}`, $style.divider);
}

features.add(import.meta.url, init, 'BBL: Makes building category dividers sticky.');
