document.addEventListener('DOMContentLoaded', () => {
    let baseDeDados = [];
    
    // 1. Carregamento dos dados
    fetch('dados.json')
        .then(response => response.json())
        .then(data => {
            baseDeDados = data.ferramentas;
            renderizarInterface(baseDeDados);
        })
        .catch(erro => console.error('Erro ao carregar o JSON:', erro));

    // 2. Renderização do Bento Grid e das Categorias
    function renderizarInterface(ferramentas) {
        const bentoMenu = document.getElementById('bento-menu');
        const listaFerramentas = document.getElementById('lista-ferramentas');
        
        bentoMenu.innerHTML = ''; 
        listaFerramentas.innerHTML = '';
        
        // Agrupando por categoria (Garantindo a regra de 8 categorias)
        const categoriasInfo = ferramentas.reduce((acc, f) => {
            if (!acc[f.categoria]) acc[f.categoria] = [];
            acc[f.categoria].push(f);
            return acc;
        }, {});

        Object.keys(categoriasInfo).forEach((cat, index) => {
            const itens = categoriasInfo[cat];
            const emojiCat = itens[0].emoji;
            const anchorId = `cat-${index}`;

            // Criar Cartão no Bento Grid (Menu de topo)
            const bentoCard = document.createElement('div');
            bentoCard.className = 'bento-card';
            bentoCard.innerHTML = `
                <span class="bento-emoji">${emojiCat}</span>
                <span class="bento-title">${cat}</span>
            `;
            // Rolagem suave até a seção
            bentoCard.onclick = () => document.getElementById(anchorId).scrollIntoView({ behavior: 'smooth', block: 'start' });
            bentoMenu.appendChild(bentoCard);

            // Criar Seção no Grid de Conteúdo
            const section = document.createElement('section');
            section.className = 'sessao-categoria';
            section.id = anchorId; 
            
            section.innerHTML = `
                <h2 class="sessao-titulo">${emojiCat} ${cat}</h2>
                <div class="grid-cards">
                    ${itens.map(item => `
                        <article class="card" onclick="abrirModalFerramenta('${item.id}')">
                            <h3>${item.nome}</h3>
                            <p>${item.dor_resolvida}</p>
                        </article>
                    `).join('')}
                </div>
            `;
            listaFerramentas.appendChild(section);
        });
    }

    // 3. Controle dos Modais e Ferramentas de Growth
    window.abrirModalFerramenta = function(id) {
        const ferramenta = baseDeDados.find(f => f.id === id);
        if (!ferramenta) return;
        
        // Push GTM Event (Rastreamento Analytics)
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'tool_click',
            'tool_id': ferramenta.id,
            'tool_name': ferramenta.nome,
            'tool_category': ferramenta.categoria
        });

        // Preenchimento dos dados no modal
        document.getElementById('artigo-emoji').textContent = ferramenta.emoji;
        document.getElementById('artigo-categoria').textContent = ferramenta.categoria;
        document.getElementById('artigo-titulo').textContent = ferramenta.nome;
        document.getElementById('artigo-dor').textContent = ferramenta.dor_resolvida;
        document.getElementById('artigo-descricao').textContent = ferramenta.descricao;
        
        // Link de destino
        document.getElementById('artigo-link').href = ferramenta.url;

        // REPORT LINK QUEBRADO (Custo Zero com mailto pré-formatado)
        const emailSuporte = "suporte@carreiradofuturo.com"; // Substitua pelo seu e-mail
        const assunto = encodeURIComponent(`Link Quebrado: ${ferramenta.nome}`);
        const corpoEmail = encodeURIComponent(`Olá equipe,\n\nO link da ferramenta "${ferramenta.nome}" apresenta erro ao ser acessado.\n\nURL cadastrada: ${ferramenta.url}\n\nPor favor, verifiquem.`);
        document.getElementById('btn-reportar').href = `mailto:${emailSuporte}?subject=${assunto}&body=${corpoEmail}`;

        // LÓGICA DE COMPARTILHAMENTO (Viralidade)
        const containerBotoes = document.getElementById('botoes-compartilhamento');
        containerBotoes.innerHTML = ''; 
        
        const textoShare = `Olha essa ferramenta para a carreira: ${ferramenta.nome} - ${ferramenta.descricao}`;
        const linkSite = window.location.href; // URL do seu próprio portal
        const textoFormatado = encodeURIComponent(`${textoShare}\n\nAcesse: ${linkSite}`);
        const linkSiteFormatado = encodeURIComponent(linkSite);

        // UX 2026: Web Share API nativa (Para Mobile)
        if (navigator.share) {
            const btnNative = document.createElement('button');
            btnNative.className = 'btn-share native';
            btnNative.innerText = '📤 Compartilhar (Nativo)';
            btnNative.onclick = () => {
                navigator.share({ title: ferramenta.nome, text: textoShare, url: linkSite }).catch(console.error);
            };
            containerBotoes.appendChild(btnNative);
        } else {
            // Fallback robusto para Desktop: Todas as redes sociais solicitadas
            const redes = [
                { id: 'whatsapp', nome: 'WhatsApp', url: `https://api.whatsapp.com/send?text=${textoFormatado}` },
                { id: 'linkedin', nome: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${linkSiteFormatado}` },
                { id: 'bluesky', nome: 'Bluesky', url: `https://bsky.app/intent/compose?text=${textoFormatado}` },
                { id: 'threads', nome: 'Threads', url: `https://www.threads.net/intent/post?text=${textoFormatado}` },
                { id: 'x', nome: 'X', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(textoShare)}&url=${linkSiteFormatado}` },
                { id: 'telegram', nome: 'Telegram', url: `https://t.me/share/url?url=${linkSiteFormatado}&text=${encodeURIComponent(textoShare)}` }
            ];

            redes.forEach(rede => {
                const b = document.createElement('button');
                b.className = `btn-share ${rede.id}`;
                b.innerText = rede.nome;
                b.onclick = () => window.open(rede.url, '_blank');
                containerBotoes.appendChild(b);
            });
        }

        // Exibir Modal
        document.getElementById('modal-overlay').classList.remove('hidden');
        document.body.classList.add('modal-open');
    };

    // Fechamento de Modais
    window.fecharTodosModais = function() {
        document.getElementById('modal-overlay').classList.add('hidden');
        document.body.classList.remove('modal-open');
    };

    window.fecharAoClicarFora = function(event) {
        if (event.target.id === 'modal-overlay') {
            fecharTodosModais();
        }
    };
    
    // Acessibilidade (Tecla ESC fecha o modal)
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            fecharTodosModais();
        }
    });
});