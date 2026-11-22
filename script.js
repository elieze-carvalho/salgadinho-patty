
document.addEventListener('DOMContentLoaded', () => {
    const FONE = '5551996033749';

    function abrirChat(mensagem) {
        const dominio = 'wa.me';
        const destino = 'https://' + dominio + '/send?phone=' + FONE + '&text=' + encodeURIComponent(mensagem);
        window.open(destino, '_blank', 'noopener,noreferrer');
    }

    // Intercepta qualquer clique em botões/links de WhatsApp no site inteiro
    document.addEventListener('click', (e) => {
        const alvo = e.target.closest('a, button');
        if (!alvo) return;

        const href = alvo.getAttribute('href') || '';
        const isTrigger = alvo.classList.contains('whatsapp-trigger') || alvo.classList.contains('btn-table-wa') || alvo.classList.contains('floating-wa');

        if (isTrigger || href.includes('whatsapp.com') || href.includes('wa.me')) {
            e.preventDefault();
            const frente = alvo.getAttribute('data-frente') || '';
            let msg = 'Olá! Vim pelo site da Salgadinho Patty e gostaria de mais informações comerciais.';

            if (frente === 'terceirizacao' || window.location.pathname.includes('terceirizacao')) {
                msg = 'Olá! Vim pelo site e gostaria de solicitar um orçamento para produzir salgadinhos com a minha própria marca (terceirização).';
            } else if (frente === 'revenda' || window.location.pathname.includes('patty')) {
                msg = 'Olá! Vim pelo site e tenho interesse em revender/distribuir o Salgadinho Patty no meu estabelecimento.';
            }

            abrirChat(msg);
        }
    });

    // Menu mobile
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    }

    // Formulário da página inicial
    const form = document.getElementById('whatsappForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value.trim();
            const cidade = document.getElementById('cidade').value.trim();
            const interesse = document.getElementById('interesse').value;

            const objetivo = interesse === 'revenda'
                ? 'Revender / Distribuir Salgadinho Patty'
                : 'Terceirização (Produzir minha própria marca)';

            const msg =
                'Olá! Preenchi o formulário no site:\n\n' +
                '*Nome / Empresa:* ' + nome + '\n' +
                '*Cidade / Estado:* ' + cidade + '\n' +
                '*Objetivo:* ' + objetivo;

            abrirChat(msg);
        });
    }

    // Pop-up de Intenção de Saída (Exit-Intent)
    let popupCriado = false;
    let popupExibido = false;
    let navegou = false;
    let pronto = false;

    setTimeout(() => { pronto = true; }, 3000);

    document.addEventListener('mousemove', (e) => {
        if (e.clientY > 120) navegou = true;
    });

    document.documentElement.addEventListener('mouseleave', (e) => {
        if (!pronto || !navegou || popupExibido || e.clientY > 20) return;
        popupExibido = true;

        if (!popupCriado) {
            popupCriado = true;
            const div = document.createElement('div');
            div.id = 'exitPopupAuto';
            div.style.cssText = 'display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.75); z-index:999999; align-items:center; justify-content:center; padding:20px;';
            div.innerHTML = `
                <div style="background:#ffffff; max-width:460px; width:100%; padding:36px 28px; border-radius:16px; text-align:center; position:relative; box-shadow:0 25px 50px rgba(0,0,0,0.3); border-top:6px solid #15803d; font-family:'Segoe UI',sans-serif;">
                    <button type="button" id="fecharExitAuto" style="position:absolute; top:12px; right:16px; background:none; border:none; font-size:28px; color:#94a3b8; cursor:pointer;">&times;</button>
                    <span style="display:inline-block; background:#fef2f2; color:#b91c1c; font-size:12px; font-weight:800; text-transform:uppercase; padding:5px 14px; border-radius:50px; margin-bottom:12px;">Espere um instante!</span>
                    <h3 style="font-size:22px; color:#0f172a; margin-bottom:10px; line-height:1.25;">Ainda não encontrou o que procurava?</h3>
                    <p style="font-size:15px; color:#334155; margin-bottom:24px;">Fale direto com nossa equipe comercial no WhatsApp e receba a <strong>tabela de revenda</strong> ou um <strong>orçamento de terceirização</strong> sem compromisso.</p>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <button type="button" id="btnPopupWhats" style="display:block; width:100%; background:#25d366; color:#ffffff; font-weight:700; padding:14px 20px; border:none; border-radius:8px; cursor:pointer; font-size:16px;">
                            Receber Cotação no WhatsApp
                        </button>
                        <button type="button" id="continuarExitAuto" style="background:none; border:none; color:#64748b; font-size:14px; font-weight:600; cursor:pointer; padding:8px; text-decoration:underline;">
                            Continuar navegando no site
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(div);

            const fechar = () => { div.style.display = 'none'; };
            document.getElementById('fecharExitAuto').onclick = fechar;
            document.getElementById('continuarExitAuto').onclick = fechar;
            document.getElementById('btnPopupWhats').onclick = () => {
                abrirChat('Olá! Estava no site da Patty e gostaria de receber uma cotação.');
            };
            div.onclick = (ev) => { if (ev.target === div) fechar(); };
        }
    });
    // ==========================================
    // SELETOR INTERATIVO DE SETOR (CONTATO)
    // ==========================================
    function atualizarSetorContato(valor) {
        const select = document.getElementById('interesse');
        if (select && select.value !== valor) {
            select.value = valor;
        }

        document.querySelectorAll('.sector-card').forEach(card => {
            card.classList.toggle('active', card.getAttribute('data-value') === valor);
        });

        const btnSubmit = document.getElementById('btnSubmitWa');
        if (btnSubmit) {
            btnSubmit.classList.remove('theme-patty', 'theme-b2b');
            btnSubmit.classList.add(valor === 'terceirizacao' ? 'theme-b2b' : 'theme-patty');
        }
    }

    // Torna disponível globalmente caso o HTML ainda tenha onclick/onchange
    window.selecionarSetor = atualizarSetorContato;
    window.sincronizarCardComSelect = atualizarSetorContato;

    // Clique nos cartões (Revenda / Terceirização)
    document.querySelectorAll('.sector-card').forEach(card => {
        card.addEventListener('click', () => {
            const valor = card.getAttribute('data-value');
            if (valor) atualizarSetorContato(valor);
        });
    });

    // Mudança no campo <select> ("Qual é o seu objetivo?")
    const selectInteresse = document.getElementById('interesse');
    if (selectInteresse) {
        selectInteresse.addEventListener('change', (e) => {
            atualizarSetorContato(e.target.value);
        });
    }
        // ==========================================
    // ROLAGEM EXATA PARA ÂNCORAS (FUNCIONA DE QUALQUER SEÇÃO)
    // ==========================================
    function irParaSecao(hash) {
        if (!hash || hash === '#') return;
        const destino = document.querySelector(hash);
        if (!destino) return;

        // Fecha o menu mobile se estiver aberto para não alterar a altura do cabeçalho
        const menu = document.getElementById('navMenu');
        if (menu) menu.classList.remove('active');

        // Calcula a posição real e fixa da seção a partir do topo da página
        let topoAbsoluto = 0;
        let elementoAtual = destino;
        while (elementoAtual) {
            topoAbsoluto += elementoAtual.offsetTop;
            elementoAtual = elementoAtual.offsetParent;
        }

        const alturaCabecalho = 115;
        window.scrollTo({
            top: Math.max(0, topoAbsoluto - alturaCabecalho),
            behavior: 'smooth'
        });
    }

    // Intercepta cliques em qualquer link interno (#sobre, #videos, #contato, etc.)
    document.querySelectorAll('a[href*="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const partes = href.split('#');
            const hash = partes[1] ? '#' + partes[1] : '';

            // Só intercepta se o link apontar para uma seção da própria página atual
            const mesmaPagina = !partes[0] || window.location.pathname.endsWith(partes[0]);
            if (mesmaPagina && hash && document.querySelector(hash)) {
                e.preventDefault();
                irParaSecao(hash);
                history.pushState(null, '', hash);
            }
        });
    });

    // Ajusta se vier de outra página (ex: patty.html -> index.html#sobre)
    if (window.location.hash && document.querySelector(window.location.hash)) {
        setTimeout(() => irParaSecao(window.location.hash), 150);
    }
