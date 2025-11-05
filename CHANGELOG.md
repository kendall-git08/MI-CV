# Registro de Cambios - Portfolio Web

## [v2.0.0] - 4 de Noviembre, 2025

### 🎯 Reestructuración Completa del Proyecto

#### Reorganización de Archivos
- ✅ Migración de estructura anidada `CURRICULUM/portfolio-app/` a la raíz del proyecto
- ✅ Creación de estructura de carpetas profesional siguiendo estándares web
- ✅ Organización de assets en categorías lógicas:
  - `assets/images/` - Imágenes de proyectos y contenido
  - `assets/icons/certificates/` - Iconos de certificaciones
  - `assets/icons/tools/` - Iconos de herramientas técnicas
  - `assets/icons/social/` - Iconos de redes sociales
- ✅ Eliminación de carpetas antiguas con nombres en español y espacios

#### Actualización de Rutas
- ✅ Actualización de todas las rutas de imágenes en `index.html`
- ✅ Actualización de rutas de iconos en `skills-grid.js`
- ✅ Corrección de referencias en header y sticky bar
- ✅ Actualización de rutas en sección de proyectos

### 📚 Mejoras en Certificaciones

#### Contenido Actualizado
- ✅ **Licenciatura en Ingeniería Industrial**
  - Agregado período: 2019 - Actualidad
  - Descripción mejorada con detalles de competencias
  
- ✅ **Business Analytics con ML e IA**
  - Agregadas 160 horas de duración
  - Descripción técnica detallada con tecnologías específicas
  - Énfasis en Python, regresión, árboles de decisión, Random Forest
  
- ✅ **Especialidad en BI con Power BI**
  - Descripción ampliada incluyendo DAX, Dataflows, optimización
  - Año de obtención: 2023
  
- ✅ **SQL para Análisis de Datos**
  - Descripción mejorada con técnicas avanzadas
  - Agregados: funciones de ventana, optimización de queries
  - Año: 2023
  
- ✅ **Google Cloud Data Analytics**
  - Descripción expandida con herramientas específicas
  - Agregados: BigQuery, Looker Studio, Data Studio
  - Año: 2024
  
- ✅ **No-Code Apps with AppSheet**
  - Descripción mejorada con casos de uso empresariales
  - Año: 2024

#### Nuevas Secciones
- ✅ **Competencia en Idiomas**
  - Nueva tarjeta para Inglés B2
  - Descripción de capacidades profesionales en inglés técnico

### 🎨 Mejoras de Presentación
- ✅ Formato consistente con meta información (institución • año)
- ✅ Descripciones más técnicas y profesionales
- ✅ Énfasis en habilidades prácticas mediante **negritas**
- ✅ Agrupación lógica: Educación Formal → Certificaciones Profesionales → Cloud & Automatización → Idiomas

### 📂 Estructura Final

```
Portafolio_web/
├── index.html
├── README.md
├── CHANGELOG.md
├── css/
│   ├── styles.css
│   └── light-theme.css
├── js/
│   ├── main.js
│   ├── skills-carousel.js
│   ├── skills-grid.js
│   └── slidepanel.js
└── assets/
    ├── images/          (20 archivos de proyectos)
    └── icons/
        ├── certificates/ (7 archivos)
        ├── tools/       (7 archivos)
        └── social/      (4 archivos)
```

### 🔧 Archivos Modificados
1. `index.html` - Actualización completa de rutas y contenido de certificaciones
2. `js/skills-grid.js` - Actualización de rutas de iconos
3. `README.md` - Nueva documentación de estructura del proyecto

### ✨ Beneficios
- ✅ Estructura más profesional y escalable
- ✅ Nombres de archivos sin espacios ni caracteres especiales
- ✅ Compatibilidad mejorada con hosting y sistemas de archivos
- ✅ Más fácil de mantener y navegar
- ✅ Información de certificaciones más detallada y profesional
- ✅ Mejor presentación para reclutadores y clientes potenciales
