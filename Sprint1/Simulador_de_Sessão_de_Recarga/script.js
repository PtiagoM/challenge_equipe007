///Construir um programa que simule:

//	Início e fim de sessão de recarga
//	Controle básico de energia
//	Registro de dados da sessão
//  Aplicação de regras simples de cobrança

//strings principais abaixo
let energiaInicial = Math.floor(Math.random() * 26);                                        // escolhe um numero aleatorio de 0 a 26

atualizarTexto("relatorio-bateria-inicial", energiaInicial + "%");      // pega o numero aleatorio e adiciona no relatorio final

atualizarTexto("porcentagem-bateria", energiaInicial + "%");            // pega o numero aleatorio e adiciona no status da bateria


let carregando;                                                                             // variável para controlar o intervalo da recarga, usada para iniciar e parar a recarga
let energiaFinal = 100;                                                                     // valor fixo para simular a recarga completa, pode ser ajustado conforme necessário

let bateriaInicialSessao = energiaInicial;                                                  // para armazenar o valor inicial da bateria no início da sessão, usado para calcular a energia carregada durante a sessão

let custoPorCarregamento = 0.57;                                                            // valor fictício, pode ser ajustado conforme necessário

let energiaEntregue = 18.6;                                                                 // valor fictício, pode ser ajustado conforme necessário

let animacaoCarregando;                                                                     // variável para controlar a animação de carregamento

let pontosAnimacao = 0;                                                                     // para criar uma animação de pontos que aparecem e desaparecem durante o carregamento

let tempoDeRecarga = 0;                                                                     // tempo em segundos para calcular o tempo decorrido da recarga

let horarioInicioSessao = "";                                                               // para armazenar o horário de início da sessão de recarga

let horarioFimSessao = "";                                                                  // para armazenar o horário de fim da sessão de recarga



//função para limpar os intervalos de recarga e animação, usada para pausar e finalizar a recarga
function carregandoNull() {

    clearInterval(carregando);                                                              // para parar a recarga

    clearInterval(animacaoCarregando);                                                      // para parar a animação de carregamento

    carregando = null;                                                                      // para indicar que a recarga não está ativa
}



function atualizarIcones() {
    lucide.createIcons();                                                                   // atualiza os ícones do Lucide, usada para garantir que os ícones sejam exibidos corretamente após mudanças no status da recarga
}



function atualizarTexto(id, valor) {
    document.getElementById(id).innerText = valor;
}



function atualizarHTML(id, icone, texto) {

    document.getElementById(id).innerHTML =
    `
    <i data-lucide="${icone}"></i>
    ${texto}
    `;

    lucide.createIcons();
}



//um comando universal, para nao repetir em certas partes
//ele chama um id do html e adiciona no javascript
function chamarBotao(idBotao, evento, funcao) {

    let botao = document.getElementById(idBotao);                                           // pega o elemento do botão pelo id

    botao.addEventListener(evento, funcao);                                                 // adiciona um ouvinte de evento ao botão, que executa a função quando o evento ocorre
}



//função para pegar o horário atual formatado como HH:MM:SS, usada para registrar o início e fim da sessão de recarga
function pegarHorarioAtual() {

    let agora = new Date();                                                                 // cria um objeto Date com a data e hora atuais

// formata o horário para HH:MM:SS, adicionando zero à esquerda
    let horas = String(agora.getHours()).padStart(2, "0");              
    let minutos = String(agora.getMinutes()).padStart(2, "0");
    let segundos = String(agora.getSeconds()).padStart(2, "0");

    return `${horas}:${minutos}:${segundos}`;                                               // retorna o horário formatado como uma string
}



//função para animar o status de carregamento
function animarCarregando() {

    clearInterval(animacaoCarregando);                                                      // para garantir que não haja múltiplas animações rodando ao mesmo tempo

    animacaoCarregando = setInterval(() => {                                                // a cada 700ms, atualiza o status de carregamento para criar a animação
       
        pontosAnimacao++;

        if (pontosAnimacao > 3) {                                                           // reseta a animação após 3 pontos
            pontosAnimacao = 0;                                                             // quantos ponto aparecem na animação antes de resetar
        }

        let textoPontos = ".".repeat(pontosAnimacao).padEnd(3, "\u00A0");                   // cria uma string com pontos e espaços para manter o layout consistente durante a animação


        // status da bateria
        atualizarTexto("status-carregamento", "", `Carregando${textoPontos}`);
                                                                 

    }, 700);                                                                                // 700ms para atualizar a animação, pode ser ajustado conforme necessário
}



//visual da barra de progresso, atualiza conforme a energia aumenta
function atualizarBarraProgresso() {

    let barra = document.getElementById("barra-progresso");                                 // pega o elemento da barra de progresso pelo id

    barra.style.width = energiaInicial + "%";                                               // cria o efeito da barra enchendo conforme a energia aumenta

    barra.style.transition = "width 1s ease";                                               // deixa a barra suave
}



//função para atualizar a quantidade de kWh carregados
function atualizarkWh() {

    let energiaCarregada = energiaInicial - bateriaInicialSessao;                           // calcula a energia carregada subtraindo o valor inicial da bateria do valor atual

    let kWhCarregados = energiaCarregada * 0.02 * 37;                                       // converte a porcentagem de energia carregada em kWh, considerando que cada 1% corresponde a 0.02 kWh e o custo por kWh é de 37 reais 

    atualizarHTML("energia-entregue", "card-dado", `${kWhCarregados.toFixed(2)} kWh`);      // atualiza o valor de kWh entregues na tela, formatado com 2 casas decimais
}



//função para atualizar o tempo decorrido da recarga, convertendo o tempo em segundos para um formato de horas, minutos e segundos
function atualizarTempo() {

    tempoDeRecarga += 1;                                                                    // incrementa o tempo de recarga em 1 segundo a cada chamada da função, usada para calcular o tempo decorrido da recarga

    // cálculos
    let horas = Math.floor(tempoDeRecarga / 3600);                                          // calcula o número de horas dividindo o tempo total em segundos por 3600 e arredondando para baixo

    let minutos = Math.floor((tempoDeRecarga % 3600) / 60);                                 // calcula o número de minutos pegando o restante da divisão do tempo total por 3600 e dividindo por 60, arredondando para baixo

    let segundos = tempoDeRecarga % 60;                                                     // calcula o número de segundos pegando o restante da divisão do tempo total por 60

    // adiciona zero à esquerda
    horas = String(horas).padStart(2, "0");
    minutos = String(minutos).padStart(2, "0");
    segundos = String(segundos).padStart(2, "0");

    let tempoFormatado = `${horas}:${minutos}:${segundos}`;                                 // formata o tempo em horas, minutos e segundos

    // atualiza na tela
    atualizarTexto("tempo-decorrido", tempoFormatado);

    // atualiza no relatório
    atualizarTexto("relatorio-tempo-total", tempoFormatado);
}



//função para calcular o custo da recarga
function custoPelaRecarga() {

    let energiaCarregada = energiaInicial - bateriaInicialSessao;

    let custoTotal = energiaCarregada * custoPorCarregamento;

    atualizarTexto("custo-estimado", `R$ ${custoTotal.toFixed(2)}`);

    atualizarTexto("total-cobranca", `R$ ${custoTotal.toFixed(2)}`);

    atualizarTexto("subtotal-cobranca", `R$ ${custoTotal.toFixed(2)}`);
}



//função para iniciar a recarga
function iniciarRecarga() {

    if (!carregando) {

        // pega o horário de início apenas 1 vez
        if (horarioInicioSessao === "") {

            horarioInicioSessao = pegarHorarioAtual();

            atualizarTexto("horario-inicio", horarioInicioSessao);

            atualizarTexto("relatorio-inicio", horarioInicioSessao);
        }

        animarCarregando();

        carregando = setInterval(() => {

            if (energiaInicial < 100) {

                energiaInicial = Math.min(energiaInicial + 5, 100);

                atualizarHTML("btn-continuar-sessao", "play", "Carregando");
                

                atualizarHTML("btn-pausar-sessao", "pause", "Pausar");



                atualizarTexto("porcentagem-bateria", energiaInicial + "%");


                atualizarkWh();             // atualiza kWh em tempo real 
                atualizarTempo();           // atualiza tempo em tempo real
                atualizarBarraProgresso();  // atualiza barra de progresso em tempo real
                custoPelaRecarga();         // atualiza custo em tempo real

            } else {

                carregandoNull();

                finalizarRecarga();
            }

        }, 1000);
    }
}
chamarBotao("btn-continuar-sessao", "click", iniciarRecarga);



//função para pausar a recarga
function pararRecarga() {

    if (carregando) {

        // pausa a recarga
        carregandoNull();

        atualizarHTML("btn-pausar-sessao", "pause", "Pausado");

        atualizarHTML("btn-continuar-sessao", "play", "Continuar");

        console.log("Recarga pausada");

    } else {

        // retoma a recarga
        iniciarRecarga();

        console.log("Recarga retomada");
    }
}
chamarBotao("btn-pausar-sessao", "click", pararRecarga);



function finalizarRecarga() {

    if (energiaInicial >= 100) {

        horarioFimSessao = pegarHorarioAtual();

        atualizarTexto("horario-fim", horarioFimSessao);

        atualizarTexto("relatorio-fim", horarioFimSessao);


        document.getElementById("relatorio-sessao").removeAttribute("hidden");

        document.getElementById("btn-continuar-sessao").style.display = "none";

        document.getElementById("btn-pausar-sessao").style.display = "none";


        carregandoNull();

        console.log("Recarga finalizada");

        document.getElementById("relatorio-energia-consumida").innerText =
            document.getElementById("energia-entregue").innerText;


        atualizarTexto("relatorio-bateria-final", energiaInicial + "%");


        atualizarHTML("status-carregamento", "check", "Recarga completa");
        

    } else {

        console.log("A recarga ainda não foi finalizada");
    }
}
chamarBotao("btn-finalizar-sessao", "click", finalizarRecarga);



function reiniciarSessao() {

    // para qualquer recarga ativa
    carregandoNull();

    // volta valores iniciais
    energiaInicial = Math.floor(Math.random() * 26);

    bateriaInicialSessao = energiaInicial;

    tempoDeRecarga = 0;

    pontosAnimacao = 0;

    horarioInicioSessao = "";
    horarioFimSessao = "";


    // atualiza bateria
    atualizarTexto("porcentagem-bateria", energiaInicial + "%");


    // atualiza barra
    document.getElementById("barra-progresso").style.width =
        energiaInicial + "%";


    // reseta tempo
    atualizarTexto("tempo-decorrido", "00:00:00");


    // reseta custo
    atualizarTexto("custo-estimado", "R$ 0,00");


    // reseta kWh
    atualizarTexto("energia-entregue", "0.00 kWh");


    // reseta horários
    atualizarTexto("horario-inicio", "--:--:--");

    atualizarTexto("horario-fim", "--:--:--");
    
    atualizarTexto("relatorio-inicio", "--:--:--");

    atualizarTexto("relatorio-fim", "--:--:--");


    // volta status
    atualizarHTML("status-carregamento", "battery-charging", "Aguardando recarga");
    // esconde relatório
    document.getElementById("relatorio-sessao").hidden = true;


    // mostra botões novamente
    document.getElementById("btn-continuar-sessao").style.display = "flex";

    document.getElementById("btn-pausar-sessao").style.display = "flex";


    // reseta botão continuar
    atualizarHTML("btn-continuar-sessao", "play", "Iniciar");

    // reseta botão pausar
    atualizarHTML("btn-pausar-sessao", "pause", "Pausar");

    // inicia nova recarga automaticamente
    iniciarRecarga();

    console.log("Nova sessão iniciada");
}
chamarBotao("btn-voltar-inicio", "click", reiniciarSessao);