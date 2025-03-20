import { applyScopedCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';
import classes from './nots-reactive-format.module.css';
import { userData } from '@src/store/user-data';

function init() {
  if (userData.settings.disabled.find(feature => feature === 'nots-notification-type-label')) {
    userData.settings.disabled.push('nots-reactive-format');
    return;
  }

  applyScopedCssRule('NOTS', `.${C.AlertListItem.content}`, classes.alertListItemContent);
  applyScopedCssRule(
    'NOTS',
    `.${C.AlertListItem.content} > span:first-of-type`,
    classes.alertListItemInnerContent,
  );
  applyScopedCssRule(
    'NOTS',
    `.${C.AlertListItem.content} > span:first-of-type:before`,
    classes.alertListItemInnerContentBefore,
  );
  applyScopedCssRule('NOTS', `.${C.AlertListItem.time}`, classes.alertListItemTime);
}

features.add(
  import.meta.url,
  init,
  'NOTS: Allow notification contents to take up the full width of the buffer.',
);
