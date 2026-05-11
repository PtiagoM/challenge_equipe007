section .data

    sensor      db 40
    limite      db 60
    user_ok     db 1

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
    cmp al, [limite]
    ja desligar

    ; =========================
    ; VERIFICA USUÁRIO
    ; =========================

    mov bl, [user_ok]
    cmp bl, 1
    jne desligar

; =========================
; LIBERA CARGA
; =========================

ligar:

    mov eax, 4          ; syscall write
    mov ebx, 1          ; stdout
    mov ecx, carga_on
    mov edx, carga_on_len
    int 0x80

    jmp fim

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
