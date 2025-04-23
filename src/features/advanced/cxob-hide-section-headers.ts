import css from '@src/utils/css-utils.module.css';

function init() {
  applyCssRule('CXOB', 'tbody:nth-child(2) > tr:first-child', css.hidden);
  applyCssRule('CXOB', 'tbody:nth-child(4) > tr:first-child', css.hidden);
}

features.add(import.meta.url, init, 'CXOB: Hides "Offers" and "Requests" headers.');
