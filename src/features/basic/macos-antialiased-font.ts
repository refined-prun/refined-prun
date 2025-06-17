import $style from './macos-antialiased-font.module.css';
import { applyCssRule } from '@src/infrastructure/prun-ui/refined-prun-css';

function init() {
  applyCssRule('body', $style.body);
}

features.add(import.meta.url, init, 'Applies antialiased smoothing to all fonts on macOS.');
