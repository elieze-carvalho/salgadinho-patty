
   function abrirChat(mensagem) {
        const prefixo = ['https://', 'api.', 'whatsapp.', 'com/send?phone='].join('');
        const destino = prefixo + FONE + '&text=' + encodeURIComponent(mensagem);
        window.open(destino, '_blank', 'noopener,noreferrer');
    }



   

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
