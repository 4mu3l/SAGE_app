import random
from fastapi import APIRouter

router = APIRouter(prefix="/dicas", tags=["Dicas"])

CATALOGO_DICAS = {
    "energia": [
        "Desligue os aparelhos da tomada quando não estiverem em uso. O modo 'standby' também consome energia!",
        "Aproveite a luz natural abrindo janelas e cortinas durante o dia.",
        "Substitua lâmpadas antigas por modelos LED, que são mais eficientes e duram até 25 vezes mais.",
        "Junte o máximo de roupas possível antes de usar a máquina de lavar ou o ferro de passar."
    ],
    "agua": [
        "Feche a torneira ao escovar os dentes. Isso pode economizar até 12 litros de água por minuto!",
        "Verifique vazamentos em casa. Uma torneira pingando desperdiça mais de 40 litros de água por dia.",
        "Tome banhos mais curtos. Reduzir o banho em apenas 5 minutos economiza muita água e energia.",
        "Reaproveite a água da máquina de lavar para lavar o quintal ou o piso da casa."
    ]
}

@router.get("/", tags=["Dicas"])
def dica_aleatoria_geral():
    todas_as_dicas = CATALOGO_DICAS["energia"] + CATALOGO_DICAS["agua"]
    dica_sorteada = random.choice(todas_as_dicas)
    return {"status": "Sucesso", "dica_do_dia": dica_sorteada}

@router.get("/{categoria}", tags=["Dicas"])
def dica_por_categoria(categoria: str):
    categoria_formatada = categoria.lower()

    if categoria_formatada in CATALOGO_DICAS:
        dica_sorteada = random.choice(CATALOGO_DICAS[categoria_formatada])
        return {"status": "Sucesso", "categoria": categoria_formatada, "dica": dica_sorteada}

    return {"status": "Erro", "mensagem": "Categoria inválida. Use: energia, agua ou materiais."}
