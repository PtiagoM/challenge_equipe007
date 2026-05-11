                                    ///Construir um programa que simule:

                                    //●	Início e fim de sessão de recarga
                                    //●	Controle básico de energia
                                    //●	Registro de dados da sessão
                                    //●	Aplicação de regras simples de cobrança


let energiaInicial = 18;
document.getElementById("porcentagem-bateria").innerText = energiaInicial + "%";//peguei o elemento do html e atribui a ele o valor da energia inicial para mostrar a porcentagem da bateria na tela

let carregando;
let energiaFinal = 100;
let energiaAtual = energiaInicial;
let custoPorCarregamento = 0.50;// custo da recarga



//um comando universal para nao repetir em certas partes
//ele chama um id do html e adiciona no javascript
function chamarBotao(idBotao, evento, funcao) {
    let botao = document.getElementById(idBotao);

    botao.addEventListener(evento, funcao);
}



let tempoDeRecarga = 0;
function atualizarTempo() {
    tempoDeRecarga += 1;

    document.getElementById("tempo-decorrido").innerText =
        `${tempoDeRecarga}s`;
}



//função para calcular o custo da recarga
function custoPelaRecarga() {

    let energiaCarregada = energiaInicial;

    let custoTotal = energiaCarregada * custoPorCarregamento;

    document.getElementById("custo-estimado").innerText =
        `R$ ${custoTotal.toFixed(2)}`;
}



chamarBotao("btn-continuar-sessao", "click", iniciarRecarga);
//função para iniciar a recarga
function iniciarRecarga() {
    if (!carregando) {//verifica se já existe um processo de recarga em andamento
                      //simula o processo de recarga aumentando a energia a cada segundo
        carregando = setInterval(() => {

            if (energiaInicial < 100) {
                energiaInicial += 10;
                

                document.getElementById("porcentagem-bateria").innerText =
                    energiaInicial + "%";

                    atualizarTempo();           //atualiza em tempo real o tempo da recarga

                    custoPelaRecarga();         //atualiza em tempo real o quanto vai custar o carregamento

            } else {

                clearInterval(carregando);

                carregando = null;

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

    console.log("Recarga pausada");
}



function finalizarRecarga() {
    if (energiaAtual === energiaFinal) {
        console.log("Recarga finalizada");
    }
    else {
        console.log("A recarga ainda não foi finalizada");
    }
}




