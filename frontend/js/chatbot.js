let answers = [];

async function loadAnswers(){
  try{
    const res = await fetch('/js/chatbot_answers.json');
    const json = await res.json();
    answers = json.answers || [];
  }catch(e){ console.error('Failed to load chatbot answers', e); }
}

function appendChat(who, text){
  const log = document.getElementById('chat-log');
  const node = document.createElement('div');
  node.className = 'chat-row ' + (who === 'me' ? 'me' : 'bot');
  node.innerHTML = `<div class="chat-bubble"><strong>${who === 'me' ? 'You' : 'Advisor'}:</strong> ${text}</div>`;
  log.appendChild(node);
  log.scrollTop = log.scrollHeight;
}

function findAnswer(q){
  const low = q.toLowerCase();
  // simple matching
  for(const item of answers){
    if(low.includes(item.q)) return item.a;
  }
  // approximate: check keywords
  if(low.includes('irrig') || low.includes('water')) return 'Irrigate when soil is dry; prefer early morning or late evening. Use drip where possible.';
  if(low.includes('pest')) return 'Use recommended pesticide, remove infected plants and rotate crops.';
  return 'Sorry, not sure — consult local agricultural extension office for exact guidance.';
}

document.addEventListener('DOMContentLoaded', async ()=>{
  await loadAnswers();
  const input = document.getElementById('chat-input');
  const btn = document.getElementById('chat-send');
  btn.addEventListener('click', ()=>{
    const q = input.value.trim();
    if(!q) return;
    appendChat('me', q);
    input.value = '';
    // small delay to simulate response
    setTimeout(()=>{
      const ans = findAnswer(q);
      appendChat('bot', ans);
    }, 600);
  });
});
