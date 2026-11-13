/* Sociality — Het Skatepark, digital playtest v3.
 * Each choice, category assignment, and terminal state is based on the uploaded physical cards.
 * The exact original card faces are displayed as images. The sidebar choices are accessible transcriptions.
 */
(()=>{'use strict';
const GAME={
'1': {title:'HET SKATEPARK: DE START', cats:[],choices:[['Je richt je eerst op gesprekken met de jongeren.','1A'],['Je richt je op draagvlak en het verzet in de buurt.','1B']]},
'1A':{title:'BEGIN BIJ DE JONGEREN',cats:['inclusie','formeel','collectief'],choices:[['Nodig jongeren uit voor overleg op kantoor.','2A'],['Praat op straat met jongeren, zonder agenda.','2B']]},
'1B':{title:'BEGIN BIJ DE INWONERS',cats:['cohesie','formeel','collectief'],choices:[['Organiseer een open inwonersavond voor de hele wijk.','2C'],['Praat individueel met inwoners op straat.','2D']]},
'2A':{title:'EEN JONGERENOVERLEG',cats:['cohesie','formeel','collectief'],choices:[['Betrek jongeren actief bij het vervolg van het skateveldje.','3A'],['Verken de zorgen over drugs en zoek contact met het meisje.','3B']]},
'2B':{title:'GESPREK OP STRAAT',cats:['cohesie','informeel','collectief'],choices:[['Betrek jongeren actief bij het vervolg.','3A'],['Onderzoek de zorgen over drugs en zoek contact met het meisje.','3B'],['Regel met de gemeente een tijdelijke pop-up skateplek.','3C']]},
'2C':{title:'OPEN INWONERSAVOND',cats:['cohesie','formeel','collectief'],choices:[['Richt je op veiligheid en spanningen in de wijk.','5A'],['Betrek de jongeren bij de zorgen van de wijkbewoners.','3A'],['Verken eerst de zorgen over drugs en zoek contact met het meisje.','3B']]},
'2D':{title:'GESPREK OP STRAAT',cats:['cohesie','informeel','collectief'],choices:[['Richt je op de spanningen en veiligheid in de wijk.','5A'],['Vraag twee welwillende buurtbewoners om mee te denken.','3D']]},
'3A':{title:'JONGEREN BETREKKEN',cats:['empowerment','informeel','collectief'],choices:[['Leid twee jongeren op tot jeugdambassadeur.','4A'],['Laat jongeren een plan presenteren tijdens een buurtpicknick.','4B'],['Organiseer een picknick met jongeren en buurtbewoners.','4C']]},
'3B':{title:'GESPREK OVER DRUGS',cats:['zekerheid','informeel','individueel'],choices:[['Voer een vervolggesprek over middelengebruik en strafbaar gedrag.','4E'],['Organiseer met haar, jongeren en inwoners een buurtpicknick.','4C']]},
'3C':{title:'POP-UP SKATEPARK',cats:['zekerheid','informeel','collectief'],choices:[],end:'fail'},
'3D':{title:'PLAN VAN INWONERS',cats:['zekerheid','informeel','collectief'],choices:[['Organiseer samen met inwoners en jongeren een buurtpicknick.','4C'],['Vertaal het reglement naar jongerentaal.','4D']]},
'4A':{title:'JEUGDAMBASSADEURS',cats:['empowerment','formeel','individueel'],choices:[['Help de jongere om een stage te bemachtigen.','5D'],['Laat de jeugdambassadeur helpen bij vergunningen en voorzieningen.','5C']]},
'4B':{title:'JONGERENPLAN',cats:['empowerment','formeel','collectief'],choices:[['Richt je op de weerstand van wijkbewoners.','5A'],['Betrek lokale ondernemers.','5B'],['Werk samen plannen uit, met vergunningen en voorzieningen.','5C']]},
'4C':{title:'GESPREK OP STRAAT',cats:['cohesie','informeel','collectief'],choices:[['Richt je op het wantrouwen van wijkbewoners.','5A'],['Ondersteun de student bij het betrekken van lokale ondernemers.','5B'],['Regel samen vergunningen en voorzieningen.','5C']]},
'4D':{title:'JEUGDTAAL',cats:['zekerheid','formeel','collectief'],choices:[],end:'fail'},
'4E':{title:'INDIVIDUELE AANPAK',cats:['zekerheid','formeel','individueel'],choices:[],end:'fail'},
'5A':{title:'GAAN VOOR VEILIGHEID',cats:['cohesie','informeel','collectief'],choices:[],end:'fail'},
'5B':{title:'LOKALE ONDERNEMERS',cats:['empowerment','informeel','individueel'],choices:[['Pak kaart 6: ga naar de afronding.','6']]},
'5C':{title:'VOORZIENINGEN REGELEN',cats:['inclusie','formeel','collectief'],choices:[['Pak kaart 6: ga naar de afronding.','6']]},
'5D':{title:'BIJDRAGEN AAN KANSEN',cats:['empowerment','formeel','individueel'],choices:[],end:'fail'},
'6': {title:'HET SKATEPARK IS EEN SUCCES!',cats:[],choices:[],end:'finish'}
};
const CONCEPTS=[
['zekerheid','Meedoen','#4274b7','Sociaaleconomische zekerheid: mensen beschikken over de basisvoorwaarden om mee te doen.'],
['cohesie','Erbij horen','#efa21c','Sociale cohesie: verbondenheid, vertrouwen, solidariteit en het gevoel erbij te horen.'],
['inclusie','Ertoe doen','#cd1924','Sociale inclusie: gelijkwaardigheid, toegankelijkheid en volwaardig meedoen.'],
['empowerment','Jezelf zijn','#842282','Sociale empowerment: de ruimte om invloed uit te oefenen en eigen keuzes te maken.'],
['collectief','Collectief','#59abce','Gericht op groepen, gemeenschappen en maatschappelijke omstandigheden (meso- en macroniveau).'],
['individueel','Individueel','#59abce','Gericht op individuele mensen en hun directe netwerk (microniveau).'],
['formeel','Formeel','#59abce','Handelen vanuit methoden, afspraken, regels en procedures.'],
['informeel','Informeel','#59abce','Flexibel en nabij handelen, buiten de vaste procedures waar passend.']
];
// Marker coordinates align to the printed movable cards, rather than the coloured quadrants.
const POS={zekerheid:[34,34],cohesie:[66,34],inclusie:[34,67],empowerment:[66,67],collectief:[50,18],individueel:[50,81],formeel:[15.6,50],informeel:[84.8,50]};
const PAWN_X={0:11,1:16,2:31,3:44,4:56,5:69,6:85};
const $=s=>document.querySelector(s);
// Load the extracted images from the assets/ folder.
const asset = name => 'assets/' + name;
const DEFAULT=()=>({current:'1',seen:['1'],trail:['1'],jokers:2,chosen:{},started:false});
let state=DEFAULT();
let lastEarned=[];
let cardBack=false;
try{const stored=JSON.parse(localStorage.getItem('sociality-skatepark-v1')||'null');if(stored&&GAME[stored.current]&&Array.isArray(stored.seen)&&Array.isArray(stored.trail)&&typeof stored.jokers==='number')state={...DEFAULT(),...stored}}catch(e){}
function save(){try{localStorage.setItem('sociality-skatepark-v1',JSON.stringify(state))}catch(e){}}
function uniqueConcepts(){return new Set(state.seen.flatMap(id=>GAME[id]?.cats||[]))}
function stage(){return state.current==='1'?0:Number(state.current[0])||0}
function node(){return GAME[state.current]}
function makeButton(text,className,click){const b=document.createElement('button');b.type='button';b.textContent=text;b.className=className;b.addEventListener('click',click);return b}
function render(){const n=node(),found=uniqueConcepts(),t=stage();
 $('#sg-board-img').src=asset('board.webp');$('#sg-pawn').style.left=PAWN_X[t]+'%';
 $('#sg-round').textContent=n.end==='finish'?'FINISH':t===0?'START':'VAKJE '+t+' / 6';
 $('#sg-progress-num').textContent=found.size+' / 8';$('#sg-barfill').style.width=(found.size/8*100)+'%';
 $('#sg-cardnumber').textContent='KAART '+state.current;$('#sg-cardtitle').textContent=n.title;
 $('#sg-card-img').src=asset('cards/'+state.current+(cardBack?'-back.webp':'-front.webp'));$('#sg-card-img').alt='Originele speelkaart '+state.current+' — '+n.title;$('#sg-flip-inline').textContent=cardBack?'↶ Voorkant tonen':'⤺ Kaart omdraaien';
 const cardline=$('#sg-cardcats');cardline.replaceChildren();n.cats.forEach(k=>{const c=CONCEPTS.find(x=>x[0]===k);const e=document.createElement('span');e.className='sg-cat';e.style.setProperty('--cat-color',c[2]);e.textContent=c[1];cardline.append(e)});
 const marker=$('#sg-boardmarkers');marker.replaceChildren();found.forEach(k=>{
  const concept=CONCEPTS.find(c=>c[0]===k);
  const m=document.createElement('div');m.className='sg-conceptmark sg-award-'+k+(lastEarned.includes(k)?' sg-new-award':'');
  m.style.left=POS[k][0]+'%';m.style.top=POS[k][1]+'%';m.style.setProperty('--award-color',concept[2]);
  m.style.setProperty('--award-angle',({zekerheid:'-43deg',cohesie:'43deg',inclusie:'-43deg',empowerment:'43deg'}[k]||'0deg'));
  m.setAttribute('role','img');m.setAttribute('aria-label',concept[1]+' verzameld');
  const raised=document.createElement('span');raised.className='sg-award-card';
  const art=document.createElement('img');art.src=asset('concepts/'+k+'.webp');art.alt='';art.draggable=false;
  raised.append(art);
  const chip=document.createElement('span');chip.className='sg-award-check';chip.textContent='✓';
  m.append(raised,chip);marker.append(m);
});
 const tokens=$('#sg-tokens');tokens.replaceChildren();CONCEPTS.forEach(c=>{let e=makeButton((found.has(c[0])?'✓ ':'○ ')+c[1],'sg-token'+(found.has(c[0])?' active':''),()=>showConcept(c));e.style.setProperty('--token-color',c[2]);e.title=c[3];tokens.append(e)});
 $('#sg-joker-count').textContent=state.jokers+' over';$('#sg-use-joker').disabled=state.jokers===0||!n.end||(n.end==='finish'&&found.size===8);
 $('#sg-history').textContent=state.trail.join('  →  ');
 const options=$('#sg-choices');options.replaceChildren();$('#sg-ending').hidden=true;
 if(n.choices.length){$('#sg-choices-title').textContent='WAT DOE JE?';$('#sg-choice-note').textContent='Lees de originele kaart. Bespreek de opties en maak samen een keuze.';n.choices.forEach(([label,id])=>{const b=document.createElement('button');b.type='button';b.className='sg-choice'+((state.chosen[state.current]||[]).includes(id)?' chosen-before':'');const code=document.createElement('span');code.className='sg-choice-code';code.textContent=id;const content=document.createElement('span');content.textContent=label;if((state.chosen[state.current]||[]).includes(id)){const v=document.createElement('small');v.textContent='Eerder gekozen';content.append(v)}const arrow=document.createElement('span');arrow.className='sg-arrow';arrow.textContent='›';b.append(code,content,arrow);b.onclick=()=>choose(id);options.append(b)});
 }else{const end=$('#sg-ending');end.hidden=false;const win=n.end==='finish'&&found.size===8;end.className='sg-ending'+(win?' success':'');$('#sg-choices-title').textContent=win?'GEFELICITEERD!':n.end==='finish'?'FINISH BEREIKT':'EINDE VAN DIT SPOOR';$('#sg-choice-note').textContent=win?'Je hebt beide doelen gehaald!':n.end==='finish'?'De casus is geslaagd, maar je hebt nog niet alle acht begrippen.':'Deze keuze heeft het skatepark niet dichterbij gebracht.';
 end.textContent=win?'🏆 Gewonnen! Je bereikte de finish én legde alle 8 sociale kwaliteit-kaartjes op het bord.':n.end==='finish'?`Je verzamelde ${found.size} van 8 begrippen. Ga met een joker terug en probeer een andere aanpak.`:'Gebruik een joker om terug te gaan naar een eerdere speelkaart en een nieuwe keuze te maken.';
 if(state.jokers>0&&!win)end.append(makeButton('🃏 Kies een eerdere speelkaart','sg-actionbtn',useJoker));else if(!win)end.append(makeButton('↻ Begin opnieuw','sg-actionbtn',reset));else end.append(makeButton('↻ Nog eens spelen','sg-actionbtn',reset));}
 save();resizeParent();
}
function choose(id){const from=state.current,card=GAME[from];if(!card.choices.some(x=>x[1]===id)||!GAME[id])return;lastEarned=GAME[id].cats.filter(k=>!uniqueConcepts().has(k));cardBack=false;state.chosen[from]=[...(state.chosen[from]||[]),id];state.current=id;state.trail.push(id);if(!state.seen.includes(id))state.seen.push(id);$('#sg-card-img').classList.remove('sg-card-swap');void $('#sg-card-img').offsetWidth;$('#sg-card-img').classList.add('sg-card-swap');render();if(id==='6'&&uniqueConcepts().size===8)showEndModal()}
function reset(){state=DEFAULT();lastEarned=[];cardBack=false;state.started=true;render();closeModal()}
function closeModal(){$('#sg-overlay').hidden=true;$('#sg-modal-body').replaceChildren();resizeParent()}
function openModal(title,content){$('#sg-modal-title').textContent=title;const holder=$('#sg-modal-body');holder.replaceChildren();if(typeof content==='string')holder.innerHTML=content;else holder.append(content);$('#sg-overlay').hidden=false;resizeParent();$('#sg-modal-close').focus()}
function showConcept(c){openModal(c[1],`<p>${c[3]}</p><p>In het spel herken je deze theorie door na elke interventie de bijbehorende sociale-kwaliteitkaart te bekijken en op het bord te leggen.</p>`)}
function useJoker(){if(state.jokers<1)return;const list=state.seen.filter(id=>id!==state.current&&GAME[id]?.choices?.length);const wrap=document.createElement('div');const intro=document.createElement('p');intro.textContent='Kies een eerder gespeelde kaart en maak vanaf daar een andere keuze. De eerder verzamelde begrippen blijven op het spelbord staan. Je hebt nog '+state.jokers+' joker(s).';wrap.append(intro);
 list.forEach(id=>{const b=makeButton('KAART '+id+' — '+GAME[id].title,'sg-historybutton',()=>{state.jokers--;state.current=id;lastEarned=[];cardBack=false;state.trail.push('↶ '+id);closeModal();render()});wrap.append(b)});if(!list.length){const p=document.createElement('p');p.textContent='Er zijn nog geen eerdere keuzekaarten.';wrap.append(p)}openModal('🃏 JOKER INZETTEN',wrap)}
function showCard(){const el=document.createElement('div');const image=document.createElement('img');image.className='sg-dialog-card';image.alt='Volledige oorspronkelijke speelkaart '+state.current;image.src=asset('cards/'+state.current+(cardBack?'-back.webp':'-front.webp'));image.dataset.back=cardBack?'1':'0';el.append(image);const row=document.createElement('div');row.className='sg-dialog-actions';row.append(makeButton('Achterkant bekijken','sg-actionbtn secondary',()=>{const flipped=image.dataset.back==='1';image.dataset.back=flipped?'0':'1';image.src=asset('cards/'+state.current+(flipped?'-front.webp':'-back.webp'));row.firstChild.textContent=flipped?'Achterkant bekijken':'Voorkant bekijken'}));el.append(row);openModal('SPEELKAART '+state.current,el)}
function rules(){openModal('HOE WERKT SOCIALITY?',`<p><strong>Sociality is een samenwerkingsspel.</strong> Een groep bespreekt praktische casussen en kiest op basis van consensus een interventie.</p><ol><li>Lees kaart 1 en kies 1A of 1B.</li><li>Volg de instructies van de gekozen kaart. De bijbehorende drie begrippen worden op het spelbord verzameld.</li><li>De pion volgt het nummer van de kaart; bij iedere nieuwe kaart maak je opnieuw een keuze.</li><li>Je wint alleen als je kaart 6 bereikt <strong>én alle 8 sociale kwaliteit-kaartjes</strong> verzameld hebt.</li><li>Als een route eindigt of je bij de finish niet alle 8 begrippen hebt, kun je een van je <strong>twee jokers</strong> gebruiken om op een eerder gespeelde kaart opnieuw te beginnen.</li></ol><p>De game gebruikt geen dobbelsteen, geld of afzonderlijke winnaars: die horen niet bij het originele Sociality-spel.</p>`)}
function showEndModal(){openModal('🎉 HET SKATEPARK IS EEN SUCCES!',`<div class="sg-modal-score">8 / 8 ♥</div><p><strong>Gefeliciteerd!</strong> Je hebt de finish bereikt en alle acht sociale kwaliteit-begrippen verzameld. Je hebt de praktische en theoretische doelen behaald.</p>`)}
function start(){openModal('WELKOM BIJ SOCIALITY',(()=>{const c=document.createElement('div');const title=document.createElement('h3');title.className='sg-intro-title';title.textContent='Eén buurt. Veel keuzes. Wat doe jij?';c.append(title);const desc=document.createElement('p');desc.textContent='Het skatepark is een oefencasus over samenwerking, inclusie en sociale kwaliteit. Speel alleen of bespreek de keuzes met anderen op één scherm. De originele kaarten en het originele bord zijn gebruikt.';c.append(desc);const p=document.createElement('p');p.innerHTML='<strong>Doel:</strong> bereik de finish en verzamel alle 8 sociale-kwaliteitbegrippen.';c.append(p);c.append(makeButton('▶ Begin het spel','sg-actionbtn',()=>{state.started=true;closeModal();render()}));return c})())}
function resizeParent(){if(window.parent===window)return;try{window.parent.postMessage({type:'sociality:resize',height:Math.ceil(document.documentElement.scrollHeight)},'*')}catch(e){}}
$('#sg-flip-inline').onclick=()=>{cardBack=!cardBack;render()};$('#sg-card-view').onclick=showCard;$('#sg-rules').onclick=rules;$('#sg-use-joker').onclick=useJoker;
$('#sg-restart').onclick=()=>{const c=document.createElement('div');const p=document.createElement('p');p.textContent='Je huidige voortgang gaat verloren. Wil je opnieuw beginnen bij kaart 1?';c.append(p);c.append(makeButton('Ja, opnieuw beginnen','sg-actionbtn',reset));openModal('OPNIEUW BEGINNEN?',c)};
$('#sg-modal-close').onclick=closeModal;$('#sg-overlay').addEventListener('click',e=>{if(e.target===$('#sg-overlay'))closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#sg-overlay').hidden)closeModal()});
render();if(!state.started)start();
if('ResizeObserver'in window){const observer=new ResizeObserver(resizeParent);observer.observe(document.body)}window.addEventListener('load',resizeParent);window.addEventListener('resize',resizeParent);
})();
