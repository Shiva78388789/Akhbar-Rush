// Installable app + automatic updates + "Invite friends" sharing.
import {$} from './util.js';
import {SHARE_URL} from './config.js';

let installEvent = null;

export function toast(text, action) {
  const t = $('#toast');
  t.textContent = text;
  t.hidden = false;
  t.onclick = () => { t.hidden = true; if (action) action(); };
  clearTimeout(t._timer);
  if (!action) t._timer = setTimeout(() => { t.hidden = true; }, 2600);
}

export async function shareGame() {
  const url = SHARE_URL || location.href.split('#')[0];
  const data = {title: 'Akhbaar Rush', text: 'Deliver papers through Delhi, Mumbai and more – beat my score in Akhbaar Rush!', url};
  try {
    if (navigator.share) { await navigator.share(data); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(url); toast('Link copied – send it to your friends!'); }
  catch (e) { toast(url); }
}

export function setupPWA() {
  // Android/Chrome install prompt
  addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); installEvent = e;
    const b = $('#btnInstall'); if (b) b.hidden = false;
  });
  const b = $('#btnInstall');
  if (b) b.addEventListener('click', async () => {
    if (installEvent) { installEvent.prompt(); await installEvent.userChoice.catch(() => {}); installEvent = null; b.hidden = true; }
  });
  // iPhone: no install prompt API – show a one-time hint instead
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !navigator.standalone;
  if (ios && b) { b.hidden = false; b.onclick = () => toast('Tap Share, then "Add to Home Screen" to install.'); }

  // Service worker: offline play + "new version" prompt
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  const hadController = !!navigator.serviceWorker.controller; // false on a first visit: never reload then
  navigator.serviceWorker.register('sw.js').then(reg => {
    const ask = w => toast('New version ready – tap to update', () => w.postMessage('skip-waiting'));
    if (reg.waiting && navigator.serviceWorker.controller) ask(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const w = reg.installing;
      w && w.addEventListener('statechange', () => {
        if (w.state === 'installed' && navigator.serviceWorker.controller) ask(w);
      });
    });
    setInterval(() => reg.update().catch(() => {}), 30 * 60 * 1000);
  }).catch(() => {});
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController && !reloaded) { reloaded = true; location.reload(); } });
}
