document.addEventListener('DOMContentLoaded', () => {
    initStickyContactBar();
    initContactSlides();
});

function initStickyContactBar() {
    const mainHeader = document.getElementById('mainHeader');
    const stickyContact = document.getElementById('stickyContact');
    const toggleBtn = document.getElementById('toggleContactSticky');
    if (!stickyContact || !toggleBtn) {
        return;
    }

    let userCollapsed = false;

    const showBar = () => {
        stickyContact.classList.add('visible');
        toggleBtn.classList.remove('open');
    };

    const hideBar = () => {
        stickyContact.classList.remove('visible');
        toggleBtn.classList.add('open');
    };

    const updateOnScroll = () => {
        const scrolled = (window.scrollY || window.pageYOffset) > 120;
        if (mainHeader) {
            mainHeader.classList.toggle('header-condensed', scrolled);
        }

        if (scrolled) {
            if (userCollapsed) {
                hideBar();
            } else {
                showBar();
            }
        } else {
            hideBar();
            userCollapsed = false;
            toggleBtn.classList.remove('open');
        }
    };

    toggleBtn.addEventListener('click', () => {
        userCollapsed = !userCollapsed;
        if (userCollapsed) {
            hideBar();
        } else {
            showBar();
        }
    });

    window.addEventListener('scroll', updateOnScroll, { passive: true });
    updateOnScroll();
}

function initContactSlides() {
    const slideState = {
        activeSlide: null
    };

    function removeActiveSlide() {
        if (!slideState.activeSlide) return;
        const current = slideState.activeSlide;
        current.classList.remove('active');
        setTimeout(() => current.remove(), 240);
        slideState.activeSlide = null;
        document.removeEventListener('mousedown', handleOutsideClick, true);
    }

    function handleOutsideClick(event) {
        if (slideState.activeSlide && !slideState.activeSlide.contains(event.target)) {
            removeActiveSlide();
        }
    }

    function createContactSlide(type, value) {
        const slide = document.createElement('div');
        const label = type === 'phone' ? 'Teléfono de contacto' : 'Correo electrónico';
        const hint = type === 'phone'
            ? 'Puedes copiar el número para llamar o enviar WhatsApp.'
            : 'Puedes copiar el correo para escribir directamente.';

        slide.className = 'contact-slide';
        slide.innerHTML = `
            <button class="slide-close" type="button" aria-label="Cerrar">✕</button>
            <span class="slide-label">${label}</span>
            <div class="slide-value">${value}</div>
            <div class="copy-container">
                <button class="copy-btn" type="button" title="Copiar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Copiar
                </button>
            </div>
            <div class="copy-notify" id="copyNotify" aria-live="polite">Copiado ✔</div>
            <p class="slide-hint">${hint}</p>
        `;
        return slide;
    }

    function placeSlide(slide, anchorRect) {
        const verticalOffset = 14;
        const pad = 12;

        slide.style.left = `${anchorRect.left + anchorRect.width / 2}px`;
        slide.style.top = `${anchorRect.bottom + verticalOffset}px`;
        slide.style.transform = 'translate(-50%, 0)';
        slide.style.maxHeight = `${Math.max(200, Math.floor(window.innerHeight * 0.45))}px`;

        requestAnimationFrame(() => {
            const { offsetHeight, offsetWidth } = slide;
            if (anchorRect.bottom + verticalOffset + offsetHeight > window.innerHeight - pad) {
                slide.style.top = `${anchorRect.top - offsetHeight - verticalOffset}px`;
            }

            const slideRect = slide.getBoundingClientRect();
            if (slideRect.left < pad) {
                slide.style.left = `${pad + offsetWidth / 2}px`;
            } else if (slideRect.right > window.innerWidth - pad) {
                slide.style.left = `${window.innerWidth - pad - offsetWidth / 2}px`;
            }

            slide.classList.add('active');
        });
    }

    function showContactSlide(triggerEl, type) {
        const value = type === 'phone'
            ? (triggerEl.dataset.phone || triggerEl.getAttribute('href')?.replace('tel:', '') || '')
            : (triggerEl.dataset.email || triggerEl.getAttribute('href')?.replace('mailto:', '') || '');

        if (!value) {
            return;
        }

        removeActiveSlide();

        const slide = createContactSlide(type, value);
        document.body.appendChild(slide);
        slideState.activeSlide = slide;

        const rect = triggerEl.getBoundingClientRect();
        placeSlide(slide, rect);

        slide.querySelector('.slide-close')?.addEventListener('click', removeActiveSlide);

        const copyBtn = slide.querySelector('.copy-btn');
        const notify = slide.querySelector('#copyNotify');
        const valueEl = slide.querySelector('.slide-value');

        copyBtn?.addEventListener('click', () => {
            const text = valueEl?.textContent?.trim();
            if (!text) return;

            const showNotify = () => {
                if (notify) {
                    notify.style.display = 'block';
                    setTimeout(() => {
                        notify.style.display = 'none';
                    }, 1400);
                }
            };

            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(showNotify);
            } else {
                const tmp = document.createElement('input');
                tmp.value = text;
                document.body.appendChild(tmp);
                tmp.select();
                document.execCommand('copy');
                document.body.removeChild(tmp);
                showNotify();
            }
        });

        setTimeout(() => {
            document.addEventListener('mousedown', handleOutsideClick, true);
        }, 30);
    }

    function openImmediate(type, el) {
        const target = type === 'phone'
            ? el.dataset.tel || el.dataset.phone || el.getAttribute('href')
            : el.dataset.mailto || el.dataset.email || el.getAttribute('href');
        if (target) {
            window.location.href = target;
        }
    }

    function addLongPressHandler(el, callback, ms = 600) {
        let timer = null;
        el.addEventListener('touchstart', () => {
            timer = setTimeout(() => {
                callback();
                timer = null;
            }, ms);
        }, { passive: true });

        ['touchend', 'touchmove', 'touchcancel'].forEach(evt => {
            el.addEventListener(evt, () => {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
            }, { passive: true });
        });
    }

    function attachContactHandler(el, type, options = {}) {
        if (!el) return;
        el.addEventListener('click', evt => {
            evt.preventDefault();
            showContactSlide(el, type);
        });

        if (options.openOnDoubleClick) {
            el.addEventListener('dblclick', evt => {
                evt.preventDefault();
                openImmediate(type, el);
            });
        }

        if (options.enableLongPress) {
            addLongPressHandler(el, () => openImmediate(type, el));
        }
    }

    // Header & sticky icons
    attachContactHandler(document.getElementById('contactPhone'), 'phone', { openOnDoubleClick: true, enableLongPress: true });
    attachContactHandler(document.getElementById('contactEmail'), 'email', { openOnDoubleClick: true, enableLongPress: true });
    attachContactHandler(document.getElementById('stickyContactPhone'), 'phone', { openOnDoubleClick: true, enableLongPress: true });
    attachContactHandler(document.getElementById('stickyContactEmail'), 'email', { openOnDoubleClick: true, enableLongPress: true });

    // Recommendation buttons
    document.querySelectorAll('.recommendation-contact-phone').forEach(btn => {
        attachContactHandler(btn, 'phone', { openOnDoubleClick: true, enableLongPress: true });
    });

    document.querySelectorAll('.recommendation-contact-email').forEach(btn => {
        attachContactHandler(btn, 'email', { openOnDoubleClick: true, enableLongPress: true });
    });
}
