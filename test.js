// Testes: node test.js
const assert=require("assert");const {Engine,D}=require("./js/engine.js");
const mem=()=>{let m={};return{getItem:k=>m[k]??null,setItem:(k,v)=>m[k]=v}};
const st=mem();let e=new Engine(st);const Q=id=>D.questions.find(q=>q.id===id);
// moedas e streak
let r=e.answer(Q("r0q1"),1,1);assert(r.ok&&r.gain===20);
e.answer(Q("r0q2"),1,1);r=e.answer(Q("r0q3"),true,1);assert.strictEqual(r.bonus,15,"bônus 3 acertos");
// anti-farm
const c=e.s.coins;r=e.answer(Q("r0q1"),1,1);assert.strictEqual(r.gain,0);assert.strictEqual(e.s.coins,c);
// erro zera sequência e registra revisão
e.answer(Q("r1q1"),0,1);assert.strictEqual(e.s.streak,0);assert(e.s.errors.includes("r1q1"));
e.review(Q("r1q1"),2);assert(!e.s.errors.includes("r1q1"));
// dicas
const b=e.s.coins;let h=e.buyHint(Q("r0q1"),2,[]);assert(h.ok&&e.s.coins===b-25);
e.s.coins=10;assert(!e.buyHint(Q("r0q1"),1,[]).ok);
// progressão
assert(!e.unlocked(1));assert(!e.finishRegion(0,1).pass);assert(e.finishRegion(0,3).pass);assert(e.unlocked(1));
// loja
e.s.coins=2000;assert(e.buy("pikachu").ok&&e.s.coins===1880);assert(!e.buy("pikachu").ok);
assert(!e.buy("xerneas").ok,"Xerneas exige conquista");e.s.completed=[0,1,2,3,4];assert(e.buy("xerneas").ok);
// salvamento + backup
const e2=new Engine(st);assert(e2.s.owned.includes("xerneas"));
const bk=e2.exportJSON();const e3=new Engine(mem());e3.importJSON(bk);assert.strictEqual(e3.s.coins,e2.s.coins);
assert.throws(()=>e3.importJSON('{"x":1}'));
// simulado
const it=e.simulado([0,1],4);assert.strictEqual(it.length,4);const cb=e.s.coins;
e.finishSim(it,it.map(q=>q.ans),100);assert.strictEqual(e.s.coins,cb);assert.strictEqual(e.s.sims.length,1);
console.log("TODOS OS TESTES PASSARAM");
