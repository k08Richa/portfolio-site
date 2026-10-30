/* Builds every editable section of the page from the files in /content.
   You never need to edit this file: change content through /admin instead. */
(function(){
var md=function(s){return s?marked.parse(String(s)):''};
var mdi=function(s){return s?marked.parseInline(String(s)):''};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function slug(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40)||'item'}
function tags(list){return (list||[]).map(function(t){return '<span class="tag">'+esc(t)+'</span>'}).join('')}
function $(id){return document.getElementById(id)}
function get(n){return fetch('/content/'+n+'.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error(n);return r.json()})}

function hero(h){
  var i=0,words=function(str){return String(str||'').trim().split(/\s+/).filter(Boolean).map(function(w){return '<span class="w" style="--i:'+(i++)+'">'+esc(w)+'</span>'}).join(' ')};
  var plain=[h.line_start,h.correct_word,h.line_middle,h.line_highlight].filter(Boolean).join(' ');
  var line=words(h.line_start)+' <span class="w" style="--i:'+(i++)+'"><span class="fix"><span class="wrong">'+esc(h.crossed_word)+'</span><span class="right">'+esc(h.correct_word)+'</span></span></span> '+words(h.line_middle);
  if(h.line_highlight) line+=' <mark class="hl">'+words(h.line_highlight)+'</mark>';
  var note=(h.note_rows||[]).map(function(r){return '<dt>'+esc(r.label)+'</dt><dd>'+esc(r.text)+'</dd>'}).join('');
  var stats=(h.stats||[]).map(function(s){return '<div><p class="stat-n'+(/\d/.test(s.number)?' count':'')+'">'+esc(s.number)+'</p><p class="stat-l">'+esc(s.label)+'</p></div>'}).join('');
  $('hero').innerHTML='<div class="hero-main"><h1 class="hero-name">'+(h.greeting?'<span class="hero-hi">'+esc(h.greeting)+'</span>':'')+'<span class="hero-name-text">'+esc(h.name)+'</span></h1>'+
    '<p class="hero-line"><span class="sr-only">'+esc(plain)+'</span><span aria-hidden="true">'+line+'</span></p>'+
    '<div class="hero-links"><a href="#works" class="btn-primary">See my work</a>'+(h.resume_url?'<a href="'+esc(h.resume_url)+'" class="btn-ghost" target="_blank" rel="noopener">Resume ↗</a>':'')+'<a href="#contact" class="btn-ghost">Get in touch</a></div></div>'+
    (note?'<aside class="now-note" aria-label="Where I am right now"><p class="now-title">'+esc(h.note_title)+'</p><dl>'+note+'</dl></aside>':'')+
    (stats?'<div class="stats">'+stats+'</div>':'');
  var nr=$('navResume'); if(nr){ if(h.resume_url) nr.href=h.resume_url; else nr.parentNode.remove(); }
}
function about(a){
  $('about').innerHTML='<p class="section-marker">'+esc(a.label)+'</p><h2>'+esc(a.heading)+'</h2>'+
    (a.paragraphs||[]).map(function(p){return '<p class="about-body">'+mdi(p.text)+'</p>'}).join('')+
    '<div class="edge-grid">'+(a.cards||[]).map(function(c){return '<div class="edge-card"><p class="edge-title">'+esc(c.title)+'</p><p class="edge-body">'+esc(c.text)+'</p><div class="edge-tags">'+tags(c.tags)+'</div></div>'}).join('')+'</div>'+
    (a.process_line?'<div class="how-i-work"><h3>'+esc(a.process_line)+'</h3></div>':'');
}
function block(b){
  var h=b.heading?'<h4>'+esc(b.heading)+'</h4>':'';
  switch(b.type){
    case 'text': return h+md(b.body);
    case 'margin_note': return '<p class="mnote">'+esc(b.text)+'</p>';
    case 'side_by_side':
      var side=function(s){s=s||{};return '<div><h5>'+esc(s.label)+'</h5><p class="big">'+esc(s.big)+'</p><p>'+esc(s.caption)+'</p></div>'};
      return h+'<div class="vs">'+side(b.left)+side(b.right)+'</div>';
    case 'table':
      var t=md(b.table).replace('<table>','<table class="cmp">').replace(/<tr>\s*<td>([\s\S]*?)<\/td>/g,'<tr><th>$1</th>');
      return h+'<div class="tbl">'+t+'</div>';
    case 'steps':
      return h+'<div class="strip">'+(b.steps||[]).map(function(s,k){return '<span><b>'+(k+1)+'</b>'+esc(s)+'</span>'}).join('<i>&rarr;</i>')+'</div>';
    case 'questions':
      return h+(b.items||[]).map(function(q){var body=md(q.answer);if(q.checklist)body=body.replace(/<ul>/g,'<ul class="chk">');return '<details class="q"><summary>'+esc(q.question)+'</summary>'+body+'</details>'}).join('');
  }
  return '';
}
function works(w){
  var ids={};
  var cards='',modals='';
  (w.projects||[]).forEach(function(p){
    var id='cs-'+slug(p.title); while(ids[id]) id+='-x'; ids[id]=1;
    cards+='<article class="card" data-cat="'+esc((p.filters||[]).join(' '))+'"><div class="inner"><div class="face front" style="--img:url(\''+esc(p.cover||'')+'\')"><p class="work-category">'+esc(p.label)+'</p><h3>'+esc(p.title)+'</h3>'+(p.subtitle?'<p class="project-subtitle">'+esc(p.subtitle)+'</p>':'')+'<span class="hint"><span class="h-hover">Hover to flip</span><span class="h-tap">Tap to flip</span></span></div>'+
      '<div class="face back"><p>'+esc(p.summary)+'</p><div class="work-tools">'+tags(p.card_tags)+'</div><button class="explore" data-open="'+id+'">Explore</button></div></div></article>';
    var text=(p.blocks||[]).map(block).join('');
    if(p.under_the_hood||(p.tools||[]).length) text+='<div class="tech"><h4>Under the hood</h4>'+md(p.under_the_hood)+'<div class="work-tools">'+tags(p.tools)+'</div></div>';
    if(p.link) text+='<a class="btn-ghost" href="'+esc(p.link)+'" target="_blank" rel="noopener">'+esc(p.link_label||'View project')+'</a>';
    var imgs=(p.images||[]).filter(function(x){return x&&x.image});
    var inner=imgs.length?'<div class="cs-grid'+(p.text_heavy?' kyc':'')+'"><div class="cs-text">'+text+'</div><aside class="cs-side">'+imgs.map(function(x){return '<figure><img src="'+esc(x.image)+'" alt="'+esc(x.alt)+'" loading="lazy" onerror="this.parentElement.hidden=true">'+(x.caption?'<figcaption>'+esc(x.caption)+'</figcaption>':'')+'</figure>'}).join('')+'</aside></div>':text;
    modals+='<div class="cs" id="'+id+'" role="dialog" aria-modal="true" aria-label="'+esc(p.title)+'" hidden><div class="cs-in'+(imgs.length?' wide':'')+'"><button class="cs-x" aria-label="Close">&times;</button><p class="work-category">'+esc(p.case_label||p.label)+'</p><h2>'+esc(p.title)+'</h2>'+inner+'</div></div>';
  });
  var F=[['all','All'],['analytics','Analytics'],['business','Business &amp; Research'],['compliance','Compliance'],['content','Content &amp; Social'],['writing','Writing']];
  $('works').innerHTML='<p class="section-marker">'+esc(w.label)+'</p><h2>'+esc(w.heading)+'</h2><p class="work-desc">'+esc(w.intro)+'</p>'+
    '<div class="filters" role="group" aria-label="Filter projects">'+F.map(function(f,k){return '<button class="filter'+(k?'':' active')+'" data-f="'+f[0]+'" aria-pressed="'+(k?'false':'true')+'">'+f[1]+'</button>'}).join('')+'</div>'+
    '<div class="cards">'+cards+'</div>';
  $('case-studies').innerHTML=modals;
}
function journey(j){
  var G=[['work','leg-work','lg-work'],['training','leg-train','lg-train'],['simulation','leg-sim','lg-sim']];
  var names={work:'Work',training:'Training internships',simulation:'Job simulations'};
  var legend='',map='';
  G.forEach(function(g){
    var list=(j.entries||[]).filter(function(e){return e.group===g[0]}); if(!list.length) return;
    legend+='<span class="lg '+g[2]+'">'+names[g[0]]+'</span>';
    map+='<div class="leg '+g[1]+'"><p class="sign">'+names[g[0]]+'</p>'+list.map(function(e){
      var c='';
      var pos=(e.positions||[]).filter(function(p){return p&&p.role});
      if(pos.length){
        c+='<p class="stop-org">'+esc(e.org)+(e.org_detail?' <span>· '+esc(e.org_detail)+'</span>':'')+'</p>'+(e.meta?'<p class="stop-meta">'+esc(e.meta)+'</p>':'')+
           '<div class="promo">'+pos.map(function(p){return '<div class="promo-step'+(p.current?' now':'')+'"><p class="stop-role">'+esc(p.role)+'</p><p class="stop-date">'+esc(p.dates)+'</p><p class="stop-body">'+esc(p.text)+'</p></div>'}).join('')+'</div>';
      } else {
        c+=(e.dates?'<p class="stop-date">'+esc(e.dates)+'</p>':'')+'<p class="stop-role">'+esc(e.role)+'</p><p class="stop-org">'+esc(e.org)+(e.org_detail?' <span>· '+esc(e.org_detail)+'</span>':'')+'</p>'+(e.meta?'<p class="stop-meta">'+esc(e.meta)+'</p>':'')+(e.text?'<p class="stop-body">'+esc(e.text)+'</p>':'');
      }
      var hl=(e.highlights||[]).filter(Boolean); if(hl.length) c+='<div class="chips">'+hl.map(function(x){return '<span>'+esc(x)+'</span>'}).join('')+'</div>';
      return '<div class="stop"><div class="stop-card">'+c+'</div></div>';
    }).join('')+'</div>';
  });
  $('journey').innerHTML='<p class="section-marker">'+esc(j.label)+'</p><h2>'+esc(j.heading)+'</h2><div class="legend">'+legend+'</div><div class="map">'+map+'</div>';
  var ed=j.education||[];
  $('education').innerHTML='<p class="section-marker">'+esc(j.education_label)+'</p><h2>'+esc(j.education_heading)+'</h2>'+
    '<div class="edu-path" style="grid-template-columns:repeat('+Math.max(ed.length,1)+',minmax(0,1fr))">'+ed.map(function(s){return '<div class="edu-stop'+(s.upcoming?' next':'')+'"><span class="pin"></span><p class="stop-date">'+esc(s.dates)+'</p><p class="stop-role">'+esc(s.title)+'</p><p class="stop-org">'+esc(s.detail)+'</p>'+(s.text?'<p class="stop-body">'+esc(s.text)+'</p>':'')+'</div>'}).join('')+'</div>'+
    '<p class="stamps-title">'+esc(j.certificates_title)+'</p><div class="stamps">'+(j.certificates||[]).map(function(c,k){return '<div class="stamp s'+(k%4+1)+'"><p class="st-name">'+esc(c.name)+'</p><p class="st-org">'+esc(c.issuer)+'</p></div>'}).join('')+'</div>';
}
function curiosity(c){
  $('rabbit').innerHTML='<p class="section-marker">'+esc(c.label)+'</p><h2>'+esc(c.heading)+'</h2><p class="about-body">'+esc(c.intro)+'</p><div class="rh-grid">'+
    (c.cards||[]).map(function(r){return '<div class="rh"><p class="rh-q">'+esc(r.question)+'</p><p class="rh-a">'+esc(r.answer)+'</p>'+(r.source_url?'<a class="rh-s" href="'+esc(r.source_url)+'" target="_blank" rel="noopener">'+esc(r.source_label||'Source')+'</a>':'')+'</div>'}).join('')+'</div>';
}
function contact(c,f){
  var gm='https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(c.email||'');
  $('contact').innerHTML='<p class="section-marker">'+esc(c.label)+'</p><h2>'+esc(c.heading)+'</h2><p class="contact-line">'+mdi(c.intro)+'</p><div class="contact-links">'+
    (c.email?'<div class="contact-link email-row"><span>Email</span><a href="'+esc(gm)+'" target="_blank" rel="noopener" class="email-addr">'+esc(c.email)+'</a><button type="button" class="copy-email" data-email="'+esc(c.email)+'">Copy</button></div>':'')+
    (c.linkedin_url?'<a href="'+esc(c.linkedin_url)+'" class="contact-link" target="_blank" rel="noopener"><span>LinkedIn</span>'+esc(c.linkedin_text||c.linkedin_url)+'</a>':'')+
    (c.github_url?'<a href="'+esc(c.github_url)+'" class="contact-link" target="_blank" rel="noopener"><span>GitHub</span>'+esc(c.github_text||c.github_url)+'</a>':'')+'</div>';
  document.querySelector('footer').innerHTML='<p class="footer-note">'+esc(f.note)+'</p>'+(f.updated?'<p class="footer-meta">'+esc(f.updated)+'</p>':'');
}
Promise.all([get('site'),get('projects'),get('journey'),get('curiosity')]).then(function(d){
  var site=d[0];
  hero(site.hero||{}); about(site.about||{}); works(d[1]); journey(d[2]); curiosity(d[3]); contact(site.contact||{},site.footer||{});
}).catch(function(err){
  console.error(err);
  $('hero').innerHTML='<div class="hero-main"><h1 class="hero-name">Richa Chaurasia</h1><p class="hero-line">This page could not load its content. Please refresh.</p></div>';
}).then(function(){
  var s=document.createElement('script'); s.src='/assets/site.js'; document.body.appendChild(s);
});
})();
