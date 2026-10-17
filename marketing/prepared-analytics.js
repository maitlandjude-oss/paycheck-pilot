/* Aggregate analytics. Inactive until the owner-provided endpoint is configured.
   Never read form values, bill storage, feedback text or financial amounts. */
(() => {
  'use strict';
  const endpoint = ''; // Set to the verified owner account's https://CODE.goatcounter.com/count.
  const params = new URLSearchParams(location.search);
  try {
    if (params.get('analytics') === 'off') localStorage.setItem('aipayerAnalyticsOff','1');
    if (params.get('analytics') === 'on') localStorage.removeItem('aipayerAnalyticsOff');
    if (localStorage.getItem('aipayerAnalyticsOff') === '1') return;
  } catch (_) {}
  if (!/^https:\/\/[a-z0-9-]+\.goatcounter\.com\/count$/.test(endpoint) ||
      location.hostname !== 'ai-payer.online' || navigator.webdriver ||
      navigator.globalPrivacyControl || navigator.doNotTrack === '1') return;
  const campaigns = {'tiktok:payday_2000':'tiktok/payday_2000'};
  const sources = new Set(['reddit','tiktok','pinterest','quora','google','bing']);
  const source = params.get('src') || params.get('utm_source');
  const campaign = campaigns[source + ':' + params.get('utm_campaign')] || (sources.has(source) ? source : '');
  let referrer = '';
  try { referrer = new URL(document.referrer).origin; } catch (_) {}
  const page = location.pathname === '/paycheck-shortfall.html' ? '/paycheck-shortfall.html' : '/';
  window.goatcounter = {no_onload:true, no_events:true, endpoint};
  const queue = [];
  const allowed = new Set(['planner_started','build_clicked','plan_generated','example_clicked','feedback_submit_attempt','support_clicked']);
  function send(name) {
    if (!allowed.has(name)) return;
    const payload = {path:name,title:name,event:true,referrer:campaign || referrer};
    if (window.goatcounter.count) { try {window.goatcounter.count(payload);} catch (_) {} }
    else if(queue.length < 20) queue.push(payload);
  }
  let started = false;
  document.querySelector('main')?.addEventListener('input', e => {
    if (!started && (e.target.closest('#billForm') || ['cash','nextPay','food','transport','needs','buffer'].includes(e.target.id))) {
      started = true; send('planner_started');
    }
  });
  document.getElementById('sample')?.addEventListener('click', () => send('example_clicked'));
  document.getElementById('build')?.addEventListener('click', () => {
    send('build_clicked');
    if (document.querySelector('#plan .plan-row')) send('plan_generated');
  });
  document.querySelector('form[action^="https://formsubmit.co/"]')?.addEventListener('submit', () => send('feedback_submit_attempt'));
  document.querySelector('.support-btn')?.addEventListener('click', () => send('support_clicked'));
  const script = document.createElement('script');
  script.src = 'https://gc.zgo.at/count.js'; script.async = true;
  script.onload = () => {
    try {
      window.goatcounter.count({path:page,title:page,referrer:campaign || referrer});
      queue.splice(0).forEach(p => window.goatcounter.count(p));
    } catch (_) {}
  };
  document.head.appendChild(script);
})();

