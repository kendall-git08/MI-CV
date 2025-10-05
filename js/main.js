// Sticky contact header with manual toggle and reset on scroll up
document.addEventListener('DOMContentLoaded', function(){
    const mainHeader = document.getElementById('mainHeader');
    const stickyContact = document.getElementById('stickyContact');
    const projectsPanel = document.getElementById('projectsPanel');
    const toggleBtn = document.getElementById('toggleContactSticky');
    const togglePolygon = document.getElementById('toggleContactPolygon');
    let stickyHidden = false;

    function updateSticky(){
        const scrollY = window.scrollY || window.pageYOffset;
        const panelOpen = projectsPanel && projectsPanel.classList.contains('open');

        if(panelOpen){
            mainHeader.style.opacity = '0';
            mainHeader.style.pointerEvents = 'none';
            stickyContact.style.display = 'none';
            return;
        }

        if(scrollY > 120){
            mainHeader.style.opacity = '0';
            mainHeader.style.pointerEvents = 'none';
            stickyContact.style.display = stickyHidden ? 'none' : 'block';
            stickyContact.style.position = 'fixed';
            stickyContact.style.top = '0';
            stickyContact.style.left = '0';
            stickyContact.style.width = '100%';
            stickyContact.style.background = 'rgba(30,30,47,0.98)';
            stickyContact.style.boxShadow = '0 4px 24px rgba(0,194,255,0.10)';
            stickyContact.style.zIndex = '2000';
            stickyContact.style.transition = 'all 0.3s';
            stickyContact.style.padding = '10px 0';
            if(toggleBtn){
                toggleBtn.style.display = 'block';
            }
        } else {
            mainHeader.style.opacity = '1';
            mainHeader.style.pointerEvents = 'auto';
            stickyContact.style.display = 'none';
            // Reset state on scroll to top
            stickyHidden = false;
            if(togglePolygon){
                togglePolygon.setAttribute('points','0,22 22,22 22,0');
            }
        }
    }

    window.addEventListener('scroll', updateSticky);

    // Also listen for panel open/close
    const observer = new MutationObserver(updateSticky);
    if(projectsPanel){
        observer.observe(projectsPanel, {attributes:true,attributeFilter:['class']});
    }

    if(toggleBtn){
        toggleBtn.addEventListener('click', function(){
            stickyHidden = !stickyHidden;
            // Change triangle direction
            if(stickyHidden){
                // Triangle up (to show)
                togglePolygon.setAttribute('points','0,0 22,0 22,22');
            } else {
                // Triangle down (to hide)
                togglePolygon.setAttribute('points','0,22 22,22 22,0');
            }
            updateSticky();
        });
    }
    updateSticky();
});


// --- Recomendaciones: wire contact buttons to animated slide (uses same UI as header contacts)
document.addEventListener('DOMContentLoaded', function() {
    // Recreate minimal contact slide helpers (kept local to avoid global collisions)
    function createContactSlide(type, value, label) {
        const slide = document.createElement('div');
        slide.className = 'contact-slide';
        slide.innerHTML = `
            <button class="slide-close" aria-label="Cerrar">✕</button>
            <span class="slide-label">${label}</span>
            <div class="slide-value">${value}</div>
            <div class="copy-container" style="display:flex; justify-content:center; margin-top:8px;">
                <button class="copy-btn" id="copyContactBtn" title="Copiar" style="background:none; border:none; color:#00c2ff; cursor:pointer; padding:6px; border-radius:6px; transition:background 0.18s; display:flex; align-items:center; justify-content:center;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
            </div>
            <div class="copy-notify" id="copyNotify" style="display:none; margin-top:6px; color:#7cf2b5; font-size:0.98rem; font-weight:600; text-align:center;">Copiado ✔</div>
            <div style="font-size:0.95rem; color:#cfc6dd; margin-top:4px; text-align:center;">${type === 'phone' ? 'Puedes copiar el número para llamar o enviar WhatsApp.' : 'Puedes copiar el correo para escribir directamente.'}</div>
        `;
        return slide;
    }

    function showContactSlideFromButton(buttonEl, type) {
        // close existing slides
        document.querySelectorAll('.contact-slide.active').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.contact-slide').forEach(s => s.remove());

        const value = type === 'phone' ? (buttonEl.dataset.phone || '') : (buttonEl.dataset.email || '');
        const label = type === 'phone' ? 'Teléfono de contacto' : 'Correo electrónico';
        const slide = createContactSlide(type, value, label);

        // Append slide to body and position it near the button to avoid clipping
        document.body.appendChild(slide);
    slide.style.position = 'fixed';
        slide.style.zIndex = '4000';
    slide.style.maxWidth = '320px';
    slide.style.minWidth = '220px';
        // initial position; will adjust after rendering
        const rect = buttonEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        slide.style.left = centerX + 'px';
        const vOffset = 10; // vertical offset
        slide.style.top = (rect.bottom + vOffset) + 'px';
        slide.style.transform = 'translateX(-50%) scale(0.98)';
        // ensure slide fits: max-height and scroll if needed
        slide.style.maxHeight = Math.max(180, Math.floor(window.innerHeight * 0.45)) + 'px';
        slide.style.overflow = 'auto';
        setTimeout(() => {
            // If the slide would overflow the viewport at bottom, place it above the button with a small margin
            const sh = slide.offsetHeight;
            const margin = 8;
            if (rect.bottom + vOffset + sh + margin > window.innerHeight) {
                slide.style.top = (rect.top - sh - vOffset) + 'px';
            }
            // Clamp horizontally so the slide doesn't go off-screen
            const slideRect = slide.getBoundingClientRect();
            const pad = 12;
            if (slideRect.left < pad) {
                slide.style.left = pad + 'px';
                slide.style.transform = 'translateX(0) scale(0.98)';
            } else if (slideRect.right > window.innerWidth - pad) {
                slide.style.left = (window.innerWidth - pad) + 'px';
                slide.style.transform = 'translateX(-100%) scale(0.98)';
            }
            slide.classList.add('active');
        }, 10);

        // Close
        slide.querySelector('.slide-close').addEventListener('click', () => {
            slide.classList.remove('active');
            setTimeout(() => slide.remove(), 320);
        });

        // click outside to close (works with slide appended to body)
        setTimeout(() => {
            document.addEventListener('mousedown', function handler(ev) {
                if (!slide.contains(ev.target) && ev.target !== buttonEl) {
                    slide.classList.remove('active');
                    setTimeout(() => slide.remove(), 320);
                    document.removeEventListener('mousedown', handler);
                }
            });
        }, 50);

        // copy button
        const copyBtn = slide.querySelector('#copyContactBtn');
        const copyValue = slide.querySelector('.slide-value');
        const notify = slide.querySelector('#copyNotify');
        if(copyBtn && copyValue && notify) {
            copyBtn.addEventListener('click', function() {
                const val = copyValue.textContent.trim();
                if(window.navigator && window.navigator.clipboard) {
                    window.navigator.clipboard.writeText(val).then(()=>{
                        notify.style.display = 'block';
                        setTimeout(()=>{ notify.style.display = 'none'; }, 1400);
                    });
                } else {
                    const tempInput = document.createElement('input');
                    tempInput.value = val;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    notify.style.display = 'block';
                    setTimeout(()=>{ notify.style.display = 'none'; }, 1400);
                }
            });
        }
    }

    // Wire recommendation buttons
    function openImmediate(actionType, btn) {
        if(actionType === 'phone') {
            const tel = btn.dataset.tel || ('tel:' + (btn.dataset.phone || '').replace(/\s+/g, ''));
            if(tel) location.href = tel;
        } else {
            const mail = btn.dataset.email ? ('mailto:' + btn.dataset.email) : (btn.dataset.mailto || '');
            if(mail) location.href = mail;
        }
    }

    // helper to add long-press detection for touch devices
    function addLongPressHandler(el, callback, ms = 600) {
        let timer = null;
        el.addEventListener('touchstart', function(e) {
            timer = setTimeout(() => {
                callback(e);
                timer = null;
            }, ms);
        }, {passive:true});
        ['touchend','touchmove','touchcancel'].forEach(ev => {
            el.addEventListener(ev, function() { if(timer){ clearTimeout(timer); timer = null; } }, {passive:true});
        });
    }

    document.querySelectorAll('.recommendation-contact-phone').forEach(btn => {
        btn.addEventListener('click', function(e){
            e.preventDefault();
            showContactSlideFromButton(btn, 'phone');
        });
        // double click (desktop) opens tel immediately
        btn.addEventListener('dblclick', function(e){
            e.preventDefault();
            openImmediate('phone', btn);
        });
        // long-press (touch) opens tel
        addLongPressHandler(btn, function(){ openImmediate('phone', btn); });
    });

    document.querySelectorAll('.recommendation-contact-email').forEach(btn => {
        btn.addEventListener('click', function(e){
            e.preventDefault();
            showContactSlideFromButton(btn, 'email');
        });
        // double click (desktop) opens mailto immediately
        btn.addEventListener('dblclick', function(e){
            e.preventDefault();
            openImmediate('email', btn);
        });
        // long-press (touch) opens mailto
        addLongPressHandler(btn, function(){ openImmediate('email', btn); });
    });
});
