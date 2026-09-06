/* Consentimiento de cookies + Google Analytics
   GA4 solo se carga si el visitante acepta. */
(function(){
  'use strict';
  var ID='G-MN3WD7C8XD', CLAVE='cda-consentimiento', d=document;

  function cargarGA(){
    if(window.__gaCargado) return; window.__gaCargado=true;
    var s=d.createElement('script'); s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+ID;
    d.head.appendChild(s);
    window.dataLayer=window.dataLayer||[];
    function gtag(){dataLayer.push(arguments)}
    window.gtag=gtag;
    gtag('js',new Date());
    gtag('config',ID,{anonymize_ip:true});
  }

  function guardar(v){
    try{ localStorage.setItem(CLAVE,v); }catch(e){}
    var b=d.getElementById('cookies'); if(b) b.remove();
    if(v==='si') cargarGA();
  }

  var previo=null;
  try{ previo=localStorage.getItem(CLAVE); }catch(e){}
  if(previo==='si'){ cargarGA(); return; }
  if(previo==='no') return;

  d.addEventListener('DOMContentLoaded',function(){
    var b=d.createElement('div');
    b.id='cookies'; b.className='cookies'; b.setAttribute('role','dialog');
    b.setAttribute('aria-live','polite'); b.setAttribute('aria-label','Aviso de cookies');
    b.innerHTML='<p>Usamos cookies de <strong>Google Analytics</strong> para saber qué contenidos se leen. '+
      'No las usamos para publicidad ni para perfilarte. '+
      '<a href="/aviso-legal-y-privacidad/#cookies">Más información</a>.</p>'+
      '<div class="cookies-btns">'+
      '<button type="button" class="btn btn-ghost" data-c="no">Rechazar</button>'+
      '<button type="button" class="btn btn-primary" data-c="si">Aceptar</button></div>';
    d.body.appendChild(b);
    b.querySelectorAll('[data-c]').forEach(function(x){
      x.addEventListener('click',function(){ guardar(x.dataset.c); });
    });
    setTimeout(function(){ b.classList.add('on'); },300);
  });
})();
