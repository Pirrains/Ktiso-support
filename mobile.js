/* KTISO — menu hamburger mobile (affiché uniquement sous 700 px via mobile.css) */
(function () {
  var path = (location.pathname.split('/').pop() || 'home.html').toLowerCase();
  var isArticle = /^\d{4}-\d{2}-\d{2}-/.test(path);

  var links = [
    ['home.html', 'Accueil'], ['a-propos.html', 'À propos'], ['portefeuille.html', 'Portefeuille'],
    ['outils.html', 'Outils'], ['application.html', 'Application'], ['contenus.html', 'Contenus'],
    ['actualites.html', 'Actualités'], ['index.html', 'Support']
  ];

  // Pages sans grande photo en haut : on laisse de la place au bouton
  var padPages = ['espace-abonne.html', 'privacy.html', 'cgu.html', 'mentions-legales.html', 'index.html'];

  function build() {
    if (document.querySelector('.kt-burger')) return;
    if (padPages.indexOf(path) > -1) document.body.classList.add('kt-pad');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kt-burger';
    btn.setAttribute('aria-label', 'Menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'ktMenu');
    btn.innerHTML = '<span></span><span></span><span></span>';

    var menu = document.createElement('nav');
    menu.className = 'kt-menu';
    menu.id = 'ktMenu';
    menu.setAttribute('aria-label', 'Navigation principale');
    menu.innerHTML = '<img class="kt-menu-logo" src="ktiso-logo.png" alt="KTISO">' +
      links.map(function (l) {
        var on = l[0] === path || (l[0] === 'actualites.html' && isArticle);
        return '<a href="' + l[0] + '"' + (on ? ' class="active" aria-current="page"' : '') + '>' + l[1] + '</a>';
      }).join('') +
      '<a class="kt-menu-cta' + (path === 'espace-abonne.html' ? ' active' : '') + '" href="espace-abonne.html">Mon compte</a>';

    document.body.appendChild(menu);
    document.body.appendChild(btn);

    function setOpen(open) {
      document.body.classList.toggle('kt-menu-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Menu');
    }
    btn.addEventListener('click', function () { setOpen(!document.body.classList.contains('kt-menu-open')); });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    // Retour arrière iOS (page restaurée depuis le cache) : menu toujours fermé
    window.addEventListener('pageshow', function () { setOpen(false); });
  }

  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
