// Datos de ejemplo para noticias
const NEWS = [
  {
    id:1,title:'Aumento en programas de salud comunitaria',
    date:'2025-11-10',category:'salud',excerpt:'Las autoridades locales lanzan programas de prevención y talleres comunitarios para fortalecer la salud pública.',
    tags:['salud','comunidad']
  },
  {
    id:2,title:'Estudio revela impacto ambiental en cuencas',
    date:'2025-10-25',category:'medio',excerpt:'Un nuevo estudio muestra alteraciones en la calidad de agua de varias cuencas agrícolas.',
    tags:['medio ambiente','investigación']
  },
  {
    id:3,title:'Proyecto participativo reduce mortalidad aviar',
    date:'2025-09-02',category:'comunitario',excerpt:'Iniciativas locales han contribuido a reducir la mortandad en poblaciones de aves migratorias.',
    tags:['comunitario','avifauna']
  },
  {
    id:4,title:'Investigadores publican datos sobre enfermedades emergentes',
    date:'2025-08-15',category:'investigacion',excerpt:'Datos preliminares sugieren la necesidad de vigilancia epidemiológica reforzada.',
    tags:['investigación','salud']
  }
];

// Datos ejemplo para mortandad (por año y causa)
const MORT = [
  {year:2021, cause:'Enfermedad infecciosa', cases:120},
  {year:2022, cause:'Enfermedad infecciosa', cases:95},
  {year:2023, cause:'Enfermedad infecciosa', cases:78},
  {year:2021, cause:'Accidentes', cases:60},
  {year:2022, cause:'Accidentes', cases:72},
  {year:2023, cause:'Accidentes', cases:55}
];

// --- Noticias: render + filtros ---
function renderNews(list){
  const container = document.getElementById('newsList');
  if(!container) return;
  container.innerHTML = '';
  const template = document.getElementById('newsCardT');
  list.forEach(item => {
    const clone = template.content.cloneNode(true);
    clone.querySelector('.thumb').src = 'assets/img/sample.png';
    clone.querySelector('.news-title').textContent = item.title;
    clone.querySelector('.meta').textContent = `${item.date} • ${item.category}`;
    clone.querySelector('.excerpt').textContent = item.excerpt;
    const tags = clone.querySelector('.tags');
    item.tags.forEach(t=>{ const s = document.createElement('span'); s.className='tag'; s.textContent = t; tags.appendChild(s)});
    container.appendChild(clone);
  });
}

// filtros y busqueda
function setupNewsFilters(){
  const search = document.getElementById('search');
  const cat = document.getElementById('categoryFilter');
  if(!search || !cat) return;
  function apply(){
    const q = search.value.trim().toLowerCase();
    const c = cat.value;
    let filtered = NEWS.filter(n=> (c==='all' || n.category===c));
    if(q) filtered = filtered.filter(n=> (n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q) || n.tags.join(' ').toLowerCase().includes(q)));
    renderNews(filtered);
  }
  search.addEventListener('input', apply);
  cat.addEventListener('change', apply);
  apply();
}

// --- Mortandad: tabla, gráfico y descarga CSV ---
function setupMortandad(){
  const tableBody = document.querySelector('#mortTable tbody');
  if(tableBody){
    tableBody.innerHTML = '';
    MORT.forEach(r=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${r.year}</td><td>${r.cause}</td><td>${r.cases}</td>`;
      tableBody.appendChild(tr);
    });
  }

  // preparar datos para gráfico (agrupar por año)
  const years = [...new Set(MORT.map(m=>m.year))].sort();
  const causes = [...new Set(MORT.map(m=>m.cause))];
  const datasets = causes.map((cause, idx) => ({
    label: cause,
    data: years.map(y => {
      const found = MORT.find(m => m.year===y && m.cause===cause);
      return found ? found.cases : 0;
    })
  }));

  const ctx = document.getElementById('mortChart')?.getContext('2d');
  if(ctx){
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: years,
        datasets: datasets.map((d,i)=>({
          label: d.label,
          data: d.data,
        }))
      },
      options: {
        responsive:true,
        plugins:{legend:{position:'top'}}
      }
    });
  }

  // CSV download
  document.getElementById('downloadCsv')?.addEventListener('click', ()=>{
    const csv = ['Año,Causa,Casos', ...MORT.map(r=>`${r.year},"${r.cause}",${r.cases}`)].join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'mortandad.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  });
}

// inicialización global
window.addEventListener('DOMContentLoaded', ()=>{
  setupNewsFilters();
  setupMortandad();
});
