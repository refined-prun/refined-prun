(() => {
  function startI18NReader() {
    window.addEventListener('message', (event: MessageEvent) => {
      if (event.source !== window) {
        return;
      }
      if (event.data.type === 'rp-get-i18n') {
        function read() {
          const i18n = window['PrUn_i18n'];
          if (!i18n) {
            return false;
          }
          window.postMessage(
            {
              type: 'rp-i18n',
              data: i18n,
            },
            '*',
          );
          return true;
        }

        if (!read()) {
          const interval = setInterval(() => {
            if (read()) {
              clearInterval(interval);
            }
          }, 10);
        }
      }
    });
  }

  try {
    startI18NReader();
  } catch (error) {
    console.error(error);
  }
})();
