import math

def distancia(p1, p2):
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def forca_bruta(pontos):
    min_d = float('inf')
    par_minimo = None
    tamanho = len(pontos)
    
    for i in range(tamanho):
        for j in range(i + 1, tamanho):
            d = distancia(pontos[i], pontos[j])
            if d < min_d:
                min_d = d
                par_minimo = (pontos[i], pontos[j])
                
    return min_d, par_minimo

def faixa_mais_proxima(faixa, d_min_atual, par_atual):
    min_d = d_min_atual
    par = par_atual

    faixa.sort(key=lambda p: p[1])
    tamanho = len(faixa)
    
    for i in range(tamanho):

        for j in range(i + 1, tamanho):

            if (faixa[j][1] - faixa[i][1]) >= min_d:
                break
            
            d_atual = distancia(faixa[i], faixa[j])
            if d_atual < min_d:
                min_d = d_atual
                par = (faixa[i], faixa[j])
                
    return min_d, par

def buscar_par_mais_proximo(pontos):
    n = len(pontos)

    if n <= 3:
        return forca_bruta(pontos)

    meio = n // 2
    ponto_central = pontos[meio]

    esq = pontos[:meio]
    dir = pontos[meio:]

    d_esq, par_esq = buscar_par_mais_proximo(esq)
    d_dir, par_dir = buscar_par_mais_proximo(dir)

    if d_esq < d_dir:
        d_min = d_esq
        par_min = par_esq
    else:
        d_min = d_dir
        par_min = par_dir

    faixa = [p for p in pontos if abs(p[0] - ponto_central[0]) < d_min]

    return faixa_mais_proxima(faixa, d_min, par_min)

def calcular_radar(pontos):

    pontos_ordenados_x = sorted(pontos, key=lambda p: p[0])
    distancia_minima, par_de_avioes = buscar_par_mais_proximo(pontos_ordenados_x)
    
    return {
        "distancia": distancia_minima,
        "aviao_1": par_de_avioes[0],
        "aviao_2": par_de_avioes[1]
    }
