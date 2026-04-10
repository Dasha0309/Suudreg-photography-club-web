const events = [
  {
    day: '10',
    month: '04-р сар',
    title: 'NUM Club Day 2025',
    desc: 'МУИС-ийн клубуудын жил бүрийн арга хэмжээ. Манай клубын үзэсгэлэн, танилцуулга.',
    tag: 'Арга хэмжээ',
    link: '#'
  },
  {
    day: '22',
    month: '04-р сар',
    title: 'Гэрэл зургийн сургалт',
    desc: 'Шинэ элсэгчидэд зориулсан камерын суурь тохиргоо болон гэрэл зургийн онол.',
    tag: 'Сургалт',
    link: '#'
  },
  {
    day: '01',
    month: '05-р сар',
    title: 'Зуны үзэсгэлэн',
    desc: 'Оюутнуудын бүтээлийг нийтэд дэлгэх зуны жилийн эцсийн үзэсгэлэн.',
    tag: 'Үзэсгэлэн',
    link: '#'
  },
  {
    day: '05',
    month: '04-р сар',
    title: 'Ууланд гарах',
    desc: 'Клубийн семистер бүрийн уламжлалт ууланд гарах аялал.',
    tag: 'Ууланд гарах',
    link: '#'
  }
];

document.getElementById('events').innerHTML = `
  <div class="events-inner">
    <div class="section-header">
      <div class="section-header-left">
        <p class="section-label-1">— Ойрын арга хэмжээнүүд</p>
      </div>
    </div>
    <div class="events-grid">
      ${events.map(e => `
        <a class="event-card" href="${e.link}">
          <div class="event-date">
            <div class="day">${e.day}</div>
            <div class="month">${e.month}</div>
          </div>
          <div class="event-divider"></div>
          <div class="event-info">
            <h3>${e.title}</h3>
            <p>${e.desc}</p>
            <span class="event-tag">${e.tag}</span>
          </div>
        </a>
      `).join('')}
    </div>
  </div>

  <section id="join-section">
    <div class="join-inner">
      <p class="section-label">— Манай клубд нэгдэх</p>
      <h2>Гэрэл зургийн<br><em style="font-style:italic; color: #c8a96e;">замаа эхлүүл</em></h2>
      <p>\Хэрэв та гэрэл зурагт хайртай оюутан бол манай клубд бүртгүүлж бидэнтэй хамт өсөн дэвжээрэй.</p>
      <a href="https://forms.gle/pAEK3YJ1g4n5T6zx9" target="_blank" class="join-btn">
        Бүртгүүлэх
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
  </section>
`;