(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('projectsContainer');
        if (!container) {
            return;
        }
        initializeProjectsLibrary(container);
    });

    async function initializeProjectsLibrary(container) {
        const source = container.dataset.source || 'data/projects.json';
        try {
            const response = await fetch(source, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const payload = await response.json();
            renderProjects(container, payload);
        } catch (error) {
            console.error('No se pudo cargar el portafolio', error);
            container.innerHTML = `
                <div class="projects-error">
                    <p>⛔️ No pude cargar los proyectos. Revisa el archivo <code>${source}</code> o vuelve a intentarlo.</p>
                    <button type="button" class="project-assets-toggle" data-retry>Reintentar</button>
                </div>
            `;
            container.querySelector('[data-retry]')?.addEventListener('click', () => initializeProjectsLibrary(container));
        }
    }

    function renderProjects(container, data) {
        container.innerHTML = '';
        const fragment = document.createDocumentFragment();
        const galleryModal = ensureGalleryModal();

        (data?.companies || []).forEach(company => {
            const block = document.createElement('section');
            block.className = 'projects-block';

            const header = document.createElement('header');
            header.className = 'projects-block-header';
            header.style.borderLeft = `4px solid ${company.accent || 'var(--accent-primary)'}`;

            const heading = document.createElement('div');
            heading.innerHTML = `
                <div class="projects-block-badge">Empresa</div>
                <h3>${company.name || 'Proyecto'}</h3>
            `;

            const period = document.createElement('span');
            period.className = 'projects-block-period';
            period.textContent = company.period || '';

            header.appendChild(heading);
            header.appendChild(period);

            const grid = document.createElement('div');
            grid.className = 'projects-block-grid';

            (company.projects || []).forEach(project => {
                const card = buildProjectCard(project, galleryModal);
                grid.appendChild(card);
            });

            block.appendChild(header);
            block.appendChild(grid);
            fragment.appendChild(block);
        });

        container.appendChild(fragment);
    }

    function buildProjectCard(project, galleryModal) {
        const card = document.createElement('article');
        card.className = 'project-card-v2';
        card.dataset.projectId = project.id || '';

        const hero = document.createElement('div');
        hero.className = 'project-card-hero';
        const heroImg = document.createElement('img');
        heroImg.src = project.heroImage || 'assets/images/KPI.png';
        heroImg.alt = project.title || 'Proyecto';
        hero.appendChild(heroImg);

        const tags = document.createElement('div');
        tags.className = 'project-card-tags';
        (project.stack || []).forEach(tagLabel => {
            const tag = document.createElement('span');
            tag.className = 'project-card-tag';
            tag.textContent = tagLabel;
            tags.appendChild(tag);
        });
        if (tags.children.length) {
            hero.appendChild(tags);
        }

        const body = document.createElement('div');
        body.className = 'project-card-body';
        body.innerHTML = `
            <p class="project-card-meta">${project.role || ''}</p>
            <h4>${project.title || ''}</h4>
            <p class="project-card-summary">${project.summary || ''}</p>
        `;

        const highlights = document.createElement('ul');
        highlights.className = 'project-card-highlights';
        (project.highlights || []).forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            highlights.appendChild(li);
        });
        if (highlights.children.length) {
            body.appendChild(highlights);
        }

        body.appendChild(buildAssetsSection(project, galleryModal));

        card.appendChild(hero);
        card.appendChild(body);
        return card;
    }

    function buildAssetsSection(project, galleryModal) {
        const wrapper = document.createElement('div');
        wrapper.className = 'project-assets';

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'project-assets-toggle';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = `
            <span>Materiales & Evidencias</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        `;

        const drawer = document.createElement('div');
        drawer.className = 'project-assets-drawer';

        const attachments = project.attachments || [];
        if (attachments.length) {
            const list = document.createElement('ul');
            list.className = 'project-asset-list';
            attachments.forEach(file => list.appendChild(buildAttachmentItem(file)));
            drawer.appendChild(list);
        } else {
            const empty = document.createElement('p');
            empty.className = 'project-gallery-empty';
            empty.textContent = 'Añade archivos cuando quieras compartir material con el cliente.';
            drawer.appendChild(empty);
        }

        const gallery = project.gallery || [];
        if (gallery.length) {
            const galleryWrapper = document.createElement('div');
            galleryWrapper.className = 'project-gallery';
            gallery.forEach(item => {
                const thumb = document.createElement('button');
                thumb.type = 'button';
                thumb.className = 'project-gallery-thumb';
                thumb.innerHTML = `<img src="${item.image}" alt="${item.caption || project.title || 'Evidencia'}">`;
                thumb.addEventListener('click', () => {
                    galleryModal.open({
                        image: item.image,
                        caption: item.caption,
                        title: project.title
                    });
                });
                galleryWrapper.appendChild(thumb);
            });
            drawer.appendChild(galleryWrapper);
        }

        toggle.addEventListener('click', () => toggleDrawer(toggle, drawer));
        wrapper.appendChild(toggle);
        wrapper.appendChild(drawer);
        return wrapper;
    }

    function buildAttachmentItem(file) {
        const item = document.createElement('li');
        item.className = 'project-asset-item';

        const pill = document.createElement('span');
        const fileType = (file.type || 'link').toLowerCase();
        pill.className = `file-pill file-pill--${fileType}`;
        pill.textContent = fileType === 'pdf' ? 'PDF' : fileType === 'excel' ? 'XLS' : 'DOC';

        const meta = document.createElement('div');
        meta.className = 'file-meta';
        const title = document.createElement('p');
        title.textContent = file.label || 'Documento adjunto';
        const detail = document.createElement('span');
        detail.textContent = buildFileMetaLabel(fileType, file.size);
        meta.appendChild(title);
        meta.appendChild(detail);

        let downloadLink = null;
        if (file.url) {
            downloadLink = document.createElement('a');
            downloadLink.className = 'file-download';
            downloadLink.href = file.url;
            downloadLink.download = '';
            downloadLink.textContent = 'Descargar';
            downloadLink.target = '_blank';
            downloadLink.rel = 'noopener';
        } else {
            const placeholder = document.createElement('span');
            placeholder.className = 'file-meta';
            placeholder.textContent = 'Pronto disponible';
            downloadLink = placeholder;
        }

        item.appendChild(pill);
        item.appendChild(meta);
        item.appendChild(downloadLink);
        return item;
    }

    function buildFileMetaLabel(type, size) {
        const map = {
            pdf: 'PDF',
            excel: 'Excel / CSV',
            link: 'Archivo'
        };
        const prefix = map[type] || 'Archivo';
        return size ? `${prefix} • ${size}` : prefix;
    }

    function toggleDrawer(button, drawer) {
        const isOpen = button.getAttribute('aria-expanded') === 'true';
        const nextState = !isOpen;
        button.setAttribute('aria-expanded', String(nextState));
        drawer.classList.toggle('open', nextState);
        if (nextState) {
            drawer.style.maxHeight = `${drawer.scrollHeight}px`;
        } else {
            drawer.style.maxHeight = '0px';
        }
    }

    function ensureGalleryModal() {
        let modal = document.getElementById('projectGalleryModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'projectGalleryModal';
            modal.className = 'project-gallery-modal';
            modal.innerHTML = `
                <button class="project-gallery-close" aria-label="Cerrar">✕</button>
                <figure>
                    <img alt="Evidencia del proyecto">
                    <figcaption></figcaption>
                </figure>
            `;
            document.body.appendChild(modal);

            const closeBtn = modal.querySelector('.project-gallery-close');
            closeBtn?.addEventListener('click', () => closeModal(modal));
            modal.addEventListener('click', evt => {
                if (evt.target === modal) {
                    closeModal(modal);
                }
            });
            document.addEventListener('keydown', evt => {
                if (evt.key === 'Escape' && modal.classList.contains('visible')) {
                    closeModal(modal);
                }
            });
        }

        return {
            open({ image, caption, title }) {
                modal.querySelector('img').src = image;
                modal.querySelector('img').alt = caption || title || 'Evidencia';
                modal.querySelector('figcaption').textContent = caption || title || '';
                modal.classList.add('visible');
            }
        };
    }

    function closeModal(modal) {
        modal.classList.remove('visible');
    }
})();
