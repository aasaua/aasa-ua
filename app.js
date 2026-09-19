(() => {
  'use strict';
  const c = window.AASA_CONTENT;
  const $ = id => document.getElementById(id);
  const el = (tag, className, text) => { const n = document.createElement(tag); if(className) n.className=className; if(text !== undefined) n.textContent=text; return n; };
  const dateOf = date => new Date(`${date}T12:00:00`);
  if(c.logo){$('club-logo').src=c.logo;$('club-logo').hidden=false;$('logo-placeholder').hidden=true;}
  const format = (date, options) => date.toLocaleDateString('en-US', options);
  for(const [id,key] of Object.entries({'hero-title':'heroTitle','hero-description':'heroDescription',mission:'mission',welcome:'welcome',semester:'semester','events-note':'eventsNote','officer-note':'officerNote','contact-message':'contactMessage'})) $(id).textContent=c[key];
  document.querySelectorAll('.instagram-link').forEach(a=>a.href=c.instagram);
  if(c.email){$('email-link').hidden=false;$('email-link').href=`mailto:${c.email}`;$('email-label').textContent=c.email;}
  const events=[...c.events].sort((a,b)=>a.date.localeCompare(b.date));
  events.forEach(e=>{const d=dateOf(e.date),row=el('article','event-row'),date=el('div','date-block');date.append(el('span','',format(d,{month:'short'}).toUpperCase()),el('strong','',d.getDate()));const body=el('div');body.append(el('h3','',e.title),el('p','',`${format(d,{weekday:'short'})} · ${e.time} · ${e.location}`));row.append(date,body);$('event-list').append(row);});
  if(!events.length) $('event-list').append(el('p','','New meeting dates will be announced soon.'));
  const now=new Date();const next=events.find(e=>e.date>=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`);
  const initial=next?dateOf(next.date):(events.length?dateOf(events[events.length-1].date):now);
  let month=new Date(initial.getFullYear(),initial.getMonth(),1);
  function renderCalendar(){
    $('calendar-title').textContent=format(month,{month:'long',year:'numeric'});$('calendar-days').replaceChildren();$('selected-event').textContent='Select a highlighted date to see event details.';
    for(let i=0;i<month.getDay();i++) $('calendar-days').append(el('span'));
    const count=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
    for(let day=1;day<=count;day++){
      const d=new Date(month.getFullYear(),month.getMonth(),day);const match=events.filter(e=>{const t=dateOf(e.date);return t.getFullYear()===d.getFullYear()&&t.getMonth()===d.getMonth()&&t.getDate()===day;});
      const n=el(match.length?'button':'span','',day);
      if(match.length){n.type='button';n.setAttribute('aria-label',`${format(d,{month:'long',day:'numeric',year:'numeric'})}: ${match.map(e=>e.title).join(', ')}`);n.setAttribute('aria-pressed','false');n.addEventListener('click',()=>{document.querySelectorAll('#calendar-days button').forEach(b=>b.setAttribute('aria-pressed','false'));n.setAttribute('aria-pressed','true');$('selected-event').textContent=match.map(e=>`${e.title} · ${format(d,{month:'short',day:'numeric'})} · ${e.time} · ${e.location}`).join(' / ');});}
      $('calendar-days').append(n);
    }
  }
  $('previous-month').onclick=()=>{month=new Date(month.getFullYear(),month.getMonth()-1,1);renderCalendar();};$('next-month').onclick=()=>{month=new Date(month.getFullYear(),month.getMonth()+1,1);renderCalendar();};renderCalendar();
  c.announcements.forEach(a=>{const n=el('article','announcement');n.append(el('p','eyebrow',a.label),el('h3','',a.title),el('p','',a.text));$('announcement-list').append(n);});
  c.officers.forEach(o=>{const n=el('article','officer');if(o.photo){const img=el('img','officer-photo');img.src=o.photo;img.alt=o.name;img.loading='lazy';n.append(img);}else{const p=el('div','officer-placeholder');p.append(el('span','','aasa'),el('small','','Photo coming soon'));n.append(p);}n.append(el('h3','',o.name),el('p','role',o.role));if(o.bio)n.append(el('p','bio',o.bio));$('officer-list').append(n);});
  c.gallery.forEach(g=>{const n=el('figure');let img;if(g.crop){img=el('div',`photo-crop ${g.crop}`);img.style.backgroundImage=`url("${g.src}")`;img.setAttribute('role','img');img.setAttribute('aria-label',g.alt);}else{img=el('img');img.src=g.src;img.alt=g.alt;img.loading='lazy';}const caption=el('figcaption');caption.append(el('span','',g.label),document.createTextNode(g.caption));n.append(img,caption);$('gallery-list').append(n);});
  if(c.quotes.length)c.quotes.forEach(q=>{const n=el('blockquote','',`“${q.text}”`);n.append(el('cite','',`${q.name}${q.detail?' · '+q.detail:''}`));$('quote-list').append(n);});else $('quote-list').append(el('p','empty-quotes',c.quotesEmpty));
})();
