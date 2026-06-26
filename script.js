
const root = document.documentElement;
const body = document.body;
const storedTheme = localStorage.getItem('cbc-theme');
if(storedTheme){ body.setAttribute('data-theme', storedTheme); root.setAttribute('data-theme', storedTheme); }

document.querySelector('.theme-toggle')?.addEventListener('click', () => {
  const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', next); root.setAttribute('data-theme', next); localStorage.setItem('cbc-theme', next);
});

const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuBtn?.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', open ? 'true':'false'); });
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const updateFeed = () => {
  const y = window.scrollY || 0;
  const feed = Math.min(150, y * .26);
  const tear = Math.max(0, 24 - y * .08);
  root.style.setProperty('--feed', feed + 'px');
  root.style.setProperty('--tear', tear + 'px');
};
updateFeed(); window.addEventListener('scroll', updateFeed, {passive:true});

const observer = new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); observer.unobserve(e.target); } }); }, {threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const cards = [...document.querySelectorAll('.service-card')];
let currentFilter = 'all';
const search = document.getElementById('serviceSearch');
function renderServices(){ const q = (search?.value || '').toLowerCase().trim(); cards.forEach(card=>{ const cat = card.dataset.category; const title = card.dataset.title; const text = card.innerText.toLowerCase(); const matchCat = currentFilter === 'all' || cat === currentFilter; const matchText = !q || title.includes(q) || text.includes(q); card.style.display = matchCat && matchText ? '' : 'none'; }); }
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{ document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); currentFilter = btn.dataset.filter; renderServices(); }));
search?.addEventListener('input', renderServices);

document.querySelectorAll('.rate-filter').forEach(btn=>btn.addEventListener('click',()=>{ document.querySelectorAll('.rate-filter').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); const group = btn.dataset.rate; document.querySelectorAll('#rateTable tbody tr').forEach(row=>{ row.style.display = group === 'all' || row.dataset.group === group ? '' : 'none'; }); }));

const form = document.getElementById('printForm');
const progress = form?.querySelector('.form-progress span');
form?.addEventListener('input', () => { const fields = [...form.querySelectorAll('input,select,textarea')]; const filled = fields.filter(f => String(f.value || '').trim()).length; progress.style.width = Math.max(25, Math.round((filled/fields.length)*100)) + '%'; });
form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const msg = `Hello Classic Business Centre, I want to start a print job.%0A%0AService: ${data.service}%0AMaterial: ${data.material}%0APrint Side: ${data.side}%0ASize: ${data.size || 'Not specified'}%0AQuantity: ${data.quantity || 'Not specified'}%0ABranch: ${data.branch}%0ANeeded by: ${data.deadline || 'Not specified'}%0ANotes: ${data.notes || 'None'}%0A%0AI will share the file here.`;
  window.open(`https://wa.me/919422062887?text=${msg}`, '_blank', 'noopener');
});
