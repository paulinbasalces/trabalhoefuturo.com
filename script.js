document.addEventListener('DOMContentLoaded', () => {
    let baseDeDados = [];
    let categoriaAtiva = 'Todas';
    const htmlElement = document.documentElement;
    const SITE_URL = 'https://trabalhoefuturo.com/';
    const GOOGLE_PROGRAMMABLE_SEARCH_ID = '';

    const categoriasMeta = {
        'Cálculos e Direitos': {
            intencao: 'Calcular direitos',
            melhorPara: 'quem precisa estimar valores antes de uma conversa com RH, contador ou advogado.',
            cuidado: 'use como simulação inicial; regras trabalhistas e dados pessoais podem alterar o resultado.'
        },
        'Busca e Vagas': {
            intencao: 'Conseguir oportunidades',
            melhorPara: 'quem está ajustando currículo, buscando vagas ou preparando entrevistas.',
            cuidado: 'revise seus dados antes de enviar currículos ou criar perfis públicos.'
        },
        'Rotina Automática': {
            intencao: 'Ganhar produtividade',
            melhorPara: 'quem precisa organizar tarefas, revisar textos ou transformar reuniões em informação útil.',
            cuidado: 'confira políticas de privacidade antes de enviar documentos, áudios ou informações internas.'
        },
        'Biblioteca de Carreira': {
            intencao: 'Aprender com profundidade',
            melhorPara: 'quem quer repertório para liderança, foco, comunicação e decisões profissionais.',
            cuidado: 'combine leitura e prática; conteúdo inspiracional funciona melhor com aplicação semanal.'
        },
        'Inteligência Artificial': {
            intencao: 'Criar com IA',
            melhorPara: 'quem quer acelerar textos, pesquisas, apresentações e sínteses de materiais.',
            cuidado: 'valide fatos, fontes e permissões antes de usar respostas de IA em trabalho final.'
        },
        'Cursos': {
            intencao: 'Desenvolver habilidades',
            melhorPara: 'quem busca certificados, novas competências e atualização profissional acessível.',
            cuidado: 'verifique carga horária, idioma, emissão de certificado e validade para seu objetivo.'
        },
        'Saúde Mental': {
            intencao: 'Cuidar do equilíbrio',
            melhorPara: 'quem quer reduzir estresse, melhorar foco ou encontrar apoio psicológico online.',
            cuidado: 'ferramentas digitais não substituem atendimento de emergência ou acompanhamento profissional.'
        },
        'Finanças': {
            intencao: 'Organizar dinheiro',
            melhorPara: 'quem quer controlar orçamento, simular juros, montar reserva e estudar investimentos.',
            cuidado: 'conteúdo financeiro é educativo; decisões de investimento exigem análise do seu perfil.'
        }
    };

    const seletor = {
        busca: document.getElementById('campo-busca'),
        limparBusca: document.getElementById('btn-limpar-busca'),
        googleBusca: document.getElementById('btn-google-busca'),
        googlePanel: document.getElementById('google-search-panel'),
        googleResultados: document.getElementById('google-resultados'),
        googleStatus: document.getElementById('google-search-status'),
        fecharGoogle: document.getElementById('btn-fechar-google'),
        bentoMenu: document.getElementById('bento-menu'),
        listaFerramentas: document.getElementById('lista-ferramentas'),
        statusResultados: document.getElementById('status-resultados')
    };

    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'dark') htmlElement.setAttribute('data-theme', 'dark');

    document.getElementById('btn-tema').addEventListener('click', () => {
        if (htmlElement.getAttribute('data-theme') === 'dark') {
            htmlElement.removeAttribute('data-theme');
            localStorage.setItem('tema', 'light');
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('tema', 'dark');
        }
    });

    let fontScale = parseInt(localStorage.getItem('fontScale'), 10) || 100;
    const atualizarFonte = () => {
        htmlElement.style.fontSize = fontScale + '%';
        localStorage.setItem('fontScale', fontScale);
    };
    atualizarFonte();

    document.getElementById('btn-fonte-mais').addEventListener('click', () => {
        if (fontScale < 130) {
            fontScale += 10;
            atualizarFonte();
        }
    });

    document.getElementById('btn-fonte-menos').addEventListener('click', () => {
        if (fontScale > 90) {
            fontScale -= 10;
            atualizarFonte();
        }
    });

    fetch('dados.json')
        .then(response => {
            if (!response.ok) throw new Error('Arquivo de dados indisponível');
            return response.json();
        })
        .then(data => {
            baseDeDados = data.ferramentas || [];
            atualizarMetricas(baseDeDados);
            injetarItemListSEO(baseDeDados);
            renderizarFiltros(baseDeDados);
            renderizarInterface();
            abrirFerramentaDaUrl();
            aplicarBuscaDaUrl();
        })
        .catch(erro => {
            console.error('Erro ao carregar o JSON:', erro);
            seletor.listaFerramentas.innerHTML = `
                <div class="mensagem-erro" role="alert">
                    Não foi possível carregar as ferramentas agora. Atualize a página em instantes.
                </div>
            `;
        });

    seletor.busca.addEventListener('input', () => {
        atualizarParametroBusca();
        renderizarInterface();
    });

    seletor.limparBusca.addEventListener('click', () => {
        seletor.busca.value = '';
        categoriaAtiva = 'Todas';
        atualizarUrl({ q: null, ferramenta: null });
        renderizarFiltros(baseDeDados);
        renderizarInterface();
        seletor.busca.focus();
    });

    seletor.googleBusca.addEventListener('click', executarBuscaGoogle);
    seletor.fecharGoogle.addEventListener('click', () => {
        seletor.googlePanel.classList.add('hidden');
    });

    function renderizarFiltros(ferramentas) {
        const categorias = ['Todas', ...new Set(ferramentas.map(item => item.categoria))];
        seletor.bentoMenu.innerHTML = categorias.map(categoria => {
            const ativo = categoria === categoriaAtiva ? 'true' : 'false';
            const emoji = categoria === 'Todas' ? 'Tudo' : ferramentas.find(item => item.categoria === categoria)?.emoji;
            const total = categoria === 'Todas' ? ferramentas.length : ferramentas.filter(item => item.categoria === categoria).length;

            return `
                <button type="button" class="bento-card" data-categoria="${escapeAttr(categoria)}" aria-pressed="${ativo}">
                    <span class="bento-emoji" aria-hidden="true">${emoji}</span>
                    <span class="bento-title">${escapeHTML(categoria)}</span>
                    <span class="bento-count">${total}</span>
                </button>
            `;
        }).join('');

        seletor.bentoMenu.querySelectorAll('.bento-card').forEach(botao => {
            botao.addEventListener('click', () => {
                categoriaAtiva = botao.dataset.categoria;
                renderizarFiltros(baseDeDados);
                renderizarInterface();
                document.getElementById('lista-ferramentas').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    function executarBuscaGoogle() {
        const termo = seletor.busca.value.trim();
        if (!termo) {
            seletor.busca.focus();
            seletor.googleStatus.textContent = 'Digite um termo para buscar no Google.';
            return;
        }

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'google_site_search',
            search_term: termo,
            search_provider: GOOGLE_PROGRAMMABLE_SEARCH_ID ? 'programmable_search' : 'google_site_query'
        });

        if (!GOOGLE_PROGRAMMABLE_SEARCH_ID) {
            const query = encodeURIComponent(`site:${SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')} ${termo}`);
            window.open(`https://www.google.com/search?q=${query}`, '_blank', 'noopener,noreferrer');
            seletor.googleStatus.textContent = 'Para monetizar esta busca dentro do site, informe o ID do Google Programmable Search no script.';
            return;
        }

        carregarGoogleProgrammableSearch(() => {
            seletor.googlePanel.classList.remove('hidden');
            seletor.googlePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const elemento = window.google?.search?.cse?.element?.getElement('portal-results');
            if (elemento) {
                elemento.execute(termo);
                seletor.googleStatus.textContent = 'Resultados do Google carregados no portal.';
            } else {
                seletor.googleStatus.textContent = 'A busca Google está carregando. Tente novamente em instantes.';
            }
        });
    }

    function carregarGoogleProgrammableSearch(callback) {
        if (window.google?.search?.cse?.element) {
            callback();
            return;
        }

        if (document.getElementById('google-cse-script')) {
            window.__executarBuscaQuandoGoogleCarregar = callback;
            return;
        }

        window.__gcse = {
            parsetags: 'explicit',
            callback: () => {
                window.google.search.cse.element.render({
                    div: 'google-resultados',
                    tag: 'searchresults-only',
                    gname: 'portal-results'
                });
                if (window.__executarBuscaQuandoGoogleCarregar) window.__executarBuscaQuandoGoogleCarregar();
                else callback();
            }
        };

        window.__executarBuscaQuandoGoogleCarregar = callback;
        const script = document.createElement('script');
        script.id = 'google-cse-script';
        script.async = true;
        script.src = `https://cse.google.com/cse.js?cx=${encodeURIComponent(GOOGLE_PROGRAMMABLE_SEARCH_ID)}`;
        document.head.appendChild(script);
    }

    function atualizarMetricas(ferramentas) {
        const totalFerramentas = document.getElementById('total-ferramentas');
        const totalCategorias = document.getElementById('total-categorias');
        if (totalFerramentas) totalFerramentas.textContent = ferramentas.length;
        if (totalCategorias) totalCategorias.textContent = new Set(ferramentas.map(item => item.categoria)).size;
    }

    function renderizarInterface() {
        const termo = normalizar(seletor.busca.value);
        const ferramentasFiltradas = baseDeDados.filter(item => {
            const textoBusca = normalizar(`${item.nome} ${item.categoria} ${item.dor_resolvida} ${item.descricao} ${item.id} ${aliasBusca(item.categoria)}`);
            const palavras = textoBusca.split(/[^a-z0-9]+/).filter(Boolean);
            const combinaBusca = !termo
                || (termo.length <= 2
                    ? palavras.includes(termo) || (termo === 'ia' && textoBusca.includes('inteligencia artificial'))
                    : textoBusca.includes(termo));
            const combinaCategoria = categoriaAtiva === 'Todas' || item.categoria === categoriaAtiva;
            return combinaBusca && combinaCategoria;
        });

        const contextoFiltro = [];
        if (seletor.busca.value.trim()) contextoFiltro.push(`busca "${seletor.busca.value.trim()}"`);
        if (categoriaAtiva !== 'Todas') contextoFiltro.push(`categoria ${categoriaAtiva}`);
        const sufixoFiltro = contextoFiltro.length ? ` para ${contextoFiltro.join(' e ')}` : '';
        seletor.statusResultados.textContent = `${ferramentasFiltradas.length} de ${baseDeDados.length} ferramenta${baseDeDados.length === 1 ? '' : 's'} exibida${ferramentasFiltradas.length === 1 ? '' : 's'}${sufixoFiltro}.`;

        if (!ferramentasFiltradas.length) {
            seletor.listaFerramentas.innerHTML = `
                <div class="mensagem-erro">
                    Nenhuma ferramenta encontrada neste filtro. Tente buscar por currículo, rescisão, IA, cursos ou finanças, ou use "Limpar" para ver todas.
                </div>
            `;
            return;
        }

        const categoriasInfo = ferramentasFiltradas.reduce((acc, item) => {
            if (!acc[item.categoria]) acc[item.categoria] = [];
            acc[item.categoria].push(item);
            return acc;
        }, {});

        seletor.listaFerramentas.innerHTML = Object.keys(categoriasInfo).map((categoria, index, todas) => {
            const itens = categoriasInfo[categoria];
            const meta = categoriasMeta[categoria];
            const emoji = itens[0].emoji;
            const cards = itens.map(renderizarCard).join('');
            const publicidade = index < todas.length - 1 ? `
                <div class="area-adsense ads-home">
                    <p class="ads-label">Publicidade</p>
                </div>
            ` : '';

            return `
                <section class="sessao-categoria" id="${slug(categoria)}">
                    <div class="sessao-heading">
                        <div>
                            <p class="section-kicker">${escapeHTML(meta?.intencao || 'Ferramentas')}</p>
                            <h2 class="sessao-titulo"><span aria-hidden="true">${emoji}</span> ${escapeHTML(categoria)}</h2>
                        </div>
                        <p>${escapeHTML(meta?.melhorPara || 'ferramentas úteis para decisões profissionais.')}</p>
                    </div>
                    <div class="grid-cards">${cards}</div>
                </section>
                ${publicidade}
            `;
        }).join('');
    }

    function renderizarCard(item) {
        const meta = categoriasMeta[item.categoria] || {};

        return `
            <article class="card" id="${escapeAttr(item.id)}">
                <div class="card-conteudo">
                    <div class="card-topo">
                        <span class="card-emoji" aria-hidden="true">${item.emoji}</span>
                        <span class="card-tag">${escapeHTML(meta.intencao || item.categoria)}</span>
                    </div>
                    <h3>${escapeHTML(item.nome)}</h3>
                    <p class="card-desc">${escapeHTML(item.dor_resolvida)}</p>
                    <p class="card-editorial">${escapeHTML(item.descricao)}</p>
                </div>
                <div class="card-footer">
                    <button type="button" class="btn-card-abrir" onclick="abrirModalFerramenta('${escapeAttr(item.id)}')">Ver análise rápida</button>
                    <a class="link-card-oficial" href="${escapeAttr(item.url)}" target="_blank" rel="noopener noreferrer">Plataforma oficial</a>
                </div>
            </article>
        `;
    }

    window.abrirModalFerramenta = function(id, alterarUrl = true) {
        const ferramenta = baseDeDados.find(item => item.id === id);
        if (!ferramenta) return;

        const meta = categoriasMeta[ferramenta.categoria] || {};
        const detalheUrl = criarUrlFerramenta(ferramenta.id);

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'tool_click',
            tool_id: ferramenta.id,
            tool_name: ferramenta.nome,
            tool_category: ferramenta.categoria
        });

        document.title = `${ferramenta.nome} | Trabalho e Futuro`;
        atualizarMetadadosFerramenta(ferramenta, detalheUrl);
        document.getElementById('artigo-emoji').textContent = ferramenta.emoji;
        document.getElementById('artigo-categoria').textContent = ferramenta.categoria;
        document.getElementById('artigo-titulo').textContent = ferramenta.nome;
        document.getElementById('artigo-dor').textContent = ferramenta.dor_resolvida;
        document.getElementById('artigo-descricao').textContent = ferramenta.descricao;
        document.getElementById('artigo-melhor-para').textContent = meta.melhorPara || 'quem precisa resolver essa etapa da carreira com rapidez.';
        document.getElementById('artigo-cuidado').textContent = meta.cuidado || 'confira as condições da plataforma antes de informar dados pessoais.';
        document.getElementById('artigo-link').href = ferramenta.url;

        const btnReportar = document.getElementById('btn-reportar');
        btnReportar.textContent = 'Reportar link quebrado';
        btnReportar.onclick = () => {
            const mensagem = `Link quebrado: ${ferramenta.nome}\nURL: ${ferramenta.url}\nContato: contato@trabalhoefuturo.com`;
            navigator.clipboard?.writeText(mensagem).then(() => {
                btnReportar.textContent = 'Mensagem copiada';
            }).catch(() => {
                btnReportar.textContent = 'Envie para contato@trabalhoefuturo.com';
            });
        };

        renderizarCompartilhamento(ferramenta, detalheUrl);

        document.getElementById('modal-overlay').classList.remove('hidden');
        document.getElementById('modal-overlay').setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        if (alterarUrl) atualizarUrl({ ferramenta: ferramenta.id });
    };

    window.fecharTodosModais = function() {
        document.getElementById('modal-overlay').classList.add('hidden');
        document.getElementById('modal-overlay').setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        document.title = 'Trabalho e Futuro | Ferramentas gratuitas para emprego, IA e finanças';
        restaurarMetadadosHome();
        atualizarUrl({ ferramenta: null });
    };

    window.fecharAoClicarFora = function(event) {
        if (event.target.id === 'modal-overlay') fecharTodosModais();
    };

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') fecharTodosModais();
    });

    window.addEventListener('popstate', () => {
        const ferramenta = new URL(window.location.href).searchParams.get('ferramenta');
        if (ferramenta) {
            window.abrirModalFerramenta(ferramenta, false);
        } else {
            document.getElementById('modal-overlay').classList.add('hidden');
            document.body.classList.remove('modal-open');
        }
    });

    function renderizarCompartilhamento(ferramenta, detalheUrl) {
        const containerBotoes = document.getElementById('botoes-compartilhamento');
        containerBotoes.innerHTML = '';

        const textoShare = `Ferramenta útil para carreira: ${ferramenta.nome} - ${ferramenta.descricao}`;
        const textoFormatado = encodeURIComponent(`${textoShare}\n\nAcesse: ${detalheUrl}`);
        const urlFormatada = encodeURIComponent(detalheUrl);

        if (navigator.share && window.innerWidth <= 768) {
            const btnNative = document.createElement('button');
            btnNative.type = 'button';
            btnNative.className = 'btn-share native';
            btnNative.innerText = 'Compartilhar';
            btnNative.onclick = () => navigator.share({ title: ferramenta.nome, text: textoShare, url: detalheUrl }).catch(console.error);
            containerBotoes.appendChild(btnNative);
            return;
        }

        [
            { id: 'whatsapp', nome: 'WhatsApp', url: `https://api.whatsapp.com/send?text=${textoFormatado}` },
            { id: 'linkedin', nome: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${urlFormatada}` },
            { id: 'bluesky', nome: 'Bluesky', url: `https://bsky.app/intent/compose?text=${textoFormatado}` },
            { id: 'threads', nome: 'Threads', url: `https://www.threads.net/intent/post?text=${textoFormatado}` },
            { id: 'x', nome: 'X', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(textoShare)}&url=${urlFormatada}` }
        ].forEach(rede => {
            const botao = document.createElement('button');
            botao.type = 'button';
            botao.className = `btn-share ${rede.id}`;
            botao.innerText = rede.nome;
            botao.onclick = () => window.open(rede.url, '_blank', 'noopener,noreferrer');
            containerBotoes.appendChild(botao);
        });
    }

    function aplicarBuscaDaUrl() {
        const url = new URL(window.location.href);
        const termo = url.searchParams.get('q');
        if (!termo) return;
        seletor.busca.value = termo;
        renderizarInterface();
    }

    function abrirFerramentaDaUrl() {
        const ferramenta = new URL(window.location.href).searchParams.get('ferramenta');
        if (ferramenta) window.abrirModalFerramenta(ferramenta, false);
    }

    function atualizarParametroBusca() {
        const termo = seletor.busca.value.trim();
        atualizarUrl({ q: termo || null, ferramenta: null }, true);
    }

    function atualizarUrl(params, substituir = false) {
        if (window.location.protocol === 'file:') return;
        const url = new URL(window.location.href);
        Object.entries(params).forEach(([chave, valor]) => {
            if (valor) url.searchParams.set(chave, valor);
            else url.searchParams.delete(chave);
        });
        const metodo = substituir ? 'replaceState' : 'pushState';
        window.history[metodo]({}, '', url);
    }

    function criarUrlFerramenta(id) {
        const url = new URL(SITE_URL);
        url.searchParams.set('ferramenta', id);
        return url.toString();
    }

    function atualizarMetadadosFerramenta(ferramenta, detalheUrl) {
        const descricao = `${ferramenta.nome}: ${ferramenta.descricao} ${ferramenta.dor_resolvida}`;
        setMeta('description', descricao);
        setMetaProperty('og:title', `${ferramenta.nome} | Trabalho e Futuro`);
        setMetaProperty('og:description', descricao);
        setMetaProperty('og:url', detalheUrl);
        setCanonical(detalheUrl);
    }

    function restaurarMetadadosHome() {
        const homeDescription = 'Curadoria independente de ferramentas gratuitas para carreira: direitos trabalhistas, vagas, currículo, IA, cursos, produtividade, saúde mental e finanças.';
        setMeta('description', homeDescription);
        setMetaProperty('og:title', 'Trabalho e Futuro | Ferramentas gratuitas para crescer na carreira');
        setMetaProperty('og:description', 'Compare, filtre e acesse ferramentas úteis para emprego, currículo, IA, cursos, produtividade e finanças pessoais.');
        setMetaProperty('og:url', SITE_URL);
        setCanonical(SITE_URL);
    }

    function injetarItemListSEO(ferramentas) {
        const itemList = {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Ferramentas gratuitas para carreira',
            itemListElement: ferramentas.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.nome,
                url: `${SITE_URL}?ferramenta=${encodeURIComponent(item.id)}`
            }))
        };
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(itemList);
        document.head.appendChild(script);
    }

    function setMeta(name, content) {
        const meta = document.querySelector(`meta[name="${name}"]`);
        if (meta) meta.setAttribute('content', content);
    }

    function setMetaProperty(property, content) {
        const meta = document.querySelector(`meta[property="${property}"]`);
        if (meta) meta.setAttribute('content', content);
    }

    function setCanonical(url) {
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.setAttribute('href', url);
    }

    function normalizar(texto) {
        return (texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function aliasBusca(categoria) {
        const aliases = {
            'Cálculos e Direitos': 'calculadora calculadoras calculo calculos direito direitos trabalhista clt fgts inss rescisao ferias salario seguro desemprego carteira trabalho',
            'Busca e Vagas': 'emprego empregos vaga vagas curriculo currículo cv entrevista linkedin recrutamento selecao seleção remoto home office salario salarios indicação indicação ats',
            'Rotina Automática': 'produtividade tarefa tarefas notas agenda reuniao reunião transcricao transcrição organizacao organização texto escrita foco pomodoro',
            'Biblioteca de Carreira': 'livro livros leitura carreira liderança lideranca gestao gestão repertorio aprendizado podcast palestra conteudo conteúdo',
            'Inteligência Artificial': 'ia inteligencia artificial inteligência artificial ai chat assistente resumo pesquisa slides imagem prompt automacao automação',
            'Cursos': 'curso cursos certificado certificados aula aulas estudo estudar qualificação qualificacao treinamento trilha aprender gratis gratuito',
            'Saúde Mental': 'saude saúde mental terapia psicologo psicólogo meditacao meditação sono estresse ansiedade burnout bem estar foco apoio emocional',
            'Finanças': 'financa finanças dinheiro orçamento orcamento investimento investimentos juros divida dívida cpf score reserva aposentadoria controle financeiro'
        };
        return aliases[categoria] || '';
    }

    function slug(texto) {
        return normalizar(texto).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    function escapeHTML(valor) {
        return String(valor || '').replace(/[&<>"']/g, caractere => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[caractere]));
    }

    function escapeAttr(valor) {
        return escapeHTML(valor).replace(/`/g, '&#96;');
    }
});
