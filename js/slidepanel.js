// slidepanel.js - modern overlays with backdrop and scroll lock
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    // --- Generic Overlay Logic ---
    let lastFocused = null;
    let activeOverlay = null;

    function lockScroll() {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    function unlockScroll() {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    function openOverlay(overlayElement){
      if (!overlayElement) return;
      lastFocused = document.activeElement;
      activeOverlay = overlayElement;
      overlayElement.classList.add('visible');
      overlayElement.setAttribute('aria-hidden','false');
      lockScroll();
      const closeBtn = overlayElement.querySelector('.projects-overlay-close');
      if(closeBtn) closeBtn.focus();
    }

    function closeOverlay(){
      if (!activeOverlay) return;
      activeOverlay.classList.remove('visible');
      activeOverlay.setAttribute('aria-hidden','true');
      unlockScroll();
      if(lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
      activeOverlay = null;
    }

    // --- Projects Overlay ---
    const projectsOverlay = document.getElementById('projectsOverlay');
    const openProjectsBtn = document.getElementById('modernProjectsBtn');
    const closeProjectsBtn = document.getElementById('closeProjects');

    if(openProjectsBtn && projectsOverlay) {
        openProjectsBtn.addEventListener('click', () => openOverlay(projectsOverlay));
    }
    if(closeProjectsBtn) {
        closeProjectsBtn.addEventListener('click', closeOverlay);
    }
    if(projectsOverlay) {
        projectsOverlay.addEventListener('click', function(e) {
            if (e.target === projectsOverlay) {
                closeOverlay();
            }
        });
    }

    // --- Education Overlay ---
    const educationOverlay = document.getElementById('educationOverlay');
    const openEducationBtn = document.getElementById('modernEducationBtn');
    const closeEducationBtn = document.getElementById('closeEducation');

    if(openEducationBtn && educationOverlay) {
        openEducationBtn.addEventListener('click', () => openOverlay(educationOverlay));
    }
    if(closeEducationBtn) {
        closeEducationBtn.addEventListener('click', closeOverlay);
    }
    if(educationOverlay) {
        educationOverlay.addEventListener('click', function(e) {
            if (e.target === educationOverlay) {
                closeOverlay();
            }
        });
    }

    // --- General Event Listeners ---
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && activeOverlay){
        closeOverlay();
      }
    });

    // Start continuous tools scroller loop, unless user prefers reduced motion
    const toolsTrack = document.querySelector('.tools-track');
    if(toolsTrack){
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(!prefersReduced){
        toolsTrack.classList.add('loop');
      }
    }

    // Project card expand/collapse: only one open at a time
    const projectCards = document.querySelectorAll('.project-card');
    function closeAllProjectDetails() {
      document.querySelectorAll('.project-detail.open').forEach(d => {
        d.classList.remove('open');
        d.setAttribute('aria-hidden','true');
      });
    }
    projectCards.forEach(card => {
      card.addEventListener('click', function(e){
        // If click originates from inside an already-open detail, ignore
        const detail = card.querySelector('.project-detail');
        if(!detail) return;
        const isOpen = detail.classList.contains('open');
        closeAllProjectDetails();
        if(!isOpen) {
          detail.classList.add('open');
          detail.setAttribute('aria-hidden','false');
          // scroll the card into view inside the panel
          setTimeout(()=> card.scrollIntoView({behavior:'smooth', block:'center'}), 160);
        }
      });
    });
  });
})();
