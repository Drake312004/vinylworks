/*CALC-START*/
const VINYL={"matte black":{t:"std",c:4.36/36},"matte white":{t:"std",c:4.36/36},"gloss black":{t:"std",c:4.36/36},"gloss white":{t:"std",c:4.36/36},"reflective white":{t:"refl",c:27.23/36},"reflective black":{t:"refl",c:33.58/36}};
function billable(w,h){const L=Math.max(+w||0,+h||0);return L<=0?0:Math.ceil(L/10-1e-9)*10;}
function calcLine(d){const q=Math.max(0,Math.floor(+d.qty||0)),L=billable(d.w,d.h),v=VINYL[d.vinyl];const u=L/10;
 const vinyl=u*(v.t==="refl"?30:20)*q,install=d.install?u*10*q:0;const hrs=L>=100?1.5:L>=50?1:0,labour=hrs*30*q;
 const longest=Math.max(+d.w||0,+d.h||0);const material=L?(longest+8)*v.c*q:0;
 return {L,q,vinyl,install,labour,hrs,material,total:vinyl+install+labour,confirm:L>=100};}
const TIME_KEYS=[["install","Installation time"],["design","Design time"],["prep","Prep time"]];
function calcQuote(lines,time){time=time||{};const r=lines.map(calcLine);const times=TIME_KEYS.map(([k,n])=>{const t=time[k]||{},h=Math.max(0,+t.h||0),rate=t.rate==null||t.rate===""?30:Math.max(0,+t.rate||0);return {key:k,name:n,h,rate,cost:h*rate};});
 const design=times.reduce((s,x)=>s+x.cost,0);
 const total=r.reduce((s,x)=>s+x.total,0)+design,mat=byColour(lines),material=mat.total;
 const vinylSub=r.reduce((s,x)=>s+x.vinyl,0),labourSub=r.reduce((s,x)=>s+x.install+x.labour,0)+design;
 return {times,mat,lines:r,design,vinylSub,labourSub,total,material,profit:total-material};}
const SQFT={"matte black":4.36/6,"matte white":4.36/6,"gloss black":4.36/6,"gloss white":4.36/6,"reflective white":27.23/6,"reflective black":33.58/6};
const TAPE=222.59/100/6;
function byColour(lines){const o={};lines.forEach(d=>{const w=+d.w||0,h=+d.h||0,q=Math.max(0,Math.floor(+d.qty||0));if(!(w>0&&h>0&&q))return;o[d.vinyl]=(o[d.vinyl]||0)+(w+10)*(h+10)*q/144;});
 const rows=Object.keys(o).map(k=>({colour:k,sqft:o[k],rate:SQFT[k],cost:o[k]*SQFT[k]}));const sqft=rows.reduce((s,x)=>s+x.sqft,0),cost=rows.reduce((s,x)=>s+x.cost,0),tape=sqft*TAPE;
 return {rows,sqft,cost,tape,total:cost+tape};}
if(typeof module!=="undefined")module.exports={byColour,billable,calcLine,calcQuote};
/*CALC-END*/
