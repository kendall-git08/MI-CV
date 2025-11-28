/**
 * Experience Loader
 * Carga la experiencia profesional desde un archivo JSON externo.
 * Implementa el patrón MVC:
 * - Model: data/experience.json
 * - View: Generación dinámica de HTML
 * - Controller: Este script
 */

document.addEventListener('DOMContentLoaded', () => {
    loadExperience();
});

async function loadExperience() {
    const container = document.getElementById('experience-container');
    if (!container) return;

    try {
        // 1. Fetch Data (Model)
        const response = await fetch('data/experience.json');
        if (!response.ok) throw new Error('No se pudo cargar la experiencia');
        const data = await response.json();

        // 2. Render Data (View)
        renderExperience(data, container);

    } catch (error) {
        console.error('Error cargando experiencia:', error);
        container.innerHTML = '<p class="error-msg">Hubo un error cargando la información profesional.</p>';
    }
}

function renderExperience(data, container) {
    // Limpiar contenedor (o skeleton loading si hubiera)
    container.innerHTML = '';

    // Header de la sección (Mantenemos el estilo original)
    const headerHTML = `
        <div class="experience-header">
            <div class="experience-photo-wrapper">
                <img class="profile-img" src="assets/images/Kendall.jpeg" alt="Foto de perfil de Kendall Jiménez">
            </div>
            <div class="experience-intro">
                <h2 class="section-title">EXPERIENCIA PROFESIONAL</h2>
                <p class="experience-tagline">Analista de datos para transformar procesos y tomar decisiones</p>
            </div>
        </div>
    `;
    
    // Crear elemento contenedor de la timeline
    const timelineContainer = document.createElement('div');
    timelineContainer.className = 'experience-timeline';

    // Iterar por áreas de negocio
    data.areas.forEach(area => {
        
        // Crear separador de área (Opcional: si quieres que se vea visualmente separado)
        // Por ahora, renderizamos los roles directamente para mantener el diseño limpio,
        // pero podríamos agregar un título de área aquí si lo deseas.
        
        /* 
        // Ejemplo de título de área:
        const areaTitle = document.createElement('h4');
        areaTitle.className = 'area-title';
        areaTitle.textContent = area.title;
        timelineContainer.appendChild(areaTitle);
        */

        area.roles.forEach(role => {
            const article = document.createElement('article');
            article.className = 'job-entry';
            
            // Construir lista de logros
            const achievementsList = role.achievements.map(item => `<li>${item}</li>`).join('');

            article.innerHTML = `
                <div class="job-header">
                    <h3 class="job-title">${role.title}</h3>
                    <p class="job-company">${role.company}</p>
                    <p class="job-duration">${role.period}</p>
                </div>
                <div class="job-area-badge" style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px; font-weight: 500;">
                    ${area.title}
                </div>
                <ul class="job-duties">
                    ${achievementsList}
                </ul>
            `;
            
            timelineContainer.appendChild(article);
        });
    });

    // Inyectar todo al DOM
    container.innerHTML = headerHTML;
    container.appendChild(timelineContainer);
}
