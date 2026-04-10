document.getElementById('topbar').innerHTML = `
  <a href="#" class="topbar-logo">SUUDREG Photography Club</a>
  <ul class="topbar-nav">
    <li><a href="#info-section">Бидний тухай</a></li>
    <li><a href="#gallery">Үзэсгэлэн</a></li>
    <li><a href="#events">Арга хэмжээ</a></li>
    <li><a href="#join-section">Бүртгүүлэх</a></li>
  </ul>
`;

window.addEventListener('scroll', () => {
  const topbar = document.getElementById('topbar');
  if (window.scrollY > 60) {
    topbar.classList.add('scrolled');
  } else {
    topbar.classList.remove('scrolled');
  }
});