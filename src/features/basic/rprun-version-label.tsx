import classes from './rprun-version-label.module.css';

async function onFooterReady(footer: HTMLElement) {
  const userCount = await $(footer, C.UsersOnlineCount.container);

  function onClick() {
    window.open('https://github.com/refined-prun/refined-prun/blob/main/CHANGELOG.md', '_blank');
  }

  createFragmentApp(() => (
    <div
      class={[classes.container, C.HeadItem.container, C.fonts.fontRegular, C.type.typeRegular]}
      onClick={onClick}>
      <div class={[C.HeadItem.indicator, C.HeadItem.indicatorSuccess]} />
      <div
        class={[classes.label, C.HeadItem.label]}
        data-tooltip="Refined PrUn version."
        data-tooltip-position="top">
        v. {config.version}
      </div>
    </div>
  )).before(userCount);
}

function init() {
  applyCssRule(`.${C.Frame.foot}`, classes.foot);
  subscribe($$(document, C.Frame.foot), onFooterReady);
}

features.add(import.meta.url, init, 'Adds a bottom-right "Refined PrUn version" label.');
