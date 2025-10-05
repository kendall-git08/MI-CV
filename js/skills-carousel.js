class SkillsCarousel {
    constructor() {
        this.container = document.querySelector('.skills-carousel-container');
        this.track = document.querySelector('.skills-carousel-track');
        this.slides = document.querySelectorAll('.skills-carousel-slide');
        this.prevBtn = document.querySelector('.skills-carousel-nav.prev');
        this.nextBtn = document.querySelector('.skills-carousel-nav.next');
        this.indicatorsContainer = document.querySelector('.skills-carousel-indicators');
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000; // 4 seconds
        
        this.init();
    }
    
    init() {
        if (!this.container || this.totalSlides === 0) return;
        
        this.createIndicators();
        this.bindEvents();
        this.updateCarousel();
        this.startAutoPlay();
    }
    
    createIndicators() {
        if (!this.indicatorsContainer) return;
        
        this.indicatorsContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'skills-indicator';
            indicator.dataset.slide = i;
            
            indicator.addEventListener('click', () => {
                this.goToSlide(i);
                this.resetAutoPlay();
            });
            
            this.indicatorsContainer.appendChild(indicator);
        }
    }
    
    bindEvents() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.previousSlide();
                this.resetAutoPlay();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoPlay();
            });
        }
        
        // Pause auto-play on hover
        if (this.container) {
            this.container.addEventListener('mouseenter', () => {
                this.pauseAutoPlay();
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isCarouselInView()) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousSlide();
                        this.resetAutoPlay();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextSlide();
                        this.resetAutoPlay();
                        break;
                }
            }
        });
        
        // Touch/swipe support
        this.addTouchSupport();
    }
    
    addTouchSupport() {
        if (!this.container) return;
        
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoPlay();
        });
        
        this.container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.touches[0].clientX;
        });
        
        this.container.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diffX = startX - currentX;
            const threshold = 50; // Minimum swipe distance
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
            
            isDragging = false;
            this.startAutoPlay();
        });
    }
    
    isCarouselInView() {
        if (!this.container) return false;
        
        const rect = this.container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        return rect.top < windowHeight && rect.bottom > 0;
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }
    
    previousSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }
    
    updateCarousel() {
        if (!this.track) return;
        
        // Update track position
        const translateX = -this.currentSlide * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        const indicators = document.querySelectorAll('.skills-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update navigation buttons accessibility
        this.updateNavButtons();
    }
    
    updateNavButtons() {
        if (this.prevBtn) {
            this.prevBtn.setAttribute('aria-label', 
                this.currentSlide === 0 ? 'Ir a la última diapositiva' : 'Diapositiva anterior');
        }
        
        if (this.nextBtn) {
            this.nextBtn.setAttribute('aria-label', 
                this.currentSlide === this.totalSlides - 1 ? 'Ir a la primera diapositiva' : 'Siguiente diapositiva');
        }
    }
    
    startAutoPlay() {
        this.pauseAutoPlay(); // Clear any existing interval
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.pauseAutoPlay();
        setTimeout(() => {
            this.startAutoPlay();
        }, 1000); // Resume after 1 second
    }
    
    // Method to add new skills dynamically
    addSkill(skillData) {
        const currentSlide = this.slides[this.slides.length - 1];
        const skillsInCurrentSlide = currentSlide.children.length;
        const maxSkillsPerSlide = this.getMaxSkillsPerSlide();
        
        let targetSlide = currentSlide;
        
        // If current slide is full, create a new slide
        if (skillsInCurrentSlide >= maxSkillsPerSlide) {
            targetSlide = this.createNewSlide();
        }
        
        // Create skill element
        const skillElement = this.createSkillElement(skillData);
        targetSlide.appendChild(skillElement);
        
        // Update carousel
        this.slides = document.querySelectorAll('.skills-carousel-slide');
        this.totalSlides = this.slides.length;
        this.createIndicators();
        this.updateCarousel();
    }
    
    createNewSlide() {
        const newSlide = document.createElement('div');
        newSlide.className = 'skills-carousel-slide';
        this.track.appendChild(newSlide);
        return newSlide;
    }
    
    createSkillElement(skillData) {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-item-carousel';
        
        skillElement.innerHTML = `
            <img src="${skillData.icon}" alt="${skillData.name}">
            <span>${skillData.name}</span>
        `;
        
        return skillElement;
    }
    
    getMaxSkillsPerSlide() {
        const containerWidth = this.container.offsetWidth;
        if (containerWidth < 480) return 3;
        if (containerWidth < 768) return 4;
        if (containerWidth < 1024) return 6;
        return 8;
    }
    
    // Accessibility enhancements
    updateAriaLabels() {
        if (this.container) {
            this.container.setAttribute('role', 'region');
            this.container.setAttribute('aria-label', 'Carrusel de Habilidades Técnicas');
        }
        
        this.slides.forEach((slide, index) => {
            slide.setAttribute('aria-label', `Diapositiva ${index + 1} de ${this.totalSlides}`);
            slide.setAttribute('role', 'group');
        });
    }
    
    // Method to destroy carousel (for cleanup)
    destroy() {
        this.pauseAutoPlay();
        
        // Remove event listeners
        if (this.prevBtn) this.prevBtn.replaceWith(this.prevBtn.cloneNode(true));
        if (this.nextBtn) this.nextBtn.replaceWith(this.nextBtn.cloneNode(true));
        
        // Reset styles
        if (this.track) {
            this.track.style.transform = '';
        }
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all styles are loaded
    setTimeout(() => {
        window.skillsCarousel = new SkillsCarousel();
    }, 100);
});

// Re-initialize on window resize to handle responsive changes
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.skillsCarousel) {
            window.skillsCarousel.updateCarousel();
        }
    }, 250);
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkillsCarousel;
}