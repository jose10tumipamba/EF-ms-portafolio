from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import OptRequest, OptResponse
from app.optimizer import optimizar

app = FastAPI(
    title="Portafolio de Proyectos",
    version="1.0.0",
    description="Microservicio.",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # para permitir peticiones de cualquier origen
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Creamos el endpoint solicitado
@app.post("/optimizar", response_model=OptResponse)
def post_optimizar(req: OptRequest):
    if req.capacidad < 0:
        raise HTTPException(status_code=400, detail="capacidad debe ser >= 0")
    if len(req.objetos) == 0:
        raise HTTPException(status_code=400, detail="lista de objetos vacía")

    pesos = [o.peso for o in req.objetos]
    ganancias = [o.ganancia for o in req.objetos]

    # Eficiencia básica: si capacidad es enorme, rechazamos para evitar O(n*capacidad) gigante
    if req.capacidad > 200_000:
        raise HTTPException(status_code=413, detail="capacidad demasiado grande para DP")

    ganancia_total, peso_total, idxs = optimizar(req.capacidad, pesos, ganancias)
    seleccionados = [req.objetos[i].nombre for i in idxs]
    return OptResponse(seleccionados=seleccionados, ganancia_total=ganancia_total, peso_total=peso_total)
