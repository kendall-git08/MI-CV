// carousel.js

(function() {
    document.addEventListener('DOMContentLoaded', function() {

        // --- Configuración unificada para carruseles ---
        const setupCarousel = (selector, scrollAmount = 1) => {
            const carousel = document.querySelector(selector);
            if (!carousel) return;

            let autoScroll = true;
            let isDown = false;
            let startX, scrollLeft;

            // Bucle de auto-scroll
            const loopScroll = () => {
                if (autoScroll) {
                    carousel.scrollLeft += scrollAmount;
                    if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 2) {
                        carousel.scrollLeft = 0;
                    }
                }
                requestAnimationFrame(loopScroll);
            };

            // Iniciar el bucle
            loopScroll();

            // Pausar con el ratón
            carousel.addEventListener('mouseenter', () => autoScroll = false);
            carousel.addEventListener('mouseleave', () => autoScroll = true);

            // Arrastrar para desplazar (ratón)
            carousel.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - carousel.offsetLeft;
                scrollLeft = carousel.scrollLeft;
                carousel.style.cursor = 'grabbing';
            });

            document.addEventListener('mouseup', () => {
                isDown = false;
                carousel.style.cursor = 'grab';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - carousel.offsetLeft;
                const walk = (x - startX);
                carousel.scrollLeft = scrollLeft - walk;
            });

            // Arrastrar para desplazar (táctil)
            carousel.addEventListener('touchstart', (e) => {
                isDown = true;
                startX = e.touches[0].pageX - carousel.offsetLeft;
                scrollLeft = carousel.scrollLeft;
            });

            carousel.addEventListener('touchend', () => {
                isDown = false;
            });

            carousel.addEventListener('touchmove', (e) => {
                if (!isDown) return;
                const x = e.touches[0].pageX - carousel.offsetLeft;
                const walk = (x - startX);
                carousel.scrollLeft = scrollLeft - walk;
            });
        };

        // Inicializar el carrusel de educación con una velocidad mayor
        setupCarousel('.education-carousel', 1); // Aumentado de 0.5 a 1

        // --- Lógica del modal de certificados ---
        const modal = document.getElementById('certModal');
        const modalBackdrop = document.getElementById('modalBackdrop');
        const modalClose = document.getElementById('modalClose');
        const certFrame = document.getElementById('certFrame');

        const openModal = (src) => {
            if (!modal || !certFrame) return;
            certFrame.src = src;
            modal.setAttribute('aria-hidden', 'false');
            modal.style.display = 'flex'; // Usar flex para centrar
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            if (!modal || !certFrame) return;
            certFrame.src = '';
            modal.setAttribute('aria-hidden', 'true');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        };

        document.querySelectorAll('.cert-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const src = link.dataset.certSrc;
                if (src && src !== '#') {
                    openModal(src);
                } else {
                    console.warn('No certificate source provided for this link.');
                }
            });
        });

        if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
        if (modalClose) modalClose.addEventListener('click', closeModal);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeModal();
            }
        });
    });
})();

