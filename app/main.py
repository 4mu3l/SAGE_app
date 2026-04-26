from fastapi import FastAPI
from database import Base, engine

from src.routes.usuario_route import router as usuario_router
from src.routes.consumo_route import router as consumo_router
from src.routes.dicas_route import router as dicas_router
from src.routes.metas_route import router as metas_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SAGE - App Consumo Sustentável",
    description="API para monitoramento de energia, água e outros."
)

app.include_router(usuario_router)
app.include_router(metas_router)
app.include_router(consumo_router)
app.include_router(dicas_router)


@app.get("/")
def home():
    return {"mensagem": "Servidor SAGE Online!"}