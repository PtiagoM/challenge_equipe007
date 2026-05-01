///simule inicio e fim de uma sessão de carregamento de um veículo elétrico
///controle basico de energia
///registro de dados da sessão
///aplicar a regra simples de cobrança


// ===== CONFIG =====


function bateriaInicial() {
  return Math.floor(Math.random() * 21) + 10;
}

let bateria = bateriaInicial();
let intervalo = null;
let inicioCarregamento = null;
let bateriaInicio = null;
let emSessao = false;
let energiaSessao = 0;

const PRECO_POR_PERCENTUAL = 0.5;

// ===== TELA =====
function atualizarTela() {
  document.getElementById("bateria").innerText = Math.floor(bateria);
  document.getElementById("barra").style.width = bateria + "%";

  let restante = 100 - bateria;
  let tempoEstimado = (restante / 2).toFixed(1);

  document.getElementById("tempo").innerText = tempoEstimado + " s";
}

// ===== HISTÓRICO =====
function mostrarHistorico() {
  let lista = document.getElementById("historico");
  lista.innerHTML = "";

  let dados = JSON.parse(localStorage.getItem("carregamentos")) || [];

  dados.forEach(item => {
    let li = document.createElement("li");

    let inicio = new Date(item.inicio).toLocaleTimeString();
    let fim = new Date(item.fim).toLocaleTimeString();

    li.innerText = ` ${item.energia}% |  R$ ${item.custo} |  ${Number(item.duracao).toFixed(1)}s | ${inicio} → ${fim}`;

    lista.appendChild(li);
  });
}

function limparHistorico() {
  if (confirm("Tem certeza que deseja apagar o histórico?")) {
    localStorage.removeItem("carregamentos");
    mostrarHistorico();
  }
}

// ===== REGISTRO =====
function registrarCarregamento(inicio, fim, bateriaInicio) {
  let historico = JSON.parse(localStorage.getItem("carregamentos")) || [];

  let energiaCarregada = energiaSessao;
  let custo = energiaCarregada * PRECO_POR_PERCENTUAL;

  historico.push({
    inicio: inicio,
    fim: fim,
    duracao: ((fim - inicio) / 1000).toFixed(1),
    energia: energiaCarregada,
    custo: custo.toFixed(2)
  });

  localStorage.setItem("carregamentos", JSON.stringify(historico));
}

// ===== CONTROLE =====
function iniciar() {
  if (intervalo) return;

  if (!inicioCarregamento) {
    inicioCarregamento = Date.now();
    bateriaInicio = bateria;
    emSessao = true;
  }

  document.getElementById("status").innerText = "Carregando";

  intervalo = setInterval(() => {
//aumenta o carregamento em 5% a cada 200ms, o que equivale a 2% por segundo
    let incremento = Math.min(5, 100 - bateria);
bateria += incremento;
energiaSessao += incremento;


if (bateria >= 100) {
  bateria = 100;

  let fimCarregamento = Date.now();

  let energiaCarregada = energiaSessao; 
  let custo = energiaCarregada * PRECO_POR_PERCENTUAL;

  let historico = JSON.parse(localStorage.getItem("carregamentos")) || [];

  historico.push({
    inicio: inicioCarregamento,
    fim: fimCarregamento,
    duracao: ((fimCarregamento - inicioCarregamento) / 1000).toFixed(1),
    energia: energiaCarregada,
    custo: custo.toFixed(2)
  });

  localStorage.setItem("carregamentos", JSON.stringify(historico));

  mostrarHistorico();

  // reset
  energiaSessao = 0; 
  emSessao = false;
  inicioCarregamento = null;
  bateriaInicio = null;

  bateria = bateriaInicial();
}

    atualizarTela();

  }, 200);
}


function parar() {
  clearInterval(intervalo);
  intervalo = null;
  document.getElementById("status").innerText = "Parado";
}

// ===== INIT =====
atualizarTela();
mostrarHistorico();
