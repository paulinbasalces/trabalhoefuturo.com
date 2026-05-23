document.addEventListener('DOMContentLoaded', () => {
    fetch('dados.json').then(r => r.json()).then(data => {
        const container = document.getElementById('container-categorias-home');
        const links = document.getElementById('links-rapidos');
        const catMap = data.ferramentas.reduce((acc, f) => {
            if(!acc[f.categoria]) acc[f.categoria] = [];
            acc[f.categoria].push(f);
            return acc;
        }, {});

        Object.keys(catMap).forEach((cat, idx) => {
            links.innerHTML += `<div class="bento-card" onclick="document.getElementById('cat-${idx}').scrollIntoView({behavior:'smooth'})"><span>${catMap[cat][0].emoji}</span><p>${cat}</p></div>`;
            container.innerHTML += `<section id="cat-${idx}"><h2>${catMap[cat][0].emoji} ${cat}</h2><div class="grid-cards">${catMap[cat].map(f => `<article class="card" onclick="abrirModal('${f.id}')"><h3>${f.nome}</h3><p>${f.dor_resolvida}</p></article>`).join('')}</div><div class="area-adsense">Anúncio</div></section>`;
        });
    });

    window.abrirModal = (id) => {
        fetch('dados.json').then(r => r.json()).then(data => {
            const f = data.ferramentas.find(x => x.id === id);
            document.getElementById('artigo-titulo').textContent = f.nome;
            document.getElementById('artigo-dor').textContent = f.dor_resolvida;
            document.getElementById('artigo-descricao').textContent = f.descricao;
            document.getElementById('artigo-link').href = f.url;
            document.getElementById('btn-reportar').href = `mailto:seuemail@exemplo.com?subject=Erro: ${f.nome}`;
            document.getElementById('modal-overlay').classList.remove('hidden');
        });
    };
    window.fecharTodosModais = () => document.getElementById('modal-overlay').classList.add('hidden');
});
