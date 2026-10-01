/* VianCore — polish layer
   Adds the reading progress bar, Copy buttons on code blocks and
   "#" section links. Each feature only switches on when the page
   has the elements it needs, so it is safe to load on any page. */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    // 1. Reading progress bar (Knowledge Base articles only)
    var body = document.querySelector('.doc-body');
    var nav = document.querySelector('.nav');
    if (body && nav) {
      var bar = document.createElement('div');
      bar.className = 'vc-progress';
      bar.setAttribute('aria-hidden', 'true');
      nav.appendChild(bar);
      var ticking = false;
      var update = function () {
        ticking = false;
        var r = body.getBoundingClientRect();
        var total = r.height - window.innerHeight * 0.6;
        var p = total > 0 ? (window.innerHeight * 0.25 - r.top) / total : 1;
        p = Math.max(0, Math.min(1, p));
        bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      };
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
      }, { passive: true });
      window.addEventListener('resize', update);
      update();
    }

    // 2. Copy buttons on code blocks
    var blocks = document.querySelectorAll('.doc-code');
    for (var i = 0; i < blocks.length; i++) {
      (function (block) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'vc-copy';
        btn.textContent = 'Copy';
        btn.setAttribute('aria-label', 'Copy code to clipboard');
        btn.addEventListener('click', function () {
          var clone = block.cloneNode(true);
          var own = clone.querySelector('.vc-copy');
          if (own) own.parentNode.removeChild(own);
          var text = clone.textContent.replace(/^\s*\n/, '').replace(/\s+$/, '');
          var flash = function (msg) {
            btn.textContent = msg;
            setTimeout(function () { btn.textContent = 'Copy'; }, 1600);
          };
          var fallback = function () {
            try {
              var range = document.createRange();
              range.selectNodeContents(block);
              var sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
              flash('Press Ctrl+C');
            } catch (e) {}
          };
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function () { flash('Copied'); }, fallback);
          } else {
            fallback();
          }
        });
        block.classList.add('vc-has-copy');
        block.appendChild(btn);
      })(blocks[i]);
    }

    // 3. "#" link on each article section heading
    var titles = document.querySelectorAll('.doc-section[id] > .doc-section-title');
    for (var j = 0; j < titles.length; j++) {
      var a = document.createElement('a');
      a.className = 'vc-anchor';
      a.href = '#' + titles[j].parentNode.id;
      a.textContent = '#';
      a.setAttribute('aria-label', 'Link to this section');
      titles[j].appendChild(a);
    }
  });
})();
