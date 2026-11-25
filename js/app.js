/* ==========================================================================
   Farm portfolio — behaviour
   Plain JS, no dependencies. Loaded with `defer` on every page.
   - Seasons: toggle, remembered in localStorage, defaults to the real season
   - Pixel art: plants, quality stars, avatar and icons are drawn as tiny SVGs
     from text grids (no image requests at all)
   - Pages: index renders hero/farm/about, project.html renders one project
   ========================================================================== */
(function () {
  'use strict';

  var DATA = window.PORTFOLIO;
  if (!DATA) return;

  var SEASONS = ['spring', 'summer', 'fall', 'winter'];
  var STORAGE_KEY = 'farm-season';
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------------ */
  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Only allow http(s), mailto and relative links (blocks javascript: etc.)
  function safeUrl(url) {
    var u = String(url || '').trim();
    if (!u) return '';
    if (/^(https?:|mailto:)/i.test(u)) return u;
    if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return '';
    return u;
  }

  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }

  /* ------------------------------------------------------------------------
     Pixel art
     Each sprite is a list of text rows. Most are symmetric, so only the left
     half is written and mirrored. '.' is transparent; every other letter maps
     to a CSS colour token, so sprites re-tint with the season automatically.
     ------------------------------------------------------------------------ */
  var COLORS = {
    g: 'var(--leaf-dark)',
    G: 'var(--leaf)',
    s: 'var(--stem)',
    f: 'var(--fruit)',
    F: 'var(--fruit-hi)',
    b: 'var(--bud)',
    B: 'var(--bud-hi)',
    k: 'var(--seed)',
    K: 'var(--seed-dark)',
    o: 'var(--q-outline)'
  };

  function mirror(halfRows, oddWidth) {
    return halfRows.map(function (row) {
      var tail = oddWidth ? row.slice(0, -1) : row;
      return row + tail.split('').reverse().join('');
    });
  }

  function pad(rows, height) {
    var width = rows[0].length;
    var blank = new Array(width + 1).join('.');
    while (rows.length < height) rows.unshift(blank);
    return rows;
  }

  // Turns rows into an SVG, merging horizontal runs of one colour into one rect.
  function sprite(rows, colors, label) {
    var h = rows.length;
    var w = rows[0].length;
    var rects = '';
    for (var y = 0; y < h; y++) {
      var row = rows[y];
      var x = 0;
      while (x < w) {
        var c = row.charAt(x);
        if (c === '.' || !colors[c]) {
          x++;
          continue;
        }
        var start = x;
        while (x < w && row.charAt(x) === c) x++;
        rects += '<rect x="' + start + '" y="' + y + '" width="' + (x - start) +
          '" height="1" style="fill:' + colors[c] + '"/>';
      }
    }
    var a11y = label
      ? 'role="img" aria-label="' + esc(label) + '"'
      : 'aria-hidden="true" focusable="false"';
    return '<svg class="pixel" viewBox="0 0 ' + w + ' ' + h + '" width="' + w * 4 +
      '" height="' + h * 4 + '" ' + a11y + '>' + rects + '</svg>';
  }

  // Growth stages, 16x16, left halves (mirrored to full width)
  var PLANT_STAGES = [
    // 0: seed in the ground
    ['......kk', '.....kKk'],
    // 1: sprout
    ['.....gg.', '....gGGg', '.....ggs', '.......s', '.......s'],
    // 2: growing
    ['...gg...', '..gGGg..', '..gGGGgs', '...gggGs', '......gs', '.....ggs',
      '....gGgs', '.......s', '.......s'],
    // 3: budding
    ['........', '.......b', '......bB', '...gg..s', '..gGGg.s', '..gGGGgs',
      '...gggGs', '.....ggs', '......gs', '.....ggs', '....gGgs', '...gGGgs',
      '...ggg.s', '.......s', '.......s', '.......s'],
    // 4: fully grown, fruiting
    ['......ff', '.....fFf', '.....fff', '...gg..s', '..gGGg.s', '..gGGGgs',
      '...gggGs', '.ff..ggs', 'fFff..gs', 'ffff.ggs', '.ff.gGgs', '...gGGgs',
      '...ggg.s', '.......s', '.......s', '.......s']
  ];

  function plantSVG(stage, label) {
    var s = Math.max(0, Math.min(4, stage | 0));
    return sprite(pad(mirror(PLANT_STAGES[s]), 16), COLORS, label);
  }

  // Quality star, 9x9, odd width (centre column shared)
  var STAR = mirror(['....o', '...ox', '...ox', 'oooxx', 'oxhxx', '.oxxx', '..oxx',
    '.oxxo', '.oo..'], true);

  var QUALITY = {
    iridium: { label: 'Iridium', meaning: 'Big project', rank: 3 },
    gold: { label: 'Gold', meaning: 'Solid, well-rounded project', rank: 2 },
    silver: { label: 'Silver', meaning: 'Medium-sized project', rank: 1 },
    none: { label: 'Regular', meaning: 'Small, finished project', rank: 0 }
  };

  function quality(q) {
    return QUALITY[q] ? q : 'none';
  }

  function starSVG(q, label) {
    if (quality(q) === 'none') return '';
    return sprite(STAR, {
      o: 'var(--q-outline)',
      x: 'var(--' + q + ')',
      h: 'var(--' + q + '-hi)'
    }, label);
  }

  /* Pixel avatar (used until a photo is set), 16x16.
     A plain base, then each season swaps in a few rows (hat, crown, scarf)
     and its own clothing colours. Left halves are mirrored like the plants. */
  var AVATAR_BASE = [
    '........', '........', '....hhhh', '...hhhhh', '..hhhhhh', '..hhssss',
    '..hsssss', '..hssess', '..hsssss', '...ssssm', '....ssss', '......ss',
    '...ccccc', '..cccccc', '.ccccccc', '.ccccccc'
  ];
  var AVATAR_SKIN = { h: '#5a3a22', s: '#f0c49a', e: '#3b2414', m: '#c0665a' };

  var OUTFITS = {
    plain: { rows: {}, colors: { c: 'var(--accent)' } },
    spring: {
      // flower crown
      rows: { 3: '...lflfl' },
      colors: { c: '#8fcf6a', l: '#4f9a35', f: '#ff9fbd' }
    },
    summer: {
      // straw hat with a red band
      rows: { 1: '....yyyy', 2: '...yyyyy', 3: '...rrrrr', 4: 'Yyyyyyyy' },
      colors: { c: '#f07a5c', y: '#f2d27a', Y: '#d9b25a', r: '#b8392c' }
    },
    fall: {
      // knitted scarf over a brown jacket
      rows: { 11: '....xxxx', 12: '...xxXxx' },
      tail: [[13, 5, 'x'], [14, 5, 'X'], [13, 6, 'x']],
      colors: { c: '#8a5a2b', x: '#c8562a', X: '#f0a060' }
    },
    winter: {
      // beanie with a pompom, striped scarf, warm coat
      rows: { 0: '.......w', 1: '....bbbb', 2: '...bbbbb', 3: '..bbbbbb', 4: '..BBBBBB',
        11: '....xxxx', 12: '...xxXxx' },
      tail: [[13, 5, 'x'], [14, 5, 'X'], [13, 6, 'x']],
      colors: { c: '#2f5d62', b: '#c94a5a', B: '#e8dfd0', w: '#ffffff', x: '#3f78a8', X: '#ffffff' }
    }
  };

  function avatarSVG(season) {
    var outfit = OUTFITS[season] || OUTFITS.plain;
    var half = AVATAR_BASE.map(function (row, i) {
      return outfit.rows[i] || row;
    });
    var rows = mirror(half);
    (outfit.tail || []).forEach(function (t) {
      var r = rows[t[0]];
      rows[t[0]] = r.slice(0, t[1]) + t[2] + r.slice(t[1] + 1);
    });
    var colors = {};
    var k;
    for (k in AVATAR_SKIN) colors[k] = AVATAR_SKIN[k];
    for (k in outfit.colors) colors[k] = outfit.colors[k];
    return sprite(rows, colors);
  }

  // 8x8 season icons
  var SEASON_ICONS = {
    spring: { rows: mirror(['...p', '..pp', '.ppy', '..pp', '...p', '...s', '.l.s', '..ls']),
      colors: { p: '#ffb8c8', y: '#ffd34d', s: '#6fbf4a', l: '#6fbf4a' } },
    summer: { rows: mirror(['y..y', '.y..', '..yy', '.yyy', '.yyy', '..yy', '.y..', 'y..y']),
      colors: { y: '#ffcc33' } },
    fall: { rows: mirror(['...o', '..oo', '.oor', 'ooor', '.oor', '..or', '...r', '...r']),
      colors: { o: '#e8742a', r: '#96491b' } },
    winter: { rows: mirror(['...w', '.w.w', '..ww', 'wwww', 'wwww', '..ww', '.w.w', '...w']),
      colors: { w: '#8fd0f5' } }
  };

  /* ------------------------------------------------------------------------
     Seasons
     The <head> already set data-season before first paint (no flash).
     ------------------------------------------------------------------------ */
  function currentSeason() {
    var s = root.getAttribute('data-season');
    return SEASONS.indexOf(s) > -1 ? s : 'spring';
  }

  function updateThemeColor() {
    var meta = $('meta[name="theme-color"]');
    if (!meta) return;
    var sky = getComputedStyle(root).getPropertyValue('--sky').trim();
    if (sky) meta.setAttribute('content', sky);
  }

  function dropParticles() {
    if (reduceMotion) return;
    var layer = document.createElement('div');
    layer.className = 'particles';
    layer.setAttribute('aria-hidden', 'true');
    var count = window.innerWidth < 600 ? 10 : 18;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.setProperty('--delay', (Math.random() * 0.8).toFixed(2) + 's');
      p.style.setProperty('--dur', (1.8 + Math.random() * 1.4).toFixed(2) + 's');
      p.style.setProperty('--drift', Math.round(Math.random() * 120 - 60) + 'px');
      layer.appendChild(p);
    }
    document.body.appendChild(layer);
    setTimeout(function () {
      layer.remove();
    }, 3800);
  }

  function setSeason(season, animate) {
    if (SEASONS.indexOf(season) === -1) return;
    applySeason(season, animate);
  }

  function applySeason(season, animate) {
    root.setAttribute('data-season', season);
    try {
      localStorage.setItem(STORAGE_KEY, season);
    } catch (e) { /* private mode: still works for this visit */ }
    var buttons = document.querySelectorAll('[data-set-season]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed',
        String(buttons[i].getAttribute('data-set-season') === season));
    }
    updateThemeColor();
    if (animate) dropParticles();
    document.dispatchEvent(new CustomEvent('farm:season', { detail: season }));
  }

  function initSeasonSwitch() {
    var buttons = document.querySelectorAll('[data-set-season]');
    for (var i = 0; i < buttons.length; i++) {
      (function (btn) {
        var s = btn.getAttribute('data-set-season');
        var icon = SEASON_ICONS[s];
        if (icon) btn.insertAdjacentHTML('afterbegin', sprite(icon.rows, icon.colors));
        btn.addEventListener('click', function () {
          if (s !== currentSeason()) setSeason(s, true);
        });
      })(buttons[i]);
    }
    setSeason(currentSeason(), false);
  }

  /* ------------------------------------------------------------------------
     Shared bits
     ------------------------------------------------------------------------ */
  function isComplete(p) {
    return p.status === 'complete';
  }

  // Complete = fully grown (4). In progress = seed, sprout, growing or budding (0-3).
  var STAGES = [
    { name: 'Seed', detail: 'just started', tag: 'Just started' },
    { name: 'Sprout', detail: 'early days', tag: 'Early days' },
    { name: 'Growing', detail: 'core features working', tag: 'Taking shape' },
    { name: 'Budding', detail: 'almost done', tag: 'Almost done' }
  ];

  function stageOf(p) {
    if (isComplete(p)) return 4;
    var n = parseInt(p.stage, 10);
    return isNaN(n) ? 1 : Math.max(0, Math.min(3, n));
  }

  function progressText(p) {
    var st = STAGES[stageOf(p)];
    return 'In progress: ' + st.detail;
  }

  // Quality is decided at harvest: no star while a project is still growing
  function shownQuality(p) {
    return isComplete(p) ? quality(p.quality) : 'none';
  }

  // Complete first (iridium > gold > silver > none), then in progress
  // (most advanced first), then file order
  function sortedProjects() {
    return (DATA.projects || []).map(function (p, i) {
      return { p: p, i: i };
    }).sort(function (a, b) {
      var ca = isComplete(a.p) ? 0 : 1;
      var cb = isComplete(b.p) ? 0 : 1;
      if (ca !== cb) return ca - cb;
      var ra = ca === 0 ? QUALITY[shownQuality(a.p)].rank : stageOf(a.p);
      var rb = cb === 0 ? QUALITY[shownQuality(b.p)].rank : stageOf(b.p);
      if (ra !== rb) return rb - ra;
      return a.i - b.i;
    }).map(function (x) {
      return x.p;
    });
  }

  function plotHTML(p, extraClass) {
    var q = shownQuality(p);
    var star = starSVG(q);
    return '<div class="plot ' + (extraClass || '') + '" data-quality="' + q +
      '" data-stage="' + stageOf(p) + '">' +
      (star ? '<span class="plot-star">' + star + '</span>' : '') +
      '<div class="plant">' + plantSVG(stageOf(p)) + '</div>' +
      '</div>';
  }

  function linkButton(href, text, primary, newTab) {
    var url = safeUrl(href);
    if (!url) return '';
    var external = newTab || /^https?:/i.test(url);
    return '<a class="btn' + (primary ? ' btn--primary' : '') + '" href="' + esc(url) + '"' +
      (external ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + esc(text) +
      (external ? '<span class="visually-hidden"> (opens in a new tab)</span>' : '') + '</a>';
  }

  function slotsHTML(items) {
    return '<ul class="slots">' + (items || []).map(function (s) {
      return '<li class="slot">' + esc(s) + '</li>';
    }).join('') + '</ul>';
  }

  function setYear() {
    var y = $('[data-year]');
    if (y) y.textContent = new Date().getFullYear();
    var n = document.querySelectorAll('[data-name]');
    for (var i = 0; i < n.length; i++) n[i].textContent = DATA.profile.name;
  }

  function fillIcons() {
    var stars = document.querySelectorAll('[data-star-icon]');
    for (var i = 0; i < stars.length; i++) {
      stars[i].innerHTML = starSVG(stars[i].getAttribute('data-star-icon'));
    }
    var stages = document.querySelectorAll('[data-stage-icon]');
    for (var j = 0; j < stages.length; j++) {
      stages[j].innerHTML = plantSVG(+stages[j].getAttribute('data-stage-icon'));
    }
    var brand = document.querySelectorAll('[data-brand-icon]');
    for (var k = 0; k < brand.length; k++) brand[k].innerHTML = plantSVG(4);

    var stagesUsed = {};
    (DATA.projects || []).forEach(function (p) {
      if (!isComplete(p)) stagesUsed[stageOf(p)] = true;
    });
    var stageRows = document.querySelectorAll('[data-legend-stage]');
    for (var g = 0; g < stageRows.length; g++) {
      stageRows[g].hidden = !stagesUsed[stageRows[g].getAttribute('data-legend-stage')];
    }
  }

  /* ------------------------------------------------------------------------
     Home page
     ------------------------------------------------------------------------ */
  function renderHero() {
    var el = $('#hero-content');
    if (!el) return;
    var p = DATA.profile;
    var portrait = safeUrl(p.photo)
      ? '<img src="' + esc(safeUrl(p.photo)) + '" alt="Photo of ' + esc(p.name) +
        '" width="160" height="160" decoding="async">'
      : avatarSVG(outfitSeason());

    el.innerHTML =
      '<div class="portrait">' +
        greetingHTML() +
        '<div class="portrait-frame">' + portrait + '</div>' +
      '</div>' +
      '<div>' +
        '<h1 class="hero-name">' + esc(p.name) + '</h1>' +
        '<p class="hero-role">' + esc(p.role) + '</p>' +
        '<p class="hero-intro">' + esc(p.intro) + '</p>' +
        '<figure class="hero-quote" data-quote hidden></figure>' +
        '<div class="hero-actions">' +
          '<a class="btn btn--primary" href="#farm">See my projects</a>' +
          linkButton(p.cv, 'View my CV', false, true) +
          linkButton(p.github, 'GitHub') +
          linkButton(p.linkedin, 'LinkedIn') +
        '</div>' +
      '</div>';
  }

  function outfitSeason() {
    return DATA.profile.seasonalOutfits === false ? 'plain' : currentSeason();
  }

  function quoteFor(season) {
    var q = DATA.profile.quote;
    if (!q) return null;
    if (typeof q.text === 'string') return q; // a single { text, author } also works
    var pick = q[season] && q[season].text ? q[season] : q['default'];
    return pick && pick.text ? pick : null;
  }

  // Things in the hero that follow the season: the avatar's outfit and the quote
  function updateSeasonalHero() {
    var p = DATA.profile;
    var frame = $('.portrait-frame');
    if (frame && !safeUrl(p.photo)) frame.innerHTML = avatarSVG(outfitSeason());

    var fig = $('[data-quote]');
    if (!fig) return;
    var q = quoteFor(currentSeason());
    if (!q) {
      fig.hidden = true;
      return;
    }
    fig.innerHTML = '<blockquote><p>' + esc(q.text) + '</p></blockquote>' +
      (q.author ? '<figcaption>' + esc(q.author) + '</figcaption>' : '');
    fig.hidden = false;
  }

  /* ------------------------------------------------------------------------
     Greeting box: "hello" in the languages I speak or am learning.
     Click the word or the arrows to move through them.
     ------------------------------------------------------------------------ */
  var ARROW = ['..a', '.aa', 'aaa', '.aa', '..a'];
  var greetIndex = 0;

  function greetings() {
    return (DATA.profile.greetings || []).filter(function (g) { return g && g.text; });
  }

  function greetingHTML() {
    var list = greetings();
    if (!list.length) return '';
    var left = sprite(ARROW, { a: 'currentColor' });
    var right = sprite(ARROW.map(function (r) { return r.split('').reverse().join(''); }), { a: 'currentColor' });
    return '<div class="greet" role="group" aria-label="Hello in the languages I speak or am learning">' +
      '<button type="button" class="greet-arrow" data-greet-step="-1" aria-label="Previous language">' + left + '</button>' +
      '<button type="button" class="greet-word" data-greet-step="1" aria-label="Next language">' +
        '<span class="greet-text" aria-live="polite"></span>' +
        '<span class="greet-lang"></span>' +
      '</button>' +
      '<button type="button" class="greet-arrow" data-greet-step="1" aria-label="Next language">' + right + '</button>' +
    '</div>';
  }

  function showGreeting(step) {
    var list = greetings();
    var box = $('.greet');
    if (!box || !list.length) return;
    greetIndex = (greetIndex + step + list.length) % list.length;
    var g = list[greetIndex];
    var text = $('.greet-text', box);
    text.textContent = g.text;
    text.setAttribute('lang', g.lang || '');
    text.setAttribute('dir', g.dir || 'ltr');
    $('.greet-lang', box).textContent = g.name || '';
    if (step) {
      box.classList.remove('is-changing');
      void box.offsetWidth; // restart the little pop
      box.classList.add('is-changing');
    }
  }

  function initGreeting() {
    var box = $('.greet');
    if (!box) return;
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-greet-step]');
      if (b) showGreeting(parseInt(b.getAttribute('data-greet-step'), 10));
    });
    showGreeting(0);
  }

  function renderFarm() {
    var list = $('#farm-list');
    if (!list) return;
    var projects = sortedProjects();
    if (!projects.length) {
      list.outerHTML = '<p class="plot-info">No projects planted yet. Add one in js/data.js.</p>';
      return;
    }
    var cards = projects.map(function (p, i) {
      var q = shownQuality(p);
      var grown = isComplete(p);
      var label = p.title + (p.subtitle ? ', ' + p.subtitle : '') + '. ' + (grown
        ? 'Complete. ' + (q === 'none' ? QUALITY[q].meaning : QUALITY[q].label + ' quality: ' +
          QUALITY[q].meaning.toLowerCase()) + '.'
        : progressText(p) + '.');
      return '<li style="--i:' + i + '">' +
        '<a class="plot-link" href="project.html?id=' + encodeURIComponent(p.id) +
          '" aria-label="' + esc(label) + '">' +
          plotHTML(p) +
          '<div class="sign"><h3>' + esc(p.title) + '</h3>' +
            (p.subtitle ? '<p class="sign-sub">' + esc(p.subtitle) + '</p>' : '') +
          '</div>' +
          '<div class="plot-info" aria-hidden="true">' +
            '<p>' + esc(p.tagline) + '</p>' +
            '<div class="plot-meta">' +
              '<span class="tag ' + (grown ? 'tag--grown' : 'tag--growing') + '">' +
                (grown ? 'Complete' : 'In progress: ' + esc(STAGES[stageOf(p)].tag.toLowerCase())) +
              '</span>' +
              (q !== 'none' ? '<span class="tag tag--quality">' + QUALITY[q].label + '</span>' : '') +
            '</div>' +
            ((p.stack || []).length
              ? '<ul class="tech">' + p.stack.slice(0, 4).map(function (t) {
                  return '<li>' + esc(t) + '</li>';
                }).join('') + '</ul>'
              : '') +
          '</div>' +
        '</a>' +
      '</li>';
    });

    // Two clearly separate groups: finished projects, then the ones still growing
    var done = [];
    var growing = [];
    projects.forEach(function (p, k) {
      (isComplete(p) ? done : growing).push(cards[k]);
    });
    function group(title, items, cls) {
      if (!items.length) return '';
      return '<div class="farm-group ' + cls + '">' +
        '<h3 class="farm-group-title">' + title + '</h3>' +
        '<ul class="farm">' + items.join('') + '</ul>' +
      '</div>';
    }
    list.outerHTML = '<div id="farm-list">' +
      group('Done', done, 'farm-group--done') +
      group('In progress', growing, 'farm-group--growing') +
    '</div>';
  }

  function renderExperience() {
    var el = $('#experience-content');
    if (!el) return;
    var items = DATA.experience || [];
    if (!items.length) {
      el.closest('.section').hidden = true;
      return;
    }
    el.innerHTML = '<ol class="timeline">' + items.map(function (x) {
      var org = esc(x.org) + (x.orgDetail ? ', ' + esc(x.orgDetail) : '');
      var links = (x.links || []).map(function (l) {
        return linkButton(l.url, l.text, false, true);
      }).join('');
      return '<li class="job">' +
        '<div class="job-when">' +
          '<span class="job-dates">' + esc(x.dates) + '</span>' +
          (x.place ? '<span class="job-place">' + esc(x.place) + '</span>' : '') +
        '</div>' +
        '<div class="job-what">' +
          '<h3>' + esc(x.role) + '</h3>' +
          '<p class="job-org">' + org + '</p>' +
          (x.points && x.points.length
            ? '<ul class="job-points">' + x.points.map(function (t) {
                return '<li>' + esc(t) + '</li>';
              }).join('') + '</ul>'
            : '') +
          (links ? '<div class="project-actions">' + links + '</div>' : '') +
        '</div>' +
      '</li>';
    }).join('') + '</ol>';
  }

  function renderAbout() {
    var el = $('#about-content');
    if (!el) return;
    var p = DATA.profile;
    el.innerHTML =
      '<div class="about-text">' +
        '<h3>A bit about me</h3>' +
        (p.about || []).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
      '</div>' +
      '<div>' +
        '<h3>Inventory</h3>' +
        (p.skills || []).map(function (g) {
          return '<div class="skill-group"><h4>' + esc(g.group) + '</h4>' +
            slotsHTML(g.items) + '</div>';
        }).join('') +
      '</div>';
  }

  function renderContact() {
    var el = $('#contact-content');
    if (!el) return;
    var p = DATA.profile;
    el.innerHTML =
      '<p class="contact-lead">The quickest way to reach me is email. ' +
        'I usually reply within a day or two.</p>' +
      (p.email
        ? '<p class="contact-email"><a href="mailto:' + esc(p.email) + '">' + esc(p.email) + '</a></p>'
        : '') +
      '<div class="contact-row">' +
        linkButton(p.email ? 'mailto:' + p.email : '', 'Email me', true) +
        linkButton(p.linkedin, 'LinkedIn') +
        linkButton(p.github, 'GitHub') +
        linkButton(p.cv, 'View my CV', false, true) +
      '</div>';
  }

  var BOOK_COLORS = ['#7a2e3a', '#2f5d62', '#5b4a8a', '#8a6a24', '#3d6b35', '#7a4a2a'];

  function renderBookshelf() {
    var el = $('#bookshelf-content');
    if (!el) return;
    var books = DATA.books || [];
    if (!books.length) {
      el.innerHTML = '<p>No books on the shelf yet. Add some in js/data.js.</p>';
      return;
    }
    el.innerHTML = '<ul class="shelf">' + books.map(function (b, i) {
      var title = safeUrl(b.link)
        ? '<a href="' + esc(safeUrl(b.link)) + '" target="_blank" rel="noopener noreferrer">' +
          esc(b.title) + '<span class="visually-hidden"> (opens in a new tab)</span></a>'
        : esc(b.title);
      return '<li>' +
        '<article class="book" style="--cover:' + BOOK_COLORS[i % BOOK_COLORS.length] + '">' +
          '<div class="book-label">' +
            '<h3>' + title + '</h3>' +
            (b.original
              ? '<p class="book-original" lang="ar" dir="rtl">' + esc(b.original) + '</p>'
              : '') +
            '<p class="book-author">' + esc(b.author) + '</p>' +
            (b.favourite ? '<span class="tag tag--fav">My favourite</span>' : '') +
            (b.note ? '<p class="book-note">' + esc(b.note) + '</p>' : '') +
          '</div>' +
        '</article>' +
      '</li>';
    }).join('') + '</ul>';
  }

  /* Goodbye sign at the bottom of every page, follows the season */
  function updateFarewell() {
    var el = $('[data-farewell]');
    if (!el) return;
    var f = DATA.profile.farewell || {};
    var text = f[currentSeason()] || f['default'] || '';
    el.textContent = text;
    el.closest('.farewell').hidden = !text;
  }

  /* ------------------------------------------------------------------------
     Quick navigation
     A slim bar with the section links slides in once the header has
     scrolled away, and highlights the section you're reading.
     ------------------------------------------------------------------------ */
  function initQuickNav() {
    var header = $('.site-header');
    var source = $('.site-nav ul');
    if (!header || !source || !('IntersectionObserver' in window)) return;

    var bar = document.createElement('nav');
    bar.className = 'quicknav';
    bar.setAttribute('aria-label', 'Sections (quick access)');
    bar.innerHTML = '<div class="wrap"><ul>' + source.innerHTML + '</ul>' +
      '<button type="button" class="quicknav-music" data-music-toggle aria-pressed="false" ' +
      'aria-label="Music" title="Music" hidden></button></div>';
    header.parentNode.insertBefore(bar, header.nextSibling);

    new IntersectionObserver(function (entries) {
      bar.classList.toggle('is-visible', !entries[0].isIntersecting);
    }).observe(header);

    // Highlight the section in view (home page only)
    var links = document.querySelectorAll('.site-nav a, .quicknav a');
    var sections = [];
    for (var i = 0; i < links.length; i++) {
      var hash = links[i].getAttribute('href').split('#')[1];
      var target = hash && document.getElementById(hash);
      if (target && sections.indexOf(target) === -1) sections.push(target);
    }
    if (!sections.length) return;

    function mark(id) {
      for (var j = 0; j < links.length; j++) {
        var on = links[j].getAttribute('href').split('#')[1] === id;
        links[j].classList.toggle('is-active', on);
        if (on) links[j].setAttribute('aria-current', 'location');
        else links[j].removeAttribute('aria-current');
      }
    }

    // A section is "current" when it crosses a line just under the quick bar
    var watcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) mark(e.target.id);
      });
    }, { rootMargin: '-30% 0px -65% 0px' });
    sections.forEach(function (sec) { watcher.observe(sec); });

    // Above the first section: nothing highlighted
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) mark('');
    }, { rootMargin: '0px 0px -60% 0px' }).observe($('.hero') || header);
  }

  /* ------------------------------------------------------------------------
     Project page
     ------------------------------------------------------------------------ */
  function setMeta(title, description) {
    document.title = title;
    var d = $('meta[name="description"]');
    if (d && description) d.setAttribute('content', description);
    var og = $('meta[property="og:title"]');
    if (og) og.setAttribute('content', title);
  }

  function renderProject() {
    var el = $('#project-root');
    if (!el) return;
    var projects = sortedProjects();
    var id = new URLSearchParams(window.location.search).get('id');
    var index = -1;
    for (var i = 0; i < projects.length; i++) {
      if (projects[i].id === id) { index = i; break; }
    }

    if (index === -1) {
      setMeta('Project not found | ' + DATA.profile.name);
      el.innerHTML =
        '<div class="dialog project-dialog empty-state">' +
          '<h1>Nothing planted here</h1>' +
          '<p>This project link doesn’t match any plot on the farm. It may have been renamed.</p>' +
          '<a class="btn btn--primary" href="index.html#farm">Back to the farm</a>' +
        '</div>';
      return;
    }

    var p = projects[index];
    var q = shownQuality(p);
    var grown = isComplete(p);
    setMeta(p.title + ' | ' + DATA.profile.name, p.tagline);

    var learned = Array.isArray(p.learned) ? p.learned : [p.learned];
    var links = p.links || {};
    var prev = projects[index - 1];
    var next = projects[index + 1];

    el.innerHTML =
      '<article class="dialog project-dialog">' +
        '<header class="project-head">' +
          plotHTML(p, 'plot-lg') +
          '<div>' +
            '<h1 class="project-title">' + esc(p.title) + '</h1>' +
            (p.subtitle ? '<p class="project-subtitle">' + esc(p.subtitle) + '</p>' : '') +
            '<p class="project-tagline">' + esc(p.tagline) + '</p>' +
            '<dl class="facts">' +
              '<dt>Status</dt><dd>' + (grown ? 'Complete' : esc(progressText(p))) + '</dd>' +
              (grown ? '<dt>Size</dt><dd>' + (q === 'none' ? QUALITY[q].meaning
                : QUALITY[q].label + ' (' + QUALITY[q].meaning.toLowerCase() + ')') + '</dd>' : '') +
              (p.year ? '<dt>Year</dt><dd>' + esc(p.year) + '</dd>' : '') +
              (p.stack && p.stack.length ? '<dt>Built with</dt><dd>' + esc(p.stack.join(', ')) + '</dd>' : '') +
            '</dl>' +
            '<div class="project-actions">' +
              linkButton(links.live, 'Open the live site', true) +
              linkButton(links.source, 'View the source code') +
            '</div>' +
            (p.availability ? '<p class="availability">' + esc(p.availability) + '</p>' : '') +
          '</div>' +
        '</header>' +
        '<div class="project-body">' +
          (p.built ? '<section><h2>What I built</h2><p>' + esc(p.built) + '</p></section>' : '') +
          (learned.filter(Boolean).length
            ? '<section><h2>What I learned</h2>' +
              learned.filter(Boolean).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
              '</section>'
            : '') +
          (p.skills && p.skills.length
            ? '<section><h2>New skills</h2>' + slotsHTML(p.skills) + '</section>'
            : '') +
          (p.credits ? '<p class="credits">' + esc(p.credits) + '</p>' : '') +
        '</div>' +
      '</article>' +
      '<nav class="project-nav" aria-label="More projects">' +
        (prev ? '<a class="btn" href="project.html?id=' + encodeURIComponent(prev.id) +
          '"><span>Previous: ' + esc(prev.title) + '</span></a>' : '<span></span>') +
        (next ? '<a class="btn" href="project.html?id=' + encodeURIComponent(next.id) +
          '"><span>Next: ' + esc(next.title) + '</span></a>' : '') +
      '</nav>';
  }

  /* ------------------------------------------------------------------------
     Background music
     - Strictly opt-in: never starts on a fresh visit.
     - The audio file is only requested when the visitor presses Music.
     - While on, it follows the visitor from page to page (sessionStorage),
       resuming where it left off. Closing the tab resets it to off.
     - Pauses while the tab is hidden; crossfades when the season changes
       if that season has its own track.
     ------------------------------------------------------------------------ */
  var NOTE_ICON = ['...nn...', '...n.n..', '...n..n.', '...n....', '...n....',
    '.nnn....', 'nnnn....', '.nn.....'];
  var MUSIC_KEY = 'farm-music';

  function initMusic() {
    var cfg = DATA.music;
    var buttons = document.querySelectorAll('[data-music-toggle]');
    if (!buttons.length || !cfg || cfg.enabled === false) return;

    var tracks = cfg.tracks || {};
    function trackFor(season) {
      return safeUrl(tracks[season]) || safeUrl(tracks['default']);
    }
    var hasAny = SEASONS.some(function (s) { return !!trackFor(s); });
    if (!hasAny) return;

    var volume = Math.max(0, Math.min(1, cfg.volume == null ? 0.35 : +cfg.volume));
    var audio = null;
    var playing = false;
    var src = '';
    var fadeFrame = 0;
    var resumeWhenVisible = false;

    for (var b = 0; b < buttons.length; b++) {
      buttons[b].hidden = false;
      buttons[b].insertAdjacentHTML('afterbegin', sprite(NOTE_ICON, { n: 'currentColor' }));
    }

    function isMusicButton(node) {
      return !!(node && node.closest && node.closest('[data-music-toggle]'));
    }

    function render() {
      for (var r = 0; r < buttons.length; r++) {
        buttons[r].setAttribute('aria-pressed', String(playing));
      }
    }

    function save() {
      try {
        sessionStorage.setItem(MUSIC_KEY, JSON.stringify({
          on: playing,
          src: src,
          t: audio ? audio.currentTime : 0
        }));
      } catch (e) { /* storage blocked: music just won't carry across pages */ }
    }

    function load() {
      try {
        return JSON.parse(sessionStorage.getItem(MUSIC_KEY)) || {};
      } catch (e) {
        return {};
      }
    }

    // Volume ramps. iOS ignores scripted volume, so there it simply starts/stops.
    function fadeTo(target, ms, done) {
      cancelAnimationFrame(fadeFrame);
      var from = audio.volume;
      var start = performance.now();
      (function step(now) {
        var k = Math.min(1, (now - start) / ms);
        audio.volume = Math.max(0, Math.min(1, from + (target - from) * k));
        if (k < 1) fadeFrame = requestAnimationFrame(step);
        else if (done) done();
      })(start);
    }

    function ensureAudio() {
      if (audio) return;
      audio = new Audio();
      audio.loop = true;
      audio.preload = 'none';
      audio.addEventListener('error', function () {
        console.warn('Music file could not be loaded: ' + src +
          '. Check the path in js/data.js.');
        playing = false;
        render();
        save();
      });
    }

    function setSource(newSrc, startAt) {
      ensureAudio();
      if (src === newSrc) return;
      src = newSrc;
      audio.src = newSrc;
      if (startAt) {
        audio.addEventListener('loadedmetadata', function seek() {
          audio.removeEventListener('loadedmetadata', seek);
          try { audio.currentTime = startAt; } catch (e) { /* ignore */ }
        });
      }
    }

    function play(onBlocked) {
      audio.volume = 0;
      var p = audio.play();
      var ok = function () {
        playing = true;
        render();
        save();
        fadeTo(volume, 900);
      };
      if (p && p.then) p.then(ok, onBlocked || function () {});
      else ok();
    }

    function start(startAt) {
      setSource(trackFor(currentSeason()), startAt);
      play(function () {
        // The browser refused (no user gesture yet on this page): start on the
        // visitor's next tap or key press instead.
        playing = false;
        render();
        waitForGesture();
      });
    }

    function stop() {
      playing = false;
      render();
      save();
      if (audio) fadeTo(0, 400, function () { audio.pause(); });
    }

    function waitForGesture() {
      function go(e) {
        if (isMusicButton(e.target)) return cleanup(); // the button handles itself
        cleanup();
        start();
      }
      function cleanup() {
        document.removeEventListener('pointerdown', go, true);
        document.removeEventListener('keydown', go, true);
      }
      document.addEventListener('pointerdown', go, true);
      document.addEventListener('keydown', go, true);
    }

    for (var c = 0; c < buttons.length; c++) {
      buttons[c].addEventListener('click', function () {
        if (playing) stop();
        else start();
      });
    }

    // Season change: crossfade if this season has a different track
    document.addEventListener('farm:season', function (e) {
      if (!playing) return;
      var next = trackFor(e.detail);
      if (next === src) return;
      fadeTo(0, 500, function () {
        setSource(next);
        play();
      });
    });

    // Don't play to an empty room
    document.addEventListener('visibilitychange', function () {
      if (!audio) return;
      if (document.hidden && playing) {
        resumeWhenVisible = true;
        audio.pause();
      } else if (!document.hidden && resumeWhenVisible) {
        resumeWhenVisible = false;
        audio.play().catch(function () {});
      }
    });

    // Remember position when leaving for another page of the site
    window.addEventListener('pagehide', save);

    // Music was on on the previous page of this visit: pick up where it was
    var state = load();
    if (state.on) {
      var same = state.src === trackFor(currentSeason());
      start(same ? state.t : 0);
    } else {
      render();
    }
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  initSeasonSwitch();
  initQuickNav(); // before initMusic: it adds the bar's music button
  initMusic();
  fillIcons();
  setYear();
  renderHero();
  updateSeasonalHero();
  initGreeting();
  document.addEventListener('farm:season', updateSeasonalHero);
  updateFarewell();
  document.addEventListener('farm:season', updateFarewell);
  renderFarm();
  renderExperience();
  renderBookshelf();
  renderAbout();
  renderContact();
  renderProject();
})();
