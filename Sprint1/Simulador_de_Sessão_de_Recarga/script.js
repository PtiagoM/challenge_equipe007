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
let tempoDeRecarga = 0;


let botao = document.getElementById("btn-continuar-sessao");
//função para iniciar a recarga
function iniciarRecarga() {
    if (!carregando) {//verifica se já existe um processo de recarga em andamento
//simula o processo de recarga aumentando a energia a cada segundo
        carregando = setInterval(() => {

            if (energiaInicial < 100) {
                energiaInicial += 10;
                tempoDeRecarga += 1;

                document.getElementById("porcentagem-bateria").innerText =
                    energiaInicial + "%";
            } else {

                clearInterval(carregando);

                carregando = null;

                console.log("Recarga concluída");
            }

        }, 1000);
    }
}
botao.addEventListener("click", iniciarRecarga);



//função para pausar a recarga
let botaoParar = document.getElementById("btn-pausar-sessao");
function pararRecarga() {

    clearInterval(carregando);

    carregando = null;

    console.log("Recarga pausada");
}
botaoParar.addEventListener("click", pararRecarga);



function finalizarRecarga() {
    if (energiaAtual === energiaFinal) {
        console.log("Recarga finalizada");
    }
    else {
        console.log("A recarga ainda não foi finalizada");
    }
}



//função para calcular o custo da recarga
let botaoFinalizar = document.getElementById("btn-finalizar-sessao");
function calcularCusto() {
    let energiaCarregada = energiaFinal - energiaInicial;
    let custoTotal = energiaCarregada * custoPorCarregamento;
    alert(`O custo total da recarga é: R$ ${custoTotal.toFixed(2)}`);
}
botaoFinalizar.addEventListener("click", calcularCusto);
