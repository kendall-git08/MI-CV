// Accessible Skills Grid
// Renders skill cards and provides inline expand/collapse details without popups.
(function(){
    'use strict';

    // Professional skills data with specialized capabilities
    const skillsData = [
        { id: 'powerbi', name: 'Power BI', category: 'bi', level: 'unlocked', progress: 90, icon: 'ICONOS DE HERRAMIENTAS/POWER BI.png', desc: 'Plataforma integral de Business Intelligence' },
        { id: 'sql', name: 'SQL', category: 'data', level: 'unlocked', progress: 85, icon: 'ICONOS DE HERRAMIENTAS/SQL.png', desc: 'Gestión y consulta de bases de datos' },
        { id: 'excel', name: 'Excel', category: 'analytics', level: 'unlocked', progress: 88, icon: 'ICONOS DE HERRAMIENTAS/EXCEL.jpg', desc: 'Análisis y modelado de datos avanzado' },
        { id: 'appsheet', name: 'AppSheet', category: 'nocode', level: 'unlocked', progress: 75, icon: 'ICONOS DE HERRAMIENTAS/APPSHEET.png', desc: 'Desarrollo de aplicaciones sin código' },
        { id: 'python', name: 'Python', category: 'programming', level: 'unlocked', progress: 80, icon: 'ICONOS DE HERRAMIENTAS/PYTHON.png', desc: 'Análisis de datos y Machine Learning' },
        { id: 'github', name: 'GitHub & Copilot', category: 'development', level: 'unlocked', progress: 85, icon: 'ICONOS DE HERRAMIENTAS/GIT.png', desc: 'Control de versiones y desarrollo asistido por IA' }
    ];

    const VISIBLE_COUNT = 4;
    const STEP_MS = 16; // ~60fps
    const PX_PER_TICK = 0.7; // smooth continuous speed
    let autoId = null;
    let trackState = { pos: 0, cardW: 0, totalW: 0 };
    let isPaused = false;
    let drag = { active:false, startX:0, startPos:0 };

    function createSkillCard(skill) {
        const card = document.createElement('article');
        card.className = 'skill-item-v2';
        card.setAttribute('role', 'listitem');
        card.setAttribute('data-skill-id', skill.id);

        const iconWrapper = document.createElement('div');
        iconWrapper.style.flex = '0 0 auto';
        iconWrapper.style.textAlign = 'center';

        if(skill.icon) {
            const img = document.createElement('img');
            img.src = skill.icon;
            img.alt = skill.name + ' icono';
            img.className = 'skill-icon';
            iconWrapper.appendChild(img);
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'skill-icon';
            placeholder.style.display = 'flex';
            placeholder.style.alignItems = 'center';
            placeholder.style.justifyContent = 'center';
            placeholder.style.background = 'rgba(255,255,255,0.04)';
            placeholder.style.color = '#cfc6dd';
            placeholder.style.fontSize = '1.4rem';
            placeholder.textContent = (skill.name && skill.name[0]) || '•';
            iconWrapper.appendChild(placeholder);
        }

        const content = document.createElement('div');
        content.className = 'skill-content';

        const text = document.createElement('div');
        text.className = 'skill-text';

        const name = document.createElement('h4');
        name.className = 'skill-name';
        name.textContent = skill.name;

        const desc = document.createElement('p');
        desc.className = 'skill-description';
        desc.textContent = skill.desc;

        const controls = document.createElement('div');
        controls.className = 'skill-controls';

        const progressWrap = document.createElement('div');
        progressWrap.style.flex = '1';
        progressWrap.style.minWidth = '0';

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.background = 'rgba(255,255,255,0.06)';
        progressBar.style.borderRadius = '8px';
        progressBar.style.height = '8px';
        progressBar.style.overflow = 'hidden';

        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = skill.progress + '%';
        progressFill.style.height = '100%';
        progressFill.style.background = skill.level === 'unlocked' ? 'linear-gradient(90deg,var(--accent-green),var(--accent-blue))' : (skill.level === 'learning' ? 'linear-gradient(90deg,#ffc857,#ff6b6b)' : 'rgba(255,255,255,0.06)');

        progressBar.appendChild(progressFill);
        progressWrap.appendChild(progressBar);

        // Toggle details button (accessible) - now an icon
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'skill-toggle-btn';
        toggleBtn.type = 'button';
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-controls', `detail-${skill.id}`);
        toggleBtn.setAttribute('aria-label', 'Ver detalles de ' + skill.name);
    // Chevron down icon that will rotate when expanded
    toggleBtn.innerHTML = `<svg class="toggle-icon" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
        // Remove all the inline styles since CSS handles styling now

        controls.appendChild(progressWrap);
        controls.appendChild(toggleBtn);

        // Instead of inline details, we will open the slide-in sidebar
        const details = null;

        // Toggle behavior
        toggleBtn.addEventListener('click', function(){
            openSkillsSidebar({
                id: skill.id,
                name: skill.name,
                icon: skill.icon,
                capabilities: getCapabilitiesForSkill(skill.id)
            });
            // Pause carousel while sidebar is open
            isPaused = true;
            setTimeout(() => card.scrollIntoView({behavior: 'smooth', block: 'nearest'}), 120);
        });

        text.appendChild(name);
        text.appendChild(desc);
        text.appendChild(controls);

        content.appendChild(text);
    // no inline details appended; sidebar will be used instead

        card.appendChild(iconWrapper);
        card.appendChild(content);

        return card;
    }

    function buildTrack(items) {
        const track = document.createElement('div');
        track.className = 'skills-track';
        // Build two copies for seamless loop
        const all = items.concat(items);
        all.forEach(item => track.appendChild(createSkillCard(item)));
        return track;
    }

    function loopStep(track) {
        if (isPaused) return;
        trackState.pos -= PX_PER_TICK;
        // Wrap when moved one original set width
        if (-trackState.pos >= trackState.totalW) {
            trackState.pos += trackState.totalW; // jump forward by one set
        }
        track.style.transform = `translateX(${trackState.pos}px)`;
    }

    function startAuto(track) {
        stopAuto();
        autoId = setInterval(() => loopStep(track), STEP_MS);
    }

    function stopAuto() {
        if (autoId) { clearInterval(autoId); autoId = null; }
    }

    function addNav(viewport, track) {
        const nav = document.createElement('div');
        nav.className = 'skills-nav';
        const prev = document.createElement('button'); prev.setAttribute('aria-label','Anterior'); prev.textContent = '‹';
        const next = document.createElement('button'); next.setAttribute('aria-label','Siguiente'); next.textContent = '›';
        nav.appendChild(prev); nav.appendChild(next);
        viewport.appendChild(nav);
        const nudge = (dir) => {
            // Move by one card width per click
            const delta = dir * Math.max(240, trackState.cardW || 260);
            trackState.pos += delta;
            // clamp within -totalW..0 visual window then wrap if needed
            if (trackState.pos > 0) trackState.pos -= trackState.totalW;
            if (-trackState.pos >= trackState.totalW) trackState.pos += trackState.totalW;
            track.style.transform = `translateX(${trackState.pos}px)`;
        };
        prev.addEventListener('click', () => nudge(1));
        next.addEventListener('click', () => nudge(-1));
    }

    function addWheel(viewport) {
        viewport.addEventListener('wheel', (e) => {
            // horizontal intended; natural scroll: up=prev, down=next
            const delta = e.deltaY || e.deltaX;
            if (Math.abs(delta) < 1) return;
            
            // Check if there's an open detail panel
            const openDetail = document.querySelector('.skill-detail[aria-hidden="false"]');
            if (openDetail) {
                // If detail panel is open, let the scroll work on the capabilities grid
                const capabilitiesGrid = openDetail.querySelector('.capabilities-grid');
                if (capabilitiesGrid && capabilitiesGrid.scrollHeight > capabilitiesGrid.clientHeight) {
                    // Let the default scroll behavior work on the capabilities grid
                    return;
                }
            }
            
            // Temporarily pause auto-movement during manual wheel interaction
            const wasPausedForDetails = isPaused;
            isPaused = true;
            
            // move proportional to wheel
            trackState.pos += -Math.sign(delta) * Math.max(160, trackState.cardW * 0.8);
            if (trackState.pos > 0) trackState.pos -= trackState.totalW;
            if (-trackState.pos >= trackState.totalW) trackState.pos += trackState.totalW;
            const track = viewport.querySelector('.skills-track');
            if (track) track.style.transform = `translateX(${trackState.pos}px)`;
            clearTimeout(viewport._wheelTimeout);
            viewport._wheelTimeout = setTimeout(() => { 
                // Only resume auto-movement if not paused for details
                if (!wasPausedForDetails && !document.querySelector('.skill-detail[aria-hidden="false"]')) {
                    isPaused = false; 
                }
            }, 500);
            e.preventDefault();
        }, { passive: false });
    }

    function addDrag(viewport, track) {
        const onDown = (clientX) => {
            // Check if there's an open detail panel
            const openDetail = document.querySelector('.skill-detail[aria-hidden="false"]');
            if (openDetail) return; // Don't allow drag when detail is open
            
            // Temporarily pause auto-movement
            const wasPausedForDetails = isPaused;
            isPaused = true;
            drag.active = true;
            drag.startX = clientX;
            drag.startPos = trackState.pos;
        };
        const onMove = (clientX) => {
            if (!drag.active) return;
            const dx = clientX - drag.startX;
            trackState.pos = drag.startPos + dx;
            if (trackState.pos > 0) trackState.pos -= trackState.totalW;
            if (-trackState.pos >= trackState.totalW) trackState.pos += trackState.totalW;
            track.style.transform = `translateX(${trackState.pos}px)`;
        };
        const onUp = () => {
            if (!drag.active) return;
            drag.active = false;
            setTimeout(() => { 
                // Only resume auto-movement if no details are open
                if (!document.querySelector('.skill-detail[aria-hidden="false"]')) {
                    isPaused = false; 
                }
            }, 200);
        };
        viewport.addEventListener('mousedown', (e) => onDown(e.clientX));
        window.addEventListener('mousemove', (e) => onMove(e.clientX));
        window.addEventListener('mouseup', onUp);
        viewport.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX), {passive:true});
        viewport.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), {passive:true});
        window.addEventListener('touchend', onUp, {passive:true});
    }

    function measureTrack(track, viewport) {
        const first = track.querySelector('.skill-item-v2');
        trackState.cardW = first ? first.getBoundingClientRect().width + 20 /*gap*/ : 260 + 20;
        const count = skillsData.length; // one set length
        trackState.totalW = count * trackState.cardW;
        // reset position
        trackState.pos = 0;
        track.style.transform = 'translateX(0px)';
    }

    function renderSkillsGrid() {
        const viewport = document.getElementById('skillsGrid');
        if(!viewport) return;
        updateCounts();
        const track = buildTrack(skillsData);
        viewport.innerHTML = '';
        viewport.appendChild(track);
        addNav(viewport, track);
        addWheel(viewport);
        addDrag(viewport, track);
        // initial appearance effect
        requestAnimationFrame(() => {
            viewport.querySelectorAll('.skill-item-v2').forEach(el => el.classList.add('sk-enter-active'));
            measureTrack(track, viewport);
            startAuto(track);
        });
        // pause on hover/focus
        viewport.addEventListener('mouseenter', () => { 
            // Only pause if no details are open
            if (!document.querySelector('.skill-detail[aria-hidden="false"]')) {
                isPaused = true; 
            }
        });
        viewport.addEventListener('mouseleave', () => { 
            // Only resume if no details are open
            if (!document.querySelector('.skill-detail[aria-hidden="false"]')) {
                isPaused = false; 
            }
        });
        viewport.addEventListener('focusin', () => { 
            // Only pause if no details are open
            if (!document.querySelector('.skill-detail[aria-hidden="false"]')) {
                isPaused = true; 
            }
        });
        viewport.addEventListener('focusout', () => { 
            // Only resume if no details are open
            if (!document.querySelector('.skill-detail[aria-hidden="false"]')) {
                isPaused = false; 
            }
        });
        // Update measurements on resize
        window.addEventListener('resize', () => measureTrack(track, viewport));
    }

    function updateCounts(){
        const unlocked = skillsData.filter(s => s.level === 'unlocked').length;
        const learning = skillsData.filter(s => s.level === 'learning').length;
        const locked = skillsData.filter(s => s.level === 'locked').length;
        const u = document.getElementById('unlockedCount');
        const l = document.getElementById('learningCount');
        const k = document.getElementById('lockedCount');
        if(u) u.textContent = unlocked;
        if(l) l.textContent = learning;
        if(k) k.textContent = locked;
    }

    // Initialize when DOM ready
    document.addEventListener('DOMContentLoaded', function(){
        renderSkillsGrid();
        // keyboard accessibility: close details on ESC
        document.addEventListener('keydown', function(e){
            if(e.key === 'Escape'){
                closeSkillsSidebar();
            }
        });
    });

    // --- Professional capabilities per skill ---
    function getCapabilitiesForSkill(id){
        const capabilities = {
            powerbi: [
                'Dataflows (Gen1/Gen2)',
                'DAX avanzado',
                'Modelado en Estrella',
                'RLS (Row-Level Security)',
                'Optimización de rendimiento'
            ],
            sql: [
                'ETL y modelado de datos',
                'Funciones de ventana',
                'CTEs (Common Table Expressions)',
                'Optimización de consultas'
            ],
            excel: [
                'Power Pivot',
                'Power Query (Lenguaje M)',
                'Modelado de datos complejos',
                'Análisis con tablas dinámicas'
            ],
            appsheet: [
                'Desarrollo de apps sin código',
                'Automatización de flujos',
                'Gestión de datos y roles de usuario'
            ],
            python: [
                'Análisis de datos con Pandas y NumPy',
                'Visualización con Matplotlib',
                'Modelos de Machine Learning con Scikit-learn'
            ],
            github: [
                'Control de versiones',
                'Desarrollo asistido por IA',
                'Integración con flujos de trabajo de BI y automatización'
            ]
        };
        return capabilities[id] || [];
    }

    // ===== Slide-in Skills Sidebar Controller =====
    function openSkillsSidebar(skill) {
        const overlay = document.getElementById('skillsSidebarOverlay');
        const content = document.getElementById('skillsSidebarContent');
        const title = document.getElementById('skillsSidebarTitle');
        if (!overlay || !content || !title) return;
        // Build content
        const header = `
            <div class="skill-header">
                ${skill.icon ? `<img class="icon" src="${skill.icon}" alt="${skill.name}">` : ''}
                <h4 class="name">${skill.name}</h4>
            </div>
        `;
        const caps = (skill.capabilities && skill.capabilities.length)
            ? skill.capabilities.map(c => `
                <div class="skill-capability-item">
                    <span class="capability-icon">✓</span>
                    <span class="capability-text">${c}</span>
                </div>
            `).join('')
            : '<div class="coming-soon">Próximamente</div>';
        content.innerHTML = `${header}
            <div class="section-label">Capacidades técnicas principales</div>
            <div class="capabilities-list">${caps}</div>`;

        overlay.classList.add('visible');
        overlay.setAttribute('aria-hidden','false');
        // Focus for accessibility
        setTimeout(() => content.focus(), 50);
        // Close wiring
        const closeBtn = document.getElementById('skillsSidebarClose');
        if (closeBtn && !closeBtn._wired) {
            closeBtn.addEventListener('click', closeSkillsSidebar);
            closeBtn._wired = true;
        }
        // Clicking backdrop closes
        if (!overlay._wired) {
            overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSkillsSidebar(); });
            overlay._wired = true;
        }
        // lock page scroll
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }

    function closeSkillsSidebar() {
        const overlay = document.getElementById('skillsSidebarOverlay');
        if (!overlay) return;
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden','true');
        // unlock page scroll
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        // resume carousel
        isPaused = false;
    }

})();
