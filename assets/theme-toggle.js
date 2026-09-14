/* VianCore — theme toggle
   Pairs with the inline no-flash snippet in <head> that sets
   documentElement[data-theme] before first paint. This file just
   wires up any .theme-toggle buttons on the page. */
(function () {
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function label(btn, theme) {
    var next = theme === 'light' ? 'dark' : 'light';
    btn.setAttribute('aria-label', 'Switch to ' + next + ' mode');
    btn.setAttribute('title', 'Switch to ' + next + ' mode');
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('viancore-theme', theme); } catch (e) {}
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) label(btns[i], theme);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var theme = currentTheme();
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) {
      label(btns[i], theme);
      btns[i].addEventListener('click', function () {
        setTheme(currentTheme() === 'light' ? 'dark' : 'light');
      });
    }
  });
})();
