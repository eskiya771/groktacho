/* Professional Navi Keyboard + Search */
const places=[
  {k:"nord",n:"Erlangen-Nord",m:"Erlangen · Bayern",t:"12 min",d:"7,4 km",ico:"📍"},
  {k:"arc",n:"Erlangen Arcaden",m:"Nürnberger Str. · Einkauf",t:"9 min",d:"4,1 km",ico:"🏬"},
  {k:"home",n:"Privat",m:"Zuhause · Favorit",t:"8 min",d:"3,8 km",ico:"🏠"},
  {k:"work",n:"Arbeit",m:"Büro · Favorit",t:"14 min",d:"8,2 km",ico:"▦"},
  {k:"gym",n:"Fitnessstudio Erlangen",m:"Sport · Erlangen",t:"11 min",d:"5,2 km",ico:"🏋️"},
  {k:"hoe",n:"Höchstadt a.d. Aisch",m:"Landkreis Erlangen-Höchstadt",t:"28 min",d:"22 km",ico:"📍"},
  {k:"nbg",n:"Nürnberg Hauptbahnhof",m:"Bahnhofsplatz · Nürnberg",t:"25 min",d:"19 km",ico:"🚉"},
  {k:"fur",n:"Fürth Rathaus",m:"Königstraße · Fürth",t:"18 min",d:"12 km",ico:"🏛️"},
  {k:"uni",n:"Universität Erlangen",m:"Campus Süd · FAU",t:"10 min",d:"4,8 km",ico:"🎓"},
  {k:"siem",n:"Siemens Campus",m:"Günther-Scharowsky-Str.",t:"7 min",d:"3,1 km",ico:"🏢"}
];
let kbShift=true, kbNum=false, kbOpen=false, caretPos=0;
const QWERTZ=["QWERTZUIOP","ASDFGHJKL","YXCVBNM"];
const NUMS=["1234567890","@#%&*+-/","!?.,:;_="];
const UML=["Ä","Ö","Ü","ß"];

function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function highlight(name,q){
  if(!q) return esc(name);
  const i=name.toLowerCase().indexOf(q.toLowerCase());
  if(i<0) return esc(name);
  return esc(name.slice(0,i))+"<mark>"+esc(name.slice(i,i+q.length))+"</mark>"+esc(name.slice(i+q.length));
}
function syncMirror(){
  const q=$("q").value||"";
  const m=$("qMirror");
  if(!m) return;
  if(!q){
    m.innerHTML=kbOpen?'<span class="caret"></span><span class="ph">Ort oder Adresse</span>':'<span class="ph">Ort oder Adresse</span>';
  } else {
    const pos=Math.min(caretPos,q.length);
    m.innerHTML=esc(q.slice(0,pos))+(kbOpen?'<span class="caret"></span>':'')+esc(q.slice(pos));
  }
  $("clearQ").classList.toggle("on",!!q);
}
function kbRows(){return kbNum?NUMS:QWERTZ}
function renderKb(){
  const el=$("kb"); if(!el) return;
  const rows=kbRows();
  let h="";
  rows.forEach((line,i)=>{
    h+='<div class="kb-row">';
    if(!kbNum&&i===2) h+='<button type="button" class="kb-key sp wide'+(kbShift?" shift-on":"")+'" data-k="shift">⇧</button>';
    for(const ch of line){
      const label=(!kbNum&&kbShift)?ch:ch.toLowerCase();
      h+='<button type="button" class="kb-key" data-ch="'+ch+'">'+label+'</button>';
    }
    if(i===2) h+='<button type="button" class="kb-key sp wide" data-k="back">⌫</button>';
    h+='</div>';
  });
  if(!kbNum){
    h+='<div class="kb-row">';
    UML.forEach(u=>{h+='<button type="button" class="kb-key" data-ch="'+u+'">'+(kbShift?u:u.toLowerCase())+'</button>'});
    h+='</div>';
  }
  h+='<div class="kb-row">';
  h+='<button type="button" class="kb-key sp wide" data-k="mode">'+(kbNum?"ABC":"123")+'</button>';
  h+='<button type="button" class="kb-key sp space" data-k="space">Leerzeichen</button>';
  h+='<button type="button" class="kb-key go wide" data-k="go">Suchen</button>';
  h+='</div>';
  h+='<div class="kb-hint">MEVICAR · BILDSCHIRMTASTATUR</div>';
  el.innerHTML=h;
}
function openKb(){
  kbOpen=true; kbShift=true; kbNum=false;
  caretPos=($("q").value||"").length;
  $("kb").classList.add("on");
  $("navHome").classList.add("search-mode");
  renderKb();
  syncMirror();
  filterSuggest($("q").value);
}
function closeKb(){
  kbOpen=false;
  $("kb").classList.remove("on");
  $("navHome").classList.remove("search-mode");
  syncMirror();
  if(!($("q").value||"").trim()){
    $("suggest").classList.remove("on");
    $("favSec").style.display=""; $("recSec").style.display=""; $("navChips").style.display="";
  }
}
function setQuery(v, moveCaretEnd){
  $("q").value=v;
  if(moveCaretEnd!==false) caretPos=v.length;
  syncMirror();
  filterSuggest(v);
}
function filterSuggest(q){
  const qq=(q||"").trim().toLowerCase();
  const list=$("suggestList");
  const title=$("suggestTitle");
  if(!kbOpen && !qq){
    $("suggest").classList.remove("on");
    $("favSec").style.display=""; $("recSec").style.display=""; $("navChips").style.display="";
    return;
  }
  $("favSec").style.display="none"; $("recSec").style.display="none"; $("navChips").style.display="none";
  $("suggest").classList.add("on");
  let hits;
  if(!qq){
    title.textContent="Vorschläge & Letzte Ziele";
    hits=places.slice(0,6);
  } else {
    hits=places.filter(p=>p.n.toLowerCase().includes(qq)||(p.m&&p.m.toLowerCase().includes(qq))||p.k.includes(qq));
    title.textContent=hits.length? (hits.length+" Treffer"):"Keine Treffer";
  }
  if(!hits.length){
    list.innerHTML='<div style="padding:16px 8px;color:var(--m);font-size:13px;text-align:center">Keine Ergebnisse für „'+esc(qq)+'“<br><span style="font-size:11px;opacity:.7">Andere Schreibweise versuchen</span></div>';
    return;
  }
  list.innerHTML=hits.map(p=>'<button type="button" class="sug" data-k="'+p.k+'"><span class="sug-ico">'+(p.ico||"📍")+'</span><div class="sug-body"><div class="sug-n">'+highlight(p.n,qq)+'</div><div class="sug-m">'+esc(p.m||"")+'</div></div><span class="sug-meta">'+esc(p.t)+'</span></button>').join("");
  list.querySelectorAll("[data-k]").forEach(el=>el.addEventListener("click",()=>selectPlace(el.dataset.k)));
}
function selectPlace(key){
  const d=dest[key]||places.find(x=>x.k===key);
  if(!d) return;
  const name=d.n, t=d.t||"12 min", dist=d.d||"7,4 km";
  $("pn").textContent=name; $("pa").textContent="Demo · "+t+" · "+dist; $("stt").textContent=t; $("std").textContent=dist;
  $("navHome").classList.add("hide"); $("navPrev").classList.remove("hide");
  closeKb(); setQuery("", true);
}
function kbType(ch){
  const cur=$("q").value||"";
  let ins=ch;
  if(!kbNum){
    if(ch==="ß") ins="ß";
    else ins=kbShift?ch:ch.toLowerCase();
  }
  const pos=Math.min(caretPos,cur.length);
  const next=cur.slice(0,pos)+ins+cur.slice(pos);
  caretPos=pos+ins.length;
  setQuery(next, false);
  if(kbShift&&!kbNum){ kbShift=false; renderKb(); }
  syncMirror();
}
function kbBack(){
  const cur=$("q").value||"";
  if(!cur||caretPos<=0) return;
  const next=cur.slice(0,caretPos-1)+cur.slice(caretPos);
  caretPos--;
  setQuery(next, false);
  syncMirror();
}
function kbGo(){
  const first=$("suggestList")&&$("suggestList").querySelector("[data-k]");
  if(first) first.click();
  else if(($("q").value||"").trim()) toast("Keine Treffer");
  else closeKb();
}

$("q").addEventListener("click",(e)=>{ e.preventDefault(); openKb(); });
$("q").addEventListener("focus",(e)=>{ e.preventDefault(); $("q").blur(); openKb(); });
$("searchBox").addEventListener("click",()=>openKb());
$("clearQ").onclick=(e)=>{ e.stopPropagation(); setQuery(""); caretPos=0; syncMirror(); filterSuggest(""); openKb(); };
$("searchBack").onclick=(e)=>{ e.stopPropagation(); setQuery(""); closeKb(); };
$("kb").addEventListener("click",(e)=>{
  const b=e.target.closest("button"); if(!b) return;
  const k=b.dataset.k, ch=b.dataset.ch;
  if(k==="shift"){ kbShift=!kbShift; renderKb(); }
  else if(k==="mode"){ kbNum=!kbNum; kbShift=!kbNum; renderKb(); }
  else if(k==="back") kbBack();
  else if(k==="space"){ const cur=$("q").value||""; const pos=Math.min(caretPos,cur.length); const next=cur.slice(0,pos)+" "+cur.slice(pos); caretPos=pos+1; setQuery(next,false); syncMirror(); }
  else if(k==="go") kbGo();
  else if(ch) kbType(ch);
});

Object.assign(dest,{
  gym:{n:"Fitnessstudio Erlangen",t:"11 min",d:"5,2 km"},
  hoe:{n:"Höchstadt a.d. Aisch",t:"28 min",d:"22 km"},
  nbg:{n:"Nürnberg Hauptbahnhof",t:"25 min",d:"19 km"},
  fur:{n:"Fürth Rathaus",t:"18 min",d:"12 km"},
  uni:{n:"Universität Erlangen",t:"10 min",d:"4,8 km"},
  siem:{n:"Siemens Campus",t:"7 min",d:"3,1 km"}
});
const _showView=showView;
showView=function(name){ closeKb(); _showView(name); };
const _px=$("px").onclick;
$("px").onclick=()=>{ if(_px)_px(); closeKb(); };
const _bs=$("bs").onclick;
$("bs").onclick=()=>{ if(_bs)_bs(); closeKb(); setQuery(""); };
syncMirror();
