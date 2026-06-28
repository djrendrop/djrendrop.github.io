// Reveal-on-scroll: fade in ao entrar na viewport.
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Scroll-spy: destaca o link de nav correspondente à seção visível.
// Scroll progress: barra magenta → violeta no topo.
const navAs = document.querySelectorAll('.nav__links a');
const secs  = [...document.querySelectorAll('section[id]')];
const progress = document.getElementById('scrollProgress');
const heroImg = document.querySelector('.hero__img');
const linksImg = document.querySelector('.links__photo img');
const linksSection = document.getElementById('links');
const navBar = document.getElementById('nav');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 160) cur = s.id; });
  navAs.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });

  if (progress) {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progress.style.width = pct + '%';
  }

  // Aplica o efeito parallax na imagem da seção Hero
  if (heroImg) {
    heroImg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.15}px)`;
  }

  // Efeito parallax na seção Links (se motion reduzido não estiver ativo)
  if (linksImg && linksSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const rect = linksSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const offset = (window.innerHeight / 2) - (rect.top + rect.height / 2);
      linksImg.style.transform = `scale(1.05) translateY(${-offset * 0.05}px)`;
    }
  }

  // Efeito Smart Nav: esconde ao rolar para baixo, mostra ao rolar para cima
  const currentScrollY = window.scrollY;
  if (navBar) {
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      navBar.classList.add('nav--hidden'); // Rolou para baixo
    } else {
      navBar.classList.remove('nav--hidden'); // Rolou para cima
    }
    navBar.classList.toggle('nav--scrolled', currentScrollY > 50);
  }
  lastScrollY = currentScrollY;
});

// ─── MODAL DE IMAGEM ───
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const triggerImg = document.querySelector('.release__photo img');
const closeBtn = document.getElementById('modalClose');

if (triggerImg && modal && modalImg && closeBtn) {
  triggerImg.onclick = function() {
    modal.style.display = "block";
    modalImg.src = this.src;
  }

  closeBtn.onclick = function() {
    modal.style.display = "none";
  }

  modal.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; }
}

// ─── EFEITO MÁQUINA DE ESCREVER ───
const tw1 = document.querySelector('.tw-1');
const tw2 = document.querySelector('.tw-2');
const tw3 = document.querySelector('.tw-3');

if (tw1 && tw2 && tw3) {
  const seq = [
    { el: tw1, text: tw1.textContent.trim(), speed: 70 },
    { el: tw2, text: tw2.textContent.trim(), speed: 50 },
    { el: tw3, text: tw3.textContent.trim(), speed: 40 }
  ];

  seq.forEach(item => item.el.innerHTML = '');

  let currentStep = 0;

  const typeSequence = () => {
    if (currentStep >= seq.length) return;
    
    const curr = seq[currentStep];
    curr.el.innerHTML = '<span class="typewriter-text"></span><span class="typewriter-cursor">|</span>';
    const textSpan = curr.el.querySelector('.typewriter-text');
    const cursor = curr.el.querySelector('.typewriter-cursor');
    
    let i = 0;
    const typeChar = () => {
      if (i < curr.text.length) {
        textSpan.textContent += curr.text.charAt(i);
        i++;
        setTimeout(typeChar, curr.speed);
      } else {
        if (currentStep < seq.length - 1) cursor.remove();
        currentStep++;
        setTimeout(typeSequence, 200); // delay leve entre as linhas
      }
    };
    typeChar();
  };
  setTimeout(typeSequence, 600);
}

// ─── EFEITO MÁQUINA DE ESCREVER (CITAÇÃO LINKS) ───
const quoteEl = document.querySelector('.links__photo__quote');
if (quoteEl) {
  const quoteText = quoteEl.textContent.trim();
  quoteEl.innerHTML = '<span class="typewriter-text"></span><span class="typewriter-cursor">|</span>';
  const quoteSpan = quoteEl.querySelector('.typewriter-text');
  let quoteIdx = 0;
  let isTypingQuote = false;
  
  const typeWriterQuote = () => {
    if (quoteIdx < quoteText.length) {
      quoteSpan.textContent += quoteText.charAt(quoteIdx);
      quoteIdx++;
      setTimeout(typeWriterQuote, 35); // Velocidade ligeiramente mais rápida
    }
  };

  const obsQuote = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !isTypingQuote) {
      isTypingQuote = true;
      setTimeout(typeWriterQuote, 300); // Atraso após entrar na tela
    }
  }, { threshold: 0.3 });
  obsQuote.observe(quoteEl);
}
