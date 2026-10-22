/* A timed view of the real planner in an isolated, non-persisting sample frame. */
(() => {
  const embedded = new URLSearchParams(location.search).has('walkthrough');
  if (embedded) {
    document.body.classList.add('walkthrough-mode');
    const nativeFocus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function() { nativeFocus.call(this,{preventScroll:true}); };
    sampleMode = true;
    bills = [];
    const s = scenario();
    window.runWalkthroughScene = index => {
      document.body.dataset.scene = String(index);
      if (index === 0) {
        $('intro').hidden = false;
        $('cash').value = s.values.cash;
        $('nextPay').value = s.values.nextPay;
      }
      if (index === 1) {
        $('continue').click();
        // Submit the actual bill form, with the same validation and render path.
        s.bills.forEach(b => {
          $('billName').value = b.name;
          $('billAmount').value = b.amount;
          $('billDue').value = b.due;
          $('billPriority').value = b.priority;
          $('billForm').requestSubmit();
        });
      }
      if (index === 2) ['food','transport','needs','buffer'].forEach(id => $(id).value = s.values[id]);
      if (index === 3) $('build').focus({preventScroll:true});
      if (index === 4) { $('build').click(); window.scrollTo(0,0); }
    };
    return;
  }
  const captions = [
    '1. Enter $850 and your next payday.',
    '2. Add bills and their due dates.',
    '3. Protect $120 for groceries.',
    '4. Tap Build My Money Plan.',
    '5. Review what fits—and what needs attention.'
  ];
  let elapsed = 0, running = false, ready = false, scene = -1, last = 0, inView = true;
  const frame = $('demoFrame');
  const observer = new IntersectionObserver(entries => {inView = entries[0].isIntersecting;}, {threshold:.4});
  observer.observe($('demoCaption'));
  function showScene(index) {
    if (scene === index) return;
    scene = index;
    frame.contentWindow.runWalkthroughScene(index);
    $('demoCaption').textContent = captions[index];
    frame.style.height = Math.max(280,frame.contentDocument.querySelector('main').scrollHeight + 24) + 'px';
  }
  function play() {
    $('demoCaption').scrollIntoView({block:'start'});
    running = true; last = performance.now();
    $('demo').textContent = 'Ⅱ Pause example';
    $('demoStatus').textContent = 'Playing · captions on · no sound needed';
  }
  function pause() {
    running = false;
    $('demo').textContent = '▶ Resume example';
    $('demoStatus').textContent = 'Paused. Continue whenever you’re ready.';
  }
  function reset() {
    elapsed = 0; scene = -1; ready = false; running = false;
    $('demoProgress').value = 0; $('demoRestart').hidden = true;
    $('demo').disabled = true; $('demo').textContent = 'Loading example…';
    frame.hidden = true;
    frame.onload = () => {
      if (typeof frame.contentWindow.runWalkthroughScene !== 'function') {
        $('demoStatus').textContent = 'The walkthrough could not load. You can still use your numbers below.';
        $('demo').textContent = 'Example unavailable'; return;
      }
      ready = true; frame.hidden = false; $('demoPoster').hidden = true;
      $('demo').disabled = false; showScene(0); play();
    };
    frame.src = '/?walkthrough=1&analytics=off&v=visual_v1';
  }
  $('demo').addEventListener('click', () => {
    if (!ready || elapsed >= 25) { signal('walkthrough_play'); reset(); }
    else if (running) pause(); else play();
  });
  $('demoRestart').addEventListener('click', () => { signal('walkthrough_play'); reset(); });
  document.querySelectorAll('.own').forEach(el => el.addEventListener('click', () => { if(running) pause(); }));
  setInterval(() => {
    const now = performance.now(), delta = Math.min((now-last)/1000,.5); last = now;
    if (!running) return;
    if (document.hidden || !inView) return;
    elapsed = Math.min(25, elapsed + delta);
    $('demoProgress').value = elapsed;
    showScene(Math.min(4,Math.floor(elapsed/5)));
    if (elapsed >= 25) {
      running = false; $('demo').textContent = '▶ Watch again'; $('demoRestart').hidden = false;
      $('demoStatus').textContent = '$120 protected. Rent $600 and card $75 fit. Electricity $140 needs review; $55 stays unallocated. Check consequences before delaying a bill.';
      signal('walkthrough_complete');
    }
  }, 100);
})();
