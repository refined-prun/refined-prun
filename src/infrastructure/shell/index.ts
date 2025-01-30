// These scripts must execute unconditionally to ensure that APEX can launch even
// if some other script in rprun fails to load. The code in this place also ensures
// basic rprun functioning and update handling.

import '@src/infrastructure/shell/deserialize-prun-app';
import '@src/infrastructure/shell/config';
import '@src/infrastructure/shell/request-hooks';
import '@src/infrastructure/shell/extension-update';

document.documentElement.classList.add('refined-prun');
