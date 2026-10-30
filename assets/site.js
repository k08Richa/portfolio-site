
(function(){var cs=document.querySelectorAll('.card'),last;
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.2});
cs.forEach(function(c,i){c.style.transitionDelay=(i*110)+'ms';io.observe(c);
c.addEventListener('click',function(e){if(!e.target.closest('.explore'))c.classList.toggle('on')})});
function open(id){last=document.activeElement;var d=document.getElementById(id);d.hidden=false;d.scrollTop=0;document.body.style.overflow='hidden';d.querySelector('.cs-x').focus()}
function close(){document.querySelectorAll('.cs').forEach(function(d){d.hidden=true});document.body.style.overflow='';if(last)last.focus()}
document.querySelectorAll('[data-open]').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();open(b.dataset.open)})});
document.querySelectorAll('.cs-x').forEach(function(b){b.addEventListener('click',close)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});})();

;

(function(){var bs=document.querySelectorAll('.filter'),cards=document.querySelectorAll('.card[data-cat]');
bs.forEach(function(b){var f=b.dataset.f;if(f!=='all'){var n=0;cards.forEach(function(c){if((' '+c.dataset.cat+' ').indexOf(' '+f+' ')>-1)n++});if(!n)b.hidden=true}
b.addEventListener('click',function(){bs.forEach(function(x){x.classList.remove('active');x.setAttribute('aria-pressed','false')});b.classList.add('active');b.setAttribute('aria-pressed','true');
cards.forEach(function(c){var show=f==='all'||(' '+c.dataset.cat+' ').indexOf(' '+f+' ')>-1;c.hidden=!show;if(show){c.style.transitionDelay='0ms';c.classList.add('in')}})})});})();

;

document.querySelectorAll('.copy-email').forEach(function(b){b.addEventListener('click',function(){var e=b.dataset.email;
function done(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy'},1800)}
if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(e).then(done,function(){fb()})}else fb();
function fb(){var t=document.createElement('textarea');t.value=e;document.body.appendChild(t);t.select();try{document.execCommand('copy');done()}catch(x){}t.remove()}})});

;

(function(){
var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add(RM?'rm':'motion');
function onView(els,cb,opt){if(!('IntersectionObserver' in window)){els.forEach(cb);return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){cb(e.target);io.unobserve(e.target)}})},opt||{threshold:.2});
  els.forEach(function(e){io.observe(e)});}

/* highlighter sweeps */
var hls=[].slice.call(document.querySelectorAll('mark.hl,.about-body strong,.contact-line strong'));
if(RM)hls.forEach(function(e){e.classList.add('lit')});else onView(hls,function(e){e.classList.add('lit')},{threshold:.8});

/* count-up from zero */
function parse(el){var m=el.textContent.trim().match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);if(!m)return null;
  return{pre:m[1],raw:m[2],suf:m[3],comma:m[2].indexOf(',')>-1,dec:(m[2].split('.')[1]||'').length,n:parseFloat(m[2].replace(/,/g,''))}}
function fmt(p,v){var s=v.toFixed(p.dec);if(p.comma)s=Number(s).toLocaleString('en-IN',{minimumFractionDigits:p.dec,maximumFractionDigits:p.dec});return p.pre+s+p.suf}
var nums=[].slice.call(document.querySelectorAll('.count,.vs .big')).filter(function(e){return /\d/.test(e.textContent)});
nums.forEach(function(el){var p=parse(el);if(!p)return;el._p=p;if(!RM)el.textContent=fmt(p,0)});
function countUp(el){var p=el._p;if(!p||RM)return;var delay=el.closest('#hero')?1950:0;
  setTimeout(function(){var t0=null,D=1500;function step(t){if(!t0)t0=t;var k=Math.min((t-t0)/D,1),e=1-Math.pow(1-k,3);el.textContent=fmt(p,p.n*e);if(k<1)requestAnimationFrame(step);else el.textContent=p.pre+p.raw+p.suf}requestAnimationFrame(step)},delay)}
onView(nums,countUp,{threshold:.5});

/* gentle fade-ups */
if(!RM){
  var sel='section .section-marker,section > h2,.about-body,.edge-card,.how-i-work,.work-desc,.filters,.legend,.sign,.stop,.edu-stop,.stamps-title,.doc,.spot-status,.spot-small,.rh,.contact-line,.contact-links';
  var rv=[].slice.call(document.querySelectorAll(sel));
  rv.forEach(function(e){e.classList.add('rv');var sib=[].slice.call(e.parentNode.children).filter(function(c){return c.classList.contains('rv')});e.style.transitionDelay=(Math.min(sib.indexOf(e),4)*90)+'ms'});
  var st=[].slice.call(document.querySelectorAll('.stamps'));st.forEach(function(e){e.classList.add('rvo')});
  onView(rv.concat(st),function(e){e.classList.add('in')},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
}

/* process rail + active nav */
var map={about:0,spot:1,works:2,journey:3,education:3,rabbit:3,contact:4};
var rail=document.querySelector('.rail'),rl=rail?rail.querySelectorAll('a'):[],navA=document.querySelectorAll('.nav-links a[href^="#"]');
function setActive(id){var k=map[id];if(k===undefined)return;
  [].forEach.call(rl,function(a,i){a.classList.toggle('active',i===k);a.classList.toggle('done',i<k)});
  if(rail)rail.style.setProperty('--fill',(k/4*100)+'%');
  [].forEach.call(navA,function(a){var h=a.getAttribute('href').slice(1);a.classList.toggle('active',h===id||(id==='education'&&h==='journey'))})}
if('IntersectionObserver' in window){
  var sio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)setActive(e.target.id)})},{rootMargin:'-45% 0px -50% 0px'});
  document.querySelectorAll('section[id]').forEach(function(s){sio.observe(s)});
  var hero=document.getElementById('hero');
  if(rail&&hero)new IntersectionObserver(function(es){es.forEach(function(e){rail.classList.toggle('show',!e.isIntersecting)})},{threshold:0,rootMargin:'0px 0px -40% 0px'}).observe(hero);
}

/* cards expand into the case study */
var lastRect=null;
document.addEventListener('click',function(e){var b=e.target.closest('[data-open]');if(b){var c=b.closest('.card');lastRect=c?c.getBoundingClientRect():null}},true);
document.querySelectorAll('[data-open]').forEach(function(b){b.addEventListener('click',function(){
  var d=document.getElementById(b.dataset.open);if(!d||RM||!lastRect||!d.animate)return;
  var r=lastRect,W=window.innerWidth,H=window.innerHeight;
  d.animate([{clipPath:'inset('+r.top+'px '+(W-r.right)+'px '+(H-r.bottom)+'px '+r.left+'px round 14px)'},{clipPath:'inset(0px 0px 0px 0px round 0px)'}],{duration:600,easing:'cubic-bezier(.2,.8,.2,1)'})})});

/* spot the error */
var g=document.getElementById('spotGame');
if(g){
  var msgs={name:'Name: "Verma" on the form, "Varma" on the ID. Could be a typo, could be a different person. I\'d ask the customer to clarify.',
            dob:'Date of birth: 01/01/1900 is a placeholder, not a real birthday. The record needs the actual date from the document.',
            pin:'PIN code: 226010 vs 226016. I\'d ask for proof of current address before going further.'};
  var START='Take your time. Compare the two side by side.',
      DONE='All three found. In a real review I wouldn\'t reject the customer straight away: I\'d note each mismatch, ask the customer to clarify, re-check the documents, and escalate anything that stays unresolved.';
  var found={},timer=null,n=document.getElementById('spotN'),m=document.getElementById('spotMsg'),show=document.getElementById('spotShow'),reset=document.getElementById('spotReset');
  function count(){return Object.keys(found).length}
  function mark(row){g.querySelectorAll('[data-row="'+row+'"]').forEach(function(b){b.classList.add('found');b.setAttribute('aria-label',b.textContent+' (mismatch found)')})}
  function finish(){clearTimeout(timer);timer=null;m.textContent=DONE;show.hidden=true;reset.hidden=false}
  g.addEventListener('click',function(e){var b=e.target.closest('.doc-v');if(!b)return;var row=b.dataset.row;
    if(row==='ok'){b.classList.remove('nope');void b.offsetWidth;b.classList.add('nope');if(count()<3)m.textContent='That one matches. Look again.';return}
    if(found[row]){m.textContent=msgs[row];return}
    found[row]=1;mark(row);n.textContent=count();m.textContent=msgs[row];
    if(count()===3){clearTimeout(timer);timer=setTimeout(finish,1800)}});
  g.addEventListener('animationend',function(e){if(e.animationName==='shake')e.target.classList.remove('nope')});
  show.addEventListener('click',function(){['name','dob','pin'].forEach(function(r){found[r]=1;mark(r)});n.textContent=3;finish()});
  reset.addEventListener('click',function(){clearTimeout(timer);timer=null;found={};
    g.querySelectorAll('.doc-v').forEach(function(b){b.classList.remove('found','nope');b.removeAttribute('aria-label')});
    n.textContent=0;m.textContent=START;show.hidden=false;reset.hidden=true;show.focus()});
}

/* soft cursor dot, desktop only */
if(!RM&&window.matchMedia('(hover: hover) and (pointer: fine)').matches){
  var dot=document.createElement('div');dot.className='cdot';dot.setAttribute('aria-hidden','true');document.body.appendChild(dot);
  var x=-50,y=-50,tx=-50,ty=-50,on=false;
  window.addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;if(!on){x=tx;y=ty;on=true;dot.classList.add('on')}},{passive:true});
  document.addEventListener('mouseleave',function(){on=false;dot.classList.remove('on')});
  document.addEventListener('mouseover',function(e){dot.classList.toggle('big',!!e.target.closest('a,button,.card,.rh,.stamp'))});
  (function loop(){x+=(tx-x)*.18;y+=(ty-y)*.18;dot.style.transform='translate3d('+x+'px,'+y+'px,0) translate(-50%,-50%)';requestAnimationFrame(loop)})();
}
})();
