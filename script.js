/**
 * 초록우산 브랜드 페이지
 */

document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initScrollReveal();
  initStoryCarousel();
});

/* ========== 패럴렉스 스크롤 ========== */
function initParallax() {
  const parallaxBgs = document.querySelectorAll('.parallax-bg');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;

        parallaxBgs.forEach(bg => {
          const speed = parseFloat(bg.dataset.speed) || 0.3;
          const section = bg.closest('section');
          if (!section) return;

          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + scrollY;
          const offset = (scrollY - sectionTop) * speed;

          bg.style.transform = `translateX(-50%) translateY(${offset}px)`;

          if (bg.closest('.cta-bg-wrapper')) {
            bg.style.transform = `translateY(${offset}px)`;
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ========== 스크롤 기반 등장 애니메이션 ========== */
function initScrollReveal() {
  const sections = document.querySelectorAll('.section-hero, .section-story, .section-cta');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => sectionObserver.observe(section));

  // 개별 요소 등장
  const fadeElements = document.querySelectorAll('.parallax-fade, .scroll-reveal');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(
          entry.target.classList.contains('scroll-reveal') ? 'in-view' : 'visible'
        );
      }
    });
  }, { threshold: 0.15 });

  fadeElements.forEach(el => fadeObserver.observe(el));
}

/* ========== Story: 좌우 버튼 캐러셀 ========== */
function initStoryCarousel() {
  const track = document.getElementById('storyTrack');
  const prevBtn = document.getElementById('storyPrev');
  const nextBtn = document.getElementById('storyNext');
  const wrap = document.querySelector('.story-carousel-wrap');
  if (!track || !prevBtn || !nextBtn || !wrap) return;

  const slides = track.querySelectorAll('.story-slide');
  const slideCount = slides.length;
  let currentIndex = 0;

  function getSlideWidth() {
    return slides[0].offsetWidth + 20;
  }

  const navBtns = document.querySelector('.story-nav-buttons');
  const viewport = wrap.querySelector('.story-carousel-viewport');

  function updateCenterPadding() {
    const cardW = slides[0].offsetWidth;
    const viewW = window.innerWidth;
    const padLeft = Math.max(0, (viewW - cardW) / 2);
    wrap.style.paddingLeft = padLeft + 'px';
    if (viewport) {
      viewport.style.setProperty('--story-pad-left', padLeft + 'px');
    }
    if (navBtns) {
      navBtns.style.paddingRight = padLeft + 'px';
    }
  }

  function updatePosition() {
    const slideW = getSlideWidth();
    track.style.transform = `translateX(-${currentIndex * slideW}px)`;
    updateButtons();
  }

  function updateButtons() {
    prevBtn.classList.toggle('disabled', currentIndex === 0);
    nextBtn.classList.toggle('disabled', currentIndex >= slideCount - 1);
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updatePosition();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < slideCount - 1) {
      currentIndex++;
      updatePosition();
    }
  });

  updateCenterPadding();
  updateButtons();
  window.addEventListener('resize', () => {
    updateCenterPadding();
    updatePosition();
  });
}
