import { act } from '@src/features/XIT/ACT/act-registry';
import { getLiveShippingAd } from '@src/core/shipping/shipping-ads';
import { clickElement } from '@src/util';
import { watchUntil } from '@src/utils/watch';
import { sleep } from '@src/utils/sleep';
import { fixed01, fixed2 } from '@src/utils/format';

interface Data {
  // LMA parameter, for example `BEN/8036`.
  key: string;
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  value: number;
  currency: string;
}

// Time for the LMA buffer to load the ad before it counts as gone.
const adLoadTimeoutMs = 5000;

// Ads accepted in this session, so later steps can tell a skipped accept from a failure.
export const acceptedAds = new Set<string>();

export const LMA_ACCEPT = act.addActionStep<Data>({
  type: 'LMA_ACCEPT',
  description: data =>
    `Accept shipping ad ${data.key}: ${fixed01(data.weight)}t / ${fixed01(data.volume)}m³ ` +
    `${data.origin} → ${data.destination} for ${fixed2(data.value)} ${data.currency}`,
  execute: async ctx => {
    const { data, log, setStatus, requestTile, waitAct, waitActionFeedback, complete, skip } = ctx;

    const tile = await requestTile(`LMA ${data.key}`);
    if (!tile) {
      return;
    }

    setStatus('Loading ad...');
    await Promise.race([
      watchUntil(() => getLiveShippingAd(data.key) !== undefined),
      sleep(adLoadTimeoutMs),
    ]);
    // Stale ads (taken or removed) must not stop the rest of the package.
    const ad = getLiveShippingAd(data.key);
    if (ad?.localAd.status !== 'OPEN') {
      log.warning(`Ad ${data.key} is not available anymore`);
      skip();
      return;
    }

    const form = await $(tile.anchor, C.LocalMarketAd.form);
    const button = _$(form, C.Button.success) ?? _$(form, C.Button.primary);
    if (!button) {
      log.warning(`Ad ${data.key} cannot be accepted`);
      skip();
      return;
    }

    await waitAct(`Accept ad ${data.key}?`);
    await clickElement(button);
    await waitActionFeedback(tile);
    acceptedAds.add(data.key);
    log.success(`Accepted ad ${data.key}`);
    complete();
  },
});
