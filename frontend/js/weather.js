// Simple server-proxied simulated weather (server has no external API, so we simulate client-side)
function simulateWeather(city){
  const hash = city.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
  const temp = 20 + (hash % 18); // 20-37
  const humidity = 40 + (hash % 60);
  const rainChance = hash % 100;
  const weather = rainChance > 60 ? 'Rain' : temp > 32 ? 'Sunny' : 'Clouds';
  return { city, temp, humidity, rainChance, weather };
}

async function checkWeatherForCity(city){
  const wrap = document.getElementById('weather-result');
  wrap.innerHTML = 'Checking...';
  try {
    // we use simulated weather for hackathon (no API key required)
    const d = simulateWeather(city || 'Ahmedabad');
    const advice = d.rainChance > 50 ? 'Hold irrigation — high chance of rain.' : (d.temp > 35 ? 'Irrigate early morning — high temp.' : 'Normal irrigation schedule.');
    wrap.innerHTML = `
      <h3>${d.city} — ${d.weather}</h3>
      <p>Temperature: <strong>${d.temp} °C</strong></p>
      <p>Humidity: <strong>${d.humidity}%</strong></p>
      <p>Rain chance (approx): <strong>${d.rainChance}%</strong></p>
      <div style="margin-top:10px;padding:10px;border-radius:8px;background:#f2fff6"><strong>Advice:</strong> ${advice}</div>
    `;
    document.getElementById('advice-box').style.display = 'block';
    document.getElementById('advice-content').innerText = `Irrigation advice: ${advice}`;
  } catch(e){
    wrap.innerHTML = '<div style="color:crimson">Failed to fetch weather</div>';
    console.error(e);
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('check-weather').addEventListener('click', ()=>{
    const city = document.getElementById('city-input').value.trim() || 'Ahmedabad';
    checkWeatherForCity(city);
  });
  // auto-check default
  checkWeatherForCity('Ahmedabad');
});
