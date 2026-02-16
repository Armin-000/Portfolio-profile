document.addEventListener('DOMContentLoaded', () => {
  /* =======================================================================
    MATRIX CANVAS (CLS-safe + DPR) + UI SLIDERI + THEME DETECTION
    ======================================================================= */

  const canvas = document.getElementById('matrix');
  if (!canvas) {
    initHeaderTyping();
    initHeroTyped();
    bindThemeSwitcher();
    applyHeroTypedTheme();
    return;
  }

  const ctx = canvas.getContext && canvas.getContext('2d');
  if (!ctx) {
    initHeaderTyping();
    initHeroTyped();
    bindThemeSwitcher();
    applyHeroTypedTheme();
    return;
  }


  let dynamicFontSize = 16;
  let rows = 0, h_drops = [], yStartOffset = 0;
  let bandTopPx = 0;

  const BG_R = 0, BG_G = 0, BG_B = 0;
  const BG_FADE_ALPHA = 0.35;
  const GLOW_RGBA = "rgba(0, 146, 199, ";

  const LIGHT_BG_R = 250, LIGHT_BG_G = 247, LIGHT_BG_B = 246;

  const TARGET_BAND_TOP_FRAC    = 0.60;
  const TARGET_BAND_HEIGHT_FRAC = 0.28;

  const DIAGONAL_RISE_RATIO = 0.20;
  const START_PACK_PORTION  = 0.40;
  const END_CONV_START      = 0.78;

  let START_Y_FRAC   = 0.32;
  let WAVE_STRENGTH  = 0.40;
  let WAVE_CYCLES    = 1.0;
  let BEND_STRENGTH  = 1.75;
  let DENSITY        = 0.90;
  let STREAMS_MULT   = 2.0;
  let SPEED_MULT     = 0.45;
  let TARGET_FPS     = 50;

  const BASE_COLS_PER_SEC  = 18;
  const BASE_PHASE_SPEED   = 3.0;

  let SCATTER_START  = 0.95;
  let SCATTER_AMOUNT = 1.00;

  let cssW = 0;
  let cssH = 0;

  function clamp01(x){ return x < 0 ? 0 : (x > 1 ? 1 : x); }

  /* =======================================================================
    LIGHT/DARK DETEKCIJA
    ======================================================================= */
  let __lastThemeCheck = 0;
  let __cachedLightMode = false;

  function parseRGB(str) {
    const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/i.exec(str);
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3] };
  }

  function computeBrightness(colorStr) {
    const rgb = parseRGB(colorStr);
    if (!rgb) return null;
    return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
  }

  function isLightMode() {
    const now = performance.now();
    if (now - __lastThemeCheck < 150) return __cachedLightMode;
    __lastThemeCheck = now;

    const root = document.documentElement;
    const body = document.body;

    const themeAttr =
      root.getAttribute('data-bs-theme') ||
      root.getAttribute('data-theme') ||
      body.getAttribute('data-theme');

    if (themeAttr === 'light') return (__cachedLightMode = true);
    if (themeAttr === 'dark')  return (__cachedLightMode = false);

    if (
      root.classList.contains('light') ||
      root.classList.contains('light-mode') ||
      root.classList.contains('theme-light') ||
      body.classList.contains('light') ||
      body.classList.contains('light-mode') ||
      body.classList.contains('theme-light')
    ) return (__cachedLightMode = true);

    if (
      root.classList.contains('dark') ||
      root.classList.contains('dark-mode') ||
      root.classList.contains('theme-dark') ||
      body.classList.contains('dark') ||
      body.classList.contains('dark-mode') ||
      body.classList.contains('theme-dark')
    ) return (__cachedLightMode = false);

    const bg = getComputedStyle(body).backgroundColor;
    const b = computeBrightness(bg);
    __cachedLightMode = (b == null) ? false : (b >= 140);
    return __cachedLightMode;
  }

  /* =======================================================================
    HERO TYPED THEME (isti scope -> nema undefined)
    ======================================================================= */
  const typedEl      = document.getElementById('typed');
  const subtitleWrap = document.querySelector('.hero-01-subtitle');
  const cursorEl     = document.querySelector('.typed-cursor');
  function applyHeroTypedTheme() {
    if (!typedEl && !subtitleWrap && !cursorEl) return;

    const light = isLightMode();
    const color = light ? '#111827' : '#f9fafb';

    if (typedEl)      typedEl.style.color = color;
    if (subtitleWrap) subtitleWrap.style.color = color;
    if (cursorEl)     cursorEl.style.color = color;
  }

  function bindThemeSwitcher() {
    const colorSwitcherBtn = document.getElementById('color-switcher');
    if (colorSwitcherBtn && !colorSwitcherBtn.__heroTypedBound) {
      colorSwitcherBtn.__heroTypedBound = true;
      colorSwitcherBtn.addEventListener('click', () => {
        setTimeout(applyHeroTypedTheme, 80);
      });
    }
  }

  /* =======================================================================
    SLIDERI (ako postoje)
    ======================================================================= */
  const $startY  = document.getElementById('strength');
  const $cycles  = document.getElementById('cycles');
  const $bend    = document.getElementById('bend');
  const $density = document.getElementById('density');
  const $streams = document.getElementById('streams');
  const $speed   = document.getElementById('speed');
  const $fps     = document.getElementById('fps');
  const $scatterStart = document.getElementById('scatterStart');
  const $scatterAmt   = document.getElementById('scatterAmt');

  const $valStartY  = document.getElementById('valStrength');
  const $valCycles  = document.getElementById('valCycles');
  const $valBend    = document.getElementById('valBend');
  const $valDensity = document.getElementById('valDensity');
  const $valStreams = document.getElementById('valStreams');
  const $valSpeed   = document.getElementById('valSpeed');
  const $valFps     = document.getElementById('valFps');
  const $valScatterStart = document.getElementById('valScatterStart');
  const $valScatterAmt   = document.getElementById('valScatterAmt');

  function setStartY(v){
    START_Y_FRAC = +v;
    if ($valStartY) $valStartY.textContent = (START_Y_FRAC * 100).toFixed(0) + '%';
  }
  function setCycles(v){
    WAVE_CYCLES = +v;
    if ($valCycles) $valCycles.textContent = WAVE_CYCLES.toFixed(1);
  }
  function setBend(v){
    BEND_STRENGTH = +v;
    if ($valBend) $valBend.textContent = BEND_STRENGTH.toFixed(2);
  }
  function setDensity(v){
    DENSITY = +v;
    if ($valDensity) $valDensity.textContent = DENSITY.toFixed(2);
    resizeCanvas();
  }
  function setStreams(v){
    STREAMS_MULT = +v;
    if ($valStreams) $valStreams.textContent = STREAMS_MULT.toFixed(1) + '×';
    resizeCanvas();
  }
  function setSpeed(v){
    SPEED_MULT = +v;
  }
  function setFps(v){
    TARGET_FPS = Math.round(+v);
    if ($valFps) $valFps.textContent = TARGET_FPS;
  }
  function setScatterStart(v){
    SCATTER_START = +v;
    if ($valScatterStart) $valScatterStart.textContent = SCATTER_START.toFixed(2);
  }
  function setScatterAmt(v){
    SCATTER_AMOUNT = +v;
    if ($valScatterAmt) $valScatterAmt.textContent = SCATTER_AMOUNT.toFixed(2);
  }

  $startY ?.addEventListener('input', e => setStartY(e.target.value));
  $cycles ?.addEventListener('input', e => setCycles(e.target.value));
  $bend   ?.addEventListener('input', e => setBend(e.target.value));
  $density?.addEventListener('input', e => setDensity(e.target.value));
  $streams?.addEventListener('input', e => setStreams(e.target.value));
  $speed  ?.addEventListener('input', e => setSpeed(e.target.value));
  $fps    ?.addEventListener('input', e => setFps(e.target.value));
  $scatterStart?.addEventListener('input', e => setScatterStart(e.target.value));
  $scatterAmt  ?.addEventListener('input', e => setScatterAmt(e.target.value));

  /* =======================================================================
    PRESETS
    ======================================================================= */
  const PRESETS = {
    mobile: {
      START_Y_FRAC:   0.35,
      WAVE_CYCLES:    1.0,
      BEND_STRENGTH:  1.40,
      DENSITY:        0.75,
      STREAMS_MULT:   1.5,
      SPEED_MULT:     0.25,
      TARGET_FPS:     50,
      SCATTER_START:  0.90,
      SCATTER_AMOUNT: 0.90
    },
    tablet: {
      START_Y_FRAC:   0.33,
      WAVE_CYCLES:    1.0,
      BEND_STRENGTH:  1.60,
      DENSITY:        0.85,
      STREAMS_MULT:   1.8,
      SPEED_MULT:     0.45,
      TARGET_FPS:     50,
      SCATTER_START:  0.93,
      SCATTER_AMOUNT: 0.95
    },
    desktop: {
      START_Y_FRAC:   0.32,
      WAVE_CYCLES:    1.0,
      BEND_STRENGTH:  1.75,
      DENSITY:        0.90,
      STREAMS_MULT:   2.0,
      SPEED_MULT:     0.45,
      TARGET_FPS:     50,
      SCATTER_START:  0.95,
      SCATTER_AMOUNT: 1.00
    }
  };

  function getPresetByViewport() {
    const w = window.innerWidth;
    if (w < 768) return PRESETS.mobile;
    if (w < 1200) return PRESETS.tablet;
    return PRESETS.desktop;
  }

  function applyPreset(p){
    if ($startY)       $startY.value       = p.START_Y_FRAC;
    if ($cycles)       $cycles.value       = p.WAVE_CYCLES;
    if ($bend)         $bend.value         = p.BEND_STRENGTH;
    if ($density)      $density.value      = p.DENSITY;
    if ($streams)      $streams.value      = p.STREAMS_MULT;
    if ($speed)        $speed.value        = p.SPEED_MULT;
    if ($fps)          $fps.value          = p.TARGET_FPS;
    if ($scatterStart) $scatterStart.value = p.SCATTER_START;
    if ($scatterAmt)   $scatterAmt.value   = p.SCATTER_AMOUNT;

    setStartY(p.START_Y_FRAC);
    setCycles(p.WAVE_CYCLES);
    setBend(p.BEND_STRENGTH);
    setDensity(p.DENSITY);
    setStreams(p.STREAMS_MULT);
    setSpeed(p.SPEED_MULT);
    setFps(p.TARGET_FPS);
    setScatterStart(p.SCATTER_START);
    setScatterAmt(p.SCATTER_AMOUNT);
  }

  let currentPreset = getPresetByViewport();
  applyPreset(currentPreset);

  /* =======================================================================
    poll UI (paranoja)
    ======================================================================= */
  let __prevDensity = DENSITY;
  let __prevStreams = STREAMS_MULT;
  let __prevStartY  = START_Y_FRAC;

  function pollUI() {
    if ($startY){
      const v = +$startY.value;
      if (!Number.isNaN(v) && v !== __prevStartY) { setStartY(v); __prevStartY = v; }
    }
    if ($cycles){ const v = +$cycles.value; if (!Number.isNaN(v)) setCycles(v); }
    if ($bend){ const v = +$bend.value; if (!Number.isNaN(v)) setBend(v); }

    if ($density){
      const v = +$density.value;
      if (!Number.isNaN(v) && v !== __prevDensity) { setDensity(v); __prevDensity = v; }
    }
    if ($streams){
      const v = +$streams.value;
      if (!Number.isNaN(v) && v !== __prevStreams) { setStreams(v); __prevStreams = v; }
    }

    if ($speed){ const v = +$speed.value; if (!Number.isNaN(v)) setSpeed(v); }
    if ($fps){ const v = +$fps.value; if (!Number.isNaN(v)) setFps(v); }
    if ($scatterStart){ const v = +$scatterStart.value; if (!Number.isNaN(v)) setScatterStart(v); }
    if ($scatterAmt){ const v = +$scatterAmt.value; if (!Number.isNaN(v)) setScatterAmt(v); }
  }

  /* =======================================================================
    effective speed
    ======================================================================= */
  const MIN_BOOST = 0.25;
  const MAX_BOOST = 10.0;

  function effectiveSpeed() {
    const t = Math.min(1, Math.max(0, (SPEED_MULT - 0.20) / (2.00 - 0.20)));
    const gamma = 0.8;
    const eff = MIN_BOOST + Math.pow(t, gamma) * (MAX_BOOST - MIN_BOOST);
    if ($valSpeed) $valSpeed.textContent = `${SPEED_MULT.toFixed(2)} (${eff.toFixed(2)}×)`;
    return eff;
  }

  /* =======================================================================
    wave / bends
    ======================================================================= */
  const BENDS = [
    { p: 0.35, yFrac: 0.64, strength: 0.80, radius: 0.30 },
    { p: 0.70, yFrac: 0.38, strength: 0.70, radius: 0.34 },
  ];

  function smoothstep(t){ return t * t * (3 - 2 * t); }

  function localizedInfluence(p, center, radius){
    const d = Math.abs(p - center);
    const norm = Math.min(1, d / Math.max(1e-6, radius));
    return smoothstep(1 - norm);
  }

  function globalWaveOffset(p, h){
    const A = h * (0.04 + Math.min(0.5, Math.max(0, WAVE_STRENGTH)) * 0.14);
    return Math.sin(p * Math.PI * 2 * Math.max(1, WAVE_CYCLES)) * A;
  }

  function applyBends(p, yCurrent, canvasHeight) {
    let y = yCurrent;
    y += globalWaveOffset(p, canvasHeight);

    for (const bend of BENDS) {
      const mixBase = localizedInfluence(p, bend.p, bend.radius) * bend.strength;
      const mix = mixBase * Math.max(0, Math.min(BEND_STRENGTH, 3.0));
      const yTarget = canvasHeight * bend.yFrac;
      y = y * (1 - mix) + yTarget * mix;
    }
    return y;
  }

  /* =======================================================================
    CLS-safe resize: CSS size (rect) + DPR buffer
    ======================================================================= */
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);

    cssW = w;
    cssH = h;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width  = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));

    // crtamo u CSS koordinatama
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const baseFont = Math.max(12, Math.floor(w / 120));
    dynamicFontSize = Math.max(8, Math.floor(baseFont / DENSITY));

    bandTopPx = Math.floor(h * TARGET_BAND_TOP_FRAC);
    const bandTop    = bandTopPx;
    const bandHeight = Math.floor(h * TARGET_BAND_HEIGHT_FRAC);
    const bandBottom = Math.min(h - 2, bandTop + bandHeight);

    const baseRows = Math.max(1, Math.floor(bandHeight / (dynamicFontSize * 0.75)));
    rows = Math.max(1, Math.floor(baseRows * STREAMS_MULT));
    yStartOffset = bandTop;

    const fullCols = Math.max(1, Math.floor(w / dynamicFontSize));
    h_drops = [];

    for (let i = 0; i < rows; i++) {
      const speed = Math.random() * 0.55 + 0.35;
      const initialX = Math.floor(Math.random() * fullCols);
      const initialT = Math.random() * 2 * Math.PI;

      const rowIndex = i % baseRows;
      const streamId = Math.floor(i / baseRows);
      const streamJitter = (streamId - (STREAMS_MULT - 1) / 2) * 0.20 / Math.max(1, (STREAMS_MULT - 1));

      const targetY  = bandTop + ((rowIndex + 0.5) / baseRows) * Math.max(1, (bandBottom - bandTop));
      const scatterY = Math.max(dynamicFontSize, Math.min(h - 2, Math.random() * h));

      h_drops.push({
        x: initialX,
        t: initialT,
        speed,
        resetPoint: fullCols + Math.floor(Math.random() * 5),
        lastY: null,
        targetY,
        scatterY,
        rowIndex,
        streamJitter
      });
    }
  }

  function handleResize() {
    const newPreset = getPresetByViewport();
    if (newPreset !== currentPreset) {
      currentPreset = newPreset;
      applyPreset(newPreset);
    }
    resizeCanvas();
  }

  window.addEventListener('resize', handleResize);

  // Jedan ResizeObserver (dosta)
  const ro = new ResizeObserver(() => resizeCanvas());
  ro.observe(canvas);

  /* =======================================================================
    draw
    ======================================================================= */
  const chars = "01010101010101010101010101010101010101010101010101010101";

  function drawStep(dt){
    // typed boje sinkaj svaku sličicu (lagano, ali sigurno)
    applyHeroTypedTheme();

    const lightMode = isLightMode();
    const r = lightMode ? LIGHT_BG_R : BG_R;
    const g = lightMode ? LIGHT_BG_G : BG_G;
    const b = lightMode ? LIGHT_BG_B : BG_B;

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${BG_FADE_ALPHA})`;
    ctx.fillRect(0, 0, cssW, cssH);

    ctx.shadowColor = "rgba(0, 146, 199, 0.8)";
    ctx.shadowBlur = 0;
    ctx.font = dynamicFontSize + "px monospace";

    const fullCols       = Math.max(1, Math.floor(cssW / dynamicFontSize));
    const diagonalRisePx = cssH * DIAGONAL_RISE_RATIO;
    const slopePerCol    = diagonalRisePx / Math.max(1, fullCols);

    const margin = Math.max(dynamicFontSize, cssH * 0.03);
    let startY = Math.round(clamp01(START_Y_FRAC) * cssH);
    startY = Math.max(margin, Math.min(cssH - margin, startY));

    const effSpeed      = effectiveSpeed();
    const waveAmplitude = cssH * 0.02;

    for (let i = 0; i < h_drops.length; i++) {
      const drop = h_drops[i];
      const text = chars.charAt(Math.floor(Math.random() * chars.length));

      const baseY     = yStartOffset + (i * dynamicFontSize);
      const originalY = baseY - (slopePerCol * drop.x);
      const p = Math.max(0, Math.min(1, drop.x / Math.max(1, fullCols)));

      const startMix = 1 - smoothstep(Math.min(1, p / START_PACK_PORTION));
      let yDiag = originalY * (1 - startMix) + startY * startMix;

      yDiag = applyBends(p, yDiag, cssH);

      const endPhase = Math.max(0, (p - END_CONV_START) / Math.max(1e-6, (1 - END_CONV_START)));
      const converge = smoothstep(endPhase);
      yDiag = yDiag * (1 - converge) + drop.targetY * converge;

      const scatterPhase = Math.max(0, (p - SCATTER_START) / Math.max(1e-6, (1 - SCATTER_START)));
      const scatterMix   = smoothstep(scatterPhase) * Math.min(1, Math.max(0, SCATTER_AMOUNT));
      yDiag = yDiag * (1 - scatterMix) + drop.scatterY * scatterMix;

      const yOffset = Math.sin(drop.t * 0.6 + drop.x * 0.16) * (waveAmplitude * 0.5);
      let wavyY = yDiag + yOffset;

      if (drop.lastY === null) drop.lastY = wavyY;
      drop.lastY = drop.lastY + (wavyY - drop.lastY) * 0.15;
      wavyY = drop.lastY;

      const wavyX = drop.x * dynamicFontSize;

      ctx.fillStyle = `${GLOW_RGBA}1)`;
      const yDraw = Math.max(dynamicFontSize, Math.min(cssH - 2, wavyY));
      ctx.fillText(text, wavyX, yDraw);

      drop.x += drop.speed * BASE_COLS_PER_SEC * effSpeed * dt;
      drop.t += BASE_PHASE_SPEED * effSpeed * dt;

      if (drop.x > drop.resetPoint && Math.random() > 0.95) {
        drop.x = 0;
        drop.t = Math.random() * 2 * Math.PI;
        drop.lastY = null;
        drop.scatterY = Math.max(dynamicFontSize, Math.min(cssH - 2, Math.random() * cssH));
      }
    }
  }

  /* =======================================================================
    FPS cap
    ======================================================================= */
  let lastTime = performance.now();
  let acc = 0;

  function loop(now){
    const elapsed = now - lastTime;
    lastTime = now;

    const fpsClamped    = 60;
    const frameInterval = 1000 / fpsClamped;

    acc += elapsed;

    while (acc >= frameInterval){
      drawStep(frameInterval / 1000);
      acc -= frameInterval;
    }

    requestAnimationFrame(loop);
  }

  /* =======================================================================
    toggle Wave Controls
    ======================================================================= */
  (function initWavePanelToggle(){
    if (window.__awWavePanelInit) return;
    window.__awWavePanelInit = true;

    const panel = document.getElementById('wavePanel');
    const btn   = document.getElementById('togglePanel');
    if (!panel || !btn) return;

    const LS_KEY = 'aw_wavePanelHidden';

    function setHidden(hidden){
      panel.classList.toggle('is-hidden', hidden);
      panel.setAttribute('aria-hidden', hidden ? 'true' : 'false');
      btn.setAttribute('aria-expanded', hidden ? 'false' : 'true');
      btn.title = hidden ? 'Show Wave Controls' : 'Hide Wave Controls';
      localStorage.setItem(LS_KEY, hidden ? '1' : '0');
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setHidden(!panel.classList.contains('is-hidden'));
    });

    document.addEventListener('click', (e) => {
      const clickInsidePanel = panel.contains(e.target);
      const clickOnBtn       = btn.contains(e.target);
      if (!clickInsidePanel && !clickOnBtn && !panel.classList.contains('is-hidden')) {
        setHidden(true);
      }
    });

    const saved = localStorage.getItem(LS_KEY);
    if (saved === '1' || saved === '0'){
      setHidden(saved === '1');
    } else {
      setHidden(window.innerWidth < 768);
    }
  })();

  /* =======================================================================
    START
    ======================================================================= */
  initHeaderTyping();
  initHeroTyped();
  bindThemeSwitcher();
  applyHeroTypedTheme();

  resizeCanvas();
  canvas.classList.add('matrix-visible');
  requestAnimationFrame(loop);


  /* =======================================================================
    HEADER TYPING LOOP (ispod loga)
    ======================================================================= */
  function initHeaderTyping(){
    const subtitles = [
      "where intelligence meets innovation",
      "changing the way you interact with technology",
      "precision, performance, and AI without limits"
    ];

    let currentTextIndex = 0;
    const textSlider = document.getElementById('text-slider');
    if (!textSlider) return;

    const el = textSlider.querySelector('.subtitle');
    const cursor = textSlider.querySelector('.cursor');
    if (!el || !cursor) return;

    function type(text, callback) {
      let i = 0;
      el.textContent = '';
      cursor.style.opacity = '1';
      cursor.classList.remove('cursor-blink');

      function typeChar() {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          const baseDelay = Math.random() * 70 + 50;
          const char = text.charAt(i);
          const isPunctuation = char === ',' || char === '.';
          const delay = isPunctuation ? baseDelay + 250 : baseDelay;
          i++;
          setTimeout(typeChar, delay);
        } else {
          cursor.classList.add('cursor-blink');
          setTimeout(callback, 2000);
        }
      }
      typeChar();
    }

    function erase(callback) {
      let i = el.textContent.length - 1;
      cursor.classList.remove('cursor-blink');

      function eraseChar() {
        if (i >= 0) {
          el.textContent = el.textContent.slice(0, i);
          i--;
          setTimeout(eraseChar, 70);
        } else {
          cursor.classList.add('cursor-blink');
          callback();
        }
      }
      eraseChar();
    }

    function cycleText() {
      const textToDisplay = subtitles[currentTextIndex];
      type(textToDisplay, () => {
        erase(() => {
          currentTextIndex = (currentTextIndex + 1) % subtitles.length;
          cycleText();
        });
      });
    }

    cycleText();
  }

  /* =======================================================================
    Typed.js init (hero)
    ======================================================================= */
  function initHeroTyped(){
    const host = document.getElementById('typed');
    if (!host) return;
    if (host.__awTypedInit) return;
    host.__awTypedInit = true;

    function initTypedNow() {
      // eslint-disable-next-line no-undef
      new Typed('#typed', {
        stringsElement: '#typed-strings',
        showCursor: true,
        cursorChar: '_',
        loop: true,
        typeSpeed: 70,
        backSpeed: 30,
        backDelay: 2500,
        startDelay: 1000
      });
    }
  }
});

