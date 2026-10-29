
"use strict";
/* ===== Oko Empire: data ===== */
const W = 1280, H = 760;
const ITEMS = {
  rice:{n:'Rice',kind:'crop'}, maize:{n:'Maize',kind:'crop'}, cassava:{n:'Cassava',kind:'crop'},
  yam:{n:'Yam',kind:'crop'}, beans:{n:'Beans',kind:'crop'}, tomato:{n:'Tomato',kind:'crop'},
  pepper:{n:'Ata rodo',kind:'crop'}, palmfruit:{n:'Palm fruit',kind:'tree'}, egg:{n:'Egg',kind:'animal'},
  milk:{n:'Goat milk',kind:'animal'},
  garri:{n:'Garri',kind:'goods',price:250}, peppermix:{n:'Pepper mix',kind:'goods'},
  palmoil:{n:'Palm oil',kind:'goods',price:300}, bread:{n:'Agege bread',kind:'goods',price:350},
  jollof:{n:'Jollof rice',kind:'dish',price:600}, yamegg:{n:'Yam & egg sauce',kind:'dish',price:650},
  akara:{n:'Akara',kind:'dish',price:350}, puffpuff:{n:'Puff-puff',kind:'dish',price:300},
  moimoi:{n:'Moi moi',kind:'dish',price:500}, soakings:{n:'Garri soakings',kind:'dish',price:400},
  eba:{n:'Eba & stew',kind:'dish',price:800}
};
// raw value for market stall
const RAWVAL = {rice:60,maize:50,cassava:60,yam:90,beans:60,tomato:50,pepper:50,palmfruit:70,egg:80,milk:90,garri:150,peppermix:140,palmoil:160,bread:200};
const FEED = ['maize','rice','beans']; // hens eat any grain
const DIRECT = ['garri','palmoil','bread']; // customers can buy these straight from the store
const MACHINES = {
  garrimill:{n:'Garri Mill', in:{cassava:1}, out:'garri', t:6, col:'#d9822b'},
  grinder:{n:'Pepper Grinder', in:{tomato:1,pepper:1}, out:'peppermix', t:4, col:'#c0392b'},
  press:{n:'Palm Oil Press', in:{palmfruit:1}, out:'palmoil', t:6, col:'#8e5a2b'},
  bakery:{n:'Bakery', in:{maize:1,egg:1}, out:'bread', t:8, col:'#b9772f'}
};
const STATIONS = {
  jollofpot:{n:'Jollof pot', in:{rice:1,peppermix:1}, out:'jollof', t:7, burn:9},
  yampan:{n:'Yam & egg', in:{yam:1,egg:1,peppermix:1}, out:'yamegg', t:7, burn:9},
  akarafryer:{n:'Akara fryer', in:{beans:1,palmoil:1}, out:'akara', t:5, burn:7},
  puffryer:{n:'Puff-puff fryer', in:{maize:1,palmoil:1}, out:'puffpuff', t:5, burn:7},
  steamer:{n:'Moi moi steamer', in:{beans:1,peppermix:1,egg:1}, out:'moimoi', t:8, burn:10},
  soakbowl:{n:'Soakings bowl', in:{garri:1,milk:1}, out:'soakings', t:2, burn:30},
  ebapot:{n:'Eba & stew', in:{garri:1,peppermix:1,palmoil:1}, out:'eba', t:8, burn:9}
};
const CROP_T = {rice:9,maize:8,cassava:10,yam:12,beans:9,tomato:8,pepper:8};
const AREAS = [
  {id:'village', n:'Village Farm', sub:'Ogbomoso outskirts', from:0, to:8, gate:null},
  {id:'town', n:'Town Buka', sub:'Ibadan junction', from:8, to:16, gate:{b:'buka',lv:1,txt:'Build your Buka to open the Town'}},
  {id:'city', n:'City Restaurant', sub:'Lekki, Lagos', from:16, to:24, gate:{b:'restaurant',lv:1,txt:'Open your Restaurant to reach the City'}}
];
/* level helper: L(area, secs, goals, plots, extras) */
function L(o){ return Object.assign({chickens:0,goats:0,palms:0,machines:[],stations:[],crows:0,maxCust:2,spawn:[10,14],patience:45,orderMax:1,menu:null,silver:0.18,gold:0.34},o); }
const LEVELS = [
 // ---- VILLAGE ----
 L({area:0,name:'First Harvest',time:165,goals:{serve:5,earn:2200},plots:['rice','rice','tomato','pepper'],machines:['grinder'],stations:['jollofpot'],menu:['jollof'],patience:55,spawn:[12,16],tutorial:true}),
 L({area:0,name:'Garri Morning',time:170,goals:{serve:7,earn:2700,make:{garri:3}},plots:['rice','rice','tomato','pepper','cassava','cassava'],machines:['grinder','garrimill'],stations:['jollofpot'],menu:['jollof','garri'],patience:50,spawn:[10,14]}),
 L({area:0,name:'Who Get Egg?',time:180,goals:{serve:8,earn:3900,make:{yamegg:3}},plots:['rice','tomato','pepper','tomato','pepper','yam','maize'],chickens:2,machines:['grinder'],stations:['jollofpot','yampan'],menu:['jollof','yamegg'],patience:50,spawn:[10,14]}),
 L({area:0,name:'Red Gold',time:200,goals:{serve:8,earn:3400,make:{palmoil:4}},plots:['beans','beans','cassava','tomato','pepper','rice'],palms:3,machines:['press','grinder','garrimill'],stations:['akarafryer','jollofpot'],menu:['akara','jollof','palmoil','garri'],patience:50,spawn:[9,13],maxCust:3}),
 L({area:0,name:'Crow Trouble',time:200,goals:{serve:9,earn:4400},plots:['rice','tomato','pepper','tomato','pepper','beans','yam','maize'],chickens:2,palms:1,machines:['grinder','press'],stations:['jollofpot','akarafryer','yampan'],menu:['jollof','akara','yamegg'],crows:1,patience:48,spawn:[9,12],maxCust:3}),
 L({area:0,name:'Goat Milk Rush',time:200,goals:{serve:10,earn:4200,make:{soakings:4}},plots:['cassava','cassava','rice','tomato','pepper','beans'],goats:1,palms:1,machines:['garrimill','grinder','press'],stations:['soakbowl','jollofpot','akarafryer'],menu:['soakings','jollof','akara'],patience:46,spawn:[8,12],maxCust:3}),
 L({area:0,name:'Moi Moi Sunday',time:210,goals:{serve:11,earn:5600,make:{moimoi:4}},plots:['beans','beans','tomato','pepper','tomato','pepper','rice','maize'],chickens:2,machines:['grinder'],stations:['steamer','jollofpot'],menu:['moimoi','jollof'],orderMax:2,crows:1,patience:50,spawn:[9,13],maxCust:3}),
 L({area:0,name:'Village Feast',time:240,goals:{serve:11,earn:6300,make:{peppermix:6}},plots:['rice','tomato','pepper','tomato','pepper','beans','yam','maize','cassava'],chickens:2,goats:1,palms:1,machines:['grinder','garrimill','press'],stations:['jollofpot','yampan','akarafryer','soakbowl'],menu:['jollof','yamegg','akara','soakings'],orderMax:2,crows:1,patience:54,spawn:[8,11],maxCust:3}),
 // ---- TOWN ----
 L({area:1,name:'Buka Opens',time:210,goals:{serve:12,earn:6000,make:{bread:4}},plots:['maize','maize','rice','tomato','pepper','beans'],chickens:3,palms:1,machines:['bakery','grinder','press'],stations:['jollofpot','akarafryer'],menu:['bread','jollof','akara'],patience:44,spawn:[7,10],maxCust:4}),
 L({area:1,name:'Puff-puff Corner',time:210,goals:{serve:13,earn:6000,make:{puffpuff:6}},plots:['maize','maize','maize','beans','beans','cassava'],palms:2,goats:1,machines:['press','garrimill'],stations:['puffryer','akarafryer','soakbowl'],menu:['puffpuff','akara','soakings'],orderMax:2,patience:46,spawn:[7,10],maxCust:4}),
 L({area:1,name:'Danfo Rush Hour',time:210,goals:{serve:14,earn:8500},plots:['rice','rice','tomato','pepper','tomato','pepper','yam','beans','maize'],chickens:3,palms:1,machines:['grinder','grinder','press'],stations:['jollofpot','yampan','akarafryer','steamer'],menu:['jollof','yamegg','akara','moimoi'],orderMax:2,crows:1,patience:42,spawn:[6,9],maxCust:4}),
 L({area:1,name:'Market Day',time:220,goals:{serve:14,earn:8000,make:{garri:6,palmoil:6}},plots:['cassava','cassava','cassava','maize','maize','beans','tomato','pepper'],chickens:2,palms:2,machines:['garrimill','press','bakery','grinder'],stations:['akarafryer','puffryer'],menu:['garri','palmoil','bread','akara','puffpuff'],orderMax:2,crows:1,patience:42,spawn:[6,9],maxCust:4}),
 L({area:1,name:'Owambe Prep',time:230,goals:{serve:15,earn:10500,make:{jollof:8}},plots:['rice','rice','rice','tomato','pepper','tomato','pepper','beans','maize'],chickens:3,palms:1,machines:['grinder','grinder','press'],stations:['jollofpot','steamer','puffryer'],menu:['jollof','moimoi','puffpuff'],orderMax:2,crows:1,patience:42,spawn:[6,9],maxCust:4}),
 L({area:1,name:'NEPA Took Light',time:220,goals:{serve:15,earn:9500},plots:['cassava','cassava','tomato','pepper','tomato','pepper','yam','maize','beans'],chickens:2,goats:2,palms:1,machines:['garrimill','grinder','press','bakery'],stations:['soakbowl','yampan','akarafryer'],menu:['soakings','yamegg','akara','bread'],orderMax:2,crows:2,patience:40,spawn:[6,8],maxCust:4}),
 L({area:1,name:'Student Lunch',time:220,goals:{serve:17,earn:10000,make:{akara:6,puffpuff:6}},plots:['beans','beans','maize','maize','maize','cassava'],palms:3,goats:1,machines:['press','garrimill'],stations:['akarafryer','puffryer','soakbowl'],menu:['akara','puffpuff','soakings'],orderMax:3,crows:1,patience:40,spawn:[5,8],maxCust:4}),
 L({area:1,name:'Town Champion',time:260,goals:{serve:16,earn:12500,make:{moimoi:4,yamegg:4}},plots:['rice','tomato','pepper','tomato','pepper','beans','beans','yam','maize'],chickens:3,palms:1,machines:['grinder','grinder','press'],stations:['jollofpot','yampan','steamer','akarafryer'],menu:['jollof','yamegg','moimoi','akara'],orderMax:3,crows:2,patience:44,spawn:[5,8],maxCust:4}),
 // ---- CITY ----
 L({area:2,name:'Lekki Opening',time:220,goals:{serve:16,earn:12000,make:{eba:5}},plots:['cassava','cassava','tomato','pepper','tomato','pepper','rice','rice'],palms:2,machines:['garrimill','grinder','press'],stations:['ebapot','jollofpot'],menu:['eba','jollof','garri'],orderMax:2,crows:1,patience:38,spawn:[5,8],maxCust:5}),
 L({area:2,name:'Tech Bros Order',time:220,goals:{serve:17,earn:13000},plots:['beans','beans','maize','maize','cassava','cassava','tomato','pepper'],chickens:2,goats:1,palms:2,machines:['press','garrimill','grinder','bakery'],stations:['akarafryer','puffryer','soakbowl','steamer'],menu:['akara','puffpuff','soakings','moimoi','bread'],orderMax:2,crows:1,patience:36,spawn:[5,7],maxCust:5}),
 L({area:2,name:'Third Mainland Jam',time:230,goals:{serve:18,earn:16000,make:{jollof:6,eba:4}},plots:['rice','rice','cassava','tomato','pepper','tomato','pepper','yam','tomato'],chickens:3,palms:2,machines:['grinder','grinder','garrimill','press'],stations:['jollofpot','ebapot','yampan'],menu:['jollof','eba','yamegg'],orderMax:3,crows:2,patience:38,spawn:[5,7],maxCust:5}),
 L({area:2,name:'Detty December',time:240,goals:{serve:20,earn:17000,make:{puffpuff:6,soakings:4}},plots:['maize','maize','maize','cassava','cassava','beans','tomato','pepper','beans'],chickens:2,goats:2,palms:2,machines:['press','garrimill','grinder'],stations:['puffryer','soakbowl','akarafryer','steamer'],menu:['puffpuff','soakings','akara','moimoi'],orderMax:3,crows:2,patience:34,spawn:[4,7],maxCust:5}),
 L({area:2,name:'Food Critic',time:230,goals:{serve:18,earn:16500,make:{moimoi:5}},plots:['beans','beans','tomato','pepper','tomato','pepper','rice','maize','cassava'],chickens:3,palms:2,machines:['grinder','grinder','press','garrimill'],stations:['steamer','jollofpot','ebapot'],menu:['moimoi','jollof','eba'],orderMax:3,crows:2,patience:33,spawn:[5,7],maxCust:5}),
 L({area:2,name:'Catering Contract',time:250,goals:{serve:22,earn:21000,make:{jollof:8,bread:5}},plots:['rice','rice','beans','tomato','pepper','tomato','pepper','maize','maize'],chickens:3,palms:2,machines:['grinder','bakery','press'],stations:['jollofpot','akarafryer','puffryer'],menu:['jollof','bread','puffpuff','akara'],orderMax:3,crows:2,patience:34,spawn:[4,6],maxCust:5}),
 L({area:2,name:'Blackout Banquet',time:250,goals:{serve:22,earn:23000,make:{eba:5,yamegg:5}},plots:['cassava','cassava','tomato','pepper','tomato','pepper','yam','yam','rice'],chickens:3,goats:1,palms:2,machines:['garrimill','grinder','grinder','press'],stations:['ebapot','yampan','jollofpot','soakbowl'],menu:['eba','yamegg','jollof','soakings'],orderMax:3,crows:3,patience:31,spawn:[4,6],maxCust:5}),
 L({area:2,name:'Empress of Lagos',time:295,goals:{serve:20,earn:22000,make:{jollof:4,moimoi:4,eba:3}},plots:['rice','cassava','beans','tomato','pepper','tomato','pepper','yam','maize'],chickens:3,goats:1,palms:2,machines:['grinder','grinder','garrimill','press'],stations:['jollofpot','steamer','ebapot','yampan','akarafryer','soakbowl'],menu:['jollof','moimoi','eba','yamegg','akara','soakings'],orderMax:3,crows:3,patience:38,spawn:[5,7],maxCust:5})
];
/* Buildings on the empire map */
const BUILD = {
  farm:{n:'Farm Plots',area:0,costs:[0,1500,4000,9000,18000],desc:['Starter plots','Crops grow 12% faster','Crops grow 24% faster, +1 harvest','Crops grow 36% faster','Crops grow 48% faster, +2 harvest'],start:1},
  coop:{n:'Chicken Coop',area:0,costs:[1200,3500,8000],desc:['+1 hen in every level','+2 hens, eggs faster','+3 hens, eggs much faster']},
  pen:{n:'Goat Pen',area:0,costs:[1500,4500,9000],desc:['Goats give milk 20% faster','40% faster, +1 milk','60% faster, +1 milk']},
  store:{n:'Barn Store',area:0,costs:[0,2000,5000,11000],desc:['Holds 20 items (+4 in Town, +8 in City)','Holds 26 items','Holds 32 items','Holds 40 items'],start:1},
  mills:{n:'Mill House',area:0,costs:[2500,6000,14000],desc:['Machines work 20% faster','40% faster','60% faster, and they start themselves']},
  buka:{n:'Buka',area:1,costs:[9000,16000,30000],desc:['Opens the Town. Customers wait 10% longer','+20% patience, +1 warmer slot','+30% patience, bigger tips']},
  kitchen:{n:'Kitchen Gear',area:1,costs:[5000,12000,24000],desc:['Cook 15% faster','30% faster, food burns slower','45% faster, food barely burns']},
  stall:{n:'Market Stall',area:1,costs:[7000,15000,28000],desc:['Sell leftover stock at 40% after each level','Sell at 60%','Sell at 80%']},
  bike:{n:'Delivery Bike',area:1,costs:[12000,25000],desc:['Delivery orders pay 1.6x','Delivery orders pay 2x, come more often']},
  restaurant:{n:'Restaurant',area:2,costs:[40000,70000,110000],desc:['Opens the City. Dishes sell for 10% more','+20% prices','+35% prices']},
  compound:{n:'Family Compound',area:2,costs:[60000,120000,200000],desc:['A home for the family. +5% all income','Duplex. +10% all income','Mansion with a fountain. +15% all income']}
};
const ACH = [
  {id:'harvest',n:'First Harvest',d:'Harvest your first crop'},
  {id:'serve1',n:'Open for Business',d:'Serve your first customer'},
  {id:'star3',n:'Three Star Cook',d:'Get 3 stars on any level'},
  {id:'garri50',n:'Garri Factory',d:'Make 50 garri'},
  {id:'serve100',n:'Crowd Pleaser',d:'Serve 100 customers'},
  {id:'serve500',n:'Lagos Legend',d:'Serve 500 customers'},
  {id:'earn100k',n:'Naira Rain',d:'Earn \u20a6100,000 in total'},
  {id:'crow20',n:'Scarecrow',d:'Chase away 20 crows'},
  {id:'perfect',n:'No Customer Left Behind',d:'Finish a level without losing a customer'},
  {id:'combo',n:'Speed Merchant',d:'Serve 3 customers within 6 seconds'},
  {id:'buka',n:'Buka Boss',d:'Build your Buka'},
  {id:'restaurant',n:'Fine Dining',d:'Open your Restaurant'},
  {id:'village',n:'Village Done',d:'Finish all Village levels'},
  {id:'town',n:'Town Done',d:'Finish all Town levels'},
  {id:'city',n:'City Done',d:'Finish all City levels'},
  {id:'allstars',n:'Perfectionist',d:'3 stars on all 24 levels'},
  {id:'empire',n:'Empire Builder',d:'Build every building at least once'},
  {id:'mansion',n:'Mansion Life',d:'Upgrade the Compound to a Mansion'}
];
const CUSTOMERS = [
  {name:'Mama Nkechi',skin:'#7a4a2a',top:'#e74c3c',pat:'#f1c40f',hair:'gele',gele:'#8e44ad'},
  {name:'Okada Man',skin:'#5b3a22',top:'#2e86c1',pat:'#f39c12',hair:'cap',gele:'#1f3a5f'},
  {name:'Aunty Bisi',skin:'#8a5a36',top:'#16a085',pat:'#f5b7b1',hair:'gele',gele:'#e67e22'},
  {name:'Student Tunde',skin:'#6b4226',top:'#f39c12',pat:'#2c3e50',hair:'short',gele:'#222'},
  {name:'Chief Okafor',skin:'#4e2f1a',top:'#ecf0f1',pat:'#c0392b',hair:'fila',gele:'#a93226'},
  {name:'Baby Girl Ada',skin:'#94603a',top:'#ff7eb6',pat:'#fff',hair:'puffs',gele:'#222'},
  {name:'Engineer Musa',skin:'#5e3b20',top:'#27ae60',pat:'#d4ac0d',hair:'kufi',gele:'#fdfefe'},
  {name:'Madam Funke',skin:'#7d4b2a',top:'#9b59b6',pat:'#f7dc6f',hair:'braids',gele:'#3b2414'}
];


/* ===== Save ===== */
const SAVE_KEY = 'okoEmpire.v1';
function freshSave(){ return {v:1, lab:{solved:{},code:{},good:{},hints:{},puz:{},auto:{serve:false,route:false}}, stars:Array(LEVELS.length).fill(0), best:Array(LEVELS.length).fill(0), bank:0,
  build:{farm:1,store:1}, stats:{served:0,earned:0,garri:0,crows:0,harvests:0,levelsWon:0}, ach:{}, music:true, sfx:true, seenIntro:false}; }
let S = freshSave();
function loadSave(){ try{ const raw = localStorage.getItem(SAVE_KEY); if(raw){ const o = JSON.parse(raw); S = Object.assign(freshSave(), o); S.stats = Object.assign(freshSave().stats, o.stats||{}); S.build = Object.assign({farm:1,store:1}, o.build||{});
  while(S.stars.length<LEVELS.length){S.stars.push(0);S.best.push(0);} } }catch(e){ S = freshSave(); } }
function save(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){} }
function bl(k){ return S.build[k]||0; }
function totalStars(){ return S.stars.reduce((a,b)=>a+b,0); }
function levelUnlocked(i){ if(i===0) return true; if(S.stars[i-1]<=0) return false; const a = AREAS[LEVELS[i].area]; if(i===a.from && a.gate && bl(a.gate.b)<a.gate.lv) return false; return true; }
function gateBlocked(i){ const a = AREAS[LEVELS[i].area]; return i===a.from && a.gate && bl(a.gate.b)<a.gate.lv && (i===0||S.stars[i-1]>0); }

/* ===== Audio (all synthesised) ===== */
const AU = { ctx:null, master:null, sfxG:null, musG:null, musicOn:false, nextBeat:0, step:0, timer:null };
function auInit(){
  if(AU.ctx) { if(AU.ctx.state==='suspended') AU.ctx.resume(); return; }
  const C = window.AudioContext || window.webkitAudioContext; if(!C) return;
  AU.ctx = new C(); AU.master = AU.ctx.createGain(); AU.master.gain.value = 0.8; AU.master.connect(AU.ctx.destination);
  AU.sfxG = AU.ctx.createGain(); AU.sfxG.gain.value = S.sfx?0.9:0; AU.sfxG.connect(AU.master);
  AU.musG = AU.ctx.createGain(); AU.musG.gain.value = S.music?0.32:0; AU.musG.connect(AU.master);
  // noise buffer
  const len = AU.ctx.sampleRate*1; const b = AU.ctx.createBuffer(1,len,AU.ctx.sampleRate); const d = b.getChannelData(0);
  for(let i=0;i<len;i++) d[i]=Math.random()*2-1; AU.noise = b;
  startMusic();
}
function auSet(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; AU.sfxG.gain.setTargetAtTime(S.sfx?0.9:0,t,0.05); AU.musG.gain.setTargetAtTime(S.music?0.32:0,t,0.2); }
function env(g,t,a,peak,dec,sus=0.0001){ g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(peak,t+a); g.gain.exponentialRampToValueAtTime(Math.max(sus,0.0001),t+a+dec); }
function osc(type,f,t,dur,peak,dest,glideTo){ const c=AU.ctx; const o=c.createOscillator(), g=c.createGain(); o.type=type; o.frequency.setValueAtTime(f,t); if(glideTo) o.frequency.exponentialRampToValueAtTime(glideTo,t+dur); env(g,t,0.005,peak,dur); o.connect(g); g.connect(dest||AU.sfxG); o.start(t); o.stop(t+dur+0.05); }
function noiseHit(t,dur,peak,freq,q,dest,type='bandpass'){ const c=AU.ctx; const s=c.createBufferSource(); s.buffer=AU.noise; const f=c.createBiquadFilter(); f.type=type; f.frequency.value=freq; f.Q.value=q; const g=c.createGain(); env(g,t,0.003,peak,dur); s.connect(f); f.connect(g); g.connect(dest||AU.sfxG); s.start(t, Math.random()*0.5); s.stop(t+dur+0.05); }
// talking drum: pitch glides like the gangan
function drum(t,f=180,to=110,peak=0.7,dest){ osc('sine',f,t,0.28,peak,dest,to); osc('triangle',f*2.01,t,0.06,peak*0.25,dest,to*2); noiseHit(t,0.03,peak*0.2,1200,1,dest); }
function shekere(t,peak=0.25,dest){ noiseHit(t,0.07,peak,6500,1.2,dest,'highpass'); }
function bell(t,f,peak=0.25,dest){ osc('sine',f,t,0.35,peak,dest); osc('sine',f*2.76,t,0.12,peak*0.3,dest); }
const SFX = {
  tap(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; osc('triangle',660,t,0.06,0.18); },
  plant(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; noiseHit(t,0.09,0.35,900,2); osc('sine',300,t,0.12,0.25,null,200); },
  harvest(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; shekere(t,0.3); osc('triangle',520,t,0.1,0.3); osc('triangle',780,t+0.07,0.12,0.3); },
  coin(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; bell(t,1318,0.22); bell(t+0.08,1760,0.22); },
  serve(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; drum(t,220,140,0.6); bell(t+0.05,1046,0.2); },
  pay(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; for(let i=0;i<4;i++) bell(t+i*0.06,1046+i*220,0.18); shekere(t,0.25); },
  cook(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; noiseHit(t,0.35,0.18,3000,0.6); },
  ding(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; bell(t,1568,0.3); },
  burn(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; osc('sawtooth',200,t,0.4,0.12,null,80); noiseHit(t,0.4,0.2,600,0.8); },
  angry(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; osc('square',260,t,0.28,0.1,null,140); drum(t,120,70,0.5); },
  err(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; osc('square',180,t,0.12,0.08); osc('square',150,t+0.1,0.14,0.08); },
  crow(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; osc('sawtooth',900,t,0.15,0.08,null,500); osc('sawtooth',850,t+0.16,0.15,0.07,null,450); },
  shoo(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; noiseHit(t,0.2,0.3,2000,0.5); osc('triangle',400,t,0.15,0.2,null,900); },
  cluck(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; osc('square',700,t,0.05,0.06,null,500); osc('square',650,t+0.07,0.05,0.05,null,480); },
  machine(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; for(let i=0;i<3;i++) noiseHit(t+i*0.08,0.06,0.15,400,3); },
  star(i){ if(!AU.ctx) return; const t=AU.ctx.currentTime; drum(t,200+i*40,120+i*30,0.8); bell(t+0.02,880*(1+i*0.25),0.3); shekere(t,0.3); },
  tick(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; bell(t,2093,0.08); },
  win(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; const n=[523,659,784,1046,784,1046,1318]; n.forEach((f,i)=>{osc('triangle',f,t+i*0.1,0.3,0.25); if(i%2==0) drum(t+i*0.1,200,120,0.5);}); },
  lose(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; [392,349,311,262].forEach((f,i)=>osc('triangle',f,t+i*0.18,0.35,0.22)); },
  build(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; for(let i=0;i<4;i++){ noiseHit(t+i*0.12,0.06,0.4,1500,4); } SFX.win(); },
  warn(){ if(!AU.ctx) return; const t=AU.ctx.currentTime; drum(t,300,200,0.4); drum(t+0.15,300,200,0.4); }
};
/* Highlife-ish loop: palm-wine guitar arpeggio, bass, agogo bell, shekere, talking drum fills */
const PROG = [[0,4,7],[5,9,12],[7,11,14],[0,4,7]]; // I IV V I in C
function startMusic(){
  if(AU.timer) return; AU.nextBeat = AU.ctx.currentTime+0.1; AU.step=0;
  AU.timer = setInterval(schedMusic, 50);
}
function pluck(t,f,peak){ const c=AU.ctx; const o=c.createOscillator(), o2=c.createOscillator(), g=c.createGain(), fl=c.createBiquadFilter();
  o.type='triangle'; o2.type='sawtooth'; o.frequency.value=f; o2.frequency.value=f*1.003; fl.type='lowpass'; fl.frequency.setValueAtTime(f*6,t); fl.frequency.exponentialRampToValueAtTime(f*1.5,t+0.25);
  const g2=c.createGain(); g2.gain.value=0.25; o2.connect(g2); g2.connect(fl); o.connect(fl); fl.connect(g); env(g,t,0.004,peak,0.32); g.connect(AU.musG); o.start(t); o2.start(t); o.stop(t+0.4); o2.stop(t+0.4); }
function schedMusic(){
  if(!AU.ctx) return; const spb = 60/116/2; // eighth notes at 116 bpm
  while(AU.nextBeat < AU.ctx.currentTime + 0.2){
    const t = AU.nextBeat, s = AU.step % 64, bar = Math.floor(s/16)%4, e = s%16; const ch = PROG[bar]; const root = 261.63;
    const semi = n => root*Math.pow(2,n/12);
    // guitar arpeggio pattern (palm-wine style)
    const pat = [0,2,1,2, 0,2,1,2, 0,1,2,1, 0,2,1,2];
    if(e%2===0 || e===7 || e===11) pluck(t, semi(ch[pat[e]] + (e>=8&&e%4===3?12:0)), 0.22);
    if(e===3||e===13) pluck(t, semi(ch[2]+12), 0.12);
    // bass
    if(e===0) pluck(t, semi(ch[0]-24), 0.5); if(e===6) pluck(t, semi(ch[1]-24), 0.35); if(e===10) pluck(t, semi(ch[2]-24), 0.35); if(e===12) pluck(t, semi(ch[0]-12), 0.3);
    // agogo bell (standard highlife bell)
    const bellPat=[1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0]; if(bellPat[e]) bell(t, e%4===0?880:1320, 0.05, AU.musG);
    // shekere on offbeats
    shekere(t, e%2? 0.12:0.05, AU.musG);
    // talking drum fill at the end of each 4 bars
    if(s>=56 && (e===8||e===10||e===12||e===13||e===14)) drum(t, 240-(e-8)*12, 130, 0.25, AU.musG);
    if(e===0||e===8) drum(t,90,60,0.35,AU.musG);
    AU.nextBeat += spb; AU.step++;
  }
}


/* ===== Art: everything is drawn in code ===== */
const OUT = '#3a2210';
function rr(c,x,y,w,h,r){ r=Math.min(r,w/2,h/2); c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
function lg(c,x0,y0,x1,y1,stops){ const g=c.createLinearGradient(x0,y0,x1,y1); stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s)); return g; }
function rg(c,x,y,r0,r1,stops){ const g=c.createRadialGradient(x,y,r0,x,y,r1); stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s)); return g; }
function ell(c,x,y,rx,ry,rot=0){ c.beginPath(); c.ellipse(x,y,Math.max(rx,0.1),Math.max(ry,0.1),rot,0,Math.PI*2); }
function fillStroke(c,fill,lw=3,stroke=OUT){ c.fillStyle=fill; c.fill(); if(lw){ c.lineWidth=lw; c.strokeStyle=stroke; c.lineJoin='round'; c.stroke(); } }
function shine(c,x,y,rx,ry,a=0.55){ c.save(); ell(c,x,y,rx,ry,-0.5); c.fillStyle=`rgba(255,255,255,${a})`; c.fill(); c.restore(); }
function shadow(c,x,y,rx,ry,a=0.25){ ell(c,x,y,rx,ry); c.fillStyle=`rgba(40,20,0,${a})`; c.fill(); }
function plate(c,s){ shadow(c,0,s*0.3,s*0.46,s*0.12,0.2); ell(c,0,s*0.18,s*0.46,s*0.2); fillStroke(c,lg(c,0,0,0,s*0.4,['#ffffff','#d9dde3']),s*0.04); ell(c,0,s*0.16,s*0.34,s*0.13); c.fillStyle='#eef1f5'; c.fill(); }
function bowl(c,s,col='#c0392b'){ shadow(c,0,s*0.34,s*0.4,s*0.1,0.2); c.beginPath(); c.moveTo(-s*0.42,0); c.quadraticCurveTo(-s*0.38,s*0.36,0,s*0.36); c.quadraticCurveTo(s*0.38,s*0.36,s*0.42,0); c.closePath(); fillStroke(c,lg(c,0,0,0,s*0.36,[col,shade(col,-0.35)]),s*0.04); }
function shade(hex,amt){ let c=hex.replace('#',''); if(c.length===3) c=c.split('').map(x=>x+x).join(''); let r=parseInt(c.substr(0,2),16),g=parseInt(c.substr(2,2),16),b=parseInt(c.substr(4,2),16);
  const f=v=>Math.max(0,Math.min(255,Math.round(amt<0? v*(1+amt) : v+(255-v)*amt))); return '#'+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,'0')).join(''); }
// seeded random for consistent textures
function srand(seed){ let s=seed>>>0||1; return ()=>{ s^=s<<13; s^=s>>>17; s^=s<<5; return ((s>>>0)%10000)/10000; }; }

const ICON = {
  rice(c,s){ // burlap sack of rice
    c.beginPath(); c.moveTo(-s*0.3,-s*0.18); c.quadraticCurveTo(-s*0.42,s*0.3,-s*0.28,s*0.38); c.lineTo(s*0.28,s*0.38); c.quadraticCurveTo(s*0.42,s*0.3,s*0.3,-s*0.18); c.closePath(); fillStroke(c,lg(c,-s*.3,0,s*.3,0,['#e8cf98','#d4b06a','#b8904c']),s*0.04);
    ell(c,0,-s*0.2,s*0.3,s*0.1); fillStroke(c,'#f8f6ee',s*0.035); const r=srand(5); c.fillStyle='#fff'; for(let i=0;i<14;i++){ ell(c,(r()-0.5)*s*0.44,-s*0.2-r()*s*0.12+s*0.03,s*0.035,s*0.018,r()*3); c.fill(); }
    c.fillStyle='#2e8b57'; rr(c,-s*0.16,s*0.04,s*0.32,s*0.14,s*0.03); c.fill(); c.fillStyle='#fff'; c.font=`bold ${s*0.1}px sans-serif`; c.textAlign='center'; c.textBaseline='middle'; c.fillText('RICE',0,s*0.115); },
  maize(c,s){ c.save(); c.rotate(-0.5);
    ell(c,0,0,s*0.17,s*0.4); fillStroke(c,lg(c,-s*.17,0,s*.17,0,['#f7dc6f','#f4c20d','#d4a106']),s*0.04);
    c.fillStyle='rgba(160,110,0,0.35)'; for(let i=-3;i<=3;i++){ for(let j=-1;j<=1;j++){ ell(c,j*s*0.085,i*s*0.1,s*0.035,s*0.04); c.fill(); } }
    c.beginPath(); c.moveTo(0,s*0.42); c.quadraticCurveTo(-s*0.32,s*0.1,-s*0.12,-s*0.32); c.quadraticCurveTo(-s*0.12,s*0.1,0,s*0.25); fillStroke(c,'#58a83c',s*0.035);
    c.beginPath(); c.moveTo(0,s*0.42); c.quadraticCurveTo(s*0.32,s*0.1,s*0.14,-s*0.28); c.quadraticCurveTo(s*0.12,s*0.12,0,s*0.25); fillStroke(c,'#6cc04a',s*0.035); c.restore(); },
  cassava(c,s){ c.save(); c.rotate(-0.6);
    c.beginPath(); c.moveTo(-s*0.08,-s*0.42); c.quadraticCurveTo(s*0.2,-s*0.2,s*0.12,s*0.2); c.quadraticCurveTo(s*0.06,s*0.42,-s*0.02,s*0.44); c.quadraticCurveTo(-s*0.16,s*0.1,-s*0.14,-s*0.3); c.closePath(); fillStroke(c,lg(c,-s*.15,0,s*.15,0,['#8b5a2b','#a8703d','#6e4420']),s*0.04);
    c.strokeStyle='rgba(60,30,10,.5)'; c.lineWidth=s*0.02; for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(-s*0.12,-s*0.2+i*s*0.13); c.lineTo(s*0.12,-s*0.16+i*s*0.13); c.stroke(); }
    ell(c,-s*0.08,-s*0.4,s*0.08,s*0.05); fillStroke(c,'#fbf3dc',s*0.03); c.restore();
    c.save(); c.translate(s*0.12,s*0.05); c.rotate(-0.2); ell(c,0,0,s*0.09,s*0.3); fillStroke(c,lg(c,-s*.1,0,s*.1,0,['#9c6535','#b67b44','#774a24']),s*0.035); ell(c,0,-s*0.28,s*0.07,s*0.04); fillStroke(c,'#fbf3dc',s*0.025); c.restore(); },
  yam(c,s){ c.beginPath(); c.moveTo(-s*0.42,-s*0.05); c.bezierCurveTo(-s*0.4,-s*0.3,s*0.2,-s*0.3,s*0.42,-s*0.1); c.bezierCurveTo(s*0.5,s*0.08,s*0.35,s*0.28,s*0.05,s*0.25); c.bezierCurveTo(-s*0.25,s*0.24,-s*0.44,s*0.15,-s*0.42,-s*0.05); c.closePath();
    fillStroke(c,lg(c,0,-s*.3,0,s*.3,['#9a7650','#7a5532','#5a3a1e']),s*0.04); const r=srand(9); c.fillStyle='rgba(40,20,5,.45)'; for(let i=0;i<22;i++){ ell(c,(r()-0.5)*s*0.7,(r()-0.5)*s*0.34,s*0.02,s*0.012); c.fill(); }
    ell(c,s*0.39,-s*0.07,s*0.06,s*0.1,0.3); fillStroke(c,'#f6ecd2',s*0.025); shine(c,-s*0.1,-s*0.12,s*0.15,s*0.04,0.25); },
  beans(c,s){ const r=srand(3); const pts=[]; for(let i=0;i<9;i++){ pts.push([(r()-0.5)*s*0.55,(r()-0.2)*s*0.3+ (i<3?-s*0.1:0)]); } pts.sort((a,b)=>a[1]-b[1]);
    shadow(c,0,s*0.25,s*0.36,s*0.08,0.2); pts.forEach(p=>{ c.save(); c.translate(p[0],p[1]); c.rotate(r()*3); ell(c,0,0,s*0.12,s*0.085); fillStroke(c,lg(c,0,-s*.08,0,s*.08,['#fffbe9','#efe2bf']),s*0.025); ell(c,s*0.02,0,s*0.035,s*0.025); c.fillStyle='#1b1b1b'; c.fill(); c.restore(); }); },
  tomato(c,s){ ell(c,0,s*0.05,s*0.38,s*0.33); fillStroke(c,rg(c,-s*.12,-s*.08,s*.05,s*.45,['#ff6b5a','#e3261b','#a5150d']),s*0.04);
    c.beginPath(); for(let i=0;i<5;i++){ const a=i/5*Math.PI*2-Math.PI/2; c.lineTo(Math.cos(a)*s*0.2,-s*0.22+Math.sin(a)*s*0.08); c.lineTo(Math.cos(a+0.6)*s*0.06,-s*0.22+Math.sin(a+0.6)*s*0.03); } c.closePath(); fillStroke(c,'#3fa34d',s*0.025);
    c.fillStyle='#2d7a37'; rr(c,-s*0.025,-s*0.36,s*0.05,s*0.13,s*0.02); c.fill(); shine(c,-s*0.15,-s*0.06,s*0.1,s*0.06); },
  pepper(c,s){ // two ata rodo (scotch bonnet) peppers: one red, one yellow
    const one=(x,y,sc,cols,rot)=>{ c.save(); c.translate(x,y); c.rotate(rot); c.scale(sc,sc);
      c.beginPath(); c.moveTo(-s*0.26,-s*0.08); c.bezierCurveTo(-s*0.34,s*0.18,-s*0.18,s*0.32,-s*0.06,s*0.26); c.bezierCurveTo(-s*0.02,s*0.36,s*0.08,s*0.36,s*0.12,s*0.26); c.bezierCurveTo(s*0.3,s*0.28,s*0.34,s*0.02,s*0.26,-s*0.08); c.bezierCurveTo(s*0.16,-s*0.2,-s*0.16,-s*0.2,-s*0.26,-s*0.08); c.closePath();
      fillStroke(c,rg(c,-s*.08,-s*.04,s*.03,s*.36,cols),s*0.045);
      c.strokeStyle='rgba(0,0,0,.18)'; c.lineWidth=s*0.025; c.beginPath(); c.moveTo(-s*0.06,s*0.24); c.quadraticCurveTo(-s*0.1,0,-s*0.04,-s*0.14); c.moveTo(s*0.1,s*0.24); c.quadraticCurveTo(s*0.14,0,s*0.08,-s*0.14); c.stroke();
      c.beginPath(); c.moveTo(-s*0.12,-s*0.15); c.quadraticCurveTo(0,-s*0.24,s*0.12,-s*0.15); c.quadraticCurveTo(0,-s*0.09,-s*0.12,-s*0.15); fillStroke(c,'#3c9a3a',s*0.03);
      c.beginPath(); c.moveTo(0,-s*0.18); c.bezierCurveTo(s*0.02,-s*0.32,s*0.14,-s*0.34,s*0.16,-s*0.44); c.lineWidth=s*0.07; c.strokeStyle='#2f7d2c'; c.lineCap='round'; c.stroke(); shine(c,-s*0.12,0,s*0.06,s*0.1,0.5); c.restore(); };
    one(s*0.14,s*0.04,0.8,['#ffe35a','#f7a600','#c86f00'],0.35); one(-s*0.12,s*0.08,0.92,['#ff6a3d','#e0280e','#a51504'],-0.25); },
  palmfruit(c,s){ shadow(c,0,s*0.32,s*0.34,s*0.08,0.22); const r=srand(7); for(let i=0;i<16;i++){ const a=r()*Math.PI*2, d=r()*s*0.24; const x=Math.cos(a)*d, y=Math.sin(a)*d*0.85;
      ell(c,x,y,s*0.1,s*0.085,a); fillStroke(c,rg(c,x-s*.03,y-s*.03,s*.01,s*.11,['#ff9a3c','#d9420e','#3a0d05']),s*0.022); }
    c.strokeStyle='#4f7a28'; c.lineWidth=s*0.04; for(let i=0;i<5;i++){ c.beginPath(); const a=-Math.PI/2+(i-2)*0.35; c.moveTo(0,-s*0.15); c.lineTo(Math.cos(a)*s*0.42,Math.sin(a)*s*0.42); c.stroke(); } },
  egg(c,s){ shadow(c,0,s*0.34,s*0.24,s*0.07,0.22); c.beginPath(); c.moveTo(0,-s*0.38); c.bezierCurveTo(s*0.3,-s*0.36,s*0.32,s*0.32,0,s*0.33); c.bezierCurveTo(-s*0.32,s*0.32,-s*0.3,-s*0.36,0,-s*0.38); fillStroke(c,rg(c,-s*.08,-s*.1,s*.02,s*.4,['#fffaf0','#f6e3c4','#d9b98a']),s*0.04); shine(c,-s*0.09,-s*0.14,s*0.06,s*0.1,0.7); },
  milk(c,s){ // clay jug
    c.beginPath(); c.moveTo(-s*0.12,-s*0.34); c.lineTo(s*0.12,-s*0.34); c.lineTo(s*0.1,-s*0.22); c.bezierCurveTo(s*0.36,-s*0.12,s*0.36,s*0.36,0,s*0.37); c.bezierCurveTo(-s*0.36,s*0.36,-s*0.36,-s*0.12,-s*0.1,-s*0.22); c.closePath(); fillStroke(c,lg(c,-s*.3,0,s*.3,0,['#d68a52','#b5652f','#8a4a1f']),s*0.04);
    ell(c,0,-s*0.34,s*0.13,s*0.05); fillStroke(c,'#fdfdfb',s*0.03); c.strokeStyle='#fff8e8'; c.lineWidth=s*0.05; c.beginPath(); c.moveTo(-s*0.22,0); c.quadraticCurveTo(0,s*0.08,s*0.22,0); c.stroke(); shine(c,-s*0.14,-s*0.02,s*0.05,s*0.12,0.3); },
  garri(c,s){ bowl(c,s,'#3c6e9e'); ell(c,0,0,s*0.42,s*0.12); fillStroke(c,'#f3e2a1',s*0.03); const r=srand(11); for(let i=0;i<30;i++){ ell(c,(r()-0.5)*s*0.7,(r()-0.5)*s*0.18-s*0.03,s*0.02,s*0.015); c.fillStyle=r()>0.5?'#e8cf72':'#fff6d0'; c.fill(); }
    c.beginPath(); c.moveTo(-s*0.3,-s*0.02); c.quadraticCurveTo(0,-s*0.26,s*0.3,-s*0.02); c.closePath(); fillStroke(c,'#f1dc8e',s*0.03); },
  peppermix(c,s){ bowl(c,s,'#f2f2f2'); ell(c,0,0,s*0.42,s*0.12); fillStroke(c,rg(c,0,0,s*.02,s*.4,['#ff5a2a','#d42a0b','#9c1a05']),s*0.03); const r=srand(13); for(let i=0;i<10;i++){ ell(c,(r()-0.5)*s*0.6,(r()-0.5)*s*0.12,s*0.03,s*0.02); c.fillStyle='rgba(255,200,120,.6)'; c.fill(); } },
  palmoil(c,s){ c.beginPath(); c.moveTo(-s*0.07,-s*0.42); c.lineTo(s*0.07,-s*0.42); c.lineTo(s*0.07,-s*0.24); c.quadraticCurveTo(s*0.22,-s*0.16,s*0.22,0); c.lineTo(s*0.22,s*0.34); c.quadraticCurveTo(0,s*0.42,-s*0.22,s*0.34); c.lineTo(-s*0.22,0); c.quadraticCurveTo(-s*0.22,-s*0.16,-s*0.07,-s*0.24); c.closePath();
    fillStroke(c,lg(c,-s*.22,0,s*.22,0,['#ff8a1e','#e2550a','#a63706']),s*0.04); c.fillStyle='#f5e9cf'; rr(c,-s*0.16,s*0.02,s*0.32,s*0.16,s*0.03); c.fill(); c.fillStyle='#b63b06'; ell(c,0,s*0.1,s*0.05,s*0.05); c.fill();
    c.fillStyle='#2c3e50'; rr(c,-s*0.08,-s*0.46,s*0.16,s*0.07,s*0.02); c.fill(); shine(c,-s*0.12,-s*0.06,s*0.04,s*0.13,0.45); },
  bread(c,s){ shadow(c,0,s*0.3,s*0.42,s*0.08,0.2); rr(c,-s*0.42,-s*0.12,s*0.84,s*0.4,s*0.1); fillStroke(c,lg(c,0,-s*.1,0,s*.3,['#e3a45a','#c27c34','#9a5b20']),s*0.04);
    c.beginPath(); c.moveTo(-s*0.42,-s*0.02); c.bezierCurveTo(-s*0.42,-s*0.36,s*0.42,-s*0.36,s*0.42,-s*0.02); fillStroke(c,lg(c,0,-s*.3,0,0,['#f2c27c','#d8913f']),s*0.04);
    c.strokeStyle='rgba(120,60,10,.6)'; c.lineWidth=s*0.03; for(let i=-1;i<=1;i++){ c.beginPath(); c.moveTo(i*s*0.2-s*0.06,-s*0.2); c.lineTo(i*s*0.2+s*0.06,-s*0.08); c.stroke(); } shine(c,-s*0.18,-s*0.2,s*0.12,s*0.04,0.35); },
  jollof(c,s){ plate(c,s); c.beginPath(); c.moveTo(-s*0.3,s*0.15); c.quadraticCurveTo(-s*0.25,-s*0.18,0,-s*0.2); c.quadraticCurveTo(s*0.25,-s*0.18,s*0.3,s*0.15); c.closePath(); fillStroke(c,rg(c,0,-s*.1,s*.02,s*.35,['#ff8c3a','#e85c12','#c04208']),s*0.03);
    const r=srand(17); for(let i=0;i<26;i++){ ell(c,(r()-0.5)*s*0.5,-s*0.12+r()*s*0.24,s*0.025,s*0.012,r()*3); c.fillStyle='rgba(255,215,160,.7)'; c.fill(); }
    // fried plantain (dodo)
    for(let i=0;i<3;i++){ c.save(); c.translate(s*0.24+i*s*0.02,s*0.1-i*s*0.07); c.rotate(0.4); ell(c,0,0,s*0.08,s*0.05); fillStroke(c,lg(c,0,-s*.05,0,s*.05,['#ffd36b','#e8952a']),s*0.02); c.restore(); }
    c.fillStyle='#3fa34d'; ell(c,-s*0.08,-s*0.16,s*0.05,s*0.025,0.4); c.fill(); },
  yamegg(c,s){ plate(c,s); for(let i=0;i<3;i++){ c.save(); c.translate(-s*0.16+i*s*0.08,s*0.06-i*s*0.03); rr(c,-s*0.1,-s*0.1,s*0.2,s*0.18,s*0.04); fillStroke(c,lg(c,0,-s*.1,0,s*.1,['#fff8df','#f1dfae']),s*0.025); c.restore(); }
    c.beginPath(); c.moveTo(s*0.0,s*0.12); c.bezierCurveTo(-s*0.02,-s*0.12,s*0.34,-s*0.14,s*0.34,s*0.08); c.quadraticCurveTo(s*0.2,s*0.2,s*0.0,s*0.12); fillStroke(c,'#f7c531',s*0.03);
    const r=srand(19); for(let i=0;i<9;i++){ ell(c,s*0.06+r()*s*0.24,-s*0.06+r()*s*0.14,s*0.025,s*0.018); c.fillStyle=r()>0.4?'#e2381b':'#3fa34d'; c.fill(); } },
  akara(c,s){ // on newspaper-ish paper
    c.save(); c.rotate(-0.08); rr(c,-s*0.42,-s*0.08,s*0.84,s*0.42,s*0.04); fillStroke(c,'#efe9da',s*0.03); c.strokeStyle='rgba(80,80,80,.35)'; c.lineWidth=s*0.012; for(let i=0;i<5;i++){ c.beginPath(); c.moveTo(-s*0.36,-s*0.0+i*s*0.07); c.lineTo(s*0.36,i*s*0.07); c.stroke(); } c.restore();
    [[-0.18,0.04],[0.02,0.08],[0.2,0.04],[-0.08,-0.12],[0.12,-0.12]].forEach(([x,y],i)=>{ c.save(); c.translate(x*s,y*s); c.beginPath(); for(let k=0;k<10;k++){ const a=k/10*Math.PI*2, rr2=s*(0.13+((k*7+i)%3)*0.01); c.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2*0.85); } c.closePath(); fillStroke(c,rg(c,-s*.03,-s*.04,s*.01,s*.16,['#f7b955','#cf7a1d','#8f4a0c']),s*0.025); c.restore(); }); },
  puffpuff(c,s){ bowl(c,s,'#2e86c1'); [[-0.2,-0.02],[0.02,-0.04],[0.22,-0.02],[-0.1,-0.18],[0.12,-0.18],[0.0,-0.3]].forEach(([x,y])=>{ ell(c,x*s,y*s,s*0.13,s*0.12); fillStroke(c,rg(c,x*s-s*.04,y*s-s*.04,s*.01,s*.15,['#ffd889','#e59a36','#b8661a']),s*0.025); });
    c.fillStyle='rgba(255,255,255,.85)'; const r=srand(23); for(let i=0;i<24;i++){ c.fillRect((r()-0.5)*s*0.6,-s*0.36+r()*s*0.36,s*0.018,s*0.018); } },
  moimoi(c,s){ // leaf with moi moi slab
    c.beginPath(); c.moveTo(-s*0.46,s*0.1); c.quadraticCurveTo(0,-s*0.3,s*0.46,s*0.06); c.quadraticCurveTo(0,s*0.42,-s*0.46,s*0.1); fillStroke(c,lg(c,0,-s*.2,0,s*.3,['#5cbf4a','#2f8a2a']),s*0.03);
    c.strokeStyle='#9fe08a'; c.lineWidth=s*0.015; c.beginPath(); c.moveTo(-s*0.42,s*0.1); c.lineTo(s*0.42,s*0.07); c.stroke();
    c.beginPath(); c.moveTo(-s*0.24,s*0.16); c.lineTo(-s*0.2,-s*0.12); c.quadraticCurveTo(0,-s*0.2,s*0.2,-s*0.12); c.lineTo(s*0.24,s*0.16); c.quadraticCurveTo(0,s*0.22,-s*0.24,s*0.16); fillStroke(c,lg(c,0,-s*.15,0,s*.2,['#f69a62','#df6f35','#b84f1f']),s*0.03);
    ell(c,s*0.04,0,s*0.07,s*0.05); fillStroke(c,'#fff6dc',s*0.015); ell(c,s*0.04,0,s*0.035,s*0.03); c.fillStyle='#f7c531'; c.fill(); },
  soakings(c,s){ bowl(c,s,'#e67e22'); ell(c,0,0,s*0.42,s*0.12); fillStroke(c,'#fbf7ef',s*0.03); const r=srand(29); for(let i=0;i<20;i++){ ell(c,(r()-0.5)*s*0.66,(r()-0.5)*s*0.14,s*0.02,s*0.015); c.fillStyle='#e7d27a'; c.fill(); }
    // groundnuts + ice
    for(let i=0;i<4;i++){ ell(c,-s*0.2+i*s*0.13,-s*0.01,s*0.035,s*0.025); c.fillStyle='#b5702e'; c.fill(); } c.fillStyle='rgba(200,235,255,.9)'; rr(c,s*0.08,-s*0.08,s*0.1,s*0.08,s*0.02); c.fill();
    c.strokeStyle='#bdc3c7'; c.lineWidth=s*0.05; c.lineCap='round'; c.beginPath(); c.moveTo(s*0.1,-s*0.05); c.lineTo(s*0.34,-s*0.38); c.stroke(); },
  eba(c,s){ plate(c,s); ell(c,-s*0.12,s*0.02,s*0.2,s*0.16); fillStroke(c,rg(c,-s*.18,-s*.05,s*.02,s*.24,['#fff1a8','#f2cf4a','#d4a51c']),s*0.03); shine(c,-s*0.18,-s*0.05,s*0.06,s*0.03,0.5);
    c.save(); c.translate(s*0.2,s*0.02); ell(c,0,s*0.04,s*0.17,s*0.12); fillStroke(c,'#f4f4f4',s*0.025); ell(c,0,s*0.02,s*0.14,s*0.08); fillStroke(c,rg(c,0,0,s*.01,s*.14,['#ff5a2a','#b82205']),0); ell(c,s*0.03,s*0.01,s*0.04,s*0.03); c.fillStyle='#7a3b1b'; c.fill(); c.restore(); },
  coin(c,s){ ell(c,0,0,s*0.42,s*0.42); fillStroke(c,rg(c,-s*.12,-s*.12,s*.05,s*.5,['#fff2a8','#f6c90e','#c48a00']),s*0.05); ell(c,0,0,s*0.3,s*0.3); c.strokeStyle='rgba(150,100,0,.6)'; c.lineWidth=s*0.04; c.stroke(); c.fillStyle='#a06c00'; c.font=`900 ${s*0.42}px "Segoe UI",sans-serif`; c.textAlign='center'; c.textBaseline='middle'; c.fillText('\u20a6',0,s*0.03); },
  customer(c,s){ c.fillStyle='#fff'; ell(c,0,-s*0.1,s*0.18,s*0.2); fillStroke(c,'#8a5a36',s*0.04); c.beginPath(); c.moveTo(-s*0.34,s*0.42); c.quadraticCurveTo(-s*0.3,s*0.08,0,s*0.1); c.quadraticCurveTo(s*0.3,s*0.08,s*0.34,s*0.42); c.closePath(); fillStroke(c,'#e74c3c',s*0.04); },
  star(c,s,col){ c.beginPath(); for(let i=0;i<10;i++){ const a=i/10*Math.PI*2-Math.PI/2, r=i%2? s*0.2:s*0.46; c.lineTo(Math.cos(a)*r,Math.sin(a)*r); } c.closePath(); fillStroke(c,col||lg(c,0,-s*.4,0,s*.4,['#fff59d','#fbc02d','#e08e00']),s*0.06); },
  clock(c,s){ ell(c,0,0,s*0.4,s*0.4); fillStroke(c,'#fff',s*0.06); c.strokeStyle=OUT; c.lineWidth=s*0.06; c.lineCap='round'; c.beginPath(); c.moveTo(0,0); c.lineTo(0,-s*0.26); c.moveTo(0,0); c.lineTo(s*0.18,s*0.06); c.stroke(); }
};
const iconCache = {};
let DPR = Math.min(window.devicePixelRatio||1, 2.5);
function iconCanvas(id, size){ const k=id+'_'+size+'_'+DPR; if(iconCache[k]) return iconCache[k]; const cv=document.createElement('canvas'); const px=Math.ceil(size*DPR*1.25); cv.width=cv.height=px; const c=cv.getContext('2d'); c.setTransform(px/(size*1.25),0,0,px/(size*1.25),px/2,px/2); if(ICON[id]) ICON[id](c,size); iconCache[k]=cv; return cv; }
function drawIcon(c,id,x,y,size,alpha=1){ const cv=iconCanvas(id,Math.round(size)); c.save(); c.globalAlpha*=alpha; c.drawImage(cv,x-size*0.625,y-size*0.625,size*1.25,size*1.25); c.restore(); }
function iconURL(id,size=64){ const cv=document.createElement('canvas'); cv.width=cv.height=size*2; const c=cv.getContext('2d'); c.setTransform(2/1.25,0,0,2/1.25,size,size); ICON[id](c,size); return cv.toDataURL(); }


/* ===== Scene art ===== */
const LAYOUT = {
  hud:64, farm:{x:14,y:76,w:600,h:440}, mach:{x:14,y:528,w:600,h:118}, buka:{x:628,y:76,w:640,h:570}, pantry:{y:656,h:100}
};
function drawBackground(c, lvl){
  const area = lvl.area;
  // sky / ground
  c.fillStyle = lg(c,0,0,0,H,['#8fd16a','#6fbf4e','#5aa83f']); c.fillRect(0,0,W,H);
  // grass texture
  const r=srand(42); for(let i=0;i<500;i++){ const x=r()*W, y=r()*H; c.strokeStyle=`rgba(${r()>0.5?'40,110,30':'170,230,120'},.35)`; c.lineWidth=1.5; c.beginPath(); c.moveTo(x,y); c.lineTo(x+(r()-0.5)*5,y-5-r()*5); c.stroke(); }
  // farm decor: flowers, bushes, rocks (peek out between fields)
  const rd=srand(lvl.area*31+7); for(let i=0;i<70;i++){ const x=20+rd()*580, y=80+rd()*420, kind=rd();
    if(kind<0.5){ const col=['#ffffff','#ffd84a','#ff7eb6','#ff6b4a'][Math.floor(rd()*4)]; for(let k=0;k<5;k++){ c.fillStyle=col; ell(c,x+Math.cos(k*1.26)*3.5,y+Math.sin(k*1.26)*3.5,2.6,2.6); c.fill(); } c.fillStyle='#f39c12'; ell(c,x,y,1.8,1.8); c.fill(); }
    else if(kind<0.8){ c.fillStyle='#3f8f2e'; ell(c,x,y,14,9); c.fill(); c.fillStyle='#57ab3c'; ell(c,x-4,y-3,9,6); c.fill(); }
    else { ell(c,x,y,7,5); c.fillStyle='#b9b0a0'; c.fill(); c.fillStyle='rgba(255,255,255,.4)'; ell(c,x-2,y-2,3,2); c.fill(); } }
  // dirt path between farm and buka
  c.fillStyle='#d9b77e'; c.beginPath(); c.moveTo(612,H); c.bezierCurveTo(600,500,640,300,615,64); c.lineTo(640,64); c.bezierCurveTo(660,300,622,500,640,H); c.closePath(); c.fill();
  // farm fence
  const f=LAYOUT.farm; c.save(); c.strokeStyle='#8a5a2b'; c.lineWidth=5; c.lineCap='round';
  for(let x=f.x+4;x<=f.x+f.w;x+=30){ c.beginPath(); c.moveTo(x,f.y+f.h+2); c.lineTo(x,f.y+f.h-16); c.stroke(); }
  c.beginPath(); c.moveTo(f.x,f.y+f.h-10); c.lineTo(f.x+f.w,f.y+f.h-10); c.moveTo(f.x,f.y+f.h-2); c.lineTo(f.x+f.w,f.y+f.h-2); c.stroke(); c.restore();
  // machine shed floor
  const m=LAYOUT.mach; rr(c,m.x,m.y,m.w,m.h,16); c.fillStyle=lg(c,0,m.y,0,m.y+m.h,['#c9a46a','#b58b52']); c.fill(); c.lineWidth=3; c.strokeStyle='rgba(58,34,16,.5)'; c.stroke();
  c.strokeStyle='rgba(90,60,30,.25)'; c.lineWidth=2; for(let x=m.x+40;x<m.x+m.w;x+=40){ c.beginPath(); c.moveTo(x,m.y+4); c.lineTo(x,m.y+m.h-4); c.stroke(); }
  drawBuka(c, area);
  // pantry shelf
  const p=LAYOUT.pantry; c.fillStyle=lg(c,0,p.y,0,H,['#7b4a24','#5e3519']); c.fillRect(0,p.y,W,H-p.y); c.fillStyle='#a8703d'; c.fillRect(0,p.y,W,8); c.fillStyle='rgba(0,0,0,.2)'; c.fillRect(0,p.y+8,W,4);
  const r2=srand(77); c.strokeStyle='rgba(30,15,5,.25)'; c.lineWidth=2; for(let i=0;i<14;i++){ const y=p.y+16+r2()*80; c.beginPath(); c.moveTo(0,y); c.bezierCurveTo(300,y+r2()*8,900,y-r2()*8,W,y); c.stroke(); }
}
function zinc(c,x,y,w,h,col){ c.fillStyle=lg(c,x,y,x,y+h,[shade(col,0.25),col,shade(col,-0.3)]); c.fillRect(x,y,w,h); c.strokeStyle='rgba(0,0,0,.18)'; c.lineWidth=2; for(let i=x+8;i<x+w;i+=12){ c.beginPath(); c.moveTo(i,y); c.lineTo(i,y+h); c.stroke(); } }
function drawBuka(c, area){
  const b=LAYOUT.buka;
  // back wall
  const wallCols=[['#f3d9a4','#e6c07e'],['#fbe7c6','#f0c98f'],['#f7f1e8','#e3dbd0']][area];
  rr(c,b.x,b.y,b.w,250,18); c.fillStyle=lg(c,0,b.y,0,b.y+250,wallCols); c.fill(); c.lineWidth=4; c.strokeStyle=OUT; c.stroke();
  c.save(); rr(c,b.x,b.y,b.w,250,18); c.clip();
  if(area===0){ // mud wall texture + zinc roof edge
    const r=srand(5); c.fillStyle='rgba(150,90,40,.18)'; for(let i=0;i<60;i++){ ell(c,b.x+r()*b.w,b.y+40+r()*200,8+r()*20,4+r()*6); c.fill(); }
    zinc(c,b.x,b.y,b.w,34,'#9aa3a8');
  } else if(area===1){ // painted wall, ankara awning
    for(let i=0;i<b.w;i+=40){ c.fillStyle=i/40%2?'#e74c3c':'#f4d03f'; c.beginPath(); c.moveTo(b.x+i,b.y); c.lineTo(b.x+i+40,b.y); c.lineTo(b.x+i+40,b.y+30); c.quadraticCurveTo(b.x+i+20,b.y+46,b.x+i,b.y+30); c.fill(); }
    c.fillStyle='rgba(39,174,96,.2)'; c.fillRect(b.x,b.y+200,b.w,50);
  } else { // city: tiles + window to skyline
    c.strokeStyle='rgba(0,0,0,.06)'; c.lineWidth=2; for(let x=b.x;x<b.x+b.w;x+=32){ c.beginPath(); c.moveTo(x,b.y); c.lineTo(x,b.y+250); c.stroke(); } for(let y=b.y;y<b.y+250;y+=32){ c.beginPath(); c.moveTo(b.x,y); c.lineTo(b.x+b.w,y); c.stroke(); }
    c.fillStyle='#2c3e50'; c.fillRect(b.x,b.y,b.w,30); c.fillStyle='#f1c40f'; for(let x=b.x+20;x<b.x+b.w;x+=60){ ell(c,x,b.y+16,6,6); c.fill(); }
  }
  c.restore();
  // signboard
    // wall decor: shelf with pots / calabashes
  for(let i=0;i<5;i++){ const dx=b.x+70+i*125, dy=b.y+150; ell(c,dx,dy,16+((i*7)%6),12); fillStroke(c,['#c87533','#7b4a24','#e3b04b','#a04020','#d98c3a'][i],2.5); }
  c.fillStyle='#8e5a2b'; c.fillRect(b.x+30,b.y+162,b.w-60,8);
  // kitchen floor
  const cy=b.y+226; const ky=cy+40; c.save(); rr(c,b.x,ky,b.w,b.y+b.h-ky,14); c.clip(); c.fillStyle=area===2?'#dfe6e9':'#d8c3a0'; c.fillRect(b.x,ky,b.w,b.y+b.h-ky);
  for(let x=b.x;x<b.x+b.w;x+=40) for(let y=ky;y<b.y+b.h;y+=40){ if(((x-b.x)/40+(y-ky)/40)%2<1){ c.fillStyle=area===2?'#c7d1d6':'#c9b088'; c.fillRect(x,y,40,40);} }
  c.restore(); rr(c,b.x,ky,b.w,b.y+b.h-ky,14); c.lineWidth=3; c.strokeStyle='rgba(58,34,16,.5)'; c.stroke();
}
/* plots */
function drawPlot(c,p,t){
  const {x,y,w,h}=p;
  shadow(c,x+w/2,y+h-2,w*0.5,10,0.2);
  rr(c,x,y,w,h,14); c.fillStyle=lg(c,0,y,0,y+h,['#8b5a33','#6b4022']); c.fill(); c.lineWidth=3; c.strokeStyle=OUT; c.stroke();
  c.strokeStyle='rgba(40,20,5,.35)'; c.lineWidth=3; for(let i=1;i<4;i++){ c.beginPath(); c.moveTo(x+8,y+i*h/4); c.lineTo(x+w-8,y+i*h/4); c.stroke(); }
  c.strokeStyle='rgba(255,220,180,.18)'; for(let i=1;i<4;i++){ c.beginPath(); c.moveTo(x+8,y+i*h/4+3); c.lineTo(x+w-8,y+i*h/4+3); c.stroke(); }
  const cx=x+w/2, cy=y+h/2;
  if(p.state==='empty'){
    // seed sign
    c.globalAlpha=0.9; drawIcon(c,p.crop,cx,cy,34); c.globalAlpha=1;
    const pulse = 0.5+0.5*Math.sin(t*4);
    rr(c,cx-30,y+h-26,60,20,10); c.fillStyle=`rgba(255,255,255,${0.75+pulse*0.2})`; c.fill(); c.fillStyle='#3a2210'; c.font='800 13px "Segoe UI",sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('PLANT',cx,y+h-16);
  } else {
    const prog = p.state==='ripe'?1:Math.min(1,p.t/p.dur);
    drawCropRows(c,p,prog,t);
    if(p.state==='growing'){ // progress bar
      rr(c,x+12,y+h-14,w-24,8,4); c.fillStyle='rgba(0,0,0,.35)'; c.fill(); rr(c,x+12,y+h-14,(w-24)*prog,8,4); c.fillStyle='#7ee05a'; c.fill();
    } else { // ripe: bobbing harvest badge
      const bob=Math.sin(t*5)*3; c.save(); c.translate(x+w-14,y+12+bob); ell(c,0,0,15,15); fillStroke(c,'#ffd84a',3); c.fillStyle=OUT; c.font='900 16px sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('!',0,1); c.restore();
    }
  }
  if(p.crow) drawCrow(c,cx+10,y+18,t,p.crow);
}
function drawCropRows(c,p,prog,t){
  const {x,y,w,h}=p; const st = prog<0.33?0:prog<0.8?1:2; const ripe=p.state==='ripe';
  for(let row=0;row<3;row++) for(let col=0;col<3;col++){
    const px=x+w*(0.2+col*0.3), py=y+h*(0.33+row*0.25); const sway=Math.sin(t*2+px*0.1)*1.5;
    c.save(); c.translate(px+sway*0.3,py);
    if(st===0){ c.fillStyle='#5fbf3f'; ell(c,-3,-3,4,2.5,-0.6); c.fill(); ell(c,3,-3,4,2.5,0.6); c.fill(); }
    else {
      const sz = st===1? 0.6:1; const crop=p.crop;
      if(crop==='maize'||crop==='rice'){ c.strokeStyle= crop==='rice'?'#7cc242':'#4e9a2e'; c.lineWidth=2.5; for(let k=-1;k<=1;k++){ c.beginPath(); c.moveTo(0,4); c.quadraticCurveTo(k*6,-8*sz,k*9+sway,-18*sz); c.stroke(); }
        if(st===2){ if(crop==='maize'){ ell(c,4,-10,3.5,7,0.3); fillStroke(c,'#f4c20d',1.5);} else { c.fillStyle=ripe?'#e8d27a':'#c8d86a'; for(let k=-1;k<=1;k++){ ell(c,k*9+sway,-19,3,6,k*0.3); c.fill(); } } } }
      else if(crop==='cassava'){ c.strokeStyle='#7b4a24'; c.lineWidth=2.5; c.beginPath(); c.moveTo(0,4); c.lineTo(0,-16*sz); c.stroke(); c.fillStyle='#3e9a3a'; for(let k=0;k<5;k++){ const a=-Math.PI/2+(k-2)*0.6; ell(c,Math.cos(a)*8*sz,-16*sz+Math.sin(a)*8*sz,6*sz,2.2,a); c.fill(); } }
      else if(crop==='yam'){ c.strokeStyle='#3e8a2a'; c.lineWidth=2; c.beginPath(); c.moveTo(0,4); for(let k=0;k<6;k++) c.lineTo(Math.sin(k)*4,-k*3.5*sz); c.stroke(); c.fillStyle='#55b33a'; for(let k=1;k<4;k++){ c.beginPath(); c.moveTo(Math.sin(k*1.5)*4,-k*5*sz); c.quadraticCurveTo(8,-k*5*sz-6,10,-k*5*sz); c.quadraticCurveTo(5,-k*5*sz+3,Math.sin(k*1.5)*4,-k*5*sz); c.fill(); } if(st===2){ ell(c,0,5,7,4); fillStroke(c,'#7a5532',1.5);} }
      else { // bushes: tomato, pepper, beans
        c.fillStyle='#3c9a35'; ell(c,0,-6*sz,10*sz,8*sz); c.fill(); c.fillStyle='#4fb544'; ell(c,-3,-9*sz,6*sz,5*sz); c.fill();
        if(st===2){ const col = crop==='tomato'?'#e3261b': crop==='pepper'?'#f0441a':'#efe2bf'; for(let k=0;k<3;k++){ ell(c,-6+k*6,-4-(k%2)*6, crop==='beans'?2.5:3.6, crop==='beans'?5:3.6, crop==='beans'?0.4:0); fillStroke(c,ripe?col:shade(col,-0.1).replace('#','#'),1.2); } }
      }
    }
    c.restore();
  }
  if(ripe){ c.save(); c.globalAlpha=0.25+0.15*Math.sin(t*6); rr(c,x,y,w,h,14); c.fillStyle='#fff6a0'; c.fill(); c.restore(); }
}
function drawCrow(c,x,y,t,cr){
  const flap=Math.sin(t*18)*0.6; c.save(); c.translate(x,y - (cr.phase==='in'? (1-cr.k)*120 : 0)); if(cr.phase==='in') c.translate((1-cr.k)*80,0);
  shadow(c,0,26,14,4,0.25);
  ell(c,0,0,16,11); fillStroke(c,'#2b2b33',2.5); ell(c,12,-8,8,8); fillStroke(c,'#2b2b33',2.5);
  c.fillStyle='#f1c40f'; c.beginPath(); c.moveTo(18,-9); c.lineTo(28,-6); c.lineTo(18,-4); c.fill(); c.fillStyle='#fff'; ell(c,13,-10,2.6,2.6); c.fill(); c.fillStyle='#000'; ell(c,14,-10,1.3,1.3); c.fill();
  c.save(); c.rotate(-0.3+flap); ell(c,-6,-8,14,6,-0.4); fillStroke(c,'#3d3d48',2); c.restore();
  // countdown ring
  if(cr.phase==='eat'){ c.beginPath(); c.arc(0,0,24,-Math.PI/2,-Math.PI/2+Math.PI*2*(1-cr.k)); c.strokeStyle='#ff4d4d'; c.lineWidth=4; c.stroke(); }
  c.restore();
}
/* coop with hens */
function drawCoop(c,o,t){
  const {x,y,w,h}=o; shadow(c,x+w/2,y+h-4,w*0.52,12,0.2);
  // yard
  rr(c,x,y+40,w,h-40,14); c.fillStyle='#d8c38f'; c.fill(); c.lineWidth=3; c.strokeStyle=OUT; c.stroke();
  // house
  c.fillStyle=lg(c,0,y,0,y+80,['#c0392b','#922b21']); c.beginPath(); c.moveTo(x+6,y+46); c.lineTo(x+52,y+4); c.lineTo(x+98,y+46); c.closePath(); c.fill(); c.lineWidth=3; c.strokeStyle=OUT; c.stroke();
  rr(c,x+16,y+44,72,48,6); c.fillStyle='#e9c48a'; c.fill(); c.stroke(); rr(c,x+40,y+60,24,32,10); c.fillStyle='#4a2c14'; c.fill();
  // trough
  rr(c,x+w-74,y+h-30,62,18,6); c.fillStyle='#8a5a2b'; c.fill(); c.lineWidth=2.5; c.stroke(); if(o.feed>0){ c.fillStyle='#f4c20d'; rr(c,x+w-70,y+h-28,54*Math.min(1,o.feed/ (o.hens*3)),8,4); c.fill(); }
  // hens
  for(let i=0;i<o.hens;i++){ const hx=x+110+((i*53)%(w-140)), hy=y+64+((i*37)%(h-110)); const peck = o.feed>0? Math.max(0,Math.sin(t*6+i*2)) : 0; drawHen(c,hx,hy,peck,i); }
  // eggs on ground
  o.eggs.forEach((e,i)=>{ const ex=x+16+((i*41)%(w-40)), ey=y+h-22; drawIcon(c,'egg',ex,ey,26); });
  // state badge
  badge(c,x+w-20,y+52,t, o.eggs.length? 'collect' : (o.feed<=0? 'hungry':null), o.eggs.length);
}
function drawHen(c,x,y,peck,i){ c.save(); c.translate(x,y); if(i%2) c.scale(-1,1); shadow(c,0,16,13,4,0.2);
  ell(c,0,4,15,12); fillStroke(c,i%3===1?'#b5651d':'#fdfdfd',2.5); c.save(); c.translate(10,-6+peck*8); ell(c,0,0,7,7); fillStroke(c,i%3===1?'#b5651d':'#fdfdfd',2.5); c.fillStyle='#e74c3c'; ell(c,0,-7,3,3); c.fill(); c.fillStyle='#f39c12'; c.beginPath(); c.moveTo(6,-1); c.lineTo(12,1); c.lineTo(6,3); c.fill(); c.fillStyle='#000'; ell(c,2,-2,1.3,1.3); c.fill(); c.restore();
  ell(c,-4,3,8,5,-0.3); c.fillStyle='rgba(0,0,0,.08)'; c.fill(); c.restore(); }
function badge(c,x,y,t,kind,n){ if(!kind) return; const bob=Math.sin(t*5)*3; c.save(); c.translate(x,y+bob);
  if(kind==='hungry'){ rr(c,-36,-16,72,30,14); fillStroke(c,'#fff',3); c.fillStyle='#c0392b'; c.font='900 13px "Segoe UI",sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('FEED ME',0,0); }
  else if(kind==='collect'){ ell(c,0,0,16,16); fillStroke(c,'#7ee05a',3); c.fillStyle=OUT; c.font='900 15px sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(n>1?n:'!',0,1); }
  c.restore(); }
function drawPen(c,o,t){
  const {x,y,w,h}=o; rr(c,x,y,w,h,14); c.fillStyle='#a8d672'; c.fill(); c.lineWidth=3; c.strokeStyle=OUT; c.stroke();
  // grass tufts
  const r=srand(31); c.fillStyle='#6fb543'; for(let i=0;i<14;i++){ ell(c,x+12+r()*(w-24),y+12+r()*(h-24),6,3); c.fill(); }
  c.strokeStyle='#8a5a2b'; c.lineWidth=4; for(let i=0;i<=4;i++){ c.beginPath(); c.moveTo(x+i*w/4,y+h-26); c.lineTo(x+i*w/4,y+h); c.stroke(); } c.beginPath(); c.moveTo(x,y+h-18); c.lineTo(x+w,y+h-18); c.stroke();
  for(let i=0;i<o.goats;i++){ drawGoat(c,x+60+i*90,y+h/2+2,t+i,o.fed>0); }
  if(o.milk>0) for(let i=0;i<Math.min(o.milk,6);i++) drawIcon(c,'milk',x+w-26-i*26,y+h-38,28);
  badge(c,x+w-26,y+20,t, o.milk? 'collect' : (o.fed<=0? 'hungry':null), o.milk);
}
function drawGoat(c,x,y,t,fed){ c.save(); c.translate(x,y); const chew=fed? Math.sin(t*8)*1.5:0; shadow(c,0,24,26,5,0.2);
  c.strokeStyle=OUT; c.lineWidth=5; c.lineCap='round'; [-16,-6,8,18].forEach(lx=>{ c.beginPath(); c.moveTo(lx,8); c.lineTo(lx,24); c.stroke(); });
  ell(c,0,0,28,15); fillStroke(c,lg(c,0,-15,0,15,['#f5f0e6','#d8cdb8']),3); ell(c,-6,-2,9,7); c.fillStyle='#8b5a2b'; c.fill();
  c.save(); c.translate(26,-12+chew); ell(c,0,0,12,9,0.3); fillStroke(c,'#f5f0e6',3); c.fillStyle='#000'; ell(c,3,-2,1.8,1.8); c.fill();
  c.strokeStyle='#7a6a55'; c.lineWidth=3; c.beginPath(); c.moveTo(-4,-8); c.quadraticCurveTo(-8,-18,-14,-16); c.stroke(); c.fillStyle='#d8cdb8'; c.beginPath(); c.moveTo(6,6); c.lineTo(8,14); c.lineTo(3,8); c.fill(); c.restore();
  c.restore(); }
function drawPalm(c,o,t){
  const {x,y,w,h}=o; const bx=x+w/2, by=y+h-8; shadow(c,bx,by,34,8,0.22);
  c.fillStyle=lg(c,bx-8,0,bx+8,0,['#8a5a2b','#a97440','#6e4420']); c.beginPath(); c.moveTo(bx-9,by); c.quadraticCurveTo(bx-4,by-h*0.5,bx+2,y+30); c.lineTo(bx+10,y+30); c.quadraticCurveTo(bx+6,by-h*0.5,bx+9,by); c.closePath(); c.fill(); c.lineWidth=2.5; c.strokeStyle=OUT; c.stroke();
  c.strokeStyle='rgba(50,25,5,.45)'; c.lineWidth=2; for(let i=0;i<8;i++){ const yy=by-10-i*((by-y-36)/8); c.beginPath(); c.moveTo(bx-8,yy); c.lineTo(bx+9,yy-4); c.stroke(); }
  const sway=Math.sin(t*1.5)*0.05; for(let i=0;i<7;i++){ const a=-Math.PI+i*Math.PI/6+sway; c.save(); c.translate(bx+6,y+30); c.rotate(a); c.beginPath(); c.moveTo(0,0); c.quadraticCurveTo(28,-16,56,4); c.quadraticCurveTo(28,-4,0,0); fillStroke(c,i%2?'#2e8b37':'#3aa646',2); c.restore(); }
  const k = o.ripe?1:Math.min(1,o.t/o.dur); if(k>0.15){ c.save(); c.translate(bx+6,y+40); c.scale(0.4+0.6*k,0.4+0.6*k); drawIcon(c,'palmfruit',0,0,38,o.ripe?1:0.85); c.restore(); }
  if(!o.ripe){ rr(c,x+10,y+h-6,w-20,6,3); c.fillStyle='rgba(0,0,0,.35)'; c.fill(); rr(c,x+10,y+h-6,(w-20)*k,6,3); c.fillStyle='#ff9a3c'; c.fill(); }
  else badge(c,bx+30,y+20,t,'collect',1);
}
/* machines */
function drawMachine(c,m,t){
  const {x,y,w,h}=m; const def=MACHINES[m.id]; const busy=m.state==='busy'; const shake=busy? Math.sin(t*40)*1.2:0;
  c.save(); c.translate(shake,0); shadow(c,x+w/2,y+h-4,w*0.45,8,0.25);
  // body
  rr(c,x+8,y+28,w-16,h-40,12); fillStroke(c,lg(c,x,0,x+w,0,[shade(def.col,0.25),def.col,shade(def.col,-0.35)]),3);
  // hopper
  c.beginPath(); c.moveTo(x+18,y+6); c.lineTo(x+w*0.5-4,y+6); c.lineTo(x+w*0.42,y+30); c.lineTo(x+26,y+30); c.closePath(); fillStroke(c,'#95a5a6',3);
  // chimney + smoke
  rr(c,x+w-38,y+4,14,28,3); fillStroke(c,'#566573',2.5); if(busy){ for(let i=0;i<3;i++){ const k=((t*0.8+i/3)%1); c.fillStyle=`rgba(240,240,240,${0.6*(1-k)})`; ell(c,x+w-31+Math.sin(k*6)*4,y-k*36,5+k*8,5+k*8); c.fill(); } }
  // gauge / window
  ell(c,x+w/2,y+h/2+6,20,20); fillStroke(c,'#fdfefe',3);
  if(busy){ const k=m.t/m.dur; c.beginPath(); c.moveTo(x+w/2,y+h/2+6); c.arc(x+w/2,y+h/2+6,16,-Math.PI/2,-Math.PI/2+Math.PI*2*k); c.closePath(); c.fillStyle='#58d68d'; c.fill(); }
  else drawIcon(c,def.out,x+w/2,y+h/2+6,26,m.state==='done'?1:0.45);
  // label
  rr(c,x+10,y+h-18,w-20,16,6); c.fillStyle='rgba(30,15,5,.75)'; c.fill(); c.fillStyle='#fff'; c.font='800 11px "Segoe UI",sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(def.n,x+w/2,y+h-10);
  c.restore();
  if(m.state==='done'){ const bob=Math.sin(t*6)*4; c.save(); c.translate(x+w/2,y-4+bob); ell(c,0,0,24,24); fillStroke(c,'#fffbe6',3); drawIcon(c,def.out,0,0,32); c.restore(); }
  if(m.state==='idle'){ // show inputs
    const ins=Object.keys(def.in); ins.forEach((k,i)=>{ const ix=x+w-18, iy=y+40+i*24; ell(c,ix,iy,11,11); c.fillStyle='rgba(255,255,255,.85)'; c.fill(); drawIcon(c,k,ix,iy,18); });
  }
}
/* stations */
function drawStation(c,s,t,area){
  const {x,y,w,h}=s; const def=STATIONS[s.id]; const out=def.out;
  shadow(c,x+w/2,y+h-6,w*0.45,8,0.22);
  // stove base
  rr(c,x+6,y+h*0.45,w-12,h*0.5,10); fillStroke(c,area===2?lg(c,0,y,0,y+h,['#d5dbdb','#7f8c8d']):lg(c,0,y,0,y+h,['#5d6d7e','#2e4053']),3);
  if(s.state==='cook'||s.state==='ready'||s.state==='burnt'){ for(let i=0;i<5;i++){ const fl=0.6+0.4*Math.sin(t*20+i*2); c.fillStyle=`rgba(255,${120+i*20},20,${0.8})`; ell(c,x+w*0.3+i*w*0.1,y+h*0.47,4,8*fl); c.fill(); } }
  // vessel
  const vx=x+w/2, vy=y+h*0.42;
  if(s.id==='soakbowl'){ bowlAt(c,vx,vy,38,'#e67e22'); }
  else if(s.id==='akarafryer'||s.id==='puffryer'){ ell(c,vx,vy,40,16); fillStroke(c,'#2c2c2c',3); ell(c,vx,vy-2,34,11); c.fillStyle=s.state==='idle'?'#3a3a3a':'#e2a038'; c.fill(); c.strokeStyle='#2c2c2c'; c.lineWidth=5; c.beginPath(); c.moveTo(vx+38,vy); c.lineTo(vx+52,vy-6); c.stroke(); }
  else if(s.id==='steamer'){ rr(c,vx-30,vy-26,60,34,8); fillStroke(c,lg(c,vx-30,0,vx+30,0,['#d0d3d4','#909497']),3); ell(c,vx,vy-26,32,9); fillStroke(c,'#b3b6b7',3); c.fillStyle='#4caf50'; ell(c,vx,vy-28,14,4); c.fill(); }
  else { // pots
    c.beginPath(); c.moveTo(vx-34,vy-18); c.quadraticCurveTo(vx-38,vy+12,vx,vy+12); c.quadraticCurveTo(vx+38,vy+12,vx+34,vy-18); c.closePath(); fillStroke(c,lg(c,vx-34,0,vx+34,0,['#4d4d4d','#1c1c1c']),3); ell(c,vx,vy-18,34,9); fillStroke(c,'#2b2b2b',3);
    if(s.state!=='idle'){ ell(c,vx,vy-18,29,6); c.fillStyle= s.id==='ebapot'? '#c0392b' : s.id==='yampan'? '#f7c531':'#e85c12'; c.fill(); }
  }
  // steam / bubbles
  if(s.state==='cook'){ for(let i=0;i<3;i++){ const k=((t*0.9+i/3)%1); c.fillStyle=`rgba(255,255,255,${0.5*(1-k)})`; ell(c,vx-14+i*14+Math.sin(k*5+i)*4,vy-30-k*40,6+k*8,6+k*8); c.fill(); } }
  if(s.state==='burnt'){ for(let i=0;i<4;i++){ const k=((t*0.7+i/4)%1); c.fillStyle=`rgba(40,40,40,${0.6*(1-k)})`; ell(c,vx-12+i*8+Math.sin(k*5+i)*6,vy-30-k*50,8+k*12,8+k*12); c.fill(); } drawIcon(c,out,vx,vy-34,40,0.5); c.save(); c.globalCompositeOperation='source-atop'; c.restore();
    rr(c,vx-30,vy-58,60,20,8); c.fillStyle='#2c3e50'; c.fill(); c.fillStyle='#fff'; c.font='900 11px "Segoe UI",sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('TAP TO BIN',vx,vy-48); }
  // ring timer
  if(s.state==='cook'||s.state==='ready'){ const k = s.state==='cook'? s.t/s.dur : s.t/s.burn; const col = s.state==='cook'?'#58d68d': (k>0.6?'#e74c3c':'#f5b041');
    c.beginPath(); c.arc(x+w-18,y+18,13,0,Math.PI*2); c.fillStyle='rgba(0,0,0,.45)'; c.fill(); c.beginPath(); c.moveTo(x+w-18,y+18); c.arc(x+w-18,y+18,11,-Math.PI/2,-Math.PI/2+Math.PI*2*k); c.closePath(); c.fillStyle=col; c.fill(); }
  if(s.state==='ready'){ const bob=Math.sin(t*6)*3; const warn = s.t/s.burn>0.6 && Math.sin(t*20)>0; drawIcon(c,out,vx,vy-38+bob,50); if(warn){ c.save(); c.globalAlpha=0.35; ell(c,vx,vy-38+bob,30,24); c.fillStyle='#ff3b30'; c.fill(); c.restore(); } }
  if(s.state==='idle'){ drawIcon(c,out,vx,vy-34,30,0.35); const ins=Object.keys(def.in); const sx=vx-(ins.length-1)*13; ins.forEach((k,i)=>{ ell(c,sx+i*26,y+h-16,11,11); c.fillStyle='rgba(255,255,255,.85)'; c.fill(); drawIcon(c,k,sx+i*26,y+h-16,18); }); }
}
function bowlAt(c,x,y,s,col){ c.save(); c.translate(x,y-s*0.2); bowl(c,s*2,col); c.restore(); }
/* customers */
function drawCustomer(c,cu,t){
  const d=CUSTOMERS[cu.type]; const x=cu.x, y=cu.y; const mood = cu.pat/cu.patMax; const bob = Math.sin(t*3+cu.seed)*2;
  c.save(); c.translate(x,y+bob); c.scale(0.86,0.86);
  if(cu.delivery){ // okada delivery rider
    c.save(); c.translate(0,70); rr(c,-50,-10,100,24,10); fillStroke(c,'#c0392b',3); ell(c,-38,18,14,14); fillStroke(c,'#222',3); ell(c,38,18,14,14); fillStroke(c,'#222',3); rr(c,26,-36,30,26,4); fillStroke(c,'#f39c12',3); c.restore(); }
  // body
  c.beginPath(); c.moveTo(-46,92); c.quadraticCurveTo(-44,20,0,18); c.quadraticCurveTo(44,20,46,92); c.closePath(); fillStroke(c,d.top,3);
  // ankara dots
  c.save(); c.clip(); const r=srand(cu.seed*100+3); for(let i=0;i<22;i++){ c.fillStyle=d.pat; ell(c,-44+r()*88,22+r()*70,4,4); c.fill(); c.strokeStyle=shade(d.top,-0.3); c.lineWidth=1.5; c.beginPath(); c.arc(-44+r()*88,22+r()*70,6,0,Math.PI); c.stroke(); } c.restore();
  // neck/head
  ell(c,0,-14,27,30); fillStroke(c,lg(c,-20,-30,20,10,[shade(d.skin,0.15),d.skin]),3);
  // ears
  ell(c,-27,-12,5,7); fillStroke(c,d.skin,2.5); ell(c,27,-12,5,7); fillStroke(c,d.skin,2.5);
  // hair styles
  c.fillStyle=d.gele; c.strokeStyle=OUT; c.lineWidth=3;
  if(d.hair==='gele'){ c.beginPath(); c.moveTo(-34,-22); c.quadraticCurveTo(-40,-62,-4,-66); c.quadraticCurveTo(30,-74,38,-40); c.quadraticCurveTo(46,-28,30,-22); c.quadraticCurveTo(0,-34,-34,-22); fillStroke(c,lg(c,-30,-70,30,-20,[shade(d.gele,0.3),d.gele]),3); c.strokeStyle='rgba(255,255,255,.4)'; c.lineWidth=2; for(let i=0;i<3;i++){ c.beginPath(); c.moveTo(-26+i*8,-30-i*6); c.quadraticCurveTo(0,-56+i*4,28,-36-i*2); c.stroke(); } }
  else if(d.hair==='cap'){ c.beginPath(); c.arc(0,-26,27,Math.PI,0); c.closePath(); fillStroke(c,d.gele,3); rr(c,0,-30,40,8,4); fillStroke(c,d.gele,2.5); }
  else if(d.hair==='fila'){ c.beginPath(); c.moveTo(-26,-28); c.quadraticCurveTo(-20,-58,10,-60); c.quadraticCurveTo(34,-54,26,-28); c.closePath(); fillStroke(c,d.gele,3); }
  else if(d.hair==='kufi'){ c.beginPath(); c.moveTo(-24,-30); c.lineTo(-22,-50); c.quadraticCurveTo(0,-56,22,-50); c.lineTo(24,-30); c.closePath(); fillStroke(c,d.gele,3); c.strokeStyle='#2ecc71'; c.lineWidth=2; c.beginPath(); c.moveTo(-20,-40); c.lineTo(20,-40); c.stroke(); }
  else if(d.hair==='puffs'){ c.fillStyle='#1b1b1b'; ell(c,-24,-40,13,13); fillStroke(c,'#1b1b1b',3); ell(c,24,-40,13,13); fillStroke(c,'#1b1b1b',3); c.beginPath(); c.arc(0,-24,26,Math.PI,0); fillStroke(c,'#1b1b1b',3); }
  else if(d.hair==='braids'){ c.beginPath(); c.arc(0,-22,29,Math.PI*1.05,-0.05); fillStroke(c,'#1b1b1b',3); c.strokeStyle='#1b1b1b'; c.lineWidth=5; for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(-26+i*3,-14); c.lineTo(-30+i*3,20); c.stroke(); c.beginPath(); c.moveTo(26-i*3,-14); c.lineTo(30-i*3,20); c.stroke(); } }
  else { c.beginPath(); c.arc(0,-24,27,Math.PI*1.08,-0.08); fillStroke(c,'#1b1b1b',3); }
  // face
  const ey = -12; c.fillStyle='#fff'; ell(c,-10,ey,6,6.5); c.fill(); ell(c,10,ey,6,6.5); c.fill(); c.fillStyle='#1b1b1b';
  const look = Math.sin(t*0.7+cu.seed)*1.5; ell(c,-10+look,ey+1,3.2,3.6); c.fill(); ell(c,10+look,ey+1,3.2,3.6); c.fill();
  c.strokeStyle=OUT; c.lineWidth=2.5; c.lineCap='round';
  if(mood<0.3){ c.beginPath(); c.moveTo(-16,ey-11); c.lineTo(-4,ey-7); c.moveTo(16,ey-11); c.lineTo(4,ey-7); c.stroke(); c.beginPath(); c.arc(0,8,7,Math.PI*1.15,Math.PI*1.85); c.stroke(); c.fillStyle='rgba(255,60,40,.25)'; ell(c,0,-6,26,24); c.fill(); }
  else if(mood<0.6){ c.beginPath(); c.moveTo(-7,6); c.lineTo(7,6); c.stroke(); }
  else { c.beginPath(); c.arc(0,2,8,0.2,Math.PI-0.2); c.stroke(); c.fillStyle='rgba(255,120,120,.35)'; ell(c,-16,0,5,3); c.fill(); ell(c,16,0,5,3); c.fill(); }
  if(cu.happy>0){ c.font='900 18px sans-serif'; c.fillStyle='#e74c3c'; c.fillText('\u2665',22,-48 - (1-cu.happy)*20); }
  c.restore();
}
function drawOrder(c,cu,t){
  const n=cu.order.length, cols=Math.min(n,2), rows=Math.ceil(n/2); const bw=18+cols*48, bh=14+rows*46+16; const x=cu.x-bw/2, y=cu.y-64-bh;
  const shake = cu.pat/cu.patMax<0.25? Math.sin(t*30)*2:0; c.save(); c.translate(shake,0);
  rr(c,x,y,bw,bh,16); fillStroke(c,cu.delivery?'#fff3e0':'#fffdf5',3); c.beginPath(); c.moveTo(cu.x-10,y+bh-1.5); c.lineTo(cu.x,y+bh+12); c.lineTo(cu.x+10,y+bh-1.5); c.closePath(); c.fillStyle=cu.delivery?'#fff3e0':'#fffdf5'; c.fill(); c.lineWidth=3; c.strokeStyle=OUT; c.beginPath(); c.moveTo(cu.x-10,y+bh); c.lineTo(cu.x,y+bh+12); c.lineTo(cu.x+10,y+bh); c.stroke();
  cu.order.forEach((o,i)=>{ const col=i%2, row=Math.floor(i/2); const rowN = (row===rows-1 && n%2===1)?1:cols; const ix = cu.x + (col - (rowN-1)/2)*48, iy=y+8+23+row*46;
    if(o.done){ drawIcon(c,o.id,ix,iy,36,0.3); c.strokeStyle='#27ae60'; c.lineWidth=6; c.lineCap='round'; c.beginPath(); c.moveTo(ix-12,iy); c.lineTo(ix-3,iy+10); c.lineTo(ix+14,iy-10); c.stroke(); }
    else { const avail = G.availableFor && G.availableFor(o.id); if(avail){ c.save(); c.globalAlpha=0.35+0.25*Math.sin(t*8); ell(c,ix,iy,23,23); c.fillStyle='#7ee05a'; c.fill(); c.restore(); } drawIcon(c,o.id,ix,iy,40); }
    o.hx=ix; o.hy=iy; });
  if(cu.delivery){ rr(c,cu.x-34,y-5,68,16,8); c.fillStyle='#c0392b'; c.fill(); c.fillStyle='#fff'; c.font='900 10px "Segoe UI",sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('DELIVERY',cu.x,y+3); }
  const k=Math.max(0,cu.pat/cu.patMax); const px=x+10, pw=bw-20, py=y+bh-16; rr(c,px,py,pw,10,5); c.fillStyle='rgba(0,0,0,.25)'; c.fill(); rr(c,px+1.5,py+1.5,(pw-3)*k,7,3.5); c.fillStyle= k>0.6?'#43c463': k>0.3?'#f5a623':'#e74c3c'; c.fill();
  c.restore();
  cu.bub={x,y,w:bw,h:bh};
}

function drawCounterFront(c,area){
  const b=LAYOUT.buka, cy=b.y+226;
  rr(c,b.x-6,cy,b.w+12,40,10); c.fillStyle=lg(c,0,cy,0,cy+40,area===2?['#f4f6f6','#a6acaf']:area===1?['#2ecc71','#1e8449']:['#c58a4b','#8e5a2b']); c.fill(); c.lineWidth=4; c.strokeStyle=OUT; c.stroke();
  c.fillStyle='rgba(255,255,255,.35)'; c.fillRect(b.x,cy+4,b.w,5);
  const names=['BUNMI\u2019S FARM STAND','BUNMI\u2019S BUKA','BUNMI\u2019S KITCHEN \u2022 LEKKI'];
  const sx=b.x+b.w/2; rr(c,sx-140,cy+9,280,26,8); c.fillStyle=['#5e3519','#145a32','#1b2631'][area]; c.fill(); c.fillStyle=['#ffe08a','#ffffff','#f7dc6f'][area]; c.font='900 16px "Segoe UI",system-ui,sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(names[area],sx,cy+22.5);
}


/* ===== Game state & rules ===== */
const G = { on:false, paused:false, t:0, fx:[], floats:[], screenShake:0 };
const fmtN = n => '\u20a6' + Math.round(n).toLocaleString('en-NG');
function upg(){
  const f=bl('farm')||1, cp=bl('coop'), pn=bl('pen'), st=bl('store')||1, m=bl('mills'), b=bl('buka'), k=bl('kitchen'), sl=bl('stall'), bk=bl('bike'), r=bl('restaurant'), cm=bl('compound');
  return { grow:1-0.12*(f-1), yield:2+(f>=3?1:0)+(f>=5?1:0), henBonus:cp, eggT:6.5*(1-0.15*cp), milkT:9*(1-0.2*pn), milkPer:3+(pn>=2?1:0),
    cap:[20,20,26,32,40][st]+(G.lvl?G.lvl.area*4:0), mach:1-0.2*m, auto:m>=3, pat:1.1+0.1*b, warm:3+(b>=2?1:0), tip:b>=3?1.5:1, cook:1-0.15*k, burn:k>=3?1.8:k>=2?1.3:1,
    stall:[0,0.4,0.6,0.8][sl], bike:bk, bikeMult:bk>=2?2:1.6, price:(1+[0,0.1,0.2,0.35][r])*(1+[0,0.05,0.1,0.15][cm]) };
}
function startLevel(i){
  const lv=LEVELS[i]; G.lvl=lv; const U=upg(); G.U=U; G.li=i; G.time=lv.time; G.left=lv.time; G.coins=0; G.served=0; G.lost=0; G.made={}; G.pantry={}; G.t=0; G.over=false; G.paused=false; G.fx=[]; G.floats=[]; G.serveTimes=[]; G.crowsShooed=0; G.warned=false; G.harvested=0;
  // plots
  const n=lv.plots.length, rows=Math.ceil(n/3); const big = !lv.chickens && !lv.goats && !lv.palms;
  const pw=big?176:112, ph=big?118:86, gx=big?192:122, gy=big?132:96;
  G.plots = lv.plots.map((crop,j)=>({crop, x:26+(j%3)*gx, y:(big?96:88)+Math.floor(j/3)*gy, w:pw, h:ph, state:'empty', t:0, dur:CROP_T[crop]*U.grow, crow:null}));
  const plotsBottom = 88+rows*96;
  let ry=88; const rx=392;
  G.coop = lv.chickens? {x:rx,y:ry,w:212,h:170,hens:lv.chickens+U.henBonus,feed:0,eggs:[],t:0} : null; if(G.coop) ry+=180;
  G.pen = lv.goats? {x:rx,y:ry,w:212,h:Math.min(140,506-ry),goats:lv.goats,fed:0,milk:0,t:0} : null; if(G.pen) ry+=G.pen.h+10;
  G.palms=[]; let below=0; for(let j=0;j<lv.palms;j++){ let px,py; if(j===0 && ry<=376) { px=rx+56; py=ry; } else { px=26+below*112; below++; py=Math.min(plotsBottom+4,384); } G.palms.push({x:px,y:py,w:100,h:128,t:0,dur:10*U.grow*1.2,ripe:false}); }
  // machines
  G.machines = lv.machines.map((id,j)=>({id, x:24+j*148, y:534, w:140, h:108, state:'idle', t:0, dur:MACHINES[id].t*U.mach}));
  // stations
  const ns=lv.stations.length, sw=Math.min(124, 620/ns); const sx0 = LAYOUT.buka.x + (LAYOUT.buka.w - ns*sw)/2;
  G.stations = lv.stations.map((id,j)=>({id, x:sx0+j*sw+2, y:350, w:sw-4, h:126, state:'idle', t:0, dur:STATIONS[id].t*U.cook, burn:STATIONS[id].burn*U.burn}));
  G.warmCap=U.warm; G.warmer=[];
  // customers
  G.nSlots = lv.maxCust; G.slots=Array(G.nSlots).fill(null); G.customers=[]; G.spawnT = lv.tutorial? 28 : 3; G.custSeed=0;
  G.crowT = lv.crows? 18 + Math.random()*8 : 1e9;
  G.deliveryT = U.bike? 40 : 1e9;
  G.menu = lv.menu;
  G.items = relevantItems(lv);
  G.tut = lv.tutorial && !S.tutDone ? 0 : -1; G.tutT=0;
  bgCache=null; G.on=true;
  SFX.warn();
}
function relevantItems(lv){
  const set=new Set(); lv.plots.forEach(p=>set.add(p)); if(lv.palms) set.add('palmfruit'); if(lv.chickens) set.add('egg'); if(lv.goats) set.add('milk');
  lv.machines.forEach(m=>set.add(MACHINES[m].out)); return [...set];
}
function stock(id){ return G.pantry[id]||0; }
function stored(){ return Object.values(G.pantry).reduce((a,b)=>a+b,0); }
function addStock(id,n,x,y,force){ if(force){ G.pantry[id]=stock(id)+n; flyToPantry(id,x,y,n); return n; } const room=G.U.cap-stored(); if(room<=0){ toast('Barn store full! Tap a store item to sell one', x, y, '#ff8a80'); G.fullFlash=1.2; SFX.err(); return 0; } const k=Math.min(room,n); G.pantry[id]=stock(id)+k; flyToPantry(id,x,y,k); return k; }
function hasAll(req){ return Object.keys(req).every(k=>stock(k)>=req[k]); }
function take(req){ Object.keys(req).forEach(k=>G.pantry[k]-=req[k]); }
function made(id,n=1){ G.made[id]=(G.made[id]||0)+n; if(id==='garri') S.stats.garri+=n; }
function missing(req,x,y){ const miss=Object.keys(req).filter(k=>stock(k)<req[k]); G.floats.push({type:'miss',items:miss,x,y,life:1.4,max:1.4}); SFX.err(); }
function toast(txt,x,y,col='#fff'){ G.floats.push({type:'txt',txt,x,y,life:1.6,max:1.6,col}); }
function flyToPantry(id,x,y,n){ const i=G.items.indexOf(id); const tx=chipX(i), ty=LAYOUT.pantry.y+50; for(let k=0;k<Math.min(n,4);k++) G.fx.push({type:'fly',id,x0:x+k*8,y0:y,x1:tx,y1:ty,t:-k*0.06,d:0.55}); }
function chipX(i){ const n=G.items.length; const cw=Math.min(104,(W-260)/n); return 40+cw*i+cw/2; }
function coinBurst(x,y,amt){ for(let k=0;k<Math.min(10,3+amt/150);k++) G.fx.push({type:'coin',x0:x+(Math.random()-0.5)*40,y0:y+(Math.random()-0.5)*20,x1:600,y1:32,t:-k*0.05,d:0.7}); }
function sparkle(x,y,col='#fff59d',n=12){ for(let k=0;k<n;k++){ const a=Math.random()*Math.PI*2, sp=80+Math.random()*160; G.fx.push({type:'spark',x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-60,t:0,d:0.6+Math.random()*0.3,col}); } }

/* availability for customer orders */
G.availableFor = function(id){ if(!G.on) return false; if(G.warmer.includes(id)) return true; if(G.stations.some(s=>s.state==='ready'&&STATIONS[s.id].out===id)) return true; if(DIRECT.includes(id) && stock(id)>0) return true; return false; };
function takeFor(id){
  const s=G.stations.find(s=>s.state==='ready'&&STATIONS[s.id].out===id); if(s){ s.state='idle'; s.t=0; return {x:s.x+s.w/2,y:s.y+20}; }
  const wi=G.warmer.indexOf(id); if(wi>=0){ const p=warmPos(wi); G.warmer.splice(wi,1); return p; }
  if(DIRECT.includes(id)&&stock(id)>0){ G.pantry[id]--; return {x:chipX(G.items.indexOf(id)),y:LAYOUT.pantry.y+40}; }
  return null;
}
function warmPos(i){ const sw=74, x0=LAYOUT.buka.x+LAYOUT.buka.w/2-(G.warmCap*sw)/2; return {x:x0+i*sw+sw/2, y:530}; }
function serveItem(cu,oi){ const o=cu.order[oi]; if(o.done) return false; const from=takeFor(o.id); if(!from) return false; o.done=true; G.fx.push({type:'fly',id:o.id,x0:from.x,y0:from.y,x1:o.hx||cu.x,y1:o.hy||cu.y-100,t:0,d:0.35}); SFX.serve(); cu.pat=Math.min(cu.patMax,cu.pat+cu.patMax*0.12);
  if(cu.order.every(o=>o.done)) setTimeout(()=>payCustomer(cu),380); return true; }
function payCustomer(cu){
  if(cu.gone) return; cu.gone=true; const base=cu.order.reduce((a,o)=>a+ITEMS[o.id].price,0)*G.U.price*(cu.delivery?G.U.bikeMult:1); const mood=Math.max(0,cu.pat/cu.patMax); const tip=Math.round(base*0.3*mood*G.U.tip/10)*10; const amt=Math.round(base/10)*10+tip;
  G.coins+=amt; G.served++; S.stats.served++; S.stats.earned+=amt; cu.leaving=true; cu.happy=1; G.slots[cu.slot]=null;
  G.floats.push({type:'txt',txt:'+'+fmtN(amt)+(tip>0?'  tip!':''),x:cu.x,y:cu.y-60,life:1.4,max:1.4,col:'#ffe066',big:true}); coinBurst(cu.x,cu.y-40,amt); SFX.pay(); setTimeout(SFX.coin,250);
  G.serveTimes.push(G.t); G.serveTimes=G.serveTimes.filter(t=>G.t-t<=6); if(G.serveTimes.length>=3){ unlock('combo'); toast('COMBO! Speed merchant',cu.x,cu.y-110,'#7ee05a'); }
  if(cu.delivery&&window.labRouteBonus) labRouteBonus(cu,amt);
  unlock('serve1'); if(S.stats.served>=100) unlock('serve100'); if(S.stats.served>=500) unlock('serve500');
}
function spawnCustomer(delivery){
  const free=[]; G.slots.forEach((s,i)=>{ if(!s) free.push(i); }); if(!free.length) return false;
  const slot=free[Math.floor(Math.random()*free.length)]; const lv=G.lvl; const sw=LAYOUT.buka.w/G.nSlots;
  const nOrd = delivery? Math.min(3,Math.max(2,lv.orderMax)) : 1+Math.floor(Math.random()*lv.orderMax*(0.6+0.4*Math.min(1,G.t/60)) ); const order=[];
  for(let k=0;k<Math.min(nOrd,3);k++){ order.push({id:lv.menu[Math.floor(Math.random()*lv.menu.length)],done:false}); }
  // nudge toward goal dishes still needed
  if(lv.goals.make){ const need=Object.keys(lv.goals.make).filter(id=>lv.menu.includes(id)&&(G.made[id]||0)<lv.goals.make[id]); if(need.length&&Math.random()<0.5) order[0].id=need[Math.floor(Math.random()*need.length)]; }
  const pm = lv.patience*G.U.pat*(1+0.25*(order.length-1))*(delivery?1.6:1);
  const cu={slot,type:(G.custSeed++*3+Math.floor(Math.random()*3))%CUSTOMERS.length,seed:Math.random()*10,order,patMax:pm,pat:pm,x:LAYOUT.buka.x+sw*slot+sw/2,y:254,tx:LAYOUT.buka.x+sw*slot+sw/2,enter:0,delivery:!!delivery,happy:0};
  cu.x = slot < G.nSlots/2 ? LAYOUT.buka.x-60 : W+60; G.slots[slot]=cu; G.customers.push(cu); SFX.tap(); return true;
}
function goalsDone(){ const g=G.lvl.goals; if(g.serve && G.served<g.serve) return false; if(g.earn && G.coins<g.earn) return false; if(g.make) for(const k in g.make) if((G.made[k]||0)<g.make[k]) return false; return true; }
function goalList(){ const g=G.lvl.goals, out=[]; if(g.serve) out.push({icon:'customer',cur:G.served,need:g.serve,label:'Serve'}); if(g.earn) out.push({icon:'coin',cur:G.coins,need:g.earn,label:'Earn',money:true}); if(g.make) for(const k in g.make) out.push({icon:k,cur:G.made[k]||0,need:g.make[k],label:'Make'}); return out; }

function update(dt){
  if(!G.on||G.paused||G.over) return;
  if(window.labTick) labTick(dt);
  G.t+=dt; G.left-=dt; const U=G.U;
  if(G.left<=30 && !G.warned){ G.warned=true; SFX.warn(); toast('30 seconds left!',W/2,120,'#ff6b6b'); }
  // plots
  G.plots.forEach(p=>{ if(p.state==='growing'){ p.t+=dt; if(p.t>=p.dur){ p.state='ripe'; } }
    if(p.crow){ const cr=p.crow; cr.k+=dt/(cr.phase==='in'?0.9:4.2); if(cr.k>=1){ if(cr.phase==='in'){ cr.phase='eat'; cr.k=0; SFX.crow(); } else { // steals
        p.crow=null; if(p.state!=='empty'){ p.state='empty'; p.t=0; toast('Crow stole your '+ITEMS[p.crop].n.toLowerCase()+'!',p.x+p.w/2,p.y,'#ff6b6b'); SFX.angry(); } } } } });
  // crows
  G.crowT-=dt; if(G.crowT<=0){ const targets=G.plots.filter(p=>!p.crow&&(p.state==='ripe'||(p.state==='growing'&&p.t>p.dur*0.5))); if(targets.length){ const p=targets[Math.floor(Math.random()*targets.length)]; p.crow={phase:'in',k:0}; } G.crowT = (24/G.lvl.crows)*(0.7+Math.random()*0.6); }
  // coop
  const co=G.coop; if(co && co.feed>0){ co.t+=dt; const per=U.eggT/co.hens*1.6; while(co.t>=per && co.feed>0){ co.t-=per; if(co.eggs.length<6){ co.eggs.push(1); co.feed--; if(Math.random()<0.4) SFX.cluck(); } else { co.t=0; break; } } }
  const pe=G.pen; if(pe && pe.fed>0){ pe.t+=dt; const per=U.milkT/pe.goats; if(pe.t>=per){ pe.t-=per; if(pe.milk<6){ pe.milk++; pe.fed--; } } }
  G.palms.forEach(p=>{ if(!p.ripe){ p.t+=dt; if(p.t>=p.dur){ p.ripe=true; } } });
  // machines
  G.machines.forEach(m=>{ if(m.state==='busy'){ m.t+=dt; if(m.t>=m.dur){ m.state='done'; SFX.ding(); collectMachine(m,true); } } else if(m.state==='idle' && U.auto && hasAll(MACHINES[m.id].in)){ take(MACHINES[m.id].in); m.state='busy'; m.t=0; } });
  // stations
  G.stations.forEach(s=>{ if(s.state==='cook'){ s.t+=dt; if(s.t>=s.dur){ s.state='ready'; s.t=0; SFX.ding(); } } else if(s.state==='ready'){ s.t+=dt; if(s.t>=s.burn){ s.state='burnt'; SFX.burn(); toast('Burnt! Tap to bin it',s.x+s.w/2,s.y,'#ff6b6b'); } } });
  // customers
  const tutWait = G.tut>=0 && G.tut<5;
  G.spawnT-=dt; if(G.spawnT<=0 && !tutWait){ if(spawnCustomer(false)) G.spawnT = G.lvl.spawn[0]+Math.random()*(G.lvl.spawn[1]-G.lvl.spawn[0]); else G.spawnT=1; }
  if(G.tut>=0 && G.tut<5 && G.spawnT<2) G.spawnT=2;
  G.deliveryT-=dt; if(G.deliveryT<=0){ spawnCustomer(true); G.deliveryT = (U.bike>=2?32:48)+Math.random()*12; }
  G.customers.forEach(cu=>{
    if(cu.leaving){ cu.x += (cu.slot<G.nSlots/2?-1:1)*420*dt; cu.happy=Math.max(0,cu.happy-dt); if(cu.x<LAYOUT.buka.x-80||cu.x>W+80) cu.dead=true; return; }
    if(Math.abs(cu.x-cu.tx)>2){ cu.x += Math.sign(cu.tx-cu.x)*Math.min(Math.abs(cu.tx-cu.x),520*dt); return; }
    cu.x=cu.tx; const tutSlow = G.tut>=0? 0.35:1; cu.pat-=dt*tutSlow;
    if(cu.pat<=0){ cu.leaving=true; cu.gone=true; G.slots[cu.slot]=null; G.lost++; SFX.angry(); toast('Customer left angry',cu.x,cu.y-80,'#ff6b6b'); G.screenShake=0.3; }
  });
  G.customers=G.customers.filter(c=>!c.dead);
  // tutorial progress
  tutUpdate(dt);
  // win / lose
  if(goalsDone()) return endLevel(true);
  if(G.left<=0){ G.left=0; return endLevel(false); }
}
function collectMachine(m,auto){ const out=MACHINES[m.id].out; const got=addStock(out,1,m.x+m.w/2,m.y+10,true); if(got){ m.state='idle'; m.t=0; made(out); if(!auto) SFX.harvest(); if(out==='garri'&&S.stats.garri>=50) unlock('garri50'); } }

/* taps */
function tapAt(x,y){
  if(!G.on||G.paused||G.over) return;
  // HUD buttons
  if(y<64){ if(x>=1150&&x<=1206){ pauseGame(); return; } if(x>=1214){ toggleSound(); return; } }
  // customer orders (tap a dish in the bubble)
  for(const cu of G.customers){ if(cu.leaving||cu.x!==cu.tx) continue; for(let i=0;i<cu.order.length;i++){ const o=cu.order[i]; if(!o.done && o.hx && Math.hypot(x-o.hx,y-o.hy)<30){ if(!serveItem(cu,i)){ const need = STATIONS[Object.keys(STATIONS).find(k=>STATIONS[k].out===o.id)]; toast(DIRECT.includes(o.id)? 'No '+ITEMS[o.id].n+' in store yet' : 'Cook '+ITEMS[o.id].n+' first', o.hx,o.hy-30,'#ffd1d1'); SFX.err(); } return; } } }
  // pantry: tap an item to sell one at the market
  if(y>=LAYOUT.pantry.y+10){ const n=G.items.length, cw=Math.min(104,(W-260)/n); for(let i=0;i<n;i++){ const cx=chipX(i); if(Math.abs(x-cx)<=cw/2){ sellOne(G.items[i],cx); return; } } return; }
  // stations
  for(const s of G.stations){ if(inR(x,y,s)){ tapStation(s); return; } }
  // warmer
  for(let i=0;i<G.warmer.length;i++){ const p=warmPos(i); if(Math.abs(x-p.x)<36&&Math.abs(y-p.y)<36){ const id=G.warmer[i]; const cu=neediest(id); if(cu){ serveItem(cu,cu.order.findIndex(o=>!o.done&&o.id===id)); } else { toast('Nobody wants '+ITEMS[id].n+' right now',p.x,p.y-30); SFX.err(); } return; } }
  // plots
  for(const p of G.plots){ if(inR(x,y,p)){ tapPlot(p); return; } }
  if(G.coop && inR(x,y,G.coop)){ tapCoop(); return; }
  if(G.pen && inR(x,y,G.pen)){ tapPen(); return; }
  for(const p of G.palms){ if(inR(x,y,p)){ if(p.ripe){ if(addStock('palmfruit',1,p.x+p.w/2,p.y+40)){ p.ripe=false; p.t=0; made('palmfruit'); SFX.harvest(); } } else { toast('Palm fruit still growing',p.x+p.w/2,p.y+20); } return; } }
  for(const m of G.machines){ if(inR(x,y,m)){ tapMachine(m); return; } }
}
function sellOne(id,cx){ if(stock(id)<=0){ SFX.err(); return; } G.pantry[id]--; const v=Math.round((RAWVAL[id]||50)*0.5/10)*10; G.coins+=v; S.stats.earned+=v; G.floats.push({type:'txt',txt:'Sold +'+fmtN(v),x:cx,y:LAYOUT.pantry.y-6,life:1,max:1,col:'#ffe066'}); SFX.coin(); }
function inR(x,y,r){ return x>=r.x-4&&x<=r.x+r.w+4&&y>=r.y-4&&y<=r.y+r.h+4; }
function neediest(id){ let best=null; G.customers.forEach(cu=>{ if(cu.leaving||cu.x!==cu.tx) return; if(cu.order.some(o=>!o.done&&o.id===id)){ if(!best||cu.pat/cu.patMax<best.pat/best.patMax) best=cu; } }); return best; }
function tapPlot(p){
  if(p.crow){ p.crow=null; G.crowsShooed++; S.stats.crows++; if(S.stats.crows>=20) unlock('crow20'); SFX.shoo(); sparkle(p.x+p.w/2,p.y+20,'#ddd',8); toast('Shoo!',p.x+p.w/2,p.y+10,'#fff'); return; }
  if(p.state==='empty'){ p.state='growing'; p.t=0; SFX.plant(); sparkle(p.x+p.w/2,p.y+p.h/2,'#c8a26a',8); }
  else if(p.state==='ripe'){ const got=addStock(p.crop,G.U.yield,p.x+p.w/2,p.y+p.h/2); if(got){ p.state='growing'; p.t=0; made(p.crop,got); S.stats.harvests++; G.harvested++; unlock('harvest'); SFX.harvest(); sparkle(p.x+p.w/2,p.y+p.h/2); } }
  else { toast(Math.ceil(p.dur-p.t)+'s to go',p.x+p.w/2,p.y+20); SFX.tap(); }
}
function tapCoop(){ const co=G.coop; if(co.eggs.length){ const n=co.eggs.length; const got=addStock('egg',n,co.x+60,co.y+co.h-30); if(got){ co.eggs.splice(0,got); made('egg',got); SFX.harvest(); } return; }
  if(co.feed<=0){ const grain=FEED.filter(k=>stock(k)>0).sort((a,b)=>stock(b)-stock(a))[0]; if(grain){ G.pantry[grain]--; co.feed=3+co.hens; co.t=0; SFX.cluck(); toast('Hens fed with '+ITEMS[grain].n.toLowerCase(),co.x+co.w/2,co.y+40,'#fff'); } else { const f=FEED.filter(k=>G.items.includes(k)); missing(Object.fromEntries((f.length?f:['maize']).map(k=>[k,1])),co.x+co.w/2,co.y+40); toast('Hens eat grain: maize, rice or beans',co.x+co.w/2,co.y+80,'#ffd1d1'); } }
  else { toast('Laying eggs...',co.x+co.w/2,co.y+40); SFX.tap(); } }
function tapPen(){ const pe=G.pen; if(pe.milk>0){ const got=addStock('milk',pe.milk,pe.x+pe.w-40,pe.y+pe.h-40); if(got){ pe.milk-=got; made('milk',got); SFX.harvest(); } return; }
  if(pe.fed<=0){ pe.fed=G.U.milkPer*pe.goats; pe.t=0; SFX.plant(); toast('Goats fed fresh grass',pe.x+pe.w/2,pe.y+30,'#fff'); } else { toast('Making milk...',pe.x+pe.w/2,pe.y+30); SFX.tap(); } }
function tapMachine(m){ const def=MACHINES[m.id];
  if(m.state==='done'){ collectMachine(m,false); return; }
  if(m.state==='busy'){ toast(Math.ceil(m.dur-m.t)+'s to go',m.x+m.w/2,m.y); SFX.tap(); return; }
  if(hasAll(def.in)){ take(def.in); m.state='busy'; m.t=0; SFX.machine(); } else missing(def.in,m.x+m.w/2,m.y+20);
}
function tapStation(s){ const def=STATIONS[s.id];
  if(s.state==='burnt'){ s.state='idle'; s.t=0; SFX.tap(); return; }
  if(s.state==='ready'){ const id=def.out; const cu=neediest(id); if(cu){ serveItem(cu,cu.order.findIndex(o=>!o.done&&o.id===id)); } else if(G.warmer.length<G.warmCap){ G.warmer.push(id); s.state='idle'; s.t=0; const p=warmPos(G.warmer.length-1); G.fx.push({type:'fly',id,x0:s.x+s.w/2,y0:s.y+20,x1:p.x,y1:p.y,t:0,d:0.3}); SFX.tap(); } else { toast('Warmer is full!',s.x+s.w/2,s.y,'#ffd1d1'); SFX.err(); } return; }
  if(s.state==='cook'){ toast(Math.ceil(s.dur-s.t)+'s to go',s.x+s.w/2,s.y); SFX.tap(); return; }
  if(hasAll(def.in)){ take(def.in); s.state='cook'; s.t=0; made(def.out); SFX.cook(); } else missing(def.in,s.x+s.w/2,s.y+30);
}
/* tutorial (level 1) */
const TUT = [
  {txt:'Tap a field to plant it', target:()=>G.plots.find(p=>p.state==='empty'), done:()=>G.plots.some(p=>p.state!=='empty')},
  {txt:'Plant every field: rice, tomato and ata rodo pepper', target:()=>G.plots.find(p=>p.state==='empty'), done:()=>G.plots.every(p=>p.state!=='empty')||G.harvested>0},
  {txt:'When a field shows  !  tap to harvest. It replants itself', target:()=>G.plots.find(p=>p.state==='ripe'), done:()=>stock('tomato')>0&&stock('pepper')>0||G.made.peppermix>0},
  {txt:'Tap the Pepper Grinder: tomato + pepper = pepper mix', target:()=>G.machines[0], done:()=>G.machines[0].state!=='idle'||stock('peppermix')>0},
  {txt:'Grinding... the pepper mix drops into your store by itself', target:()=>null, done:()=>stock('peppermix')>0||G.made.jollof>0},
  {txt:'Tap the Jollof pot to cook: rice + pepper mix', target:()=>G.stations[0], done:()=>G.stations[0].state!=='idle'||G.served>0},
  {txt:'Jollof is ready! Tap the pot to serve your customer before it burns', target:()=>G.stations[0].state==='ready'?G.stations[0]:null, done:()=>G.served>0},
  {txt:'Oya! Keep the farm busy and hit the goals at the top before time runs out', target:()=>null, done:()=>G.tutT>5}
];
function tutUpdate(dt){ if(G.tut<0) return; G.tutT+=dt; const st=TUT[G.tut]; if(st.done()){ G.tut++; G.tutT=0; if(G.tut>=TUT.length){ G.tut=-1; S.tutDone=true; save(); } } }

function endLevel(win){
  G.over=true; const lv=G.lvl, i=G.li; let stars=0;
  if(win){ const frac=G.left/G.time; stars = frac>=lv.gold?3: frac>=lv.silver?2:1; }
  // leftover stock sold at market stall
  let stall=0; if(G.U.stall>0){ for(const k in G.pantry){ stall+= (RAWVAL[k]||50)*G.pantry[k]*G.U.stall; } stall=Math.round(stall/10)*10; }
  const timeBonus = win? Math.round(G.left*10/10)*10 : 0;
  const total = G.coins + stall + timeBonus;
  S.bank += total; S.stats.earned += stall+timeBonus;
  const prevStars=S.stars[i];
  if(win){ S.stars[i]=Math.max(S.stars[i],stars); S.best[i]=Math.max(S.best[i],G.coins); S.stats.levelsWon++; if(stars===3) unlock('star3'); if(G.lost===0) unlock('perfect'); }
  if(S.stats.earned>=100000) unlock('earn100k');
  AREAS.forEach((a,ai)=>{ let all=true; for(let k=a.from;k<a.to;k++) if(!S.stars[k]) all=false; if(all) unlock(a.id); });
  if(S.stars.every(s=>s===3)) unlock('allstars');
  save();
  setTimeout(()=>showResult({win,stars,prevStars,coins:G.coins,stall,timeBonus,total,lost:G.lost,served:G.served,i}), win?600:300);
  if(win) SFX.win(); else SFX.lose();
}
function unlock(id){ if(S.ach[id]) return; S.ach[id]=Date.now(); save(); const a=ACH.find(a=>a.id===id); if(a) achToast(a); }


/* ===== Render loop ===== */
const cv = document.getElementById('game'); const ctx = cv.getContext('2d');
let VIEW={s:1,ox:0,oy:0,cw:0,ch:0}; let bgCache=null;
function resize(){ DPR=Math.min(window.devicePixelRatio||1,2.5); const cw=window.innerWidth, ch=window.innerHeight; cv.width=Math.round(cw*DPR); cv.height=Math.round(ch*DPR); cv.style.width=cw+'px'; cv.style.height=ch+'px';
  const s=Math.min(cw/W,ch/H); VIEW={s,ox:(cw-W*s)/2,oy:(ch-H*s)/2,cw,ch}; bgCache=null; for(const k in iconCache) delete iconCache[k]; }
window.addEventListener('resize',resize);
function toLogical(cx,cy){ return {x:(cx-VIEW.ox)/VIEW.s, y:(cy-VIEW.oy)/VIEW.s}; }
function toClient(x,y){ return {x:x*VIEW.s+VIEW.ox, y:y*VIEW.s+VIEW.oy}; }
function buildBg(){ const b=document.createElement('canvas'); b.width=Math.round(W*VIEW.s*DPR); b.height=Math.round(H*VIEW.s*DPR); const c=b.getContext('2d'); c.scale(VIEW.s*DPR,VIEW.s*DPR); drawBackground(c,G.lvl); bgCache=b; }
let lastT=performance.now();
function frame(now){ const dt=Math.min(0.1,(now-lastT)/1000)*(window.__speed||1); lastT=now; G.anim=(G.anim||0)+dt;
  if(G.on){ update(dt); render(dt); }
  else if(window.empireVisible) drawEmpire(dt);
  requestAnimationFrame(frame); }
function render(dt){
  const c=ctx; const t=G.anim; c.setTransform(1,0,0,1,0,0);
  // letterbox fill
  c.fillStyle='#3a2210'; c.fillRect(0,0,cv.width,cv.height/2); c.fillStyle='#5e3519'; c.fillRect(0,cv.height/2,cv.width,cv.height/2); if(VIEW.ox>1){ c.fillStyle='#4f9a37'; c.fillRect(0,0,cv.width,cv.height); }
  let shx=0,shy=0; if(G.screenShake>0){ G.screenShake-=dt; shx=(Math.random()-0.5)*8; shy=(Math.random()-0.5)*8; }
  if(!bgCache) buildBg();
  c.drawImage(bgCache,(VIEW.ox+shx)*DPR,(VIEW.oy+shy)*DPR);
  c.setTransform(VIEW.s*DPR,0,0,VIEW.s*DPR,(VIEW.ox+shx)*DPR,(VIEW.oy+shy)*DPR);
  const area=G.lvl.area;
  G.plots.forEach(p=>drawPlot(c,p,t));
  G.palms.forEach(p=>drawPalm(c,p,t));
  if(G.coop) drawCoop(c,G.coop,t);
  if(G.pen) drawPen(c,G.pen,t);
  G.machines.forEach(m=>drawMachine(c,m,t));
  // customers behind counter
  c.save(); c.beginPath(); c.rect(LAYOUT.buka.x,LAYOUT.buka.y,LAYOUT.buka.w,250); c.clip(); G.customers.forEach(cu=>drawCustomer(c,cu,t)); c.restore();
  drawCounterFront(c,area);
  G.customers.forEach(cu=>{ if(!cu.leaving && cu.x===cu.tx) drawOrder(c,cu,t); });
  G.stations.forEach(s=>drawStation(c,s,t,area));
  drawWarmer(c,t);
  drawPantry(c,t);
  drawHUD(c,t);
  drawFx(c,dt);
  drawHint(c,t);
}
function drawWarmer(c,t){ const sw=74, n=G.warmCap, x0=LAYOUT.buka.x+LAYOUT.buka.w/2-(n*sw)/2, y=496;
  rr(c,x0-14,y,n*sw+28,70,14); c.fillStyle=lg(c,0,y,0,y+70,['#b0b7bc','#7b858c']); c.fill(); c.lineWidth=3; c.strokeStyle=OUT; c.stroke();
  c.fillStyle='rgba(255,140,40,.25)'; c.fillRect(x0-6,y+56,n*sw+12,6);
  c.fillStyle='#2c3e50'; rr(c,x0+n*sw/2-40,y-12,80,18,8); c.fill(); c.fillStyle='#fff'; c.font='800 11px "Segoe UI",sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('WARMER',x0+n*sw/2,y-3);
  for(let i=0;i<n;i++){ const p=warmPos(i); ell(c,p.x,p.y+4,28,12); c.fillStyle='rgba(255,255,255,.35)'; c.fill(); if(G.warmer[i]) drawIcon(c,G.warmer[i],p.x,p.y-4,46); }
  if(G.U.bike){ c.fillStyle='rgba(58,34,16,.75)'; c.font='800 12px "Segoe UI",sans-serif'; c.textAlign='right'; c.fillText('Delivery bike active',LAYOUT.buka.x+LAYOUT.buka.w-14,632); }
}
function drawPantry(c,t){ const y=LAYOUT.pantry.y; const n=G.items.length; const cw=Math.min(104,(W-260)/n);
  G.items.forEach((id,i)=>{ const x=chipX(i); const k=stock(id); rr(c,x-cw/2+5,y+16,cw-10,74,14); c.fillStyle= k? 'rgba(255,240,210,.95)':'rgba(255,240,210,.45)'; c.fill(); c.lineWidth=2.5; c.strokeStyle=OUT; c.stroke();
    drawIcon(c,id,x,y+46,40,k?1:0.45); rr(c,x+cw/2-40,y+66,32,22,10); c.fillStyle=k?'#2e7d32':'#8d6e63'; c.fill(); c.fillStyle='#fff'; c.font='900 15px "Segoe UI",sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(k,x+cw/2-24,y+77.5); });
  // capacity
  const st=stored(), cap=G.U.cap; const x=W-200; rr(c,x,y+18,184,70,14); c.fillStyle= G.fullFlash>0 && Math.sin(G.anim*20)>0 ? 'rgba(200,40,30,.85)':'rgba(30,15,5,.6)'; c.fill(); if(G.fullFlash>0) G.fullFlash-=1/60; c.fillStyle='#ffe08a'; c.font='800 14px "Segoe UI",sans-serif'; c.textAlign='left'; c.fillText('BARN STORE',x+14,y+34); c.fillStyle='rgba(255,255,255,.75)'; c.font='700 11px "Segoe UI",sans-serif'; c.textAlign='center'; c.fillText('tap an item to sell 1',x+92,y+79);
  rr(c,x+14,y+44,156,20,10); c.fillStyle='rgba(255,255,255,.2)'; c.fill(); rr(c,x+14,y+44,156*Math.min(1,st/cap),20,10); c.fillStyle= st>=cap?'#e74c3c': st>cap*0.8?'#f39c12':'#7ee05a'; c.fill(); c.fillStyle='#fff'; c.font='900 13px "Segoe UI",sans-serif'; c.textAlign='center'; c.fillText(st+' / '+cap,x+92,y+55);
}
function drawHUD(c,t){
  // top bar
  c.fillStyle=lg(c,0,0,0,64,['rgba(40,22,8,.92)','rgba(70,40,15,.9)']); c.fillRect(0,0,W,64); c.fillStyle='#d4a017'; c.fillRect(0,62,W,3);
  // goals
  const gl=goalList(); let x=10; c.fillStyle='#ffe08a'; c.font='900 12px "Segoe UI",sans-serif'; c.textAlign='left'; c.textBaseline='middle'; c.fillText('GOALS',x+2,14);
  gl.forEach(g=>{ const done=g.cur>=g.need; const txt = g.money? fmtN(Math.min(g.cur,g.need))+'/'+fmtN(g.need).replace('\u20a6','') : Math.min(g.cur,g.need)+'/'+g.need; c.font='900 15px "Segoe UI",sans-serif'; const w=44+c.measureText(txt).width;
    rr(c,x,22,w,36,12); c.fillStyle=done?'#2e7d32':'rgba(255,255,255,.14)'; c.fill(); c.lineWidth=2; c.strokeStyle=done?'#7ee05a':'rgba(255,255,255,.25)'; c.stroke();
    drawIcon(c,g.icon,x+20,40,26); c.fillStyle='#fff'; c.textAlign='left'; c.fillText(txt,x+36,41); if(done){ c.fillStyle='#7ee05a'; c.font='900 14px sans-serif'; c.fillText('\u2713',x+w-12,28); } x+=w+8; });
  // coins
  const cx=Math.max(x+20,560); rr(c,cx,10,170,44,22); c.fillStyle='rgba(0,0,0,.35)'; c.fill(); drawIcon(c,'coin',cx+22,32,34); c.fillStyle='#ffe066'; c.font='900 22px "Segoe UI",sans-serif'; c.textAlign='left'; c.fillText(fmtN(G.coins),cx+44,33);
  // timer + star markers
  const tx=Math.max(cx+186,760), tw=1136-tx; const k=Math.max(0,G.left/G.time); rr(c,tx,18,tw,28,14); c.fillStyle='rgba(0,0,0,.4)'; c.fill();
  rr(c,tx+3,21,(tw-6)*k,22,11); c.fillStyle= G.left<30? (Math.sin(t*10)>0?'#ff5252':'#c62828') : lg(c,tx,0,tx+tw,0,['#f39c12','#f1c40f','#7ee05a']); c.fill();
  [[G.lvl.gold,3],[G.lvl.silver,2]].forEach(([f,n])=>{ const mx=tx+3+(tw-6)*f; const lit = k>=f; c.save(); c.translate(mx,18); ICON.star(c,22,lit?null:'#777'); c.restore(); c.fillStyle=lit?'#fff':'#aaa'; c.font='900 10px sans-serif'; c.textAlign='center'; c.fillText(n,mx,32); });
  const mm=Math.floor(Math.ceil(G.left)/60), ss=Math.ceil(G.left)%60; c.fillStyle='#fff'; c.font='900 20px "Segoe UI",sans-serif'; c.textAlign='center'; c.fillText(mm+':'+String(ss).padStart(2,'0'),tx+tw/2,33);
  // buttons
  hudBtn(c,1150,4,56,56,'pause'); hudBtn(c,1214,4,56,56,S.music||S.sfx?'sound':'mute');
  // level name
}
function hudBtn(c,x,y,w,h,kind){ rr(c,x,y,w,h,14); c.fillStyle=lg(c,0,y,0,y+h,['#f6c453','#d68910']); c.fill(); c.lineWidth=3; c.strokeStyle=OUT; c.stroke(); c.fillStyle=OUT; c.strokeStyle=OUT; const cx=x+w/2, cy=y+h/2;
  if(kind==='pause'){ rr(c,cx-11,cy-13,8,26,3); c.fill(); rr(c,cx+3,cy-13,8,26,3); c.fill(); }
  else { c.beginPath(); c.moveTo(cx-14,cy-6); c.lineTo(cx-7,cy-6); c.lineTo(cx+2,cy-14); c.lineTo(cx+2,cy+14); c.lineTo(cx-7,cy+6); c.lineTo(cx-14,cy+6); c.closePath(); c.fill(); c.lineWidth=3; c.lineCap='round';
    if(kind==='sound'){ c.beginPath(); c.arc(cx+4,cy,8,-0.8,0.8); c.stroke(); c.beginPath(); c.arc(cx+4,cy,14,-0.8,0.8); c.stroke(); } else { c.beginPath(); c.moveTo(cx+7,cy-7); c.lineTo(cx+17,cy+7); c.moveTo(cx+17,cy-7); c.lineTo(cx+7,cy+7); c.stroke(); } } }
function drawFx(c,dt){
  G.fx.forEach(f=>{ f.t+=dt; if(f.t<0) return; const k=Math.min(1,f.t/f.d);
    if(f.type==='fly'||f.type==='coin'){ const e=1-Math.pow(1-k,3); const x=f.x0+(f.x1-f.x0)*e, y=f.y0+(f.y1-f.y0)*e - Math.sin(k*Math.PI)*80; drawIcon(c,f.type==='coin'?'coin':f.id,x,y,f.type==='coin'?24:34); if(k>=1&&f.type==='coin'&&!f.dinged){ f.dinged=true; } }
    else if(f.type==='spark'){ const x=f.x+f.vx*f.t, y=f.y+f.vy*f.t+200*f.t*f.t; c.globalAlpha=1-k; c.fillStyle=f.col; c.beginPath(); c.arc(x,y,4*(1-k)+1,0,Math.PI*2); c.fill(); c.globalAlpha=1; }
  });
  G.fx=G.fx.filter(f=>f.t<f.d);
  G.floats.forEach(f=>{ f.life-=dt; const k=1-f.life/f.max; const y=f.y-k*40; c.globalAlpha=Math.min(1,f.life*2);
    if(f.type==='txt'){ c.font=`900 ${f.big?24:17}px "Segoe UI",sans-serif`; c.textAlign='center'; c.textBaseline='middle'; c.lineWidth=5; c.strokeStyle='rgba(40,20,5,.85)'; c.strokeText(f.txt,f.x,y); c.fillStyle=f.col; c.fillText(f.txt,f.x,y); }
    else if(f.type==='miss'){ const n=f.items.length; rr(c,f.x-n*24-14,y-28,n*48+28,56,16); c.fillStyle='rgba(255,255,255,.95)'; c.fill(); c.lineWidth=3; c.strokeStyle='#c0392b'; c.stroke(); f.items.forEach((id,i)=>{ const ix=f.x-(n-1)*24+i*48; drawIcon(c,id,ix,y,34); c.strokeStyle='#e74c3c'; c.lineWidth=4; c.beginPath(); c.moveTo(ix-12,y-12); c.lineTo(ix+12,y+12); c.stroke(); }); c.fillStyle='#c0392b'; c.font='900 12px "Segoe UI",sans-serif'; c.textAlign='center'; c.fillText('NEED',f.x,y-36); }
    c.globalAlpha=1; });
  G.floats=G.floats.filter(f=>f.life>0);
}
function drawHint(c,t){ if(G.tut<0) return; const st=TUT[G.tut]; if(!st) return;
  // banner
  c.font='800 18px "Segoe UI",sans-serif'; const w=Math.min(700,c.measureText(st.txt).width+70); const bx=W/2-w/2+(-330), by=74; const x0=Math.max(10,320-w/2);
  rr(c,x0,by,w,40,20); c.fillStyle='rgba(255,253,240,.97)'; c.fill(); c.lineWidth=3; c.strokeStyle='#d68910'; c.stroke(); c.fillStyle=OUT; c.textAlign='center'; c.textBaseline='middle'; c.fillText(st.txt,x0+w/2,by+21);
  const tg=st.target(); if(!tg) return; const tx=tg.x+tg.w/2, ty=tg.y+tg.h/2; const bob=Math.sin(t*6)*8;
  c.save(); c.globalAlpha=0.5+0.3*Math.sin(t*6); rr(c,tg.x-6,tg.y-6,tg.w+12,tg.h+12,16); c.lineWidth=5; c.strokeStyle='#fff'; c.stroke(); c.restore();
  drawHand(c,tx+18,ty+18+bob);
}
function drawHand(c,x,y){ c.save(); c.translate(x,y); c.rotate(-0.4); c.beginPath(); rr(c,-8,-34,16,40,8); fillStroke(c,'#f5cba7',3); rr(c,-14,0,40,34,12); fillStroke(c,'#f5cba7',3); c.restore(); }


/* ===== Empire map ===== */
const ecv = document.getElementById('empireCv'); const ectx = ecv.getContext('2d'); const EW=1280, EH=640;
let EVIEW={s:1,ox:0,oy:0};
const SLOTS = {
  store:{x:50,y:90,w:150,h:120}, mills:{x:240,y:70,w:150,h:120}, farm:{x:24,y:400,w:230,h:140}, coop:{x:280,y:210,w:130,h:110}, pen:{x:275,y:450,w:150,h:110},
  buka:{x:480,y:170,w:190,h:150}, kitchen:{x:695,y:140,w:140,h:120}, stall:{x:470,y:440,w:180,h:120}, bike:{x:680,y:450,w:150,h:110},
  restaurant:{x:890,y:90,w:200,h:230}, compound:{x:1060,y:360,w:200,h:200}
};
function empireResize(){ const host=document.getElementById('empireWrap'); const r=host.getBoundingClientRect(); const s=Math.min(r.width/EW,r.height/EH); ecv.width=Math.round(r.width*DPR); ecv.height=Math.round(r.height*DPR); ecv.style.width=r.width+'px'; ecv.style.height=r.height+'px'; EVIEW={s,ox:(r.width-EW*s)/2,oy:(r.height-EH*s)/2}; }
function areaOpen(a){ if(a===0) return true; if(a===1) return S.stars[7]>0; return S.stars[15]>0; }
function drawEmpire(dt){
  const c=ectx, t=G.anim||0; c.setTransform(1,0,0,1,0,0); c.fillStyle='#5aa83f'; c.fillRect(0,0,ecv.width,ecv.height);
  c.setTransform(EVIEW.s*DPR,0,0,EVIEW.s*DPR,EVIEW.ox*DPR,EVIEW.oy*DPR);
  // zones
  c.fillStyle=lg(c,0,0,0,EH,['#9ad66f','#6fbf4e']); c.fillRect(0,0,440,EH);
  c.fillStyle=lg(c,0,0,0,EH,['#e8d39b','#d4b77a']); c.fillRect(440,0,420,EH);
  c.fillStyle=lg(c,0,0,0,EH,['#b8c4cc','#8e9ea8']); c.fillRect(860,0,420,EH);
  // city skyline backdrop
  const r=srand(4); for(let i=0;i<9;i++){ const bw=30+r()*30, bh=60+r()*120, bx=870+i*45; c.fillStyle=`rgba(60,80,100,${0.25+r()*0.2})`; c.fillRect(bx,EH-bh-420<0?10:0,bw,0); c.fillRect(bx,40-0,bw,0); }
  for(let i=0;i<10;i++){ const bw=34+r()*24, bh=70+r()*110, bx=862+i*42; c.fillStyle='rgba(70,90,110,.35)'; c.fillRect(bx,80-bh*0.4,bw,bh*0.6); }
  // road
  c.strokeStyle='#7f7f7f'; c.lineWidth=46; c.lineCap='round'; c.beginPath(); c.moveTo(-20,300); c.bezierCurveTo(200,290,330,420,460,400); c.bezierCurveTo(620,380,700,350,870,360); c.bezierCurveTo(1000,370,1080,330,1300,340); c.stroke();
  c.strokeStyle='#c9a46a'; c.lineWidth=40; c.beginPath(); c.moveTo(-20,300); c.bezierCurveTo(200,290,330,420,460,400); c.stroke();
  c.setLineDash([18,16]); c.strokeStyle='#f7f7f7'; c.lineWidth=4; c.beginPath(); c.moveTo(460,400); c.bezierCurveTo(620,380,700,350,870,360); c.bezierCurveTo(1000,370,1080,330,1300,340); c.stroke(); c.setLineDash([]);
  // decor palms
  [[16,330],[420,250],[440,620],[845,610],[760,330],[1255,620],[200,620]].forEach(([x,y],i)=>miniPalm(c,x,y,0.8,t+i));
  // zone labels
  [['VILLAGE FARM',220,0],['TOWN',650,1],['CITY \u2022 LAGOS',1070,2]].forEach(([n,x,a])=>{ rr(c,x-100,10,200,34,17); c.fillStyle= areaOpen(a)?'rgba(40,22,8,.8)':'rgba(40,22,8,.45)'; c.fill(); c.fillStyle='#ffe08a'; c.font='900 17px "Segoe UI",sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(n,x,28); });
  for(const k in SLOTS){ drawBuilding(c,k,bl(k),SLOTS[k],t); }
  // moving okada on road when bike built
  if(bl('bike')){ const k=(t*0.08)%1; const x=460+k*840, y=400-k*40+Math.sin(k*20)*2; drawOkada(c,x,y); }
}
function miniPalm(c,x,y,s,t){ c.save(); c.translate(x,y); c.scale(s,s); c.fillStyle='#8a5a2b'; c.fillRect(-4,-60,8,60); for(let i=0;i<6;i++){ c.save(); c.translate(0,-60); c.rotate(-Math.PI+i*Math.PI/5+Math.sin(t)*0.05); c.beginPath(); c.moveTo(0,0); c.quadraticCurveTo(18,-10,36,3); c.quadraticCurveTo(18,-2,0,0); c.fillStyle=i%2?'#2e8b37':'#3aa646'; c.fill(); c.restore(); } c.restore(); }
function drawOkada(c,x,y){ c.save(); c.translate(x,y); ell(c,-14,8,7,7); fillStroke(c,'#222',2); ell(c,14,8,7,7); fillStroke(c,'#222',2); rr(c,-16,-4,32,8,4); fillStroke(c,'#c0392b',2); ell(c,0,-14,6,6); fillStroke(c,'#5b3a22',2); rr(c,6,-16,14,12,2); fillStroke(c,'#f39c12',2); c.restore(); }
function house(c,x,y,w,h,wall,roof,opts={}){
  shadow(c,x+w/2,y+h+4,w*0.55,10,0.25);
  rr(c,x,y+h*0.35,w,h*0.65,4); fillStroke(c,lg(c,x,0,x+w,0,[shade(wall,0.15),wall,shade(wall,-0.2)]),3);
  // roof
  c.beginPath(); c.moveTo(x-10,y+h*0.38); c.lineTo(x+w*0.2,y); c.lineTo(x+w*0.8,y); c.lineTo(x+w+10,y+h*0.38); c.closePath(); fillStroke(c,lg(c,0,y,0,y+h*0.38,[shade(roof,0.3),roof,shade(roof,-0.25)]),3);
  if(opts.zinc){ c.strokeStyle='rgba(0,0,0,.18)'; c.lineWidth=2; for(let i=0;i<12;i++){ const k=i/11; c.beginPath(); c.moveTo(x+w*0.2+(w*0.6)*k,y+2); c.lineTo(x-10+(w+20)*k,y+h*0.38-2); c.stroke(); } }
  // door + windows
  rr(c,x+w/2-10,y+h-30,20,30,4); c.fillStyle='#5e3519'; c.fill();
  const nw=opts.win||2; for(let i=0;i<nw;i++){ const wx=x+12+i*((w-24-22)/(Math.max(1,nw-1)))+(nw===1?(w-46)/2:0); if(Math.abs(wx+11-(x+w/2))<18) continue; rr(c,wx,y+h*0.5,22,18,3); fillStroke(c,'#aee3f5',2); }
}
function buildSign(c,s,t,cost,open){ const cx=s.x+s.w/2, cy=s.y+s.h/2; c.save(); c.globalAlpha=open?1:0.55; rr(c,s.x+10,s.y+20,s.w-20,s.h-30,14); c.setLineDash([10,8]); c.lineWidth=3; c.strokeStyle='rgba(255,255,255,.9)'; c.stroke(); c.setLineDash([]); c.fillStyle='rgba(255,255,255,.15)'; c.fill();
  c.fillStyle='#8a5a2b'; c.fillRect(cx-3,cy-6,6,34); rr(c,cx-52,cy-34,104,36,8); fillStroke(c,'#f6c453',3); c.fillStyle=OUT; c.font='900 14px "Segoe UI",sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(open?'BUILD':'LOCKED',cx,cy-22); c.font='800 11px "Segoe UI",sans-serif'; c.fillText(open?fmtN(cost):(BUILD[Object.keys(SLOTS).find(k=>SLOTS[k]===s)].area===1?'beat the Village':'beat the Town'),cx,cy-8);
  const bob=Math.sin(t*4)*3; if(open && S.bank>=cost){ ell(c,s.x+s.w-14,s.y+18+bob,12,12); fillStroke(c,'#7ee05a',2.5); c.fillStyle=OUT; c.font='900 14px sans-serif'; c.fillText('!',s.x+s.w-14,s.y+19+bob); }
  c.restore(); }
function drawBuilding(c,k,lv,s,t){
  const def=BUILD[k]; const open=areaOpen(def.area); const {x,y,w,h}=s;
  if(lv<=0){ buildSign(c,s,t,def.costs[0],open); return; }
  c.save();
  if(k==='farm'){ const n=lv*2+1; const cols=['#7cb342','#c0ca33','#e53935','#fb8c00','#fdd835']; for(let i=0;i<Math.min(n,9);i++){ const px=x+(i%3)*74, py=y+Math.floor(i/3)*50; rr(c,px,py,68,44,8); fillStroke(c,'#7b4a24',2.5); for(let j=0;j<4;j++){ c.fillStyle=cols[(i+j)%5]; for(let q=0;q<5;q++){ ell(c,px+8+q*13,py+8+j*10,4,3); c.fill(); } } } }
  else if(k==='coop'){ house(c,x+20,y+10,80,70,'#e9c48a','#c0392b',{win:1}); for(let i=0;i<lv+1;i++) drawHen(c,x+20+i*28,y+h-6,Math.max(0,Math.sin(t*5+i)),i); }
  else if(k==='pen'){ c.strokeStyle='#8a5a2b'; c.lineWidth=4; rr(c,x,y+10,w,h-20,10); c.fillStyle='#a8d672'; c.fill(); c.stroke(); for(let i=0;i<lv;i++) { c.save(); c.translate(x+40+i*50,y+h/2); c.scale(0.7,0.7); drawGoat(c,0,0,t+i,true); c.restore(); } }
  else if(k==='store'){ const sc=0.75+lv*0.08; c.translate(x+w/2,y+h); c.scale(sc,sc); house(c,-70,-110,140,110,'#b03a2e','#7b241c',{win:1}); c.strokeStyle='#fff'; c.lineWidth=4; c.strokeRect(-20,-40,40,40); c.beginPath(); c.moveTo(-20,-40); c.lineTo(20,0); c.moveTo(20,-40); c.lineTo(-20,0); c.stroke(); }
  else if(k==='mills'){ house(c,x+10,y+20,w-30,h-30,'#d5a86a','#7f8c8d',{zinc:true,win:2}); for(let i=0;i<lv;i++){ c.fillStyle='#566573'; c.fillRect(x+w-40+i*-24,y,12,30); const kk=(t*0.6+i*0.3)%1; c.fillStyle=`rgba(240,240,240,${0.6*(1-kk)})`; ell(c,x+w-34-i*24,y-kk*40,6+kk*10,6+kk*10); c.fill(); } }
  else if(k==='buka'){ const walls=['#d9a066','#f5b041','#27ae60'][lv-1], roofs=['#9aa3a8','#c0392b','#1e8449'][lv-1]; house(c,x,y+(3-lv)*10,w,h-(3-lv)*10,walls,roofs,{zinc:lv===1,win:lv+1});
    rr(c,x+w/2-60,y+h*0.42,120,22,6); c.fillStyle='#fff8e1'; c.fill(); c.fillStyle='#145a32'; c.font='900 13px "Segoe UI",sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('BUNMI\u2019S BUKA',x+w/2,y+h*0.42+11);
    if(lv>=2){ for(let i=0;i<4;i++){ c.fillStyle=i%2?'#e74c3c':'#f4d03f'; c.beginPath(); c.moveTo(x+i*w/4,y+h*0.36); c.lineTo(x+(i+1)*w/4,y+h*0.36); c.lineTo(x+(i+0.5)*w/4,y+h*0.36+16); c.fill(); } }
    if(lv>=3){ for(let i=0;i<2;i++){ ell(c,x-20+i*(w+40),y+h-6,16,6); fillStroke(c,'#8e5a2b',2); } } }
  else if(k==='kitchen'){ house(c,x+10,y+20,w-20,h-30,'#ecf0f1','#34495e',{win:lv}); c.fillStyle='#7f8c8d'; c.fillRect(x+w-40,y,14,34); const kk=(t*0.8)%1; c.fillStyle=`rgba(255,255,255,${0.7*(1-kk)})`; ell(c,x+w-33,y-kk*40,7+kk*10,7+kk*10); c.fill(); }
  else if(k==='stall'){ for(let i=0;i<lv;i++){ const sx=x+10+i*58, sy=y+30; c.fillStyle='#8a5a2b'; c.fillRect(sx+24,sy+10,4,60); c.beginPath(); c.moveTo(sx-6,sy+14); c.quadraticCurveTo(sx+26,sy-24,sx+58,sy+14); c.closePath(); fillStroke(c,['#e74c3c','#3498db','#f1c40f'][i],2.5); rr(c,sx,sy+44,52,24,4); fillStroke(c,'#c58a4b',2.5); drawIcon(c,['tomato','yam','pepper'][i],sx+16,sy+50,22); drawIcon(c,['palmoil','garri','bread'][i],sx+38,sy+50,22); } }
  else if(k==='bike'){ for(let i=0;i<lv;i++){ c.save(); c.translate(x+40+i*60,y+h/2+10); c.scale(1.6,1.6); drawOkada(c,0,0); c.restore(); } rr(c,x+10,y+h-24,w-20,20,6); c.fillStyle='#c0392b'; c.fill(); c.fillStyle='#fff'; c.font='900 11px "Segoe UI",sans-serif'; c.textAlign='center'; c.fillText('BUNMI EXPRESS',x+w/2,y+h-13); }
  else if(k==='restaurant'){ const fl=lv+1, fh=46; const by=y+h-fl*fh-30; shadow(c,x+w/2,y+h,w*0.55,10,0.25); rr(c,x+10,by,w-20,fl*fh+30,6); fillStroke(c,lg(c,x,0,x+w,0,['#34495e','#2c3e50','#1b2631']),3);
    for(let f=0;f<fl;f++) for(let i=0;i<4;i++){ rr(c,x+24+i*40,by+12+f*fh,30,30,3); c.fillStyle= (Math.sin(t*2+f+i)>0.6)?'#fff3b0':'#85c1e9'; c.fill(); }
    rr(c,x+30,by-24,w-60,26,8); fillStroke(c,'#1b2631',2.5); c.fillStyle= Math.sin(t*3)>-0.8? '#f7dc6f':'#a67c00'; c.font='900 14px "Segoe UI",sans-serif'; c.textAlign='center'; c.textBaseline='middle'; c.fillText('BUNMI\u2019S KITCHEN',x+w/2,by-11);
    rr(c,x+w/2-16,y+h-34,32,34,3); c.fillStyle='#aed6f1'; c.fill(); }
  else if(k==='compound'){ if(lv===1){ house(c,x+20,y+60,w-40,h-60,'#f5cba7','#a93226',{win:3}); }
    else if(lv===2){ house(c,x+10,y+80,w-20,h-80,'#fdebd0','#1f618d',{win:3}); rr(c,x+30,y+20,w-60,70,4); fillStroke(c,'#fdebd0',3); for(let i=0;i<3;i++){ rr(c,x+44+i*42,y+40,24,22,3); fillStroke(c,'#aee3f5',2); } c.beginPath(); c.moveTo(x+20,y+24); c.lineTo(x+w/2,y-4); c.lineTo(x+w-20,y+24); c.closePath(); fillStroke(c,'#1f618d',3); }
    else { rr(c,x,y+50,w,h-50,6); fillStroke(c,lg(c,x,0,x+w,0,['#ffffff','#f2f3f4','#d5d8dc']),3); for(let i=0;i<5;i++){ c.fillStyle='#d5d8dc'; c.fillRect(x+16+i*40,y+60,8,h-70); } for(let f=0;f<2;f++) for(let i=0;i<4;i++){ rr(c,x+28+i*42,y+70+f*50,24,30,3); fillStroke(c,'#aed6f1',2); }
      c.beginPath(); c.moveTo(x-8,y+54); c.lineTo(x+w/2,y+10); c.lineTo(x+w+8,y+54); c.closePath(); fillStroke(c,'#b9770e',3); ell(c,x+w/2,y+h+16,30,10); fillStroke(c,'#85c1e9',2.5); const kk=(t*1.5)%1; c.fillStyle='rgba(255,255,255,.8)'; ell(c,x+w/2,y+h+6-kk*14,3,6); c.fill(); }
    rr(c,x+w/2-50,y+h+2,100,14,4); c.fillStyle='rgba(0,0,0,.0)'; c.fill(); }
  c.restore();
  // level pips
  const lx=x+w/2, ly=y+h+14; const max=def.costs.length; for(let i=0;i<max;i++){ c.save(); c.translate(lx-(max-1)*9+i*18,ly); ICON.star(c,16,i<lv?null:'rgba(0,0,0,.25)'); c.restore(); }
  if(lv<def.costs.length && open && S.bank>=def.costs[lv]){ const bob=Math.sin(t*4)*3; c.save(); c.translate(x+w-6,y+6+bob); ell(c,0,0,15,15); fillStroke(c,'#7ee05a',3); c.fillStyle=OUT; c.beginPath(); c.moveTo(0,-8); c.lineTo(7,1); c.lineTo(2,1); c.lineTo(2,8); c.lineTo(-2,8); c.lineTo(-2,1); c.lineTo(-7,1); c.closePath(); c.fill(); c.restore(); }
}
function empireTap(cx,cy){ const r=ecv.getBoundingClientRect(); const x=(cx-r.left-EVIEW.ox)/EVIEW.s, y=(cy-r.top-EVIEW.oy)/EVIEW.s; for(const k in SLOTS){ const s=SLOTS[k]; if(x>=s.x-6&&x<=s.x+s.w+6&&y>=s.y-6&&y<=s.y+s.h+20){ openBuild(k); return; } } }
ecv.addEventListener('pointerdown',e=>{ e.preventDefault(); auInit(); empireTap(e.clientX,e.clientY); });


/* ===== DOM screens ===== */
const $ = id => document.getElementById(id);
const screens = ['title','map','empire','ach'];
function show(id){ screens.forEach(s=>$(s).classList.toggle('on',s===id)); window.empireVisible = id==='empire'; if(id==='empire'){ empireResize(); renderEmpireHud(); } if(id==='map') renderMap(); if(id==='ach') renderAch(); if(id==='title') renderTitle(); G.on = false; document.body.classList.toggle('ingame',false); }
function modal(id,on){ $(id).classList.toggle('on',on); }
function icoImg(id,cls=''){ return `<img class="ico ${cls}" alt="" src="${iconURL(id,48)}">`; }
const IMG = {}; function img(id){ return IMG[id] || (IMG[id]=iconURL(id,48)); }
function ico(id,cls=''){ return `<img class="ico ${cls}" alt="${ITEMS[id]?ITEMS[id].n:''}" src="${img(id)}">`; }
function starsHTML(n,max=3){ let s=''; for(let i=0;i<max;i++) s+=`<span class="st ${i<n?'lit':''}">\u2605</span>`; return s; }
function renderTitle(){ $('titleStars').textContent = totalStars()+' / '+LEVELS.length*3; $('titleBank').textContent = fmtN(S.bank); $('btnSound').textContent = (S.music?'Music on':'Music off'); }
function renderMap(){ if(window.labMapStrip) labMapStrip();
  $('mapBank').textContent=fmtN(S.bank); $('mapStars').textContent=totalStars()+' / '+LEVELS.length*3;
  const host=$('areas'); host.innerHTML='';
  AREAS.forEach((a,ai)=>{ const div=document.createElement('div'); div.className='area area'+ai; let html=`<div class="ahead"><b>${a.n}</b><small>${a.sub}</small></div><div class="path">`;
    for(let i=a.from;i<a.to;i++){ const k=i-a.from; const un=levelUnlocked(i); const cur = un && !S.stars[i]; const top = 4 + k*11.6; const left = k%2? 70:30;
      html+=`<button class="node ${un?'':'locked'} ${cur?'cur':''}" data-l="${i}" style="top:${top}%;left:${left}%" aria-label="Level ${i+1}"><span class="num">${un?i+1:'\ud83d\udd12'}</span><span class="nst">${starsHTML(S.stars[i])}</span></button>`; }
    const pts=[]; for(let k=0;k<8;k++) pts.push(`${k%2?70:30},${4+k*11.6+4.5}`);
    html+=`<svg class="trail" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="${pts.join(' ')}"/></svg></div>`;
    if(a.gate && bl(a.gate.b)<a.gate.lv){ const ready = S.stars[a.from-1]>0; html+=`<div class="gate"><div>${ready?'\ud83c\udfd7\ufe0f':'\ud83d\udd12'}</div><p>${ready? a.gate.txt : 'Finish '+AREAS[ai-1].n+' first'}</p>${ready?`<button class="btn small" data-go="empire">Build it (${fmtN(BUILD[a.gate.b].costs[0])})</button>`:''}</div>`; }
    const decos=[['maize','tomato','egg','yam'],['bread','puffpuff','akara','palmoil'],['jollof','eba','moimoi','soakings']][ai];
    html+=decos.map((id,k)=>`<img class="deco d${k}" alt="" src="${img(id)}">`).join('');
    div.innerHTML=html; host.appendChild(div); });
  host.querySelectorAll('.node').forEach(b=>b.addEventListener('click',()=>{ const i=+b.dataset.l; if(!levelUnlocked(i)){ SFX.err(); return; } SFX.tap(); openBrief(i); }));
  host.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{ SFX.tap(); show('empire'); }));
  // auto-scroll to current
}
const TIPS = {0:'Plant, harvest, grind, cook, serve. Follow the pointing hand.',1:'New: the Garri Mill turns cassava into garri. Customers buy garri straight from your store. Store full? Tap an item in the store bar to sell one.',2:'New: hens! Tap the coop to feed them grain (maize, rice or beans), then tap again to collect eggs.',3:'New: palm trees and the Palm Oil Press. Akara = beans + palm oil, fried fast.',4:'Crows! They land on your fields and steal crops. Tap the field to chase them.',5:'New: goats. Tap to feed them grass, then collect milk for garri soakings.',6:'Moi moi = beans + pepper mix + egg. Customers now order up to 2 dishes.',7:'Village finale. Keep every field busy and park extra food in the warmer.',8:'Welcome to town! The Bakery makes agege bread from maize + egg. 4 customers at once.',9:'Puff-puff = maize + palm oil. It fries fast, so serve it quick.',12:'Owambe! Lots of jollof. Keep the grinder running nonstop.',13:'Two crows at a time now. Watch your ripe fields.',14:'Orders of 3 dishes. Cook ahead and fill the warmer.',16:'Lagos! Eba & stew = garri + pepper mix + palm oil. 5 customers at once.',20:'A food critic is in town. Patience is short. Speed is everything.',21:'Big catering order. A Kitchen Gear upgrade helps a lot here.',22:'Lights out across Lagos and three crows. Keep your fields guarded.',23:'The final level, and it is brutal. Max out your Kitchen, Buka and Mill House first, then become the Empress of Lagos.'};
let briefLevel=0;
function openBrief(i){ briefLevel=i; const lv=LEVELS[i]; $('bTitle').textContent=`Level ${i+1}: ${lv.name}`; $('bArea').textContent=AREAS[lv.area].n;
  const g=lv.goals; let h=''; if(g.serve) h+=`<div class="goal">${icoImg('customer')}<span>Serve <b>${g.serve}</b> customers</span></div>`; if(g.earn) h+=`<div class="goal">${icoImg('coin')}<span>Earn <b>${fmtN(g.earn)}</b></span></div>`; if(g.make) for(const k in g.make) h+=`<div class="goal">${ico(k)}<span>Make <b>${g.make[k]}</b> ${ITEMS[k].n}</span></div>`;
  $('bGoals').innerHTML=h; const mm=t=>Math.floor(t/60)+':'+String(Math.round(t%60)).padStart(2,'0');
  $('bTime').innerHTML=`\u23f1 ${mm(lv.time)} &nbsp; <span class="st lit">\u2605\u2605\u2605</span> finish with ${mm(lv.time*lv.gold)} left &nbsp; <span class="st lit">\u2605\u2605</span> with ${mm(lv.time*lv.silver)} left`;
  $('bTip').textContent = TIPS[i] || ['Tip: upgrade your empire between levels for faster crops and more patient customers.','Tip: food in the warmer never burns.','Tip: the green glow on an order means you have it ready. Tap the dish in the bubble to serve.','Tip: barn store full? Tap any item in the store bar to sell one at the market.'][i%4];
  $('bMenu').innerHTML = lv.menu.map(id=>ico(id,'big')).join(''); $('bStars').innerHTML=starsHTML(S.stars[i]); modal('brief',true); }
function beginLevel(i){ modal('brief',false); modal('result',false); modal('pause',false); screens.forEach(s=>$(s).classList.remove('on')); window.empireVisible=false; document.body.classList.add('ingame'); auInit(); startLevel(i); }
function pauseGame(){ if(G.over) return; G.paused=true; SFX.tap(); $('pMusic').textContent='Music: '+(S.music?'On':'Off'); $('pSfx').textContent='Sounds: '+(S.sfx?'On':'Off'); $('pTitle').textContent=`Level ${G.li+1}: ${G.lvl.name}`; modal('pause',true); }
function toggleSound(){ const on = !(S.music||S.sfx); S.music=on; S.sfx=on; save(); auSet(); if(on) SFX.tap(); }
document.addEventListener('visibilitychange',()=>{ if(document.hidden && G.on && !G.over && !G.paused) pauseGame(); });
/* result */
function showResult(r){ if(window.labAfterResult) setTimeout(()=>labAfterResult(r),0);
  const box=$('resultBox'); box.className='panel result '+(r.win?'win':'lose'); const lv=LEVELS[r.i];
  $('rTitle').textContent = r.win? (r.stars===3?'Perfect!':'Level complete!') : 'Time up!';
  $('rSub').textContent = r.win? `${lv.name} \u2022 ${r.served} customers served${r.lost? ', '+r.lost+' walked out':' \u2022 nobody left angry'}` : 'So close. Your coins are still banked for building.';
  $('rStars').innerHTML = [0,1,2].map(i=>`<span class="bigstar" id="rs${i}">\u2605</span>`).join('');
  $('rRows').innerHTML = `<div class="row"><span>Earned at the buka</span><b id="rc1">\u20a60</b></div>` + (r.win?`<div class="row"><span>Time bonus</span><b id="rc2">\u20a60</b></div>`:'') + (r.stall?`<div class="row"><span>Market stall sold leftovers</span><b id="rc3">\u20a60</b></div>`:'') + `<div class="row total"><span>Added to your bank</span><b id="rc4">\u20a60</b></div>`;
  if(!r.win){ const gl=goalList(); $('rRows').innerHTML += '<div class="goalsum">'+gl.map(g=>`<span class="${g.cur>=g.need?'ok':''}">${icoImg(g.icon)} ${g.money?fmtN(g.cur):g.cur}/${g.money?fmtN(g.need):g.need}</span>`).join('')+'</div>'; }
  $('rNext').style.display = r.win && r.i+1<LEVELS.length ? '' : 'none'; $('rNext').dataset.l = r.i+1;
  const nextBlocked = r.i+1<LEVELS.length && gateBlocked(r.i+1); $('rNext').textContent = nextBlocked? 'Build to continue' : 'Next level';
  $('rRetry').dataset.l=r.i; modal('result',true);
  // animate stars and count-up
  for(let i=0;i<3;i++) setTimeout(()=>{ const el=$('rs'+i); if(i<r.stars){ el.classList.add('lit'); SFX.star(i); } }, 500+i*450);
  const steps=[['rc1',r.coins],['rc2',r.timeBonus],['rc3',r.stall],['rc4',r.total]]; let delay=600+3*450;
  steps.forEach(([id,val])=>{ const el=$(id); if(!el) return; setTimeout(()=>countUp(el,val),delay); delay+=700; });
  if(r.win) confetti(r.stars);
  checkBuildAch();
}
function countUp(el,val){ const t0=performance.now(), d=650; let lastTick=0; function step(now){ const k=Math.min(1,(now-t0)/d); el.textContent=fmtN(val*k); if(now-lastTick>60&&k<1){ SFX.tick(); lastTick=now; } if(k<1) requestAnimationFrame(step); else { el.textContent=fmtN(val); if(val>0) SFX.coin(); } } requestAnimationFrame(step); }
/* confetti */
const ccv=$('confetti'), cctx=ccv.getContext('2d'); let conf=[], confOn=false;
function confetti(n){ ccv.width=innerWidth*DPR; ccv.height=innerHeight*DPR; const cols=['#e74c3c','#f1c40f','#2ecc71','#3498db','#9b59b6','#ff7eb6','#ffffff','#008751'];
  for(let i=0;i<90+n*60;i++) conf.push({x:Math.random()*innerWidth,y:-20-Math.random()*innerHeight*0.6,vx:(Math.random()-0.5)*120,vy:120+Math.random()*220,r:Math.random()*6,vr:(Math.random()-0.5)*10,w:6+Math.random()*8,h:4+Math.random()*6,c:cols[i%cols.length]});
  if(!confOn){ confOn=true; let last=performance.now(); const tick=now=>{ const dt=Math.min(0.05,(now-last)/1000); last=now; cctx.setTransform(DPR,0,0,DPR,0,0); cctx.clearRect(0,0,innerWidth,innerHeight); conf.forEach(p=>{ p.x+=p.vx*dt; p.y+=p.vy*dt; p.r+=p.vr*dt; p.vx*=0.99; cctx.save(); cctx.translate(p.x,p.y); cctx.rotate(p.r); cctx.fillStyle=p.c; cctx.fillRect(-p.w/2,-p.h/2,p.w,p.h*Math.abs(Math.cos(p.r*2))); cctx.restore(); }); conf=conf.filter(p=>p.y<innerHeight+30); if(conf.length) requestAnimationFrame(tick); else { confOn=false; cctx.clearRect(0,0,innerWidth,innerHeight); } }; requestAnimationFrame(tick); } }
/* empire */
function renderEmpireHud(){ $('empBank').textContent=fmtN(S.bank); const built=Object.keys(BUILD).filter(k=>bl(k)>0).length; $('empBuilt').textContent=built+' / '+Object.keys(BUILD).length+' buildings'; }
let buildKey=null;
function openBuild(k){ buildKey=k; const d=BUILD[k], lv=bl(k), max=d.costs.length; const open=areaOpen(d.area);
  $('uTitle').textContent=d.n; $('uLevel').innerHTML=starsHTML(lv,max);
  $('uNow').textContent = lv>0? 'Now: '+d.desc[lv-1] : 'Not built yet';
  const btn=$('uBtn');
  if(lv>=max){ $('uNext').textContent='Fully upgraded. Beautiful.'; btn.style.display='none'; }
  else { const cost=d.costs[lv]; $('uNext').textContent=(lv>0?'Next: ':'Build: ')+d.desc[lv]; btn.style.display=''; btn.textContent=(lv>0?'Upgrade for ':'Build for ')+fmtN(cost);
    btn.disabled = !open || S.bank<cost; $('uWhy').textContent = !open? (d.area===1?'Finish the Village Farm levels to open the Town.':'Finish the Town levels to open the City.') : S.bank<cost? `You need ${fmtN(cost-S.bank)} more. Play levels to earn it.` : '';
    const gate = window.labGate && lv>0 ? labGate(k, lv+1) : null; if(gate && !gate.ok){ btn.disabled=true; $('uWhy').innerHTML = gate.html + (S.bank<cost? `<br><small>You also need ${fmtN(cost-S.bank)} more.</small>`:''); } }
  // preview
  const pc=$('uPrev'); pc.width=220*DPR; pc.height=170*DPR; const c=pc.getContext('2d'); c.setTransform(DPR,0,0,DPR,0,0); c.clearRect(0,0,220,170); const s=SLOTS[k]; const sc=Math.min(180/s.w,130/s.h,1.3); c.translate(110-s.w*sc/2-s.x*sc,20-s.y*sc); c.scale(sc,sc); drawBuilding(c,k,Math.max(1,Math.min(max,lv+ (lv<max?1:0))),s,0);
  $('uPrevLbl').textContent = lv<max? (lv>0?'After upgrade':'Preview') : '';
  modal('upgrade',true); SFX.tap(); }
function doBuild(){ const k=buildKey, d=BUILD[k], lv=bl(k); if(lv>=d.costs.length) return; const cost=d.costs[lv]; if(S.bank<cost||!areaOpen(d.area)) return; if(lv>0&&window.labGate){ const gt=labGate(k,lv+1); if(gt&&!gt.ok) return; } S.bank-=cost; S.build[k]=lv+1; save(); SFX.build(); modal('upgrade',false); renderEmpireHud();
  if(k==='buka') unlock('buka'); if(k==='restaurant') unlock('restaurant'); if(k==='compound'&&S.build[k]>=3) unlock('mansion'); checkBuildAch(); confetti(1);
  const s=SLOTS[k]; flashBuild=k; }
let flashBuild=null;
function checkBuildAch(){ if(Object.keys(BUILD).every(k=>bl(k)>0)) unlock('empire'); }
/* achievements */
function renderAch(){ const n=ACH.filter(a=>S.ach[a.id]).length; $('achCount').textContent=n+' / '+ACH.length; $('achList').innerHTML=ACH.map(a=>`<div class="ach ${S.ach[a.id]?'got':''}"><div class="medal">${S.ach[a.id]?'\ud83c\udfc5':'\ud83d\udd12'}</div><div><b>${a.n}</b><small>${a.d}</small></div></div>`).join('') +
  `<div class="statbox"><b>Your stats</b><span>Customers served: ${S.stats.served}</span><span>Total earned: ${fmtN(S.stats.earned)}</span><span>Garri made: ${S.stats.garri}</span><span>Crows chased: ${S.stats.crows}</span><span>Harvests: ${S.stats.harvests}</span></div>`; }
let achQ=[], achBusy=false; function achToast(a){ achQ.push(a); if(!achBusy) nextAch(); }
function nextAch(){ const a=achQ.shift(); if(!a){ achBusy=false; return; } achBusy=true; const el=$('achToast'); el.innerHTML=`<span>\ud83c\udfc5</span><div><small>Achievement unlocked</small><b>${a.n}</b></div>`; el.classList.add('on'); SFX.star(2); setTimeout(()=>{ el.classList.remove('on'); setTimeout(nextAch,400); },2600); }
/* wiring */
function on(id,fn){ $(id).addEventListener('click',e=>{ auInit(); fn(e); }); }
on('btnPlay',()=>{ SFX.tap(); show('map'); }); on('btnEmpire',()=>{ SFX.tap(); show('empire'); }); on('btnAch',()=>{ SFX.tap(); show('ach'); });
on('btnSound',()=>{ S.music=!S.music; save(); auSet(); renderTitle(); });
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',()=>{ SFX.tap(); show(b.dataset.back); }));
on('mapEmpire',()=>{ SFX.tap(); show('empire'); }); on('empPlay',()=>{ SFX.tap(); show('map'); });
on('bStart',()=>beginLevel(briefLevel)); on('bClose',()=>{ modal('brief',false); });
on('pResume',()=>{ modal('pause',false); G.paused=false; lastT=performance.now(); }); on('pRestart',()=>{ modal('pause',false); beginLevel(G.li); }); on('pQuit',()=>{ modal('pause',false); G.on=false; show('map'); });
on('pMusic',()=>{ S.music=!S.music; save(); auSet(); $('pMusic').textContent='Music: '+(S.music?'On':'Off'); }); on('pSfx',()=>{ S.sfx=!S.sfx; save(); auSet(); $('pSfx').textContent='Sounds: '+(S.sfx?'On':'Off'); });
on('rNext',e=>{ const i=+$('rNext').dataset.l; modal('result',false); G.on=false; if(!levelUnlocked(i)){ show('empire'); return; } show('map'); openBrief(i); });
on('rRetry',()=>{ beginLevel(+$('rRetry').dataset.l); }); on('rMap',()=>{ modal('result',false); G.on=false; show('map'); }); on('rEmpire',()=>{ modal('result',false); G.on=false; show('empire'); });
on('uBtn',doBuild); on('uClose',()=>modal('upgrade',false));
on('btnReset',()=>{ if(confirm('Start a brand new empire? All progress will be erased.')){ S=freshSave(); save(); renderTitle(); } });
cv.addEventListener('pointerdown',e=>{ e.preventDefault(); auInit(); const p=toLogical(e.clientX,e.clientY); tapAt(p.x,p.y); });
window.addEventListener('resize',()=>{ if(window.empireVisible) empireResize(); });
document.addEventListener('contextmenu',e=>e.preventDefault());
/* boot */
loadSave(); resize(); renderTitle(); show('title'); requestAnimationFrame(frame);
// title art
(function(){ const ids=['jollof','tomato','maize','akara','puffpuff','yam','egg','pepper','moimoi','palmoil','garri','bread']; const host=$('titleArt'); host.innerHTML=ids.map((id,i)=>`<img src="${img(id)}" style="--i:${i}" alt="">`).join(''); })();
if('serviceWorker' in navigator && location.protocol.startsWith('http')){ window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{})); }
let deferredInstall=null; window.addEventListener('beforeinstallprompt',e=>{ e.preventDefault(); deferredInstall=e; $('btnInstall').style.display=''; });
on('btnInstall',async()=>{ if(!deferredInstall) return; deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall=null; $('btnInstall').style.display='none'; });
window.OKO = { G, S:()=>S, toClient, LEVELS, startLevel:i=>beginLevel(i), stock };
