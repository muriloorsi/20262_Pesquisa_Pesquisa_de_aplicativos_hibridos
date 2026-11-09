# Critérios de aceitação

- [ ] Com a API ligada, ao abrir o app aparece a lista de plantões do dia (sala, turno, enfermeiro e função) e a faixa verde "Escala atualizada agora".
- [ ] Com o celular em modo avião, ao fechar o app por completo e abrir de novo, a mesma lista aparece e a faixa laranja informa "mostrando cópia salva em DD/MM HH:MM".
- [ ] Com a API em `MODO=invalido`, ao tocar em Atualizar o app não apaga a escala salva: continua mostrando a cópia anterior e a faixa informa "dados num formato inválido".
- [ ] Na primeira instalação, sem rede e sem nada salvo, a faixa vermelha avisa que não há escala salva e a lista mostra a mensagem para conectar e atualizar (o app não trava nem fica em branco).
- [ ] Com a API em `MODO=lento`, em até ~5 s o app desiste e cai na cópia salva, informando "Sem resposta da API em 5 s".
- [ ] Ao desligar o modo avião com o app aberto, a escala se atualiza sozinha e a faixa volta a ficar verde.

**Verificado em:** ( ) aparelho físico ( ) emulador

**Resultado:** ( ) passou ( ) reprovou
