'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');const root=path.resolve(__dirname,'..');const box={console,setTimeout,clearTimeout};box.window=box;box.globalThis=box;vm.createContext(box);['assets/js/jorge-knowledge.js','assets/js/jorge-phase1-knowledge.js','assets/js/jorge-phase1.js','assets/js/jorge.js'].forEach(f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),box,{filename:f}));const engine=box.JORGE_ENGINE;
const cases=[
  {q:'Ya está estudiando en otra institución.',title:/Ya estudia/,sources:['Manejo oficial de objeciones'],must:/experiencia|satisfech/i},
  {q:'Solo quiere precio y no quiere hablar con asesor.',title:/precio.*asesor/i,sources:['Manejo oficial de objeciones'],must:/valor aislado|precio es importante/i},
  {q:'Quiere virtual porque no se puede desplazar.',title:/virtual/i,sources:['Portafolio Smart Online','Portafolio Smart Flex'],must:/autonomía|clases en vivo/i},
  {q:'¿Qué diferencia a Smart de otras academias?',title:/diferenciadores/i,sources:['Anexo Portafolio Comercial Instituto','Portafolio Smart Online','Portafolio Smart Flex'],must:/presenciales y virtuales/i},
  {q:'Necesita B2 para graduarse.',title:/Certificación|examen/i,sources:['Base oficial de exámenes internacionales'],must:/certificación acepta|nivel o puntaje/i},
  {q:'Vive en Kennedy y quiere saber qué sede le queda bien.',title:/Ubicación|sede/i,sources:['Base oficial de sedes Smart'],must:/casa o de su trabajo|base de sedes/i},
  {q:'Nunca dejó datos y pregunta de dónde sacamos el número.',title:/origen|datos/i,sources:['Políticas de operación Telemercadeo 2026'],must:/validar|inquietud/i,compliance:true},
  {q:'Ya estudió antes y tuvo una mala experiencia.',title:/Mala experiencia/i,sources:['Manejo oficial de objeciones'],must:/qué fue exactamente|qué ocurrió/i},
  {q:'Dice que otra academia es más barata.',title:/menor precio/i,sources:['Manejo oficial de objeciones'],must:/comparar precios|otra oferta/i},
  {q:'No tiene tiempo ni dinero pero sí quiere aprender.',title:/tiempo y presupuesto/i,sources:['Manejo oficial de objeciones'],must:/tiempo y el presupuesto|disponibilidad real/i}
];
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim()}
function setOf(s){return new Set(norm(s).split(' ').filter(x=>x.length>3))}
function jaccard(a,b){const A=setOf(a),B=setOf(b),i=[...A].filter(x=>B.has(x)).length,u=new Set([...A,...B]).size;return u?i/u:0}
const results=cases.map(c=>{engine.reset();const r=engine.analyze(c.q);const names=r.sources.map(s=>s.title);const ok=c.title.test(r.title||'')&&c.must.test([r.response,r.question,r.next].join(' '))&&c.sources.every(s=>names.includes(s))&&(!c.compliance||r.compliance);return {query:c.q,ok,title:r.title,response:r.response,question:r.question,next:r.next,objective:r.objective,sources:names,domains:r.domains||[]};});
const pairs=[];for(let i=0;i<results.length;i++)for(let j=i+1;j<results.length;j++){const similarity=jaccard(results[i].response,results[j].response);pairs.push({left:i+1,right:j+1,similarity:Number(similarity.toFixed(3)),ok:similarity<0.58});}
const duplicates=new Set(results.map(r=>norm(r.response))).size!==results.length;const maxSimilarity=Math.max(...pairs.map(p=>p.similarity));const similarityOk=!duplicates&&pairs.every(p=>p.ok);
const report={totalDomainCases:results.length,passedDomainCases:results.filter(r=>r.ok).length,failedDomainCases:results.filter(r=>!r.ok).length,repeatedResponseTest:{ok:similarityOk,duplicates,maxSimilarity,threshold:0.58,failedPairs:pairs.filter(p=>!p.ok)},results};console.log(JSON.stringify(report,null,2));process.exitCode=report.failedDomainCases||!similarityOk?1:0;
