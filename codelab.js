"use strict";
/* ===== Oko Empire: Code Lab (queues, hash maps, heaps, sliding window, sort + binary search, graphs) ===== */
const LAB_PUZ = [
 {id:'qz1',topic:'queue',q:'Ada, Tunde and Bisi join the line in that order. You serve 2 people, then Femi joins, then you serve 1 more. Who is the 3rd person served?',opts:['Femi','Bisi','Tunde','Ada'],a:1,hint:'A queue serves in arrival order. Femi joined after Bisi.',why:'Ada, then Tunde, then Bisi. Femi is still waiting at the back.'},
 {id:'qz2',topic:'queue',q:'The line is ["Ada","Tunde","Bisi"] (Ada came first). The code serves with <code>line.pop()</code>. Who gets served first?',opts:['Ada','Tunde','Bisi','Nobody'],a:2,hint:'pop() takes from the END of a list.',why:'pop() takes the last item, so Bisi jumps the line. That is a stack, not a queue. shift() or a front pointer fixes it.'},
 {id:'qz3',topic:'queue',q:'Spot the bug in this <code>dequeue()</code>: <code>return this.items[this.front++];</code> when the line is EMPTY. What does it return?',opts:['null','undefined','0','It crashes'],a:1,hint:'What do you get when you read a list position that does not exist?',why:'Reading past the end gives undefined. You must check for the empty line first and return null.'},
 {id:'qz4',topic:'queue',q:'Start empty. enqueue(1), enqueue(2), dequeue(), enqueue(3), enqueue(4), dequeue(). What is at the front now?',opts:['1','2','3','4'],a:2,hint:'Write the line down after each step.',why:'[1] [1,2] [2] [2,3] [2,3,4] [3,4]. The front is 3.'},
 {id:'hz1',topic:'hash',q:'You need to answer "have we seen this crate code before?" 100,000 times. Best tool?',opts:['Search a list from the start each time','A Set or hash map','Sort the list every time','A queue'],a:1,hint:'Which one can answer in a single step, no matter how many codes there are?',why:'A Set or map checks membership in about one step. Searching a list is slow when it grows.'},
 {id:'hz2',topic:'hash',q:'<code>counts = {}</code>. For each x in ["yam","egg","yam","yam"]: <code>counts[x] = (counts[x] || 0) + 1</code>. What is <code>counts.yam</code>?',opts:['1','2','3','4'],a:2,hint:'Count only the yams.',why:'Three yams, so counts.yam is 3 (and counts.egg is 1).'},
 {id:'hz3',topic:'hash',q:'Spot the bug: <code>counts[x] = counts[x] + 1</code>, with counts starting as <code>{}</code>. After the first "yam", counts.yam is…',opts:['1','0','NaN','It crashes'],a:2,hint:'What is counts.yam before anything was stored?',why:'It starts as undefined, and undefined + 1 is NaN. Use (counts[x] || 0) + 1.'},
 {id:'hz4',topic:'hash',q:'Exact change: money is 1000 and the current item costs 300. Which price do you look up in your map of prices you have already seen?',opts:['300','700','1300','1000'],a:1,hint:'This item plus its partner must make 1000.',why:'1000 minus 300 is 700. If 700 was seen before, you have your pair.'},
 {id:'pz1',topic:'heap',q:'Push 5, 2, 8, 1 into a MIN-heap. What does pop() return?',opts:['5','2','8','1'],a:3,hint:'A min-heap always gives the smallest.',why:'The smallest is 1, and it sits at the top of a min-heap.'},
 {id:'pz2',topic:'heap',q:'A heap is stored in a list. Where are the children of position 3?',opts:['4 and 5','6 and 7','7 and 8','1 and 2'],a:2,hint:'Children of i are at 2i + 1 and 2i + 2.',why:'2×3+1 = 7 and 2×3+2 = 8.'},
 {id:'pz3',topic:'heap',q:'Customers keep arriving and you must ALWAYS serve the highest VIP next. Best approach?',opts:['Sort the whole line after every arrival','A heap: quick to add, quick to take the top','A plain queue','A hash map'],a:1,hint:'You need "best one" many times while the line keeps changing.',why:'A heap adds and removes in about log n steps. Re-sorting every time is much slower.'},
 {id:'pz4',topic:'heap',q:'A MAX-heap holds VIP levels 3, 7, 5. Chief (9) arrives, then you serve twice. Which levels are still waiting?',opts:['5 and 3','7 and 3','9 and 5','Only 3'],a:0,hint:'Each serve takes the biggest that is waiting.',why:'You serve 9, then 7. Levels 5 and 3 are left.'},
 {id:'wz1',topic:'window',q:'Harvest is [4, 1, 6, 2]. What are the totals of every 2-day window?',opts:['5, 7, 8','4, 1, 6','5, 6, 8','11, 9'],a:0,hint:'Days 1+2, then 2+3, then 3+4.',why:'4+1 = 5, 1+6 = 7, 6+2 = 8.'},
 {id:'wz2',topic:'window',q:'A 3-day window totals 12. You slide it one day right: the day leaving had 4, the day joining has 9. New total?',opts:['12','17','25','8'],a:1,hint:'Subtract what leaves, add what joins.',why:'12 − 4 + 9 = 17. No need to add up all three days again.'},
 {id:'wz3',topic:'window',q:'Why does "shrink from the left when over budget" fail if some costs could be NEGATIVE?',opts:['Negative numbers crash JavaScript','A longer window could then be cheaper, so shrinking might throw away the best answer','It works fine anyway','Windows must have odd length'],a:1,hint:'The trick relies on "longer always costs more".',why:'With negatives, adding a day can lower the total, so the window rules no longer hold.'},
 {id:'wz4',topic:'window',q:'Orders by name: [A, B, C, B, D]. How long is the longest stretch with no repeated name?',opts:['2','3','4','5'],a:1,hint:'Try A B C, then C B D.',why:'A B C and C B D both have length 3. A B C B repeats B.'},
 {id:'sz1',topic:'search',q:'Binary search in 1,000,000 sorted prices. About how many looks in the worst case?',opts:['20','1,000','500,000','1,000,000'],a:0,hint:'Each look cuts the list in half.',why:'2 to the power 20 is about a million, so about 20 halvings.'},
 {id:'sz2',topic:'search',q:'What does <code>[10, 2, 33].sort()</code> give in JavaScript?',opts:['[2, 10, 33]','[10, 2, 33]','[33, 10, 2]','[10, 33, 2]'],a:1,hint:'Without a compare function, sort compares as TEXT.',why:'As text, "10" < "2" < "33". Use sort((a, b) => a - b) for numbers.'},
 {id:'sz3',topic:'search',q:'Sorted [100, 250, 400, 800, 950]. Binary search for 800 checks the middle first. How many checks to find it?',opts:['1','2','3','5'],a:1,hint:'First middle is position 2 (400). Too small, so go right.',why:'Check 400 (too small), then the middle of [800, 950] is 800. Two checks.'},
 {id:'sz4',topic:'search',q:'Spot the bug: <code>mid = (low + high) / 2</code> with low 0 and high 5. What is mid?',opts:['2','2.5, which is not a valid position','3','An error'],a:1,hint:'Division in JavaScript keeps decimals.',why:'5 / 2 is 2.5. Use Math.floor((low + high) / 2).'},
 {id:'gz1',topic:'graph',q:'Roads: Buka–Yaba, Yaba–Ikeja, Buka–Surulere, Surulere–Lekki. BFS from Buka. Which places are exactly 2 roads away?',opts:['Ikeja and Lekki','Only Ikeja','Yaba and Surulere','Buka'],a:0,hint:'Ring 1 is Yaba and Surulere. What do they lead to?',why:'Yaba leads to Ikeja and Surulere leads to Lekki, both 2 roads away.'},
 {id:'gz2',topic:'graph',q:'BFS uses which structure to decide what to visit next?',opts:['A queue','A stack','A heap','A sorted list'],a:0,hint:'BFS visits places in the order they were discovered.',why:'Discovered first, visited first: that is a queue. A stack gives DFS instead.'},
 {id:'gz3',topic:'graph',q:'Why do we keep a "visited" set during BFS?',opts:['To make the code longer','So we do not go round in circles forever when roads loop back','To sort the places','It is not needed'],a:1,hint:'Yaba–Ikeja–Maryland–Yaba is a loop.',why:'Without it, a loop of roads keeps adding the same places again and again.'},
 {id:'gz4',topic:'graph',q:'Buka–VI takes 50 min. Buka–Yaba 10, Yaba–Ikoyi 15, Ikoyi–VI 10. Which is true?',opts:['Fewest stops is Buka→VI (50 min) but the fastest is via Yaba and Ikoyi (35 min)','Both are Buka→VI','Both go via Yaba','The fastest is 50 min'],a:0,hint:'Add up 10 + 15 + 10.',why:'Fewest roads is not always fastest. That is why weighted routes need Dijkstra.'}
];
const LAB_GATES = { farm:{2:'s1',3:'s2',4:'s4',5:'s5'}, coop:{2:'h2',3:'h4'}, pen:{2:'h5',3:'s3'}, store:{2:'h1',3:'h3',4:'h6'}, mills:{2:'q1',3:'q4'},
  buka:{2:'q2',3:'q5'}, kitchen:{2:'p1',3:'p3'}, stall:{2:'b1',3:'b3'}, bike:{2:'g3'}, restaurant:{2:'p2',3:'p5'}, compound:{2:'g5',3:'g6'} };
const LAB_REWARD = [0,400,800,1500,2500,4000];
const LAGOS_ROADS = [['Buka','Yaba'],['Buka','Surulere'],['Yaba','Ebute Metta'],['Yaba','Gbagada'],['Surulere','Ebute Metta'],['Surulere','Apapa'],['Apapa','Festac'],['Gbagada','Ojota'],['Gbagada','Maryland'],['Ojota','Maryland'],['Maryland','Ikeja'],['Ikeja','Oshodi'],['Oshodi','Surulere'],['Ebute Metta','Obalende'],['Obalende','Ikoyi'],['Obalende','VI'],['Ikoyi','VI'],['Ikoyi','Lekki'],['VI','Lekki'],['Lekki','Ajah']];
const LAB_PASS = ['E choke! Every test passed \u{1F525}','Correct! Oga programmer \u{1F4AA}','Clean code. The customers dey smile \u{1F604}','Sharp! Na you be the main character \u2705'];
const LAB_FAIL = ['Almost there, no wahala. Read the failing test slowly.','Omo, one test no gree. Look at the input and what you returned.','Not yet. Trace it by hand with the failing input; you go see am.'];
const chById = id => LAB_CH.find(c=>c.id===id);
const puzById = id => LAB_PUZ.find(p=>p.id===id);
function labS(){ if(!S.lab||typeof S.lab!=='object') S.lab={}; const L=S.lab; const d={solved:{},code:{},good:{},hints:{},puz:{},auto:{serve:false,route:false}}; for(const k in d) if(!L[k]||typeof L[k]!=='object') L[k]=d[k]; return L; }
function labSolved(id){ return !!labS().solved[id]; }
function labStars(id){ const s=labS().solved[id]; return s? s.stars:0; }
function labUnlocked(ch){ const list=LAB_CH.filter(c=>c.topic===ch.topic); const i=list.indexOf(ch); return i===0 || labSolved(list[i-1].id); }
function labTopicStats(t){ const list=LAB_CH.filter(c=>c.topic===t); const solved=list.filter(c=>labSolved(c.id)).length; const stars=list.reduce((a,c)=>a+labStars(c.id),0); const puz=LAB_PUZ.filter(p=>p.topic===t); const pz=puz.filter(p=>labS().puz[p.id]).length; return {n:list.length,solved,stars,pn:puz.length,pz}; }
function labBadge(t){ const s=labTopicStats(t); if(s.solved===s.n && s.stars===s.n*3) return {k:'master',e:'\u{1F451}',n:'Master'}; if(s.solved===s.n) return {k:'gold',e:'\u{1F947}',n:'Gold'}; if(s.solved*2>=s.n) return {k:'silver',e:'\u{1F948}',n:'Silver'}; if(s.solved>0) return {k:'bronze',e:'\u{1F949}',n:'Bronze'}; return {k:'none',e:'\u{1F512}',n:'Not started'}; }
function esc(s){ return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function short(v,n=220){ let s; try{ s = typeof v==='string'? v : labStableMain(v); }catch(e){ s=String(v); } return s.length>n? s.slice(0,n)+' \u2026' : s; }
function labStableMain(v){ if(v===undefined) return 'undefined'; if(v===null||typeof v!=='object') return JSON.stringify(v); if(Array.isArray(v)) return '['+v.map(labStableMain).join(',')+']'; return '{'+Object.keys(v).sort().map(k=>k+':'+labStableMain(v[k])).join(',')+'}'; }
function topicOf(id){ return LAB_TOPICS.find(t=>t.id===id); }
function labGate(k, target){ const g=LAB_GATES[k]; const id=g&&g[target]; if(!id) return null; const ch=chById(id); const ok=labSolved(id); const t=topicOf(ch.topic);
  return {ok, ch, html: ok? '' : `\u{1F4BB} Locked by code: solve <b>\u201c${esc(ch.title)}\u201d</b> (${esc(t.n)}) in the Code Lab to unlock this upgrade. <button class="btn small gold" id="uLab" data-ch="${ch.id}">Open Code Lab</button>`}; }

/* ----- worker sources ----- */
const LAB_RUNNER = LAB_WORKER_LIB + `
var __log=[]; var __quiet=false;
function __fmt(v){ try{ return typeof v==='string'? v : JSON.stringify(v); }catch(e){ return String(v); } }
console.log=function(){ if(__quiet) return; if(__log.length<60) __log.push(Array.prototype.map.call(arguments,__fmt).join(' ').slice(0,300)); else if(__log.length===60) __log.push('(more logs hidden)'); };
console.error=console.warn=console.info=console.log;
function __clone(x){ return JSON.parse(JSON.stringify(x)); }
function __compile(code,name){ return (new Function(code+'\\n;return (typeof '+name+'!=="undefined")?'+name+':undefined;'))(); }
function __show(v){ if(v===undefined) return 'undefined'; var s; try{ s=labStable(v); }catch(e){ s=String(v); } return s.length>400? s.slice(0,400)+' \\u2026':s; }
function __errmsg(x){ return (x&&x.name?x.name+': ':'')+(x&&x.message||String(x)); }
onmessage=function(e){ var m=e.data; var f;
  try{ f=__compile(m.code,m.ch.fn); }catch(x){ postMessage({type:'compile',msg:__errmsg(x)}); return; }
  if(typeof f!=='function'){ postMessage({type:'compile',msg:'missing'}); return; }
  var ch=m.ch, all=true;
  for(var i=0;i<ch.tests.length;i++){ var t=ch.tests[i]; postMessage({type:'start',i:i}); var got, err=null; var t0=performance.now();
    try{ got = ch.kind==='class'? labRunOps(f,__clone(t.ops)) : f.apply(null,__clone(t.args)); }catch(x){ err=__errmsg(x); }
    var ms=performance.now()-t0; var pass=false;
    if(!err){ try{ pass = ch.cmp==='path'? labCheckPath(t.args[0],t.args[1],t.args[2],got,t.exp) : labStable(got)===labStable(t.exp); }catch(x){ pass=false; } }
    if(!pass) all=false;
    postMessage({type:'test',i:i,pass:pass,got:err?null:__show(got),err:err,ms:ms}); }
  if(all){ postMessage({type:'bigstart'}); var args=LAB_GENS[ch.big.gen](LAB_GENS.rng(ch.big.seed)); var n=JSON.stringify(args).length; __quiet=true; var res, err2=null; var t1=performance.now();
    try{ res = ch.kind==='class'? labRunOps(f,args.ops) : f.apply(null,args); }catch(x){ err2=__errmsg(x); }
    var ms2=performance.now()-t1; __quiet=false; var ok=false; if(!err2){ try{ ok = ch.cmp==='path'? labCheckPath(args[0],args[1],args[2],res,ch.big.exp) : labHash(labStable(res))===ch.big.exp; }catch(x){} }
    postMessage({type:'big',pass:ok,ms:ms2,err:err2,size:n}); }
  postMessage({type:'done',logs:__log});
};`;
const LAB_BOT = LAB_WORKER_LIB + `
var fns={}; console.log=function(){};
function __compile(code,name){ return (new Function(code+'\\n;return (typeof '+name+'!=="undefined")?'+name+':undefined;'))(); }
onmessage=function(e){ var m=e.data;
  if(m.type==='init'){ fns={}; for(var k in m.codes){ try{ fns[k]=__compile(m.codes[k],k); }catch(x){} } return; }
  var val=null, err=null; try{ var f=fns[m.fn]; if(typeof f!=='function') throw new Error('script missing'); val=f.apply(null,m.args); if(val===undefined) val=null; }catch(x){ err=(x&&x.message)||String(x); }
  try{ postMessage({rid:m.rid,val:val,err:err}); }catch(x){ postMessage({rid:m.rid,val:null,err:'your script returned something that is not plain data'}); } };`;
let LAB_URLS={};
function labWorker(kind){ if(!LAB_URLS[kind]) LAB_URLS[kind]=URL.createObjectURL(new Blob([kind==='run'?LAB_RUNNER:LAB_BOT],{type:'text/javascript'})); return new Worker(LAB_URLS[kind]); }

/* ----- screen ----- */
const LABV = { topic:'queue', ch:null, from:'title', w:null, wd:null, running:false };
screens.push('lab');
function openLab(from, chId){ labS(); LABV.from = from||'title'; show('lab'); if(chId){ const ch=chById(chId); LABV.topic=ch.topic; if(labUnlocked(ch)) return openChallenge(ch.id); } labHome(); }
function labHeader(){ const tot=LAB_CH.length, sv=LAB_CH.filter(c=>labSolved(c.id)).length; $('labSolved').innerHTML=`\u{1F4BB} <b>${sv}</b> / ${tot} solved`; $('labBank').textContent=fmtN(S.bank); }
function labHome(){ LABV.ch=null; $('lab').classList.remove('solving'); labHeader();
  $('labTopics').innerHTML = LAB_TOPICS.map((t,i)=>{ const s=labTopicStats(t.id), b=labBadge(t.id); return `<button class="ltopic ${t.id===LABV.topic?'sel':''} b-${b.k}" data-topic="${t.id}"><span class="lnum">${i+1}</span><span class="licon">${t.icon}</span><span class="ltxt"><b>${t.n}</b><small>${t.where}</small><i class="lbar"><i style="width:${Math.round(100*s.solved/s.n)}%"></i></i></span><span class="lbadge" title="${b.n}">${b.e}<small>${s.solved}/${s.n}</small></span></button>`; }).join('');
  const t=topicOf(LABV.topic), list=LAB_CH.filter(c=>c.topic===t.id);
  const gatesFor = id => Object.keys(LAB_GATES).filter(k=>Object.values(LAB_GATES[k]).includes(id)).map(k=>{ const lv=+Object.keys(LAB_GATES[k]).find(l=>LAB_GATES[k][l]===id); return `${BUILD[k].n} Lv ${lv}`; });
  $('labTopicHead').innerHTML = `<h3>${t.icon} ${t.n} <small>\u2022 ${t.where}</small></h3><p>${t.blurb}</p>`;
  $('labList').innerHTML = list.map((c,i)=>{ const un=labUnlocked(c), sv=labSolved(c.id), st=labStars(c.id), g=gatesFor(c.id);
    return `<button class="lch ${un?'':'locked'} ${sv?'done':''}" data-ch="${c.id}" ${un?'':'aria-disabled="true"'}><span class="lci">${sv?'\u2705':un?'\u{1F4BB}':'\u{1F512}'}</span><span class="lct"><b>${i+1}. ${esc(c.title)}</b><small>${'\u25CF'.repeat(c.diff)}${'\u25CB'.repeat(5-c.diff)} ${['','Easy','Easy+','Medium','Hard','Boss'][c.diff]}${c.auto?' \u2022 \u{1F916} automation script':''}${g.length?' \u2022 unlocks '+g.join(', '):''}</small></span><span class="lcs">${[1,2,3].map(k=>`<i class="${k<=st?'on':''}">\u2605</i>`).join('')}</span></button>`; }).join('');
  const pz=LAB_PUZ.filter(p=>p.topic===t.id);
  $('labPuz').innerHTML = `<h4>\u{1F9E0} Logic puzzles (no code)</h4><div class="lpz">`+pz.map((p,i)=>`<button class="lp ${labS().puz[p.id]?'done':''}" data-puz="${p.id}">${labS().puz[p.id]?'\u2705':'\u2753'} Puzzle ${i+1}</button>`).join('')+`</div>`;
  const L=labS();
  $('labScripts').innerHTML = `<h4>\u{1F916} My automation scripts</h4>`+
   [['serve','q3','Auto-serve','Your pickNext() code serves customers by itself during levels.'],['route','g3','Bike GPS','Your shortestRoute() code routes delivery orders across Lagos for a +25% bonus.']].map(([k,id,n,d])=>{ const ok=labSolved(id); return `<div class="lscript"><div><b>${n}</b><small>${ok?d:'Solve \u201c'+esc(chById(id).title)+'\u201d to unlock.'}</small></div><button class="tog ${L.auto[k]&&ok?'on':''}" data-auto="${k}" ${ok?'':'disabled'}>${L.auto[k]&&ok?'ON':'OFF'}</button></div>`; }).join('');
}
function openChallenge(id){ const ch=chById(id); if(!ch||!labUnlocked(ch)) return; LABV.ch=ch; LABV.topic=ch.topic; const L=labS(); $('lab').classList.add('solving'); labHeader();
  const t=topicOf(ch.topic); const ex=ch.tests.slice(0,2);
  const exHTML = ex.map((tc,i)=>`<div class="ex"><small>Example ${i+1}</small><code>${ch.kind==='class'? esc(tc.ops.map(o=>o[0]+'('+o.slice(1).map(x=>JSON.stringify(x)).join(', ')+')').join('; ')) : esc(ch.fn+'('+tc.args.map(a=>short(a,160)).join(', ')+')')}</code><code class="exo">\u2192 ${esc(short(ch.cmp==='path'? (tc.exp===null?null:'a route with '+tc.exp+' places') : tc.exp,200))}</code></div>`).join('');
  $('labTaskBody').innerHTML = `<div class="ttag">${t.icon} ${t.n} \u2022 ${['','Easy','Easy+','Medium','Hard','Boss'][ch.diff]}</div><h3>${esc(ch.title)}</h3><p class="story">${esc(ch.story)}</p><p class="task">${ch.task}</p>${exHTML}<p class="small">${ch.tests.length} tests (${ch.tests.length-2} hidden) + 1 big speed test.<br>\u2605 pass \u2022 \u2605 speed test \u2022 \u2605 no hints used</p>`;
  const code = L.code[id]!=null? L.code[id] : ch.starter; $('edCode').value=code; edGutter(); labHints(); $('labResults').innerHTML='<p class="muted">Write your code, then tap <b>Run</b>. You can use <code>console.log()</code>.</p>';
  $('edCode').scrollTop=0; }
function labHints(){ const ch=LABV.ch, n=labS().hints[ch.id]||0; $('labHints').innerHTML = ch.hints.slice(0,n).map((h,i)=>`<div class="lhint"><b>Hint ${i+1} \u2022 ${['Concept','Approach','Structure'][i]}</b>${esc(h)}</div>`).join(''); $('edHint').textContent = n>=3? 'No more hints' : `Hint (${n}/3)`; $('edHint').disabled = n>=3; }
function edGutter(){ const n=$('edCode').value.split('\n').length; let s=''; for(let i=1;i<=Math.max(n,1);i++) s+=i+'\n'; $('edGutter').textContent=s; $('edGutter').scrollTop=$('edCode').scrollTop; }
let saveT=null; function edChanged(){ edGutter(); if(!LABV.ch) return; labS().code[LABV.ch.id]=$('edCode').value; clearTimeout(saveT); saveT=setTimeout(save,400); }
function edInsert(txt, back=0){ const ta=$('edCode'); ta.focus(); const s=ta.selectionStart, e=ta.selectionEnd; ta.setRangeText(txt,s,e,'end'); if(back) ta.selectionStart=ta.selectionEnd=ta.selectionEnd-back; edChanged(); }
function edIndent(out){ const ta=$('edCode'); const v=ta.value; let s=ta.selectionStart, e=ta.selectionEnd; const ls=v.lastIndexOf('\n',s-1)+1;
  if(!out && s===e){ edInsert('  '); return; }
  const block=v.slice(ls,e); const lines=block.split('\n'); const nb=lines.map(l=>out? l.replace(/^ {1,2}/,'') : '  '+l).join('\n');
  ta.setRangeText(nb,ls,e,'select'); if(s===e){ const d=nb.length-block.length; ta.selectionStart=ta.selectionEnd=Math.max(ls,s+d); } edChanged(); }
function edKey(ev){ const ta=$('edCode');
  if(ev.key==='Tab'){ ev.preventDefault(); edIndent(ev.shiftKey); return; }
  if(ev.key==='Enter' && !ev.ctrlKey && !ev.metaKey){ ev.preventDefault(); const v=ta.value, s=ta.selectionStart; const ls=v.lastIndexOf('\n',s-1)+1; const ind=(v.slice(ls,s).match(/^\s*/)||[''])[0]; const prev=v.slice(0,s).trimEnd(); const extra=/[{[(]$/.test(prev)?'  ':''; const next=v[ta.selectionEnd];
    if(extra && /[}\])]/.test(next||'')) edInsert('\n'+ind+extra+'\n'+ind, ind.length+1); else edInsert('\n'+ind+extra); return; }
  if(ev.key==='}' ){ const v=ta.value, s=ta.selectionStart; const ls=v.lastIndexOf('\n',s-1)+1; if(/^\s+$/.test(v.slice(ls,s)) && s-ls>=2){ ev.preventDefault(); ta.setRangeText('}',s-2,s,'end'); edChanged(); } return; }
  if((ev.ctrlKey||ev.metaKey) && ev.key==='Enter'){ ev.preventDefault(); labRun(); } }
const KEYS=[['Tab','tab'],['{ }','{}'],['( )','()'],['[ ]','[]'],[';',';'],['=','='],['=>',' => '],['"','""'],['.','.'],[',',', '],['<','<'],['>','>'],['+','+'],['-','-'],['!','!'],['&&',' && '],['||',' || '],['\u2190','left'],['\u2192','right']];
function buildKeybar(){ $('keybar').innerHTML=KEYS.map((k,i)=>`<button class="key" data-k="${i}">${esc(k[0])}</button>`).join('');
  $('keybar').addEventListener('pointerdown',e=>{ const b=e.target.closest('.key'); if(!b) return; e.preventDefault(); const k=KEYS[+b.dataset.k][1]; const ta=$('edCode');
    if(k==='tab') return edIndent(false); if(k==='left'||k==='right'){ ta.focus(); const p=Math.max(0,Math.min(ta.value.length,ta.selectionStart+(k==='left'?-1:1))); ta.selectionStart=ta.selectionEnd=p; return; }
    if(k.length===2 && '{}()[]""'.includes(k)) return edInsert(k,1); edInsert(k); }); }

/* ----- running tests ----- */
function labRun(){ const ch=LABV.ch; if(!ch||LABV.running) return; const code=$('edCode').value; labS().code[ch.id]=code; save();
  const R=$('labResults'); R.innerHTML='<div class="rhead run">\u23F3 Running your code\u2026</div><div class="rlist" id="rlist"></div>'; const list=$('rlist');
  let w; try{ w=labWorker('run'); }catch(e){ R.innerHTML='<div class="rhead bad">Could not start the code runner on this browser.</div>'; return; }
  LABV.w=w; LABV.running=true; $('edRun').disabled=true; $('edRun').textContent='Running\u2026';
  const res={tests:[], big:null, cur:-1, phase:'tests'}; const row=i=>`<div class="rt" id="rt${i}"><span>${i<2?'Example':'Hidden test'} ${i+1}</span><b>\u2026</b></div>`;
  list.innerHTML = ch.tests.map((_,i)=>row(i)).join('') + `<div class="rt" id="rtbig"><span>\u26A1 Big speed test</span><b>\u2026</b></div>`;
  const finish=(timedOut)=>{ clearTimeout(LABV.wd); if(timedOut){ const el=res.phase==='big'?$('rtbig'):$('rt'+res.cur); if(el){ el.className='rt no'; el.querySelector('b').textContent='\u23F1 timed out'; } } try{ w.terminate(); }catch(e){} LABV.w=null; LABV.running=false; $('edRun').disabled=false; $('edRun').textContent='\u25B6 Run'; labReport(ch,res,timedOut); };
  const arm=(ms)=>{ clearTimeout(LABV.wd); LABV.wd=setTimeout(()=>finish(true),ms); };
  w.onmessage=e=>{ const m=e.data;
    if(m.type==='compile'){ res.compile=m.msg; return finish(false); }
    if(m.type==='start'){ res.cur=m.i; arm(3000); return; }
    if(m.type==='test'){ res.tests[m.i]=m; const el=$('rt'+m.i); if(el){ el.className='rt '+(m.pass?'ok':'no'); el.querySelector('b').textContent=m.pass?'\u2714 pass':'\u2716 fail'; } return; }
    if(m.type==='bigstart'){ res.phase='big'; arm(ch.big.limit+6000); return; }
    if(m.type==='big'){ res.big=m; const el=$('rtbig'); if(el){ const f=m.pass&&m.ms<=ch.big.limit; el.className='rt '+(f?'ok':'no'); el.querySelector('b').textContent=f?'\u26A1 '+Math.round(m.ms)+' ms':m.pass?'\u{1F422} '+Math.round(m.ms)+' ms':'\u2716'; } return; }
    if(m.type==='done'){ res.logs=m.logs; return finish(false); } };
  w.onerror=e=>{ e.preventDefault(); res.compile=res.compile||(e.message||'error'); finish(false); };
  arm(4000); w.postMessage({code, ch:{fn:ch.fn,kind:ch.kind,cmp:ch.cmp,tests:ch.tests,big:ch.big}}); }
function testInput(ch,t){ return ch.kind==='class'? t.ops.map(o=>o[0]+'('+o.slice(1).map(x=>JSON.stringify(x)).join(', ')+')').join('; ') : ch.fn+'('+t.args.map(a=>short(a,120)).join(', ')+')'; }
function labReport(ch,res,timedOut){ const L=labS(); const R=$('labResults'); let html='';
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  if(res.compile){ const missing=res.compile==='missing';
    html=`<div class="rhead bad">\u{1F6A7} ${missing?`I can\u2019t find <code>${ch.fn}</code> in your code.`:'Your code no run at all: there is a typo somewhere.'}</div><div class="rbox">${missing?`Keep the ${ch.kind==='class'?'class':'function'} name exactly <code>${ch.fn}</code>.`:esc(res.compile)}<br><small>Check brackets { }, ( ) and quotes. Each opening one needs a closing one.</small></div>`;
    R.innerHTML=html; SFX.err(); return; }
  const n=ch.tests.length, passed=res.tests.filter(t=>t&&t.pass).length;
  if(timedOut && res.phase==='tests' && res.cur<0){ html+=`<div class="rhead bad">\u23F1 Your code got stuck before any test started.</div><div class="rbox">Is there a loop OUTSIDE your function that never ends? Only define the ${ch.kind==='class'?'class':'function'}; the tests call it for you.</div>`; }
  else if(timedOut && res.phase==='tests'){ const i=res.cur; html+=`<div class="rhead bad">\u23F1 Test ${i+1} ran for too long, so I stopped it.</div><div class="rbox">Your code ran for more than 3 seconds. Na infinite loop be this? Check that every loop\u2019s condition eventually becomes false, and that you move your pointer or index each time round.<br><small>Input: <code>${esc(short(testInput(ch,ch.tests[i]),260))}</code></small></div>`; }
  const fails=res.tests.map((t,i)=>({t,i})).filter(x=>x.t&&!x.t.pass);
  if(fails.length){ const {t,i}=fails[0]; const tc=ch.tests[i];
    html+=`<div class="rhead bad">${pick(LAB_FAIL)} (${passed}/${n} passed)</div><div class="rbox"><b>${i<2?'Example':'Hidden test'} ${i+1} failed</b><br>Input: <code>${esc(short(testInput(ch,tc),260))}</code><br>`+
      (t.err? `Your code crashed: <code>${esc(t.err)}</code>${/undefined|null/.test(t.err)?'<br><small>Something you used was empty. Check the empty-line / empty-list case.</small>':''}` :
       `Expected: <code>${esc(ch.cmp==='path'? (tc.exp===null?'null (no route)':'a valid route with '+tc.exp+' places, from start to finish, using real roads') : short(tc.exp,260))}</code><br>You returned: <code>${esc(t.got)}</code>`)+`</div>`; }
  if(!timedOut && !fails.length && passed===n){ const b=res.big; const fast=b&&b.pass&&b.ms<=ch.big.limit; const hints=L.hints[ch.id]||0; const stars=1+(fast?1:0)+(hints===0?1:0);
    const first=!labSolved(ch.id); const prev=labStars(ch.id); const reward=first? LAB_REWARD[ch.diff]:0;
    L.solved[ch.id]={stars:Math.max(prev,stars), at:Date.now()}; L.good[ch.id]=$('edCode').value; if(reward){ S.bank+=reward; } save();
    html+=`<div class="rhead good">${pick(LAB_PASS)}</div><div class="rbox good"><div class="bigst">${[1,2,3].map(k=>`<i class="${k<=stars?'on':''}">\u2605</i>`).join('')}</div>`+
      `\u2714 All ${n} tests passed<br>${fast?`\u26A1 Speed star: the big test finished in ${Math.round(b.ms)} ms`: b&&b.pass? `\u{1F422} Correct on the big test but slow (${Math.round(b.ms)} ms, need under ${ch.big.limit} ms). Try a faster idea for the \u26A1 star.` : b&&b.err? `\u26A0\uFE0F The big test crashed: <code>${esc(b.err)}</code>`+(/call stack/i.test(b.err)?' (too much recursion: try a loop with a list instead)':'') : timedOut? `\u23F1 The big speed test ran too long (over ${Math.round((ch.big.limit+6000)/1000)} s). Your idea works but it is too slow for a huge input.` : '\u26A0\uFE0F The big test gave a different answer. Check edge cases like ties and empty inputs.'}<br>${hints===0?'\u{1F9E0} No hints used':'\u{1F4A1} '+hints+' hint'+(hints>1?'s':'')+' used (solve with no hints for the last star)'}`+
      (reward?`<br><b class="rw">+${fmtN(reward)} added to your bank \u{1F4B0}</b>`:'')+unlockLine(ch)+`</div>`;
    if(first){ SFX.star(3); confetti(1); } else SFX.star(2); }
  else if(timedOut && res.phase==='big'){}
  if(res.logs&&res.logs.length) html+=`<div class="rlog"><b>console.log</b><pre>${esc(res.logs.join('\n'))}</pre></div>`;
  R.innerHTML = html + R.innerHTML.replace(/^[\s\S]*?(<div class="rlist")/,'$1'); labHeader();
  if(fails.length||timedOut) SFX.err(); }
function unlockLine(ch){ const parts=[]; for(const k in LAB_GATES) for(const lv in LAB_GATES[k]) if(LAB_GATES[k][lv]===ch.id) parts.push(`${BUILD[k].n} Lv ${lv}`); const list=LAB_CH.filter(c=>c.topic===ch.topic); const nx=list[list.indexOf(ch)+1];
  let s=''; if(parts.length) s+=`<br>\u{1F513} Unlocked upgrade: <b>${parts.join(', ')}</b> (build it on the Empire map)`; if(ch.auto) s+=`<br>\u{1F916} Your script is ready! Switch it on in <b>My automation scripts</b>.`; if(nx) s+=`<br><button class="btn small gold" data-next="${nx.id}">Next challenge: ${esc(nx.title)} \u2192</button>`; return s; }
function labHint(){ const ch=LABV.ch; if(!ch) return; const L=labS(); const n=L.hints[ch.id]||0; if(n>=3) return; L.hints[ch.id]=n+1; save(); labHints(); SFX.tap(); $('labHints').lastElementChild.scrollIntoView({block:'nearest'}); }
function labReset(){ const ch=LABV.ch; if(!ch) return; if(!confirm('Reset this challenge to the starter code? Your current code will be cleared.')) return; $('edCode').value=ch.starter; edChanged(); }

/* ----- puzzles ----- */
let PZ=null;
function openPuzzle(id, fromResult){ const p=puzById(id); if(!p) return; PZ={p,fromResult,tries:0}; const t=topicOf(p.topic);
  $('pzTag').textContent=`\u{1F9E0} Brain break \u2022 ${t.n}`; $('pzQ').innerHTML=p.q; $('pzFb').innerHTML=''; $('pzFb').className='pzfb'; $('pzNext').style.display='none';
  $('pzOpts').innerHTML=p.opts.map((o,i)=>`<button class="btn pzo" data-o="${i}">${esc(o)}</button>`).join(''); modal('puz',true); }
function pzAnswer(i){ const p=PZ.p; const L=labS(); const btns=[...document.querySelectorAll('.pzo')];
  if(i===p.a){ btns.forEach(b=>b.disabled=true); btns[i].classList.add('right'); const first=!L.puz[p.id]; L.puz[p.id]=1; if(first) S.bank+=300; save();
    $('pzFb').className='pzfb good'; $('pzFb').innerHTML=`\u2714 Correct! ${esc(p.why)}${first?` <b>+${fmtN(300)}</b>`:''}`; SFX.star(2); $('pzNext').style.display='';
    if(window.renderEmpireHud) try{ renderEmpireHud(); }catch(e){} }
  else { PZ.tries++; btns[i].classList.add('wrong'); btns[i].disabled=true; $('pzFb').className='pzfb bad'; $('pzFb').innerHTML=`Not quite. Hint: ${esc(p.hint)}`; SFX.err(); } }
function nextPuzzle(){ for(const t of LAB_TOPICS){ const p=LAB_PUZ.find(p=>p.topic===t.id&&!labS().puz[p.id]); if(p) return p; } return null; }

/* ----- automation inside levels ----- */
const BOT={w:null,rid:0,pend:{},busy:false,acc:0,lastT:-1,off:false,served:0,routes:0,msgT:0};
function botOn(k){ const L=labS(); return !!(L.auto[k] && labSolved(k==='serve'?'q3':'g3') && L.good[k==='serve'?'q3':'g3']); }
function botStop(){ if(BOT.w){ try{ BOT.w.terminate(); }catch(e){} } BOT.w=null; BOT.pend={}; BOT.busy=false; }
function botStart(){ botStop(); BOT.off=false; BOT.served=0; BOT.routes=0; BOT.acc=0; const L=labS(); const codes={}; if(botOn('serve')) codes.pickNext=L.good.q3; if(botOn('route')) codes.shortestRoute=L.good.g3;
  chipUpdate(); if(!Object.keys(codes).length) return; try{ BOT.w=labWorker('bot'); }catch(e){ return; }
  BOT.w.onmessage=e=>{ const f=BOT.pend[e.data.rid]; if(f){ delete BOT.pend[e.data.rid]; f(e.data); } }; BOT.w.postMessage({type:'init',codes}); }
function botCall(fn,args){ return new Promise(res=>{ if(!BOT.w||BOT.off) return res({err:'off'}); const rid=++BOT.rid; const to=setTimeout(()=>{ delete BOT.pend[rid]; res({err:'timeout'}); botKill('Your script took too long, so I paused it for this level.'); },500); BOT.pend[rid]=v=>{ clearTimeout(to); res(v); }; BOT.w.postMessage({type:'call',rid,fn,args}); }); }
function botKill(msg){ BOT.off=true; botStop(); toast('\u{1F916} '+msg,W/2,160,'#ffd1d1'); chipUpdate(); }
function botSay(txt,col){ if(G.t-BOT.msgT<1.2) return; BOT.msgT=G.t; toast(txt,W/2,150,col||'#bff5a6'); }
function readyDishes(){ const out=[]; for(const id of G.warmer) out.push(id); for(const s of G.stations) if(s.state==='ready') out.push(STATIONS[s.id].out); for(const id of DIRECT){ const n=Math.min(6,stock(id)); for(let i=0;i<n;i++) out.push(id); } return out; }
function labTick(dt){ if(!G.on||G.paused||G.over) return; if(G.t<BOT.lastT || BOT.lastT<0) botStart(); BOT.lastT=G.t;
  if(!BOT.w||BOT.off||!botOn('serve')||G.lvl.tutorial) return; BOT.acc+=dt; if(BOT.acc<1.5||BOT.busy) return; BOT.acc=0;
  const live=G.customers.filter(cu=>!cu.leaving&&!cu.gone&&cu.x===cu.tx&&cu.order.some(o=>!o.done)); if(!live.length) return;
  const byId={}; const line=live.map(cu=>{ if(!cu.botId) cu.botId=(BOT.idSeq=(BOT.idSeq||0)+1); byId[cu.botId]=cu; return {id:cu.botId, wants:cu.order.filter(o=>!o.done).map(o=>o.id)}; });
  const ready=readyDishes(); BOT.busy=true; const startT=G.t;
  botCall('pickNext',[line,ready]).then(r=>{ BOT.busy=false; if(!G.on||G.t<startT) return;
    if(r.err){ if(r.err!=='off'&&r.err!=='timeout') botSay('\u{1F916} Script error: '+String(r.err).slice(0,60),'#ffd1d1'); return; }
    if(r.val===null||r.val===undefined) return; const cu=byId[r.val]; if(!cu||cu.leaving||cu.gone){ botSay('\u{1F916} Your script picked someone who is not in the line','#ffd1d1'); return; }
    const need=cu.order.map((o,i)=>({o,i})).filter(x=>!x.o.done); const avail=readyDishes(); for(const x of need){ const k=avail.indexOf(x.o.id); if(k<0){ botSay('\u{1F916} Script picked '+CUSTOMERS[cu.type].name+' but their food isn\u2019t ready','#ffd1d1'); return; } avail.splice(k,1); }
    let ok=0; for(const x of need) if(serveItem(cu,x.i)) ok++; if(ok){ BOT.served++; G.botServed=(G.botServed||0)+1; S.stats.botServed=(S.stats.botServed||0)+1; botSay('\u{1F916} Your script served '+(CUSTOMERS[cu.type].name||'a customer')+'!'); chipUpdate(); } }); }
function bfsLen(roads,f,t){ const adj={}; for(const [a,b] of roads){ (adj[a]=adj[a]||[]).push(b); (adj[b]=adj[b]||[]).push(a); } const d={[f]:1}; const q=[f]; for(let h=0;h<q.length;h++){ const x=q[h]; for(const y of adj[x]||[]) if(!d[y]){ d[y]=d[x]+1; q.push(y); } } return d[t]||null; }
function labRouteBonus(cu,amt){ if(!BOT.w||BOT.off||!botOn('route')) return; const places=[...new Set(LAGOS_ROADS.flat())].filter(p=>p!=='Buka'); const dest=places[Math.floor(Math.random()*places.length)]; const x=cu.x, y=cu.y;
  botCall('shortestRoute',[LAGOS_ROADS.map(r=>r.slice()),'Buka',dest]).then(r=>{ if(!G.on) return; if(r.err){ if(r.err!=='off'&&r.err!=='timeout') botSay('\u{1F6F5} Route script error: '+String(r.err).slice(0,50),'#ffd1d1'); return; }
    const want=bfsLen(LAGOS_ROADS,'Buka',dest); const p=r.val; const ok = Array.isArray(p)&&p.length===want&&p[0]==='Buka'&&p[p.length-1]===dest&&p.every((v,i)=>i===0||LAGOS_ROADS.some(([a,b])=>(a===p[i-1]&&b===v)||(b===p[i-1]&&a===v)));
    if(ok){ const bonus=Math.max(10,Math.round(amt*0.25/10)*10); G.coins+=bonus; S.stats.earned+=bonus; BOT.routes++; G.floats.push({type:'txt',txt:'\u{1F6F5} '+p.join(' \u2192 ')+'  +'+fmtN(bonus),x:Math.min(W-260,Math.max(260,x)),y:y-130,life:2.4,max:2.4,col:'#7ee05a'}); chipUpdate(); }
    else botSay('\u{1F6F5} Your route to '+dest+' no make sense. No bonus this time','#ffd1d1'); }); }
function chipUpdate(){ const el=$('botChip'); if(!el) return; const s=botOn('serve'), r=botOn('route'); if(!s&&!r){ el.style.display='none'; return; } el.style.display='';
  el.innerHTML=`\u{1F916} ${BOT.off?'Script paused':[s?'Auto-serve '+BOT.served:'',r?'GPS '+BOT.routes:''].filter(Boolean).join(' \u2022 ')}`; }

/* ----- mastery strip on the level map + brain break on results ----- */
function labMapStrip(){ const el=$('mapMastery'); if(!el) return; labS(); el.innerHTML=`<button class="mm-open" id="mmOpen">\u{1F4BB} Code Lab</button><span class="mm-t">Code mastery</span>`+LAB_TOPICS.map(t=>{ const b=labBadge(t.id), s=labTopicStats(t.id); return `<button class="mm b-${b.k}" data-topic="${t.id}" title="${t.n}: ${b.n}">${t.icon}<small>${({queue:'Queues',hash:'Hash maps',heap:'Heaps',window:'Windows',search:'Search',graph:'Graphs'})[t.id]}</small><b>${b.e} ${s.solved}/${s.n}</b></button>`; }).join(''); }
function labAfterResult(r){ const box=$('rBrain'); if(!box) return; const p=r.win? nextPuzzle():null; if(!p){ box.style.display='none'; return; } box.style.display=''; box.dataset.p=p.id; box.innerHTML=`<span>\u{1F9E0} <b>Brain break</b> \u2022 quick ${topicOf(p.topic).n.toLowerCase()} puzzle for <b>+${fmtN(300)}</b></span><button class="btn small gold" id="rBrainGo">Try it</button>`; }

/* ----- wiring ----- */
document.addEventListener('click',e=>{ const el=e.target.closest('button'); if(!el) return; auInit();
  if(el.id==='uLab'){ modal('upgrade',false); openLab('empire', el.dataset.ch); return; }
  if(el.id==='mmOpen'){ openLab('map'); return; }
  if(el.id==='rBrainGo'){ openPuzzle($('rBrain').dataset.p,true); return; }
  if(el.classList.contains('mm')){ LABV.topic=el.dataset.topic; openLab('map'); return; }
  if(el.dataset.topic && el.closest('#labTopics')){ LABV.topic=el.dataset.topic; SFX.tap(); labHome(); return; }
  if(el.dataset.ch && el.closest('#labList')){ const ch=chById(el.dataset.ch); if(!labUnlocked(ch)){ SFX.err(); const list=LAB_CH.filter(c=>c.topic===ch.topic); el.querySelector('small').textContent='Solve \u201c'+list[list.indexOf(ch)-1].title+'\u201d first'; return; } SFX.tap(); openChallenge(ch.id); return; }
  if(el.dataset.next){ SFX.tap(); openChallenge(el.dataset.next); return; }
  if(el.dataset.puz){ openPuzzle(el.dataset.puz,false); return; }
  if(el.dataset.auto){ const L=labS(); L.auto[el.dataset.auto]=!L.auto[el.dataset.auto]; save(); SFX.tap(); labHome(); return; }
  if(el.classList.contains('pzo')){ pzAnswer(+el.dataset.o); return; }
});
on('pzNext',()=>{ modal('puz',false); if(PZ&&PZ.fromResult) labAfterResult({win:true}); if($('lab').classList.contains('on')&&!LABV.ch) labHome(); });
on('pzClose',()=>{ modal('puz',false); if($('lab').classList.contains('on')&&!LABV.ch) labHome(); });
on('btnLab',()=>{ SFX.tap(); openLab('title'); }); on('empLab',()=>{ SFX.tap(); openLab('empire'); });
on('labBack',()=>{ SFX.tap(); if(LABV.w){ try{ LABV.w.terminate(); }catch(e){} LABV.running=false; } show(LABV.from||'title'); });
on('labToMap',()=>{ SFX.tap(); show('map'); });
on('edRun',labRun); on('edHint',labHint); on('edReset',labReset); on('edBack',()=>{ SFX.tap(); labHome(); });
$('edCode').addEventListener('input',edChanged); $('edCode').addEventListener('keydown',edKey); $('edCode').addEventListener('scroll',()=>{ $('edGutter').scrollTop=$('edCode').scrollTop; });
buildKeybar(); labS(); labMapStrip(); chipUpdate();
window.OKO.lab = { open:openLab, openChallenge, run:labRun, CH:LAB_CH, PUZ:LAB_PUZ, GATES:LAB_GATES, S:()=>S.lab, BOT, labTick };
