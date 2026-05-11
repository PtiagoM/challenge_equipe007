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
