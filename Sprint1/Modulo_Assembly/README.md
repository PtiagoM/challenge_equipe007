# Descrição do Projeto

O projeto do modúlo de controle de baixo nivel para o ChargeGrid  propõe uma solução computacional otimizada para eletropostos de veículos elétricos, utilizando programação em baixo nível (Assembly NASM) e conceitos de arquitetura de computadores para aumentar a eficiência energética do sistema.

A proposta faz parte do EV Challenge 2026 e tem como foco a redução do consumo computacional em sistemas embarcados responsáveis pelo gerenciamento de operações críticas em eletropostos.

---

# Problema

Sistemas de eletropostos frequentemente utilizam software de alto nível e hardware genérico, resultando em:

- Consumo desnecessário de energia computacional
- Baixa eficiência no processamento
- Desperdício de ciclos de CPU
- Uso excessivo de recursos computacionais
- Menor eficiência energética do sistema

Operações como autenticação de usuários, leitura de sensores e controle de carga podem ser executadas de forma mais eficiente utilizando programação em baixo nível.

---

# Objetivo

Desenvolver um módulo de controle otimizado em Assembly para gerenciamento de operações críticas em eletropostos, reduzindo ciclos de CPU e aumentando a eficiência energética do sistema embarcado.

---

# Proposta de Solução

A solução consiste em um módulo de controle desenvolvido em NASM (Netwide Assembler), responsável por fazer:

- Leitura de sensores
- Controle da distribuição de carga
- Autenticação de usuários
- Monitoramento do estado do sistema

O módulo utiliza acesso direto a registradores e instruções otimizadas do processador, reduzindo overhead computacional e melhorando o desempenho energético.

---

# Arquitetura Utilizada

## Arquitetura Principal
- x86 (CISC) utilizando NASM

## Aplicabilidade Real
Embora o projeto utilize NASM para demonstração conceitual, os mesmos princípios podem ser aplicados em arquiteturas embarcadas mais eficientes, como:

- ARM
- RISC-V

---

# Conceitos de Arquitetura Aplicados

## Pipeline

O pipeline permite que múltiplas instruções sejam executadas simultaneamente em diferentes estágios do processador.

O uso de código Assembly otimizado reduz interrupções no pipeline e melhora o aproveitamento do processador.

---

## Registradores

A utilização direta de registradores reduz acessos desnecessários à memória RAM, diminuindo ciclos de CPU.

---

## Ciclos de Clock

Cada instrução executada pelo processador consome ciclos de clock.

Ao reduzir a quantidade de instruções executadas, o sistema reduz o consumo energético do processamento.

---

## Eficiência Computacional

A programação em baixo nível permite:

- Menor overhead
- Execução mais direta
- Maior controle do hardware
- Melhor aproveitamento computacional

---

# Código do Módulo (NASM)

```
section .data

  ; Valores simulados
    sensor      db 40  ; corrente medida
    limite      db 60  ; limite permitido
    user_ok     db 1   ; 1 = autenticado

    carga_on    db "Carga Liberada", 10
    carga_on_len equ $ - carga_on

    carga_off   db "Carga Desligada", 10
    carga_off_len equ $ - carga_off

section .text
    global _start

_start:

    ; =========================
    ; LEITURA DO SENSOR
    ; =========================

    mov al, [sensor]

    ; ==========================
    ; VERIFICA LIMITE DE CARGA
    ; ==========================

    cmp al, [limite]  ; compara sensor com limite
    ja desligar       ; se maior -> desliga

    ; =========================
    ; VERIFICA USUÁRIO
    ; =========================

    mov bl, [user_ok]
    cmp bl, 1          ; verifica se o usuário está autenticado
    jne desligar       ; se não -> desliga

; =========================
; LIBERA CARGA
; =========================

ligar:

    mov eax, 4          ; syscall write
    mov ebx, 1          ; stdout
    mov ecx, carga_on
    mov edx, carga_on_len
    int 0x80

    jmp fim              ; pula para o final

; =========================
; DESLIGA CARGA
; =========================

desligar:

    mov eax, 4
    mov ebx, 1
    mov ecx, carga_off
    mov edx, carga_off_len
    int 0x80

; =========================
; ENCERRA PROGRAMA
; =========================

fim:

    mov eax, 1          ; syscall exit
    xor ebx, ebx
    int 0x80
```

# Impactos Esperados:

- Redução de ciclos de CPU
- Menor consumo energético
- Melhor desempenho em sistemas embarcados
- Maior eficiência operacional
- Infraestrutura mais sustentável


# Relação com Sustentabilidade e Energias Renováveis:

A proposta contribui diretamente para sustentabilidade ao:

- Reduzir o consumo energético computacional
- Melhorar eficiência dos eletropostos
- Diminuir necessidade de hardware mais potente
- Otimizar uso de energia renovável

A redução do consumo computacional permite melhor aproveitamento da energia disponível em sistemas integrados com:

- Energia solar
- Sistemas de armazenamento
- Infraestruturas inteligentes de carregamento
