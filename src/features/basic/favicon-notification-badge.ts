import { reachableAlerts } from '@src/core/alerts';
import { clamp } from '@src/utils/clamp';

const size = 64;

class FaviconRenderer {
  canvas: HTMLCanvasElement;
  base: HTMLImageElement;
  link: HTMLLinkElement | undefined;
  ready: Ref<boolean>;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = size;
    this.canvas.height = size;

    this.base = new Image();
    this.ready = ref(false);
    this.base.addEventListener('load', () => (this.ready.value = true));
    this.base.src = '/favicon.ico';
  }

  render(badgeNumber: number) {
    if (badgeNumber > 0) {
      this.drawBadge(badgeNumber.toString());
      return;
    }
    this.paint();
  }

  drawBadge(text: string) {
    this.paint(ctx => {
      const radius = size * 0.32;
      const center = size - radius;
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#f04747';
      ctx.fill();
      ctx.lineWidth = size * 0.05;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.stroke();
      const ratio = text.length === 2 ? 1.4 : 1.8;
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(radius * ratio)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, center, center);
    });
  }

  paint(overlay?: (ctx: CanvasRenderingContext2D) => void) {
    const ctx = this.canvas.getContext('2d')!;
    ctx.clearRect(0, 0, size, size);
    if (this.base.naturalWidth > 0) {
      ctx.drawImage(this.base, 0, 0, size, size);
    }
    overlay?.(ctx);
    this.link ??= createLink();
    this.link.href = this.canvas.toDataURL('image/png');
  }
}

function createLink() {
  const el = document.createElement('link');
  el.rel = 'icon';
  el.type = 'image/png';
  document.head.appendChild(el);
  return el;
}

function init() {
  const renderer = new FaviconRenderer();

  watchEffect(() => {
    if (!renderer.ready.value) {
      return;
    }
    const unseen = reachableAlerts.value?.filter(x => !x.seen).length ?? 0;
    renderer.render(clamp(unseen, 0, 99));
  });
}

features.add(import.meta.url, init, 'Adds a notification count badge to the browser tab favicon.');
