const canvas = document.getElementById('radarCanvas');
const ctx = canvas.getContext('2d');

let pontos = [];
let parMaisProximo = null;

function desenharRadar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centroX = canvas.width / 2;
    const centroY = canvas.height / 2;

    ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.lineWidth = 1;
    for (let r = 50; r < canvas.width / 2; r += 70) {
        ctx.beginPath();
        ctx.arc(centroX, centroY, r, 0, 2 * Math.PI);
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(0, centroY); ctx.lineTo(canvas.width, centroY);
    ctx.moveTo(centroX, 0); ctx.lineTo(centroX, canvas.height);
    ctx.stroke();

    pontos.forEach(p => {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });

    if (parMaisProximo) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(parMaisProximo.aviao_1.x, parMaisProximo.aviao_1.y);
        ctx.lineTo(parMaisProximo.aviao_2.x, parMaisProximo.aviao_2.y);
        ctx.stroke();

        [parMaisProximo.aviao_1, parMaisProximo.aviao_2].forEach(p => {
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
}

function enviarParaOBackend() {
    if (pontos.length < 2) {
        parMaisProximo = null;
        atualizarPainelAlerta(null);
        desenharRadar();
        return;
    }

    fetch('/calcular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pontos: pontos })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(data.error);
            return;
        }
        parMaisProximo = data;
        atualizarPainelAlerta(data);
        desenharRadar();
    })
    .catch(err => console.error("Erro na comunicação com o servidor:", err));
}

function atualizarPainelAlerta(data) {
    const painel = document.getElementById('painelAlerta');
    const textoStatus = document.getElementById('textoStatus');
    const dadosConflito = document.getElementById('dadosConflito');

    if (!data) {
        painel.className = "alerta status-normal";
        textoStatus.innerText = pontos.length === 1 ? "Adicione mais um avião." : "Aguardando aviões...";
        dadosConflito.classList.add('escondido');
        return;
    }

    painel.className = "alerta status-perigo";
    textoStatus.innerHTML = "⚠️ <strong>ALERTA DE COLISÃO IMINENTE!</strong>";
    
    document.getElementById('valDistancia').innerText = data.distancia.toFixed(2);
    document.getElementById('a1x').innerText = data.aviao_1.x.toFixed(0);
    document.getElementById('a1y').innerText = data.aviao_1.y.toFixed(0);
    document.getElementById('a2x').innerText = data.aviao_2.x.toFixed(0);
    document.getElementById('a2y').innerText = data.aviao_2.y.toFixed(0);
    
    dadosConflito.classList.remove('escondido');
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    pontos.push({ x: x, y: y });
    enviarParaOBackend();
});

document.getElementById('btnAdicionar').addEventListener('click', () => {
    for (let i = 0; i < 50; i++) {
        pontos.push({
            x: Math.random() * (canvas.width - 20) + 10,
            y: Math.random() * (canvas.height - 20) + 10
        });
    }
    enviarParaOBackend();
});

document.getElementById('btnLimpar').addEventListener('click', () => {
    pontos = [];
    parMaisProximo = null;
    enviarParaOBackend();
});

desenharRadar();