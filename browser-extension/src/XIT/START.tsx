import { Link } from '@src/components/Link';
import { h } from 'preact';
import xit from './xit-registry';

function START() {
  return (
    <div style={{ height: '100%', flexGrow: 1, fontSize: '12px', paddingLeft: '2px' }}>
      <span class="title" style={{ paddingLeft: '0' }}>
        Thank you for using PMMG Extended!
      </span>
      <span>This is a short tutorial on how to get the most out of the extension.</span>
      <div style={{ paddingTop: '15px' }}>
        <span>Details on what PMMG offers can be found here: </span>
        <a
          href="https://sites.google.com/view/pmmgextended/home?authuser=0"
          target="_blank"
          class="link"
          style={{ display: 'inline-block' }}
          rel="noreferrer">
          PMMG Extended
        </a>
      </div>
      <div style={{ paddingTop: '15px' }}>
        <span>You can find a list of all of the PMMG commands using </span>
        <Link command="XIT HELP" style={{ display: 'inline-block' }}>
          XIT HELP
        </Link>
      </div>
      <div style={{ paddingTop: '15px' }}>
        <span>PMMG&apos;s settings can be accessed using </span>
        <Link command="XIT SETTINGS" style={{ display: 'inline-block' }}>
          XIT SETTINGS
        </Link>
      </div>
      <div style={{ paddingTop: '15px' }}>
        <span>
          To get PMMG to show you data about your space empire, you need to &apos;scan in&apos; your bases by refreshing
          the page, then opening each of your production lines. You can check how much data has been scanned in using
          the XIT HEALTH buffer.
        </span>
      </div>
      <div style={{ paddingTop: '15px' }}>
        <span>
          Once you have scanned in your data, one of the biggest PMMG features is in the XIT FIN buffer. It tracks your
          finances more accurately than the in game FIN buffer.
        </span>
      </div>
      <div style={{ paddingTop: '15px' }}>
        <span>Contact PiBoy314 in game or on Discord if you have questions.</span>
      </div>
    </div>
  );
}

xit.add({
  command: 'START',
  name: 'PMMG INTRODUCTION',
  component: START,
});
