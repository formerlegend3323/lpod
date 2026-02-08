const menuEl = document.getElementById('menu');
const audio = document.getElementById('audio');
const fileInput = document.getElementById('fileInput');

const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const btnPlay = document.getElementById('btn-play');
const btnMenu = document.getElementById('btn-menu');
const btnCenter = document.getElementById('btn-center');

let state = 'root';
let cursor = 0;
let library = [];
let current = 0;

const menus = {
  root: ['Local Music','Streaming'],
  local: ['All Songs','Shuffle','Upload'],
  streaming: ['Top Stations'],
};

function render() {
  menuEl.innerHTML = '';
  menus[state].forEach((item,i)=>{
    const li=document.createElement('li');
    li.textContent=item;
    if(i===cursor) li.classList.add('active');
    menuEl.appendChild(li);
  });
}

function select() {
  const choice = menus[state][cursor];

  if(state==='root') {
    state = choice==='Local Music' ? 'local' : 'streaming';
    cursor=0;
  }
  else if(state==='local') {
    if(choice==='Upload') fileInput.click();
    if(choice==='All Songs' && library.length) playIndex(0);
    if(choice==='Shuffle' && library.length) playIndex(Math.floor(Math.random()*library.length));
  }
  else if(state==='streaming') {
    loadRadio();
  }
  render();
}

function playIndex(i) {
  if(!library[i]) return;
  current=i;
  audio.src=library[i].url;
  audio.play();
}

fileInput.onchange = e => {
  for(const f of e.target.files) {
    library.push({name:f.name,url:URL.createObjectURL(f)});
  }
};

async function loadRadio() {
  const res = await fetch('https://de1.api.radio-browser.info/json/stations/topvote/10');
  const stations = await res.json();
  audio.src = stations[0].url_resolved;
  audio.play();
}

btnNext.onclick = ()=> library.length && playIndex((current+1)%library.length);
btnPrev.onclick = ()=> library.length && playIndex((current-1+library.length)%library.length);
btnPlay.onclick = ()=> audio.paused?audio.play():audio.pause();
btnMenu.onclick = ()=> { state='root'; cursor=0; render(); };
btnCenter.onclick = select;

render();
