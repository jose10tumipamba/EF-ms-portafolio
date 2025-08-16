from typing import List, Tuple


def optimizar(capacidad: int, pesos: List[int], ganancias: List[int]) -> Tuple[int, int, List[int]]:
    """
    Retorna (ganancia_total, peso_total, indices_seleccionados)
    """
    n = len(pesos)
    # DP de (n+1) x (capacidad+1)
    dp = [[0] * (capacidad + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        w = pesos[i - 1]
        v = ganancias[i - 1]
        for c in range(capacidad + 1):
            sin_i = dp[i - 1][c]
            con_i = dp[i - 1][c - w] + v if w <= c else -10**18
            dp[i][c] = max(sin_i, con_i)

    # Backtracking para recuperar selección
    seleccion = []
    c = capacidad
    for i in range(n, 0, -1):
        if dp[i][c] != dp[i - 1][c]:
            # Se tomó el i-ésimo objeto
            seleccion.append(i - 1)
            c -= pesos[i - 1]

    seleccion.reverse()
    ganancia_total = dp[n][capacidad]
    peso_total = sum(pesos[i] for i in seleccion)
    return ganancia_total, peso_total, seleccion
