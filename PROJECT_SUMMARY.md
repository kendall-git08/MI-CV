# 📊 PORTAFOLIO WEB PROFESIONAL - RESUMEN EJECUTIVO

**Autor:** Kendall Jiménez Barboza  
**Proyecto:** CV Digital con Automatización IA  
**Stack Principal:** HTML5, JavaScript (ES6+), Python (FastAPI), Google Gemini AI  
**Arquitectura:** Frontend estático (GitHub Pages) + Backend opcional (FastAPI + Gemini)

---

## 🎯 DESCRIPCIÓN DEL PROYECTO

Portafolio web profesional de un **Business Intelligence Specialist** que combina:

1. **Frontend moderno y dinámico** con carga de contenido desde archivos JSON
2. **Patrón MVC simplificado** para separar datos de lógica
3. **Backend opcional con IA** para generación automática de perfiles profesionales
4. **Diseño responsivo** optimizado para reclutadores y dispositivos móviles

El proyecto está estructurado para permitir actualizaciones rápidas de contenido sin tocar código, y cuenta con una herramienta de automatización basada en **Google Gemini** para generar resúmenes profesionales personalizados según el rol objetivo.

---

## 📁 ESTRUCTURA DEL PROYECTO

```
Portafolio_web/
│
├── index.html                    # Página principal del CV
├── cv-generator.html             # Herramienta admin para generar perfiles con IA
│
├── data/
│   ├── experience.json           # Experiencia profesional segmentada por áreas
│   └── projects.json             # Portafolio de proyectos por área de negocio
│
├── js/
│   ├── experience-loader.js      # Controlador: carga dinámica de experiencia
│   ├── skills-grid.js            # Carrusel de habilidades técnicas
│   ├── projects-library.js       # Carga y renderizado de proyectos
│   ├── slidepanel.js             # Gestión de paneles overlay
│   └── main.js                   # Lógica general (sticky bar, modals, etc.)
│
├── css/
│   ├── styles.css                # Estilos principales del portafolio
│   └── light-theme.css           # Variables CSS (tema claro)
│
├── backend/
│   ├── main.py                   # API FastAPI con endpoint de Gemini
│   ├── requirements.txt          # Dependencias Python
│   ├── .env                      # Credenciales (excluido de Git)
│   └── venv/                     # Entorno virtual Python
│
├── assets/
│   ├── images/                   # Screenshots de proyectos
│   ├── icons/                    # Iconos de herramientas, certificados, etc.
│   └── docs/                     # Archivos adjuntos (PDFs, CSVs)
│
└── .gitignore                    # Excluye .env, venv, credenciales
```

---

## 🧠 ARQUITECTURA Y PATRONES

### **1. Patrón MVC Simplificado (Frontend)**

**Problema resuelto:** Separar la experiencia profesional del código HTML para facilitar actualizaciones.

- **Modelo (`data/experience.json`):** Datos estructurados por "Áreas de Negocio" (BI & Finanzas, Mejora Continua, etc.).
- **Vista (`index.html`):** HTML skeleton que recibe el contenido dinámicamente.
- **Controlador (`js/experience-loader.js`):** Fetch del JSON, construcción del DOM y renderizado.

**Ventajas:**
- Actualizar experiencia = editar un JSON (sin tocar código).
- Escalable: agregar nuevas áreas o roles es trivial.
- Reutilizable: el mismo patrón se usa para proyectos (`projects.json`).

---

### **2. Automatización con IA (Backend)**

**Problema resuelto:** Generar perfiles profesionales personalizados para diferentes roles (ej: Data Scientist, BI Manager) sin escribir manualmente cada versión.

**Componentes:**

1. **API REST (FastAPI):**
   - Endpoint protegido: `/generate-cv-summary`
   - Autenticación simple vía header `x-access-token`
   - CORS habilitado para llamadas desde navegador

2. **Integración con Google Gemini:**
   - Recibe la experiencia JSON del usuario.
   - Construye un prompt estructurado con instrucciones precisas.
   - Devuelve un párrafo de 3-4 líneas orientado a resultados.

3. **Herramienta Admin (`cv-generator.html`):**
   - Interfaz web simple para interactuar con el backend.
   - Ingresa rol objetivo y contraseña.
   - Genera y copia el texto automáticamente.

**Flujo:**
```
Usuario (cv-generator.html) 
    ↓
    Fetch experience.json
    ↓
    POST /generate-cv-summary (+ Access Token)
    ↓
Backend (main.py) → Google Gemini API
    ↓
    Respuesta: Perfil profesional generado
    ↓
Usuario copia texto y lo usa
```

**Seguridad:**
- Credenciales (`GENAI_API_KEY`, `ACCESS_TOKEN`) en `.env` local.
- `.env` excluido del repositorio vía `.gitignore`.
- En producción: variables de entorno en plataforma cloud (Render, Railway, etc.).

---

## 🎨 CARACTERÍSTICAS DEL FRONTEND

### **Diseño y UX**

- **Tema claro** con variables CSS personalizables (`--accent-primary`, `--bg-card`, etc.)
- **Sticky contact bar** que aparece al hacer scroll
- **Carrusel infinito de habilidades** con drag, wheel scroll y navegación por teclado
- **Overlays modales** para proyectos y certificaciones
- **Cards interactivas** con hover effects y micro-animaciones
- **Responsive design** con breakpoints para mobile, tablet y desktop

### **Secciones principales**

1. **Header:** Nombre, título, links de contacto (teléfono, email, GitHub, LinkedIn)
2. **Experiencia Profesional:** Cargada dinámicamente desde `experience.json`
3. **Perfil Profesional:** Summary estático (puede reemplazarse con salida de IA)
4. **Habilidades:** Carrusel con 8 skills principales + grid secundario
5. **Proyectos:** Organizados por áreas (Finanzas, Logística, IT, etc.) en overlay
6. **Certificaciones:** Timeline con Google Career Certificates, FundaTEC, Data Grow Up
7. **Recomendaciones:** Chips compactos con contacto directo (teléfono/email)

### **Interactividad**

- **Modales de contacto:** Al hacer clic en iconos, muestra slide-in con información copiable
- **Expandibles:** Los proyectos y certificaciones se expanden al hacer clic
- **Skeleton loading:** Muestra placeholders mientras carga la experiencia
- **Accesibilidad:** ARIA labels, roles, navegación por teclado

---

## 🚀 FLUJO DE USO

### **Para actualizar contenido (sin código):**

1. Abrir `data/experience.json`
2. Agregar/editar áreas o roles
3. Guardar y refrescar el sitio → Cambios reflejados automáticamente

### **Para generar perfil con IA:**

1. Iniciar backend: `uvicorn main:app --reload`
2. Abrir `cv-generator.html` en el navegador
3. Ingresar rol objetivo (ej: "Data Engineer")
4. Ingresar contraseña del `.env`
5. Copiar resultado generado por Gemini

---

## 📊 DATOS CLAVE

### **Experiencia (experience.json)**

**Estructura:**
```json
{
  "areas": [
    {
      "id": "bi_finanzas",
      "title": "Business Intelligence & Finanzas",
      "description": "Transformación de datos en decisiones...",
      "roles": [
        {
          "title": "BI Specialist",
          "company": "Coprodesa",
          "period": "SEP 2024 – Actualidad",
          "achievements": ["Logro 1", "Logro 2", ...]
        }
      ]
    }
  ]
}
```

**Áreas definidas:**
1. **Business Intelligence & Finanzas**
2. **Mejora Continua & Operaciones**

### **Proyectos (projects.json)**

**7 áreas de negocio:**
1. Área Financiera (presupuestos, costos, viáticos)
2. Área Comercial (comisiones)
3. Logística (inventarios)
4. IT (Power BI, SQL, micro-apps)
5. Mejora Continua (KPIs)
6. Ingeniería (proyectos, kilometraje)
7. Telemetría (IoT, medidores)
8. Recursos Humanos (Bitrix24, evaluaciones)

**Cada proyecto incluye:**
- Stack técnico
- Hero image
- Highlights
- Attachments (PDFs, CSVs)
- Gallery de screenshots

---

## 🛠️ TECNOLOGÍAS UTILIZADAS

### **Frontend**
- HTML5 semántico
- CSS3 (variables, flexbox, grid)
- JavaScript (ES6+, async/await, fetch API)
- Fuentes: Inter (body), Poppins (headings)

### **Backend (Opcional)**
- **Python 3.11+**
- **FastAPI** (framework web moderno)
- **Pydantic** (validación de datos)
- **Google Generative AI** (Gemini API)
- **python-dotenv** (gestión de secretos)

### **Despliegue**
- **Frontend:** GitHub Pages (estático, gratuito)
- **Backend:** Render / Railway / Heroku (Python apps)

---

## 🔒 SEGURIDAD

1. **API Key de Gemini:** Almacenada en `.env`, **nunca** en el código
2. **Access Token:** Contraseña simple para proteger el endpoint
3. **CORS:** Configurado para desarrollo (`*`), debe restringirse en producción
4. **`.gitignore`:** Excluye `.env`, `venv/`, `__pycache__/`

---

## 📈 PRÓXIMOS PASOS SUGERIDOS

### **Mejoras Frontend**
- [ ] Sistema de temas (dark mode)
- [ ] Animaciones GSAP para entrada de secciones
- [ ] Filtros en la galería de proyectos (por tecnología)
- [ ] Búsqueda semántica en proyectos

### **Backend**
- [ ] Endpoint para generar CV completo en PDF
- [ ] Versionado de perfiles generados (historial)
- [ ] Analytics: tracking de qué perfiles se generan más
- [ ] Rate limiting para prevenir abuso

### **Integración**
- [ ] Botón "Generar perfil" directamente en `index.html`
- [ ] Preview en tiempo real del perfil generado
- [ ] Sincronización con LinkedIn (importar datos)

---

## 📝 CONCLUSIÓN

Este proyecto demuestra:

✅ **Dominio de arquitectura frontend moderna** (separación de concerns, MVC)  
✅ **Integración con APIs externas** (Gemini AI)  
✅ **Desarrollo full-stack** (Python backend + frontend dinámico)  
✅ **Enfoque en UX/UI** (diseño limpio, responsivo, accesible)  
✅ **Automatización inteligente** (reducción de tareas repetitivas con IA)  
✅ **Buenas prácticas** (gitignore, variables de entorno, documentación)  

Es una herramienta práctica para **destacar en procesos de selección**, mostrando no solo la experiencia profesional, sino también las habilidades técnicas aplicadas en un proyecto real.

---

**Repositorio:** [github.com/kendall-git08/MI-CV](https://github.com/kendall-git08/MI-CV)  
**Demo:** Desplegado en GitHub Pages  
**Contacto:** kendalljimenez8@gmail.com
