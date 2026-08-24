// =========================================================
// KTISO — comportements de la page (nav, wordmark hero, menu mobile)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('siteNav');
  const heroWrap = document.getElementById('heroWordmarkWrap');
  const scrollCue = document.getElementById('scrollCue');
  const hero = document.getElementById('hero');
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('navMobile');

  const heroHeight = () => (hero ? hero.offsetHeight : window.innerHeight);

  function onScroll() {
    const y = window.scrollY;
    const h = heroHeight();
    const progress = Math.min(y / (h * 0.6), 1);

    if (heroWrap) {
      const opacity = 1 - progress;
      const scale = 1 - progress * 0.12;
      const translateY = progress * 30;
      heroWrap.style.opacity = opacity.toString();
      heroWrap.style.transform = `translateY(-${translateY}px) scale(${scale})`;
    }

    if (scrollCue) {
      scrollCue.style.opacity = (1 - progress * 2.5).toString();
    }

    if (nav) {
      if (y > 30) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      burger.classList.toggle('active');
    });
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }
});
