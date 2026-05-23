document.addEventListener('DOMContentLoaded', () => {
    fetch('dados.json').then(r => r.json()).then(data => {
        const catMap = data.ferramentas.reduce((acc, f) => { if(!acc[f.categoria]) acc[f.categoria] = []; acc[f.categoria].push(f); return acc; }, {});
        const bento = document.getElementById('bento-menu');
        const lista = document.getElementById('lista-ferramentas');
        Object.keys(catMap).forEach((cat, i) => {
            bento.innerHTML += `<div class="bento-item" onclick="document.getElementById('cat-${i}').scrollIntoView({behavior:'smooth'})"><h3>${catMap[cat][0].emoji} ${cat}</h3></div>`;
            lista.innerHTML += `<section id="cat-${i}"><h2>${cat}</h2><div class="grid-ferramentas">${catMap[cat].map(f => `<article class="card" onclick="abrir('${f.id}')"><h3>${f.nome}</h3><p>${f.dor_resolvida}</p></article>`).join('')}</div><div class="area-adsense">Anúncio</div></section>`;
        });
    });
});
window.abrir = (id) => {
    fetch('dados.json').then(r => r.json()).then(data => {
        const f = data.ferramentas.find(x => x.id === id);
        document.getElementById('modal-titulo').innerText = f.nome;
        document.getElementById('modal-desc').innerText = f.descricao;
        document.getElementById('modal-link').href = f.url + '?ref=portalcarreiradofuturo';
        document.getElementById('modal-report').href = `mailto:seuemail@exemplo.com?subject=Erro em ${f.nome}`;
        document.getElementById('modal-overlay').classList.remove('hidden');
        const share = document.getElementById('botoes-share');
        share.innerHTML = `<button onclick="window.open('https://api.whatsapp.com/send?text=${f.url}')">WhatsApp</button> <button onclick="window.open('https://bsky.app/intent/compose?text=${f.nome}')">Bluesky</button> <button onclick="window.open('https://www.threads.net/intent/post?text=${f.nome}')">Threads</button>`;
    });
};
window.fechar = () => document.getElementById('modal-overlay').classList.add('hidden');
