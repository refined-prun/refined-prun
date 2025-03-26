import classes from './bbl-sticky-dividers.module.css';

function init() {
  applyCssRule('BBL', `.${C.SectionList.divider}`, classes.divider);
}

features.add(import.meta.url, init, 'BBL: Makes building category dividers sticky.');
