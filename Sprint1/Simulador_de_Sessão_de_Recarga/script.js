                         ///Construir um programa que simule:

                         //	Início e fim de sessão de recarga
                         //	Controle básico de energia
                         //	Registro de dados da sessão
                         //Aplicação de regras simples de cobrança

let energiaInicial = 18;    
document.getElementById("relatorio-bateria-inicial").innerText = energiaInicial + "%";  //mostra a energia inicial no relatório da sessão
document.getElementById("porcentagem-bateria").innerText = energiaInicial + "%";        //peguei o elemento do html e atribui a ele o valor da energia inicial para mostrar a porcentagem da bateria na tela

let carregando;
let energiaFinal = 100;
let energiaAtual = energiaInicial;
let custoPorCarregamento = 0.57;                                                        // custo da recarga
let energiaEntregue = 18.6;                                                             // energia entregue durante a recarga, valor inicial para o relatório da sessão



//um comando universal para nao repetir em certas partes
//ele chama um id do html e adiciona no javascript
function chamarBotao(idBotao, evento, funcao) {
    let botao = document.getElementById(idBotao);

    botao.addEventListener(evento, funcao);
}


function atualizarBarraProgresso() {
    document.getElementById("barra-progresso").style.width = energiaInicial + "%";
}



function atualizarkWh() {
    let energiaCarregada = energiaInicial;

    let kWhCarregados = energiaCarregada * 0.02 * 37;                                   // n sei o calculo certo, só chutei um aqui dps eu arrumo melhor

    document.getElementById("energia-entregue").innerText = `${kWhCarregados.toFixed(2)} kWh`;
}



let tempoDeRecarga = 0;
function atualizarTempo() {
    tempoDeRecarga += 1;

    document.getElementById("tempo-decorrido").innerText = `${tempoDeRecarga}s`;
    document.getElementById("relatorio-tempo-total").innerText = `${tempoDeRecarga}s`; //atualiza o tempo do relatorio da sessão
}



//função para calcular o custo da recarga
function custoPelaRecarga() {

    let energiaCarregada = energiaInicial;

    let custoTotal = energiaCarregada * custoPorCarregamento;

    document.getElementById("custo-estimado").innerText = `R$ ${custoTotal.toFixed(2)}`;
    document.getElementById("total-cobranca").innerText =                            //atualiza o custo total no relatório da sessão
    `R$ ${custoTotal.toFixed(2)}`; 
    document.getElementById("subtotal-cobranca").innerText =                            //atualiza o custo total no relatório da sessão
    `R$ ${custoTotal.toFixed(2)}`;

}



chamarBotao("btn-continuar-sessao", "click", iniciarRecarga);
//função para iniciar a recarga
function iniciarRecarga() {
    if (!carregando) {                                                                  //verifica se já existe um processo de recarga em andamento e simula o processo de recarga aumentando a energia a cada segundo                                                                                
        carregando = setInterval(() => {

            if (energiaInicial < 100) {
                energiaInicial += 5;
                

                document.getElementById("porcentagem-bateria").innerText = energiaInicial + "%";

                    atualizarkWh();                  //atualiza em tempo real a energia carregada

                    atualizarTempo();                //atualiza em tempo real o tempo da recarga

                    atualizarBarraProgresso();       //atualiza em tempo real a barra de progresso

                    custoPelaRecarga();              //atualiza em tempo real o quanto vai custar o carregamento

            } else {

                clearInterval(carregando);

                carregando = null;

                document.getElementById("status-carregamento").innerHTML = "Recarga concluída";

                console.log("Recarga concluída");
            }

        }, 1000);
    }
}



chamarBotao("btn-pausar-sessao", "click", pararRecarga);
//função para pausar a recarga
function pararRecarga() {

    clearInterval(carregando);

    carregando = null;

    document.getElementById("btn-pausar-sessao").innerText = "Recarga pausada";         //tem algo de errrado ainda

    console.log("Recarga pausada"); 
}


chamarBotao("btn-finalizar-sessao", "click", finalizarRecarga);
function finalizarRecarga() {
    if (energiaInicial >= 100) {

        document.getElementById("relatorio-sessao").removeAttribute("hidden");          //mostra o relatório da sessão quando a recarga for finalizada

        clearInterval(carregando);

        carregando = null;

        console.log("Recarga finalizada");

        document.getElementById("relatorio-energia-consumida").innerText =
        document.getElementById("energia-entregue").innerText;                          //mostra a energia consumida no relatório da sessão
        
        document.getElementById("relatorio-bateria-final").innerText =                  //mostra a energia final no relatório da sessão
        energiaInicial + "%"; 

    } else {
        console.log("A recarga ainda não foi finalizada");
    }
}




chamarBotao("btn-voltar-inicio", "click", reiniciarSessao);

function reiniciarSessao() {

    // para qualquer recarga ativa
    clearInterval(carregando);

    carregando = null;

    // volta valores iniciais
    energiaInicial = 18;

    tempoDeRecarga = 0;

    // atualiza bateria
    document.getElementById("porcentagem-bateria").innerText = energiaInicial + "%";

    // atualiza barra
    document.getElementById("barra-progresso").style.width = energiaInicial + "%";

    // reseta tempo
    document.getElementById("tempo-decorrido").innerText = "0s";

    // reseta custo
    document.getElementById("custo-estimado").innerText = "R$ 0,00";

    // volta status
    document.getElementById("status-carregamento").innerHTML =
        `
        <i data-lucide="battery-charging"></i>
        Carregando...
        `;

    // esconde relatório
    document.getElementById("relatorio-sessao").hidden = true;

    // recria ícones lucide
    lucide.createIcons();

    // inicia nova recarga automaticamente
    iniciarRecarga();

    console.log("Nova sessão iniciada");
}