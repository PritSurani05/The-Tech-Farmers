let allData = [];
let chart = null;

async function fetchMandi(){
  try{
    const res = await fetch('/api/mandi-prices');
    const json = await res.json();
    allData = json.mandi_prices || [];
    populateCropSelect();
    renderTable(allData);
    drawChartForCrop(); // default
  }catch(e){
    console.error('Failed to fetch mandi data', e);
    document.querySelector('#mandi-table tbody').innerHTML = '<tr><td colspan="4">Failed to load data</td></tr>';
  }
}

function populateCropSelect(){
  const sel = document.getElementById('crop-select');
  const crops = [...new Set(allData.map(i=>i.crop))];
  sel.innerHTML = '<option value="">All Crops</option>' + crops.map(c => `<option value="${c}">${c}</option>`).join('');
  sel.addEventListener('change', ()=> filterAndRender());
}

function renderTable(data){
  const tbody = document.querySelector('#mandi-table tbody');
  if(!data.length){ tbody.innerHTML = '<tr><td colspan="4">No data</td></tr>'; return; }
  tbody.innerHTML = data.map(r=> `<tr>
    <td>${r.crop}</td>
    <td>${r.price} ₹</td>
    <td>${r.location}</td>
    <td>${r.date}</td>
  </tr>`).join('');
}

function filterAndRender(){
  const q = (document.getElementById('search-input').value || '').toLowerCase();
  const crop = document.getElementById('crop-select').value;
  let filtered = allData.filter(it => {
    const txt = `${it.crop} ${it.location} ${it.date}`.toLowerCase();
    return txt.includes(q) && (crop ? it.crop === crop : true);
  });
  renderTable(filtered);
  drawChartForCrop(crop || filtered[0]?.crop || '');
}

function drawChartForCrop(cropName=''){
  // default: first crop
  if(!cropName){
    if(allData.length) cropName = allData[0].crop;
    else return;
  }
  const cropData = allData.filter(d => d.crop === cropName).sort((a,b)=> new Date(a.date)-new Date(b.date));
  const labels = cropData.map(d=>d.date);
  const prices = cropData.map(d=>d.price);
  const ctx = document.getElementById('priceChart').getContext('2d');
  if(chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `${cropName} Price (₹)`,
        data: prices,
        tension: 0.3,
        fill: true,
        backgroundColor: 'rgba(43,182,115,0.12)',
        borderColor: 'rgba(43,182,115,1)',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      scales: { x: { display:true }, y: { beginAtZero:false } }
    }
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  fetchMandi();
  document.getElementById('search-input').addEventListener('input', filterAndRender);
  document.getElementById('refresh-btn').addEventListener('click', fetchMandi);
});
