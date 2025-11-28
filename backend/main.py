from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Cargar variables de entorno (crear archivo .env localmente)
load_dotenv()

app = FastAPI()

# Configurar CORS para permitir peticiones desde el navegador
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, restringe esto a tu dominio real
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de Gemini
GENAI_API_KEY = os.getenv("GENAI_API_KEY")
ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")  # Tu contraseña simple para proteger el endpoint

if GENAI_API_KEY:
    genai.configure(api_key=GENAI_API_KEY)

# Modelos de datos (coinciden con tu experience.json)
class Role(BaseModel):
    title: str
    company: str
    period: str
    achievements: List[str]

class Area(BaseModel):
    id: str
    title: str
    description: str
    roles: List[Role]

class ExperienceData(BaseModel):
    areas: List[Area]

class CVRequest(BaseModel):
    experience: ExperienceData
    target_role: Optional[str] = "Data Analyst" # Para personalizar el CV

@app.get("/")
def read_root():
    return {"status": "online", "service": "CV Generator API"}

@app.post("/generate-cv-summary")
async def generate_cv_summary(request: CVRequest, x_access_token: str = Header(None)):
    """
    Genera un resumen profesional optimizado usando Gemini basado en la experiencia JSON.
    Protegido por un token simple.
    """
    # 1. Seguridad básica
    if x_access_token != ACCESS_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid Access Token")

    if not GENAI_API_KEY:
        raise HTTPException(status_code=500, detail="Server Error: Gemini API Key not configured")

    # 2. Construir el prompt para Gemini
    experience_text = ""
    for area in request.experience.areas:
        experience_text += f"\nÁREA: {area.title} ({area.description})\n"
        for role in area.roles:
            experience_text += f"- Rol: {role.title} en {role.company} ({role.period})\n"
            experience_text += "  Logros:\n"
            for achievement in role.achievements:
                experience_text += f"    * {achievement}\n"

    prompt = f"""
    Actúa como un experto reclutador de tecnología y redactor de CVs.
    
    Tengo la siguiente experiencia profesional segmentada por áreas:
    {experience_text}
    
    OBJETIVO: Generar un "Perfil Profesional" (Summary) para un CV enfocado al rol de: {request.target_role}.
    
    INSTRUCCIONES:
    1. Escribe un párrafo de 3-4 líneas potente y directo.
    2. Destaca las habilidades técnicas y de negocio mencionadas en los logros.
    3. Usa un tono profesional, orientado a resultados.
    4. No inventes información, usa solo lo provisto.
    5. Retorna SOLO el texto del perfil, sin introducciones ni markdown.
    """

    try:
        # 3. Llamar a Gemini
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        return {"generated_profile": response.text}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Para correr localmente: uvicorn main:app --reload
