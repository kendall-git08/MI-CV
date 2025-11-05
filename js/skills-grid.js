// Accessible Skills Grid
// Renders skill cards and provides inline expand/collapse details without popups.
(function(){
    'use strict';

    // Professional skills data with specialized capabilities
    const skillsData = [
        { id: 'powerbi', name: 'Power BI', category: 'bi', level: 'unlocked', progress: 90, icon: 'assets/icons/tools/POWER BI.png', desc: 'Plataforma integral de Business Intelligence' },
        { id: 'sql', name: 'SQL', category: 'data', level: 'unlocked', progress: 85, icon: 'assets/icons/tools/SQL.png', desc: 'Gestión y consulta de bases de datos' },
        { id: 'excel', name: 'Excel', category: 'analytics', level: 'unlocked', progress: 88, icon: 'assets/icons/tools/EXCEL.jpg', desc: 'Análisis y modelado de datos avanzado' },
        { id: 'sap', name: 'SAP Business One', category: 'erp', level: 'unlocked', progress: 82, icon: 'assets/icons/tools/POWER BI.png', desc: 'Sistema ERP para gestión empresarial' },
        { id: 'appsheet', name: 'AppSheet', category: 'nocode', level: 'unlocked', progress: 75, icon: 'assets/icons/tools/APPSHEET.png', desc: 'Desarrollo de aplicaciones sin código' },
        { id: 'python', name: 'Python', category: 'programming', level: 'unlocked', progress: 80, icon: 'assets/icons/tools/PYTHON.png', desc: 'Análisis de datos y Machine Learning' },
        { id: 'vscode', name: 'VS Code', category: 'development', level: 'unlocked', progress: 85, icon: 'assets/icons/tools/VSCODE.jpeg', desc: 'Editor de código profesional' },
        { id: 'github', name: 'GitHub', category: 'development', level: 'unlocked', progress: 85, icon: 'assets/icons/tools/GIT.png', desc: 'Control de versiones y colaboración' }
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

        controls.appendChild(progressWrap);

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
        // No navigation buttons - clean carousel
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
            sap: [
                'Integración con SQL Server',
                'Consultas y reportes',
                'Gestión de datos empresariales',
                'Conexión con Power BI'
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
            vscode: [
                'Desarrollo con extensiones',
                'GitHub Copilot',
                'Debugging y control de versiones'
            ],
            github: [
                'Control de versiones',
                'Colaboración en equipo',
                'CI/CD y automatización'
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
