/* State & constants */
const DEFAULT = {points:0,level:0,badges:[],activity:[],dailyClaimed:false};
const LEVELS = [
  {name:'Seedling',req:0},
  {name:'Sprout',req:100},
  {name:'Sapling',req:300},
  {name:'Young Tree',req:700},
  {name:'Canopy',req:1500}
];
const QUIZZES = [
  {q:'Which is the best way to reduce single-use plastic?',opts:['Recycle only','Use refillables','Burn it','Bury it'],a:1,pts:20},
  {q:'What is composting?',opts:['Turning organic waste into fertilizer','Mixing plastics','Washing dry waste','Incinerating waste'],a:0,pts:25},
  {q:'Which plant type supports local biodiversity?',opts:['Invasive exotic','Native species','Decorative alien','None of these'],a:1,pts:30}
];

function load(){
  try{
    const saved = JSON.parse(localStorage.getItem('ecoplay'))||{};
    return {...DEFAULT,...saved};
  }catch(e){
    return {...DEFAULT};
  }
}
function save(state){localStorage.setItem('ecoplay',JSON.stringify(state));}
let state = load();

/* Elements */
const pointsEl = document.getElementById('points');
const levelLabel = document.getElementById('levelLabel');
const levelsWrap = document.getElementById('levels');
const badgesWrap = document.getElementById('badges');
const activityEl = document.getElementById('activity');
const taskList = document.getElementById('taskList');
const leaderboard = document.getElementById('leaderboard');
const modal = document.getElementById('modal');
const modalCard = document.getElementById('modalCard');

/* Render UI */
function render(){
  pointsEl.innerText = state.points;
  levelLabel.innerText = LEVELS[state.level].name;

  // Levels pills
  levelsWrap.innerHTML = '';
  LEVELS.forEach((lv,i)=>{
    const el = document.createElement('div');
    el.className='level';
    el.innerText = lv.name + (state.points>=lv.req? ' ✓':'');
    if(i===state.level) el.style.boxShadow='inset 0 0 0 2px rgba(46,125,50,0.12)';
    levelsWrap.appendChild(el);
  });

  // Badges
  badgesWrap.innerHTML='';
  if(state.badges.length===0){
    badgesWrap.innerHTML = '<div style="color:var(--muted);font-size:13px">No badges yet</div>';
  } else {
    state.badges.forEach(b=>{
      const d = document.createElement('div');
      d.className='badge';
      d.innerText = b;
      badgesWrap.appendChild(d);
    });
  }

  // Activity
  if(!state.activity || state.activity.length===0){
    activityEl.innerText = 'No activity yet — start by taking a quiz or completing a task.';
  } else {
    activityEl.innerText = state.activity.slice(-6).reverse().join('\n');
  }

  // Tasks
  const defaultTasks = [
    {id:'t1',title:'Segregate household waste for 7 days',pts:40},
    {id:'t2',title:'Plant a native seedling',pts:50},
    {id:'t3',title:'Carry a refillable bottle for a week',pts:30}
  ];
  taskList.innerHTML='';
  defaultTasks.forEach(t=>{
    const tr = document.createElement('div');
    tr.className='task';
    tr.innerHTML = `<div><strong>${t.title}</strong><div style="font-size:12px;color:var(--muted)">+${t.pts} pts</div></div><div><button class='btn' data-id='${t.id}'>Claim</button></div>`;
    taskList.appendChild(tr);
  });

  // Leaderboard (mock)
  const mock = [ ['Ananya',420],['Rohit',380],['You',state.points],['Priya',120] ];
  leaderboard.innerHTML='';
  mock.forEach(([n,p])=>{
    const e = document.createElement('div');
    e.className='lb-item';
    e.innerHTML = `<div>${n}</div><div style="font-weight:700">${p}</div>`;
    leaderboard.appendChild(e);
  });

  save(state);
}

/* Leveling & badges */
function checkLevel(){
  for(let i=LEVELS.length-1;i>=0;i--){
    if(state.points>=LEVELS[i].req){
      if(state.level!==i){
        state.level=i;
        state.activity.push(`Leveled up to ${LEVELS[i].name} — ${new Date().toLocaleDateString()}`);
      }
      break;
    }
  }
}
function maybeAwardBadges(){
  if(state.points>=100 && !state.badges.includes('Eco Enthusiast')) state.badges.push('Eco Enthusiast');
  if(state.points>=500 && !state.badges.includes('Green Champion')) state.badges.push('Green Champion');
}
function grant(pts,reason){
  state.points += pts;
  state.activity.push(`+${pts} pts — ${reason} (${new Date().toLocaleDateString()})`);
  checkLevel();
  maybeAwardBadges();
  render();
}

/* Quiz modal */
function openQuiz(){
  const idx = Math.floor(Math.random()*QUIZZES.length);
  const q = QUIZZES[idx];
  modalCard.innerHTML = `<h3>Quick Quiz</h3><p class="muted">${q.q}</p><div id="opts" class="opts"></div><div style="margin-top:12px;text-align:right"><button class="btn" id="submitAns">Submit</button> <button class="ghost" id="closeModal">Close</button></div>`;
  const opts = modalCard.querySelector('#opts');
  q.opts.forEach((o,i)=>{
    const b = document.createElement('button');
    b.className = 'ghost';
    b.style.display='block';
    b.style.width='100%';
    b.style.marginTop='8px';
    b.dataset.idx = i;
    b.innerText = o;
    opts.appendChild(b);
  });
  modal.classList.add('open');

  let selected = null;
  modalCard.querySelectorAll('.ghost').forEach(btn=>{
    if(btn.dataset.idx !== undefined){
      btn.addEventListener('click', e=>{
        selected = Number(e.target.dataset.idx);
        modalCard.querySelectorAll('.ghost').forEach(x=>x.style.borderColor='#e6f3ea');
        e.target.style.borderColor='rgba(46,125,50,0.6)';
      });
    }
  });

  modalCard.querySelector('#submitAns').addEventListener('click', ()=>{
    if(selected===null){alert('Please select an option');return;}
    if(selected===q.a){ grant(q.pts,'Quiz correct'); alert('Correct! +' + q.pts + ' pts'); }
    else { alert('Oops — wrong. Keep learning!'); }
    modal.classList.remove('open');
  });

  modalCard.querySelector('#closeModal').addEventListener('click', ()=> modal.classList.remove('open'));
}

/* Event delegation for task claims */
document.addEventListener('click', e=>{
  if(e.target.matches("button[data-id]")){
    const id = e.target.dataset.id;
    if(id==='t2'){
      const confirmed = confirm('Upload photograph proof? (demo accept OK to claim)');
      if(confirmed) grant(50,'Planted a native seedling');
    } else if(id==='t1'){ grant(40,'Waste segregation challenge'); }
    else if(id==='t3'){ grant(30,'Refillable bottle challenge'); }
  }
});

/* Buttons */
document.getElementById('startQuiz').addEventListener('click', openQuiz);
document.getElementById('showTasks').addEventListener('click', ()=> alert('Tasks are on the right — claim when completed.'));
document.getElementById('viewLeaderboard').addEventListener('click', ()=> alert('Leaderboard shows top students and school rankings.'));
document.getElementById('claimDaily').addEventListener('click', ()=>{
  if(!state.dailyClaimed){
    grant(50,'Daily challenge');
    state.dailyClaimed = true;
    alert('Daily challenge claimed!');
    save(state);
  } else alert('You already claimed today');
});

/* First-time join */
if(state.points===0 && (!state.activity || state.activity.length===0)){
  state.activity = ['Joined EcoPlay — ' + new Date().toLocaleDateString()];
}
maybeAwardBadges();
render();

/* Background animations */
const cloud1 = document.getElementById('cloud1');
const cloud2 = document.getElementById('cloud2');
let t = 0;
function anim(){
  t += 0.5;
  cloud1.style.transform = `translateX(${Math.sin(t/80)*60}px)`;
  cloud2.style.transform = `translateX(${Math.cos(t/70)*80}px)`;
  requestAnimationFrame(anim);
}
anim();

/* Floating leaves */
function makeLeaf(){
  const leaf = document.createElement('div');
  leaf.className='leaf';
  leaf.style.left = Math.random()*100 + '%';
  leaf.style.top = '-10%';
  leaf.style.opacity = 0.9;
  leaf.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24"><path fill="#43a047" d="M2 12c4-8 12-10 20-10c0 0-6 10-8 14c-2 4-8 6-12 4c0 0 2-5 0-8z"/></svg>`;
  document.body.appendChild(leaf);
  const dur = 6000 + Math.random()*6000;
  leaf.animate([{transform:`translateY(0) rotate(0deg)` , opacity:1},{transform:`translateY(110vh) rotate(${360*Math.random()}deg)`,opacity:0}],{duration:dur,iterations:1,easing:'linear'}).onfinish = ()=>leaf.remove();
}
setInterval(makeLeaf,2500);

/* Parallax */
document.addEventListener('mousemove', e=>{
  const w=window.innerWidth/2, h=window.innerHeight/2;
  const dx=(e.clientX-w)/w, dy=(e.clientY-h)/h;
  cloud1.style.transform += ` translate3d(${dx*6}px,${dy*4}px,0)`;
  cloud2.style.transform += ` translate3d(${dx*10}px,${dy*6}px,0)`;
});

/* Debug: expose state for instructor tools */
window.__EcoPlay = {state, getState: ()=> JSON.parse(localStorage.getItem('ecoplay')||'{}')};