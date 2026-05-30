from flask import Flask, render_template, request, jsonify
from algoritmo import calcular_radar

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calcular', methods=['POST'])
def calcular():
    data = request.get_json()

    if not data or 'pontos' not in data:
        return jsonify({"error": "Dados inválidos"}), 400
        
    pontos = data['pontos']

    if len(pontos) < 2:
        return jsonify({"error": "São necessários pelo menos 2 aviões no radar"}), 400
        
    try:

        lista_pontos = [(float(p['x']), float(p['y'])) for p in pontos]
        resultado = calcular_radar(lista_pontos)

        resposta = {
            "distancia": resultado["distancia"],
            "aviao_1": {"x": resultado["aviao_1"][0], "y": resultado["aviao_1"][1]},
            "aviao_2": {"x": resultado["aviao_2"][0], "y": resultado["aviao_2"][1]}
        }
        return jsonify(resposta)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)