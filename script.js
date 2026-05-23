document.addEventListener('DOMContentLoaded', () => {
    let baseDeDados = [];
    fetch('dados.json').then(r => r.json()).then(data => { baseDeDados = data.ferramentas; renderizarHome(baseDeDados); });

    function renderizarHome(ferramentas) {
        const container = document.getElementById('container-categorias-home');
        const linksRapidos = document.getElementById('links-rapidos');
        container.innerHTML = ''; linksRapidos.innerHTML = '';
        
        const categorias = ferramentas.reduce((acc, f) => { if(!acc[f.categoria]) acc[f.categoria] = []; acc[f.categoria].push(f); return acc; }, {});

        Object.keys(categorias).forEach((cat, index) => {
            const itens = categorias[cat];
            const btn = document.createElement('div');
            btn.className = 'bento-card';
            btn.innerHTML = `<span class="bento-emoji">${itens[0].emoji}</span><span class="bento-title">${cat}</span>`;
            btn.onclick = () => document.getElementById(`cat-${index}`).scrollIntoView({behavior:'smooth'});
            linksRapidos.appendChild(btn);

            const section = document.createElement('section');
            section.className = 'sessao-categoria'; section.id = `cat-${index}`;
            section.innerHTML = `<h2 class="sessao-titulo">${itens[0].emoji} ${cat}</h2><div class="grid-cards">${itens.map(i => `<article class="card" onclick="abrirModal('${i.id}')"><h3>${i.nome}</h3><p>${i.dor_resolvida}</p></article>`).join('')}</div>`;
            container.appendChild(section);
            if (index < Object.keys(categorias).length - 1) container.appendChild(document.createElement('div')).className = 'area-adsense ads-home';
        });
    }

    window.abrirModal = function(id) {
        const f = baseDeDados.find(x => x.id === id);
        document.getElementById('artigo-emoji').textContent = f.emoji;
        document.getElementById('artigo-categoria').textContent = f.categoria;
        document.getElementById('artigo-titulo').textContent = f.nome;
        document.getElementById('artigo-dor').textContent = f.dor_resolvida;
        document.getElementById('artigo-descricao').textContent = f.descricao;
        document.getElementById('artigo-link').href = f.url;
        // Botão reportar (enviar e-mail)
        document.getElementById('btn-reportar').href = `mailto:seuemail@exemplo.com?subject=Link Quebrado: ${f.nome}&body=O link da ferramenta ${f.nome} (${f.url}) parece estar quebrado.`;
        
        document.getElementById('modal-overlay').classList.remove('hidden');
        document.getElementById('modal-ferramenta').classList.remove('hidden');
    };

    window.fecharTodosModais = () => { document.getElementById('modal-overlay').classList.add('hidden'); document.getElementById('modal-ferramenta').classList.add('hidden'); };
    window.fecharAoClicarFora = (e) => { if(e.target.id === 'modal-overlay') fecharTodosModais(); };
});
