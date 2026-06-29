(function () {
  'use strict';
  var panelIds, currentIndex;
  function initParticles() {
    var canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouse = { x: null, y: null, radius: 120 };
    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', function () {
      mouse.x = null;
      mouse.y = null;
    });
    var particleCount = Math.min(80, Math.floor(window.innerWidth * 0.06));
    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.15,
      };
    }
    for (var i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
    function connectParticles() {
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            var opacity = (1 - dist / 140) * 0.15;
            ctx.strokeStyle = 'rgba(232, 67, 147, ' + opacity + ')';
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        if (mouse.x !== null) {
          var dx = mouse.x - p.x;
          var dy = mouse.y - p.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            var force = (mouse.radius - dist) / mouse.radius;
            p.x -= dx * force * 0.01;
            p.y -= dy * force * 0.01;
          }
        }
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232, 67, 147, ' + p.opacity + ')';
        ctx.fill();
      }
      connectParticles();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }
  function initTypewriter() {
    var el = document.getElementById('typewriter');
    if (!el) return;
    var phrases = [
      'Derechos Naturales, Liberalismo y Poder Político',
      'Padre del liberalismo clásico',
      'Vida, Libertad y Propiedad',
      'El gobierno debe contar con tu consentimiento',
    ];
    var phraseIdx = 0;
    var charIdx = 0;
    var isDeleting = false;
    var speed = 60;
    function type() {
      var current = phrases[phraseIdx];
      if (!isDeleting) {
        el.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          setTimeout(function () {
            isDeleting = true;
            speed = 25;
            type();
          }, 2500);
          return;
        }
      } else {
        el.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          speed = 60;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }
      setTimeout(type, speed);
    }
    setTimeout(type, 800);
  }
  function initProgressBar() {
    var bar = document.getElementById('progressBar');
    if (!bar) return;
    function update() {
      var total = panelIds.length;
      var percent = ((currentIndex + 1) / total) * 100;
      bar.style.width = percent + '%';
      bar.setAttribute('aria-valuenow', Math.round(percent));
    }
    window.__updateProgress = update;
    update();
  }
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      this.classList.toggle('active');
      this.setAttribute('aria-expanded', open);
    });
    var heroScroll = document.querySelector('.hero-scroll');
    if (heroScroll) {
      heroScroll.addEventListener('click', function () {
        nextSection();
      });
    }
    document.querySelectorAll('.nav-link, [data-section]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var section = this.getAttribute('data-section');
        if (section) {
          goToSection(section);
        }
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
  function initPanelSystem() {
    var panels = document.querySelectorAll('.panel');
    panelIds = [];
    panels.forEach(function (p) { panelIds.push(p.id); });
    currentIndex = 0;
    panels.forEach(function (p, i) {
      if (p.classList.contains('active')) {
        currentIndex = i;
      }
    });
    updateCounter();
    updateNavLinks();
    if (window.__updateProgress) window.__updateProgress();
  }
  function goToSection(id) {
    var idx = panelIds.indexOf(id);
    if (idx === -1) return;
    if (idx === currentIndex) return;
    switchPanel(idx);
  }
  function switchPanel(idx) {
    if (idx < 0 || idx >= panelIds.length) return;
    var prev = currentIndex;
    currentIndex = idx;
    var panels = document.querySelectorAll('.panel');
    panels.forEach(function (p) { p.classList.remove('active'); });
    var target = document.getElementById(panelIds[idx]);
    if (target) {
      target.classList.add('active');
      var scrollEl = target.querySelector('.panel-scroll');
      if (scrollEl) scrollEl.scrollTop = 0;
      var reveals = target.querySelectorAll('.reveal');
      reveals.forEach(function (r) {
        r.classList.remove('revealed');
        void r.offsetWidth;
        r.classList.add('revealed');
      });
    }
    updateCounter();
    updateNavLinks();
    if (window.__updateProgress) window.__updateProgress();
    history.replaceState(null, '', '#' + panelIds[idx]);
  }
  function nextSection() {
    if (currentIndex < panelIds.length - 1) {
      switchPanel(currentIndex + 1);
    }
  }
  function prevSection() {
    if (currentIndex > 0) {
      switchPanel(currentIndex - 1);
    }
  }
  function updateCounter() {
    var el = document.getElementById('snCurrent');
    var totalEl = document.getElementById('snTotal');
    if (el) el.textContent = currentIndex + 1;
    if (totalEl) totalEl.textContent = panelIds.length;
  }
  function updateNavLinks() {
    var currentId = panelIds[currentIndex];
    document.querySelectorAll('.nav-link').forEach(function (link) {
      var section = link.getAttribute('data-section');
      link.classList.toggle('active', section === currentId);
    });
  }
  function initSectionControls() {
    var prevBtn = document.getElementById('snPrev');
    var nextBtn = document.getElementById('snNext');
    if (prevBtn) prevBtn.addEventListener('click', prevSection);
    if (nextBtn) nextBtn.addEventListener('click', nextSection);
  }
  function initKeyboardNav() {
    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextSection();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          prevSection();
          break;
        case 'Home':
          e.preventDefault();
          switchPanel(0);
          break;
        case 'End':
          e.preventDefault();
          switchPanel(panelIds.length - 1);
          break;
      }
    });
  }
  function initReveal() {
    var elements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
      elements.forEach(function (el) { observer.observe(el); });
    } else {
      elements.forEach(function (el) { el.classList.add('revealed'); });
    }
  }
  function initDataDelay() {
    document.querySelectorAll('[data-delay]').forEach(function (el) {
      var delay = el.getAttribute('data-delay');
      el.style.setProperty('--delay', delay + 'ms');
    });
  }
  function initCounters() {
    var counters = document.querySelectorAll('.counter');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { observer.observe(el); });
    } else {
      counters.forEach(function (el) { animateCounter(el); });
    }
    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      var current = 0;
      var step = Math.max(1, Math.ceil(target / 50));
      var interval = setInterval(function () {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        el.textContent = current;
      }, 25);
    }
  }
  function initQuoteCarousel() {
    var track = document.getElementById('quoteTrack');
    var prevBtn = document.getElementById('quotePrev');
    var nextBtn = document.getElementById('quoteNext');
    var dotsContainer = document.getElementById('quoteDots');
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
    var slides = track.querySelectorAll('.quote-slide');
    if (slides.length === 0) return;
    var current = 0;
    var total = slides.length;
    var autoTimer;
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'quote-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Ir a frase ' + (i + 1));
      dot.addEventListener('click', function (idx) {
        return function () { goTo(idx); resetAuto(); };
      }(i));
      dotsContainer.appendChild(dot);
    }
    function goTo(index) {
      current = index;
      if (current < 0) current = total - 1;
      if (current >= total) current = 0;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      document.querySelectorAll('.quote-dot').forEach(function (d, idx) {
        d.classList.toggle('active', idx === current);
      });
    }
    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () { goTo(current + 1); }, 6000);
    }
    prevBtn.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); resetAuto(); });
    [prevBtn, nextBtn, dotsContainer].forEach(function (el) {
      el.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
      el.addEventListener('mouseleave', resetAuto);
    });
    var touchStartX = 0;
    var touchEndX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goTo(current + 1);
        else goTo(current - 1);
        resetAuto();
      }
    }, { passive: true });
    autoTimer = setInterval(function () { goTo(current + 1); }, 6000);
  }
  function initTimelineInteraction() {
    var items = document.querySelectorAll('.tl-item');
    items.forEach(function (item, idx) {
      item.style.setProperty('--i', idx);
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      item.style.transition = 'opacity 0.5s ease calc(var(--i, 0) * 120ms), transform 0.5s ease calc(var(--i, 0) * 120ms)';
      item.addEventListener('click', function () {
        var content = this.querySelector('.tl-content');
        if (content) {
          content.style.borderColor = 'rgba(201, 168, 76, 0.4)';
          content.style.boxShadow = '0 0 30px rgba(201, 168, 76, 0.1)';
          setTimeout(function () {
            content.style.borderColor = '';
            content.style.boxShadow = '';
          }, 700);
        }
      });
    });
    if ('IntersectionObserver' in window) {
      var tlObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            [].slice.call(entry.target.children).forEach(function (child) {
              if (child.classList.contains('tl-item')) {
                child.style.opacity = '1';
                child.style.transform = 'translateX(0)';
              }
            });
            tlObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      var timeline = document.querySelector('.interactive-timeline');
      if (timeline) tlObserver.observe(timeline);
    } else {
      items.forEach(function (item) {
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      });
    }
  }
  function initHashNav() {
    var hash = window.location.hash.replace('#', '');
    if (hash && panelIds.indexOf(hash) !== -1) {
      switchPanel(panelIds.indexOf(hash));
    }
  }
  function init() {
    initParticles();
    initTypewriter();
    initPanelSystem();
    initProgressBar();
    initNavbar();
    initSectionControls();
    initKeyboardNav();
    initReveal();
    initDataDelay();
    initCounters();
    initQuoteCarousel();
    initTimelineInteraction();
    initHashNav();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
