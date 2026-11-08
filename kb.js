/* ===== Custom Navi Keyboard (QWERTZ, MeviCar-style) ===== */
const places=[
  {k:"nord",n:"Erlangen-Nord",m:"12 min · 7,4 km",t:"12 min",d:"7,4 km"},
  {k:"arc",n:"Erlangen Arcaden",m:"9 min · 4,1 km",t:"9 min",d:"4,1 km"},
  {k:"home",n:"Privat",m:"8 min · 3,8 km",t:"8 min",d:"3,8 km"},
  {k:"work",n:"Arbeit",m:"14 min · 8,2 km",t:"14 min",d:"8,2 km"},
  {k:"gym",n:"Fitnessstudio Erlangen",m:"11 min · 5,2 km",t:"11 min",d:"5,2 km"},
  {k:"hoe",n:"Höchstadt a.d. Aisch",m:"28 min · 22 km",t:"28 min",d:"22 km"},
  {k:"nbg",n:"Nürnberg Hauptbahnhof",m:"25 min · 19 km",t:"25 min",d:"19 km"},
  {k:"fur",n:"Fürth Rathaus",m:"18 min · 12 km",t:"18 min",d:"12 km"}
];
let kbShift=true, kbNum=false, kbOpen=false;
const QWERTZ=["QWERTZUIOP","ASDFGHJKL","YXCVBNM"];
const NUMS=["1234567890","@#€%&*-_=","!?.,:;/+"];
function kbRows(){return kbNum?NUMS:QWERTZ}
function renderKb(){
  const el=$("kb"); if(!el) return;
  const rows=kbRows();
  let h="";
  rows.forEach((line,i)=>{
    h+='<div class="kb-row">';
    if(!kbNum&&i===2) h+='<button type="button" class="kb-key sp wide" data-k="shift">⇧</button>';
    for(const ch of line){
      const label=(!kbNum&&kbShift)?ch:ch.toLowerCase();
      h+='<button type="button" class="kb-key" data-ch="'+ch+'">'+label+'</button>';
    }
    if(i===2) h+='<button type="button" class="kb-key sp wide" data-k="back">⌫</button>';
    h+='</div>';
  });
  h+='<div class="kb-row">';
  h+='<button type="button" class="kb-key sp wide" data-k="mode">'+(kbNum?"ABC":"123")+'</button>';
  h+='<button type="button" class="kb-key sp space" data-k="space">Leerzeichen</button>';
  h+='<button type="button" class="kb-key go wide" data-k="go">Suchen</button>';
  h+='</div>';
  el.innerHTML=h;
}
function openKb(){
  kbOpen=true; kbShift=true; kbNum=false;
  $("kb").classList.add("on");
  $("navHome").classList.add("searching");
  renderKb();
  filterSuggest($("q").value);
}
function closeKb(){
  kbOpen=false;
  $("kb").classList.remove("on");
  $("navHome").classList.remove("searching");
  if(!$("q").value){ $("suggest").classList.remove("on"); $("favSec").style.display=""; $("recSec").style.display=""; $("navChips").style.display=""; }
}
function setQuery(v){
  $("q").value=v;
  $("clearQ").classList.toggle("on",!!v);
  filterSuggest(v);
}
function filterSuggest(q){
  const qq=(q||"").trim().toLowerCase();
  const list=$("suggestList");
  if(!qq){
    $("suggest").classList.remove("on");
    $("favSec").style.display=""; $("recSec").style.display=""; $("navChips").style.display="";
    return;
  }
  $("favSec").style.display="none"; $("recSec").style.display="none"; $("navChips").style.display="none";
  $("suggest").classList.add("on");
  const hits=places.filter(p=>p.n.toLowerCase().includes(qq)||p.k.includes(qq));
  if(!hits.length){
    list.innerHTML='<div style="padding:10px;color:var(--m);font-size:12px">Keine Treffer für „'+qq+'“</div>';
    return;
  }
  list.innerHTML=hits.map(p=>'<button class="ri" data-k="'+p.k+'"><span>📍</span><div><div class="ri-n">'+p.n+'</div><div class="ri-m">'+p.m+'</div></div></button>').join("");
  list.querySelectorAll("[data-k]").forEach(el=>el.addEventListener("click",()=>{
    const d=dest[el.dataset.k]||places.find(x=>x.k===el.dataset.k);
    if(!d) return;
    const name=d.n; const t=d.t||"12 min"; const dist=d.d||"7,4 km";
    $("pn").textContent=name; $("pa").textContent="Demo · "+t+" · "+dist; $("stt").textContent=t; $("std").textContent=dist;
    $("navHome").classList.add("hide"); $("navPrev").classList.remove("hide");
    closeKb(); setQuery("");
  }));
}
function kbType(ch){
  const cur=$("q").value||"";
  let ins=ch;
  if(!kbNum){ ins=kbShift?ch:ch.toLowerCase(); }
  setQuery(cur+ins);
  if(kbShift&&!kbNum){ kbShift=false; renderKb(); }
}
function kbBack(){ setQuery(($("q").value||"").slice(0,-1)); }
function kbGo(){
  const first=$("suggestList").querySelector("[data-k]");
  if(first) first.click();
  else if(($("q").value||"").trim()) toast("Keine Treffer");
  else closeKb();
}
$("q").addEventListener("click",(e)=>{ e.preventDefault(); openKb(); });
$("q").addEventListener("focus",(e)=>{ e.preventDefault(); $("q").blur(); openKb(); });
$("clearQ").onclick=()=>{ setQuery(""); filterSuggest(""); openKb(); };
$("kb").addEventListener("click",(e)=>{
  const b=e.target.closest("button"); if(!b) return;
  const k=b.dataset.k, ch=b.dataset.ch;
  if(k==="shift"){ kbShift=!kbShift; renderKb(); }
  else if(k==="mode"){ kbNum=!kbNum; kbShift=!kbNum; renderKb(); }
  else if(k==="back") kbBack();
  else if(k==="space") setQuery(($("q").value||"")+" ");
  else if(k==="go") kbGo();
  else if(ch) kbType(ch);
});
Object.assign(dest,{
  gym:{n:"Fitnessstudio Erlangen",t:"11 min",d:"5,2 km"},
  hoe:{n:"Höchstadt a.d. Aisch",t:"28 min",d:"22 km"},
  nbg:{n:"Nürnberg Hauptbahnhof",t:"25 min",d:"19 km"},
  fur:{n:"Fürth Rathaus",t:"18 min",d:"12 km"}
});
const _showView=showView;
showView=function(name){ closeKb(); _showView(name); };
const _px=$("px").onclick;
$("px").onclick=()=>{ if(_px)_px(); closeKb(); };
const _bs=$("bs").onclick;
$("bs").onclick=()=>{ if(_bs)_bs(); closeKb(); setQuery(""); };
