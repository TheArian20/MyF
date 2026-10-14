(() => {
  const gate = document.getElementById('date-gate');
  const universe = document.getElementById('private-universe');
  const form = document.getElementById('date-key');
  const status = document.getElementById('gate-status');
  function unlock() {
    gate.hidden = true; universe.hidden = false;
    universe.classList.add('entry-animation');
    window.scrollTo({top:0,behavior:'instant'});
    document.querySelector('.hero h1').focus({preventScroll:true});
    window.dispatchEvent(new Event('resize'));
    status.textContent = '';
    form.reset();
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const day = document.getElementById('key-day').value.trim();
    const month = document.getElementById('key-month').value.trim();
    const year = document.getElementById('key-year').value.trim();
    if (/^0?5$/.test(day) && /^0?2$/.test(month) && year === '2024') unlock();
    else { status.textContent = 'Esa no es nuestra fecha. Piensa en el día en que nos conocimos. ♡'; document.getElementById('key-day').focus(); }
  });
  document.getElementById('lock-universe').addEventListener('click', () => {
    document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
    universe.hidden = true; gate.hidden = false; universe.classList.remove('entry-animation');
    window.scrollTo({top:0,behavior:'instant'});
    document.getElementById('key-day').focus();
  });
  // La entrada vuelve a cerrarse al recargar: no se guarda la llave.
  window.addEventListener('pageshow',event=>{if(event.persisted){universe.hidden=true;gate.hidden=false;}});
  const messageDialog = document.getElementById('message-dialog');
  const messages = {
    beginning: ['✧','El comienzo','El 5 de febrero de 2024 tiene su propia estrella. El día en que nuestros caminos se encontraron.'],
    moon: ['☾','La luna','Hay personas que hacen que incluso una noche cualquiera se sienta un poco más bonita.'],
    star: ['✦','Mi estrella favorita','Fernanda, entre todas las luces de este pequeño cielo, la tuya tiene un lugar especial.'],
    bow: ['♡','Los pequeños detalles','Un lazo de Hello Kitty, tu personaje favorito, una foto tuya. Cosas sencillas que hacen que este lugar sea tan tuyo.'],
    tomorrow: ['∞','Lo que viene','Que sigamos encontrando momentos que merezcan guardarse entre las estrellas.'],
    smile: ['☀','Para un día gris','Respira un poquito. No necesitas tener todo resuelto hoy. Mereces calma, cariño y una razón para sonreír.'],
    miss: ['☾','Cuando me extrañes','Este rincón sigue aquí, a una fecha de distancia. Abre nuestra carta y recuerda que lo bonito también vive en los pequeños detalles.'],
    dream: ['✧','Para cuando sueñes en grande','Ojalá no dejes de buscar las cosas que te hacen brillar. Hay un universo de posibilidades esperando por ti.']
  };
  function openMessage(key) {
    const [icon,title,body] = messages[key];
    document.getElementById('message-icon').textContent=icon;
    document.getElementById('message-title').textContent=title;
    document.getElementById('message-body').textContent=body;
    messageDialog.showModal();
  }
  const visited = new Set();
  document.querySelectorAll('[data-star]').forEach(button=>button.addEventListener('click',()=>{
    const key=button.dataset.star;visited.add(key);button.classList.add('visited');
    document.getElementById('constellation-progress').textContent=`${visited.size} de 5 estrellas descubiertas`;
    document.getElementById('discovery').hidden=visited.size!==5;
    openMessage(key);
  }));
  document.querySelectorAll('[data-message]').forEach(button=>button.addEventListener('click',()=>openMessage(button.dataset.message)));
  const storageKey='mf-wishes-v1';
  let wishes=[];
  try {const stored=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(stored))wishes=stored.filter(w=>typeof w==='string').map(w=>w.slice(0,180)).slice(0,30);} catch {}
  const list=document.getElementById('saved-wishes');
  function renderWishes(){
    list.replaceChildren();document.getElementById('wish-empty').hidden=wishes.length>0;
    wishes.forEach((wish,index)=>{
      const item=document.createElement('li'),text=document.createElement('span'),remove=document.createElement('button');
      text.textContent='✧ '+wish;remove.textContent='×';remove.type='button';remove.setAttribute('aria-label','Eliminar deseo: '+wish);
      remove.addEventListener('click',()=>{wishes.splice(index,1);persistWishes();renderWishes();});
      item.append(text,remove);list.append(item);
    });
  }
  function persistWishes(){try{localStorage.setItem(storageKey,JSON.stringify(wishes));return true;}catch{return false;}}
  document.getElementById('wish-form').addEventListener('submit',event=>{
    event.preventDefault();const input=document.getElementById('personal-wish'),text=input.value.trim();
    if(!text)return;
    // Número de WhatsApp indicado por el propietario.
    const recipient = '5216633305059';
    const whatsappUrl = `https://wa.me/${recipient}?text=${encodeURIComponent(text)}`;
    wishes.unshift(text.slice(0,180));wishes=wishes.slice(0,30);
    persistWishes();renderWishes();
    document.getElementById('save-status').textContent='Tu deseo está listo en WhatsApp. Pulsa Enviar allí para compartirlo.';
    window.location.assign(whatsappUrl);
  });
  renderWishes();
})();
