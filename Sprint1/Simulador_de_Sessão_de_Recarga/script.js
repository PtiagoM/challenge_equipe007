// ============================================================
//  Utilitários
// ============================================================

function atualizarTexto(id, valor) {
    const el = document.getElementById(id);
    if (el) el.innerText = valor;
}

function atualizarHTML(id, icone, texto) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `<i data-lucide="${icone}"></i> ${texto}`;
    lucide.createIcons();
}

function chamarBotao(idBotao, evento, funcao) {
    const botao = document.getElementById(idBotao);
    if (botao) botao.addEventListener(evento, funcao);
}

function pegarHorarioAtual() {
    const agora = new Date();
    const horas   = String(agora.getHours()).padStart(2, "0");
    const minutos = String(agora.getMinutes()).padStart(2, "0");
    const segundos = String(agora.getSeconds()).padStart(2, "0");
    return `${horas}:${minutos}:${segundos}`;
}

// ============================================================
//  Página de índice — salva dados do formulário
// ============================================================

const formRecarga = document.getElementById("form-recarga");

if (formRecarga) {
    formRecarga.addEventListener("submit", function (e) {
        e.preventDefault(); // impede o envio padrão

        // Lê os valores do formulário
        const dadosSessao = {
            nome:              document.getElementById("nome").value.trim(),
            tipo_usuario:      document.getElementById("tipo_usuario").value,
            capacidade_bateria: parseFloat(document.getElementById("capacidade_bateria").value),
            bateria_inicial:   parseFloat(document.getElementById("bateria_inicial").value),
            bateria_desejada:  parseFloat(document.getElementById("bateria_desejada").value),
            origem_energia:    document.getElementById("origem_energia").value,
        };

        // Validação extra: bateria inicial < bateria desejada
        if (dadosSessao.bateria_inicial >= dadosSessao.bateria_desejada) {
            alert("A bateria inicial deve ser menor que a bateria desejada.");
            return;
        }

        // Salva no sessionStorage e redireciona
        sessionStorage.setItem("dadosSessao", JSON.stringify(dadosSessao));
        window.location.href = "recarga.html";
    });
}

// ============================================================
//  Página de recarga — simulação
// ============================================================

// Só roda se os elementos da página de recarga existirem
if (document.getElementById("porcentagem-bateria")) {

    // --- Carrega dados salvos pelo formulário ---
    const dadosSessao = JSON.parse(sessionStorage.getItem("dadosSessao")) || null;

    // Dados do usuário
    const nomeUsuario       = dadosSessao?.nome              || "Usuário";
    const tipoUsuario       = dadosSessao?.tipo_usuario      || "comum";
    const capacidadeBateria = dadosSessao?.capacidade_bateria || 60;
    const bateriaDesejada   = dadosSessao?.bateria_desejada  || 100;
    const origemEnergia     = dadosSessao?.origem_energia    || "rede";

    // Bateria inicial: usa o valor do formulário, ou aleatório se não houver
    let energiaInicial = dadosSessao
        ? dadosSessao.bateria_inicial
        : Math.floor(Math.random() * 26);

    // Preenche campos estáticos do relatório com dados do formulário
    atualizarTexto("relatorio-nome", nomeUsuario);
    atualizarTexto("relatorio-tipo-usuario",
        tipoUsuario === "assinante" ? "Assinante GOODWE+" :
        tipoUsuario === "corporativo" ? "Corporativo" : "Comum");
    atualizarTexto("relatorio-capacidade-bateria", capacidadeBateria + " kWh");
    atualizarTexto("relatorio-bateria-desejada", bateriaDesejada + "%");
    atualizarTexto("relatorio-origem-energia",
        origemEnergia === "fotovoltaica" ? "Energia fotovoltaica" : "Rede elétrica");

    // Preenche estado inicial da bateria na tela
    atualizarTexto("relatorio-bateria-inicial", energiaInicial + "%");
    atualizarTexto("porcentagem-bateria", energiaInicial + "%");

    // --- Variáveis de controle da sessão ---
    let carregando        = null;
    let animacaoCarregando = null;
    let pontosAnimacao    = 0;
    let tempoDeRecarga    = 0;
    let horarioInicioSessao = "";
    let horarioFimSessao    = "";
    let bateriaInicialSessao = energiaInicial;

    // --- Tarifa por tipo de usuário ---
    // Assinante tem 15% de desconto; corporativo, 10%
    const tarifaBase = 1.80; // R$/kWh
    const descontos = { assinante: 0.15, corporativo: 0.10, comum: 0 };
    const desconto  = descontos[tipoUsuario] || 0;
    const tarifaFinal = tarifaBase * (1 - desconto);

    // Mostra tarifa no relatório
    atualizarTexto("tarifa-base", `R$ ${tarifaFinal.toFixed(2)}/kWh`);
    atualizarTexto("tipo-tarifa",
        tipoUsuario === "assinante" ? `Com desconto (${(desconto * 100).toFixed(0)}%)` :
        tipoUsuario === "corporativo" ? `Corporativo (${(desconto * 100).toFixed(0)}% off)` :
        "Horário normal");
    atualizarTexto("desconto-cobranca",
        desconto > 0 ? `-${(desconto * 100).toFixed(0)}%` : "R$ 0,00");

    // --------------------------------------------------------
    //  Funções auxiliares
    // --------------------------------------------------------

    function carregandoNull() {
        clearInterval(carregando);
        clearInterval(animacaoCarregando);
        carregando = null;
    }

    function atualizarIcones() {
        lucide.createIcons();
    }

    function animarCarregando() {
        clearInterval(animacaoCarregando);
        animacaoCarregando = setInterval(() => {
            pontosAnimacao = (pontosAnimacao % 3) + 1;
            const textoPontos = ".".repeat(pontosAnimacao).padEnd(3, "\u00A0");
            // Atualiza apenas o texto, preservando o ícone existente
            const el = document.getElementById("status-carregamento");
            if (el) {
                el.innerHTML = `<i data-lucide="battery-charging"></i> Carregando${textoPontos}`;
                lucide.createIcons();
            }
        }, 700);
    }

    function atualizarBarraProgresso() {
        const barra = document.getElementById("barra-progresso");
        if (barra) {
            barra.style.width = energiaInicial + "%";
            barra.style.transition = "width 1s ease";
        }
    }

    function atualizarkWh() {
        const energiaCarregada = energiaInicial - bateriaInicialSessao;
        const kWhCarregados = energiaCarregada * (capacidadeBateria / 100);
        atualizarHTML("energia-entregue", "zap", `${kWhCarregados.toFixed(2)} kWh`);
    }

    function atualizarTempo() {
        tempoDeRecarga += 1;
        const horas   = String(Math.floor(tempoDeRecarga / 3600)).padStart(2, "0");
        const minutos = String(Math.floor((tempoDeRecarga % 3600) / 60)).padStart(2, "0");
        const segundos = String(tempoDeRecarga % 60).padStart(2, "0");
        const tempoFormatado = `${horas}:${minutos}:${segundos}`;
        atualizarTexto("tempo-decorrido", tempoFormatado);
        atualizarTexto("relatorio-tempo-total", tempoFormatado);
    }

    function custoPelaRecarga() {
        const energiaCarregada = energiaInicial - bateriaInicialSessao;
        const kWhCarregados    = energiaCarregada * (capacidadeBateria / 100);
        const custoTotal       = kWhCarregados * tarifaFinal;
        atualizarTexto("custo-estimado", `R$ ${custoTotal.toFixed(2)}`);
        atualizarTexto("total-cobranca",    `R$ ${custoTotal.toFixed(2)}`);
        atualizarTexto("subtotal-cobranca", `R$ ${custoTotal.toFixed(2)}`);
    }

    // --------------------------------------------------------
    //  Iniciar recarga
    // --------------------------------------------------------

    function iniciarRecarga() {
        if (carregando) return; // já está rodando

        // Registra horário de início apenas uma vez
        if (horarioInicioSessao === "") {
            horarioInicioSessao = pegarHorarioAtual();
            atualizarTexto("horario-inicio", horarioInicioSessao);
            atualizarTexto("relatorio-inicio", horarioInicioSessao);
        }

        animarCarregando();

        carregando = setInterval(() => {
            if (energiaInicial < bateriaDesejada) {
                energiaInicial = Math.min(energiaInicial + 5, bateriaDesejada);

                atualizarHTML("btn-continuar-sessao", "play", "Carregando");
                atualizarHTML("btn-pausar-sessao", "pause", "Pausar");
                atualizarTexto("porcentagem-bateria", energiaInicial + "%");

                atualizarkWh();
                atualizarTempo();
                atualizarBarraProgresso();
                custoPelaRecarga();

            } else {
                carregandoNull();
                finalizarRecarga();
            }
        }, 1000);
    }

    chamarBotao("btn-continuar-sessao", "click", iniciarRecarga);

    // --------------------------------------------------------
    //  Pausar / retomar
    // --------------------------------------------------------

    function pararRecarga() {
        if (carregando) {
            carregandoNull();
            atualizarHTML("btn-pausar-sessao",   "pause", "Pausado");
            atualizarHTML("btn-continuar-sessao", "play",  "Continuar");
        } else {
            iniciarRecarga();
        }
    }

    chamarBotao("btn-pausar-sessao", "click", pararRecarga);

    // --------------------------------------------------------
    //  Finalizar recarga
    // --------------------------------------------------------

    function finalizarRecarga() {
        if (energiaInicial < bateriaDesejada) {
            console.log("A recarga ainda não foi finalizada.");
            return;
        }
 
        horarioFimSessao = pegarHorarioAtual();
        atualizarTexto("horario-fim",    horarioFimSessao);
        atualizarTexto("relatorio-fim",  horarioFimSessao);
        atualizarTexto("relatorio-bateria-final", energiaInicial + "%");
        atualizarTexto("relatorio-status", "Concluída");
 
        // Energia consumida (kWh)
        const elEnergiaEntregue = document.getElementById("energia-entregue");
        if (elEnergiaEntregue) {
            atualizarTexto("relatorio-energia-consumida", elEnergiaEntregue.innerText);
        }
 
        // Mostra relatório e esconde botões de sessão
        const relatorio = document.getElementById("relatorio-sessao");
        if (relatorio) relatorio.removeAttribute("hidden");
 
        const btnContinuar = document.getElementById("btn-continuar-sessao");
        const btnPausar    = document.getElementById("btn-pausar-sessao");
        if (btnContinuar) btnContinuar.style.display = "none";
        if (btnPausar)    btnPausar.style.display    = "none";
 
        carregandoNull();
 
        // Atualiza status visual
        atualizarHTML("status-carregamento", "check-circle", "Recarga completa");
 
        // Salva no histórico (localStorage persiste entre sessões)
        const relatorioSessao = {
            nome:             nomeUsuario,
            tipoUsuario,
            capacidadeBateria,
            bateriaInicial:   bateriaInicialSessao + "%",
            bateriaFinal:     energiaInicial + "%",
            tempoTotal:       document.getElementById("relatorio-tempo-total")?.innerText,
            energiaConsumida: document.getElementById("energia-entregue")?.innerText,
            custoTotal:       document.getElementById("total-cobranca")?.innerText,
            horarioInicio:    horarioInicioSessao,
            horarioFim:       horarioFimSessao,
            data:             new Date().toLocaleDateString("pt-BR"),
        };
 
        const historicoRecargas = JSON.parse(localStorage.getItem("historicoRecargas")) || [];
        historicoRecargas.push(relatorioSessao);
        localStorage.setItem("historicoRecargas", JSON.stringify(historicoRecargas));
 
        // ── Exibe histórico completo no console ──────────────────────
        console.clear();
        console.log("%c GOODWE — Histórico de Recargas", "font-size:16px;font-weight:bold;color:#E60012");
        console.log("%c" + historicoRecargas.length + " sessão(ões) registrada(s)\n", "color:#6B7280");
 
        historicoRecargas.forEach((sessao, i) => {
            console.groupCollapsed(
                "%c Sessão #" + (i + 1) + " — " + (sessao.nome || "Usuário") + "  |  " + (sessao.data || ""),
                "font-weight:bold;color:#111827"
            );
            console.log("%cUsuário",        "color:#6B7280;font-weight:bold", sessao.nome);
            console.log("%cTipo",           "color:#6B7280;font-weight:bold", sessao.tipoUsuario);
            console.log("%cCapacidade",     "color:#6B7280;font-weight:bold", sessao.capacidadeBateria + " kWh");
            console.log("%cBateria inicial","color:#6B7280;font-weight:bold", sessao.bateriaInicial);
            console.log("%cBateria final",  "color:#6B7280;font-weight:bold", sessao.bateriaFinal);
            console.log("%cEnergia entregue","color:#6B7280;font-weight:bold", sessao.energiaConsumida);
            console.log("%cTempo total",    "color:#6B7280;font-weight:bold", sessao.tempoTotal);
            console.log("%cInício",         "color:#6B7280;font-weight:bold", sessao.horarioInicio);
            console.log("%cFim",            "color:#6B7280;font-weight:bold", sessao.horarioFim);
            console.log("%cCusto total",    "color:#E60012;font-weight:bold", sessao.custoTotal);
            console.groupEnd();
        });
 
        console.log("\n%c Objeto completo do histórico:", "color:#6B7280");
        console.table(historicoRecargas);
    }
    chamarBotao("btn-finalizar-sessao", "click", finalizarRecarga);

    // --------------------------------------------------------
    //  Reiniciar sessão (botão "Voltar ao início")
    // --------------------------------------------------------

    function reiniciarSessao() {
        // Limpa dados da sessão atual e volta ao formulário
        sessionStorage.removeItem("dadosSessao");
        window.location.href = "index.html";
    }
    chamarBotao("btn-voltar-inicio", "click", reiniciarSessao);

    // --------------------------------------------------------
    //  Estado inicial da barra de progresso
    // --------------------------------------------------------
    atualizarBarraProgresso();
} // fim do bloco da página de recarga