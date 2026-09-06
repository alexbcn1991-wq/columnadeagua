/* Columna de Agua — interacciones
   1. utilidades de foco   4. comparativa
   2. menú móvil           5. infografía
   3. buscador             6. filtros del hub                     */
(function(){
  'use strict';
  var d=document, body=d.body;
  var FOCO='a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

  /* ---------- 1. utilidades ---------- */
  function trampa(cont){
    return function(e){
      if(e.key!=='Tab') return;
      var f=[].slice.call(cont.querySelectorAll(FOCO)).filter(function(el){return el.offsetParent!==null});
      if(!f.length) return;
      var pri=f[0], ult=f[f.length-1];
      if(e.shiftKey && d.activeElement===pri){ e.preventDefault(); ult.focus(); }
      else if(!e.shiftKey && d.activeElement===ult){ e.preventDefault(); pri.focus(); }
    };
  }
  function crearModal(el, btnAbrir){
    if(!el) return null;
    var previo=null, onTab=trampa(el);
    return {
      abrir:function(foco){
        previo=d.activeElement;
        el.setAttribute('aria-hidden','false');
        body.classList.add('no-scroll');
        if(btnAbrir) btnAbrir.setAttribute('aria-expanded','true');
        d.addEventListener('keydown',onTab);
        setTimeout(function(){ (foco||el.querySelector(FOCO)||el).focus(); },40);
      },
      cerrar:function(){
        el.setAttribute('aria-hidden','true');
        body.classList.remove('no-scroll');
        if(btnAbrir) btnAbrir.setAttribute('aria-expanded','false');
        d.removeEventListener('keydown',onTab);
        if(previo && previo.focus) previo.focus();
      },
      abierto:function(){ return el.getAttribute('aria-hidden')==='false'; }
    };
  }

  /* ---------- 2. menú móvil ---------- */
  var drawerEl=d.getElementById('drawer'), burger=d.getElementById('burger');
  var drawer=crearModal(drawerEl,burger);
  if(drawer&&burger){
    burger.addEventListener('click',function(){ drawer.abrir(drawerEl.querySelector('.drawer-nav a')); });
    drawerEl.querySelectorAll('[data-cerrar]').forEach(function(el){ el.addEventListener('click',drawer.cerrar); });
    drawerEl.querySelectorAll('.drawer-nav a').forEach(function(a){ a.addEventListener('click',function(){ drawer.cerrar(); }); });
  }

  /* ---------- 3. buscador ---------- */
  var swEl=d.getElementById('search'), sInput=d.getElementById('search-input'), sRes=d.getElementById('search-res');
  var sw=crearModal(swEl), datos=null, sel=-1;
  function norm(s){ return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
  function buscar(q){
    if(!datos||!q.trim()) return [];
    var t=norm(q).split(/\s+/).filter(Boolean);
    return datos.map(function(e){
      var tt=norm(e.t), h=norm(e.t+' '+e.d+' '+e.s), p=0;
      t.forEach(function(w){ if(tt.indexOf(w)===0) p+=5; else if(tt.indexOf(w)>-1) p+=3; else if(h.indexOf(w)>-1) p+=1; });
      return {e:e,p:p};
    }).filter(function(x){return x.p>0}).sort(function(a,b){return b.p-a.p}).slice(0,10).map(function(x){return x.e});
  }
  var ORDEN=['Equipo','Guías','Especies','Sitio'], cargando=false;
  function repintar(){ pinta(buscar(sInput.value), sInput.value.trim()); }
  function cargar(){
    if(datos||cargando) return;
    cargando=true;
    fetch('/assets/buscador.json')
      .then(function(r){ return r.json(); })
      .then(function(j){ datos=j; cargando=false; if(sInput.value.trim()) repintar(); })
      .catch(function(){ cargando=false; sRes.innerHTML='<p class="search-empty">No se ha podido cargar el índice. Prueba a recargar la página.</p>'; });
  }
  function pinta(r,q){
    sel=-1;
    if(!q){ sRes.innerHTML='<p class="search-empty">Busca un equipo, una guía o una especie.</p>'; return; }
    if(!r.length){ sRes.innerHTML='<p class="search-empty">Sin resultados para <b>'+q.replace(/[<>&]/g,'')+'</b>.</p>'; return; }
    var g={};
    r.forEach(function(e){ (g[e.s]=g[e.s]||[]).push(e); });
    sRes.innerHTML=ORDEN.filter(function(k){return g[k]}).map(function(k){
      return '<div class="search-grupo"><p class="search-grupo-t">'+k+'</p>'+g[k].map(function(e){
        return '<a href="'+e.u+'" role="option"><span class="t">'+e.t+'</span><span class="d">'+e.d+'</span></a>';
      }).join('')+'</div>';
    }).join('');
  }
  if(sw&&sInput){
    d.querySelectorAll('[data-search]').forEach(function(b){
      b.addEventListener('click',function(){
        sw.abrir(sInput); sInput.value=''; pinta([],'');
        if(drawer&&drawer.abierto()) drawer.cerrar();
        cargar();
      });
    });
    swEl.querySelectorAll('[data-cerrar-search]').forEach(function(el){ el.addEventListener('click',sw.cerrar); });
    sInput.addEventListener('focus',cargar);
    sInput.addEventListener('input',function(){
      if(!datos){ cargar(); if(sInput.value.trim()){ sRes.innerHTML='<p class="search-empty">Buscando…</p>'; return; } }
      repintar();
    });
    sInput.addEventListener('keydown',function(e){
      var items=sRes.querySelectorAll('a'); if(!items.length) return;
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){
        e.preventDefault();
        items.forEach(function(i){i.classList.remove('on')});
        sel=e.key==='ArrowDown'?(sel+1)%items.length:(sel-1+items.length)%items.length;
        items[sel].classList.add('on'); items[sel].scrollIntoView({block:'nearest'});
      } else if(e.key==='Enter'&&sel>-1){ e.preventDefault(); items[sel].click(); }
    });
  }

  d.addEventListener('keydown',function(e){
    if(e.key!=='Escape') return;
    if(sw&&sw.abierto()) sw.cerrar();
    else if(drawer&&drawer.abierto()) drawer.cerrar();
  });

  /* ---------- 4. comparativa ---------- */
  (function(){
    var cards=[].slice.call(d.querySelectorAll('.pt-card')); if(!cards.length) return;
    var D=[
     {n:"Nobleza 54 L",a:"B0CRKW5HH6",v:"54 L",
      t:"Bomba integrada y cristal curvado. Base razonable para un montaje de peces marinos, aunque la luz no sirve para coral y no incluye calentador.",
      pro:"Frente de 49,8 cm y tapa que reduce la evaporación", con:"Sin calentador y con iluminación no apta para coral"},
     {n:"Tetra Starter Line",a:"B09RPD8HGL",v:"54 L",
      t:"El único de los tres que incluye calentador, y sus 61 cm de frente dan más juego para estructurar la roca.",
      pro:"Calentador de 50 W incluido y 61 cm de frente", con:"Filtro de cartuchos que en marino no vas a usar"},
     {n:"Marina 15256",a:"B0173I55JM",v:"38 L",
      t:"El más compacto de los tres. Ocupa menos, pero a menor volumen cualquier variación de temperatura o salinidad se mueve más rápido.",
      pro:"El más barato y el que menos espacio ocupa", con:"38 litros dan bastante menos margen de error"}];
    var REC={peces:0,coral:1}, sws=[].slice.call(d.querySelectorAll('.pt-sw[data-modo]')),
        buy=d.getElementById('pt-buy'), txt=d.getElementById('pt-txt'),
        rPro=d.getElementById('pt-pro'), rCon=d.getElementById('pt-con'), modo='coral', s=1;
    function pinta(){
      cards.forEach(function(c,j){
        c.setAttribute('aria-selected', j===s?'true':'false');
        c.querySelector('[data-pop]').hidden = (j!==REC[modo]);
        c.querySelector('[data-val]').textContent=D[j].v;
      });
      d.querySelectorAll('.pt-tabla td').forEach(function(td){ td.classList.toggle('on',td.dataset.i===String(s)); });
      buy.href='https://www.amazon.es/dp/'+D[s].a+'?tag=alex19910c-21';
      buy.textContent='Ver '+D[s].n+' en Amazon';
      txt.textContent=D[s].t;
      if(rPro) rPro.textContent=D[s].pro;
      if(rCon) rCon.textContent=D[s].con;
    }
    cards.forEach(function(c){ c.addEventListener('click',function(){ s=+c.dataset.i; pinta(); }); });
    sws.forEach(function(b){ b.addEventListener('click',function(){
      modo=b.dataset.modo;
      sws.forEach(function(x){ x.classList.toggle('is-on',x===b); x.setAttribute('aria-selected',x===b?'true':'false'); });
      s=REC[modo]; pinta();
    }); });
    pinta();
  })();

  /* ---------- 5. infografía ---------- */
  (function(){
    var wrap=d.querySelector('.eq-wrap'); if(!wrap) return;
    var tip=d.getElementById('eq-tip'), zonas=[].slice.call(wrap.querySelectorAll('.eq-zona'));
    function mostrar(z,x,y){
      tip.querySelector('b').textContent=z.dataset.n+' · '+z.dataset.t;
      tip.querySelector('span').textContent=z.dataset.d;
      wrap.classList.add('is-on'); tip.classList.add('on');
      var r=wrap.getBoundingClientRect();
      tip.style.left=Math.min(Math.max(x,150),r.width-150)+'px';
      tip.style.top=y+'px';
    }
    function ocultar(){ wrap.classList.remove('is-on'); tip.classList.remove('on'); }
    zonas.forEach(function(z){
      z.addEventListener('mouseenter',function(e){ var r=wrap.getBoundingClientRect(); mostrar(z,e.clientX-r.left,e.clientY-r.top-18); });
      z.addEventListener('mousemove',function(e){ var r=wrap.getBoundingClientRect(); mostrar(z,e.clientX-r.left,e.clientY-r.top-18); });
      z.addEventListener('focus',function(){ var r=wrap.getBoundingClientRect(), b=z.getBoundingClientRect(); mostrar(z,b.left-r.left+b.width/2,b.top-r.top-10); });
      z.addEventListener('mouseleave',ocultar);
      z.addEventListener('blur',ocultar);
    });
    /* móvil: resaltar la fila de la lista al tocar su número */
    d.querySelectorAll('.eq-lista a').forEach(function(a){
      a.addEventListener('mouseenter',function(){
        var n=a.querySelector('.eq-li-n').textContent.trim();
        zonas.forEach(function(z){ z.classList.toggle('destacada', z.dataset.n===n); });
      });
      a.addEventListener('mouseleave',function(){ zonas.forEach(function(z){ z.classList.remove('destacada'); }); });
    });
  })();

  /* ---------- 6. filtros del hub de equipo ---------- */
  (function(){
    var tabs=[].slice.call(d.querySelectorAll('[data-f]')), grid=d.getElementById('grid-equipo');
    if(!tabs.length||!grid) return;
    var cards=[].slice.call(grid.querySelectorAll('.pcard')), cuenta=d.getElementById('grid-cuenta');
    tabs.forEach(function(t){
      t.addEventListener('click',function(){
        tabs.forEach(function(x){ x.classList.toggle('is-on',x===t); x.setAttribute('aria-selected',x===t?'true':'false'); });
        var f=t.dataset.f, n=0;
        cards.forEach(function(c){
          var ok=(f==='todo'||(c.dataset.c||'').split(' ').indexOf(f)>-1);
          c.hidden=!ok; if(ok) n++;
        });
        if(cuenta) cuenta.textContent=n+(n===1?' análisis':' análisis');
      });
    });
  })();
})();
