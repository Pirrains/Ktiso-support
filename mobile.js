/* KTISO — barre d'onglets mobile (affichée uniquement sous 700 px via mobile.css) */
(function () {
  var path = (location.pathname.split('/').pop() || 'home.html').toLowerCase();
  if (path === '' || path === 'index.html' && false) path = 'home.html';
  var isArticle = /^\d{4}-\d{2}-\d{2}-/.test(path);

  function icon(d) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }

  var tabs = [
    { href: 'home.html',        label: 'Accueil',    match: ['home.html'],
      svg: icon('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>') },
    { href: 'outils.html',      label: 'Outils',     match: ['outils.html'],
      svg: icon('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>') },
    { href: 'actualites.html',  label: 'Actus',      match: ['actualites.html'], article: true,
      svg: icon('<path d="M4 5h13a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2z"/><path d="M19 9h2v8a2 2 0 0 1-2 2"/><path d="M8 9h7M8 13h7"/>') },
    { href: 'espace-abonne.html', label: 'Compte',   match: ['espace-abonne.html'],
      svg: icon('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>') }
  ];

  var moreLinks = [
    ['a-propos.html', 'À propos'], ['portefeuille.html', 'Portefeuille'],
    ['application.html', 'Application'], ['contenus.html', 'Contenus'],
    ['index.html', 'Support']
  ];
  var moreActive = moreLinks.some(function (l) { return l[0] === path; });

  function build() {
    if (document.querySelector('.kt-tabbar')) return;

    var bar = document.createElement('nav');
    bar.className = 'kt-tabbar';
    bar.setAttribute('aria-label', 'Navigation');

    bar.innerHTML = tabs.map(function (t) {
      var on = t.match.indexOf(path) > -1 || (t.article && isArticle);
      return '<a class="kt-tab' + (on ? ' active' : '') + '" href="' + t.href + '"' +
             (on ? ' aria-current="page"' : '') + '>' + t.svg + '<span>' + t.label + '</span></a>';
    }).join('') +
      '<button type="button" class="kt-tab' + (moreActive ? ' active' : '') + '" id="ktMoreBtn" aria-expanded="false" aria-controls="ktMore">' +
      icon('<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>') + '<span>Plus</span></button>';

    var sheet = document.createElement('div');
    sheet.className = 'kt-more';
    sheet.id = 'ktMore';
    sheet.innerHTML = moreLinks.map(function (l) {
      return '<a href="' + l[0] + '">' + l[1] + '</a>';
    }).join('');

    var back = document.createElement('div');
    back.className = 'kt-more-backdrop';

    document.body.appendChild(back);
    document.body.appendChild(sheet);
    document.body.appendChild(bar);

    var btn = document.getElementById('ktMoreBtn');
    function setOpen(open) {
      document.body.classList.toggle('kt-more-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    btn.addEventListener('click', function () { setOpen(!document.body.classList.contains('kt-more-open')); });
    back.addEventListener('click', function () { setOpen(false); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });

    // Le clavier iOS ne doit pas remonter la barre au-dessus des champs
    function typing(on) { document.body.classList.toggle('kt-typing', on); }
    document.addEventListener('focusin', function (e) {
      if (e.target.matches('input:not([type=checkbox]):not([type=radio]):not([type=file]), textarea, select')) typing(true);
    });
    document.addEventListener('focusout', function () { typing(false); });
  }

  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
