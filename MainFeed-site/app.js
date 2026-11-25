(() => {
  const $ = selector => document.querySelector(selector);
  const all = selector => [...document.querySelectorAll(selector)];
  const clamp = n => Math.min(1, Math.max(0,n));
  const mix = (a,b,t) => a+(b-a)*t;
  const ramp = (start,end,n) => {
    const t=clamp((n-start)/(end-start));
    return t*t*(3-2*t);
  };
  function color(a,b,t){
    return a.map((v,k)=>Math.round(mix(v,b[k],t)));
  }
  function expose(el,amount){
    el.style.visibility=amount>.001?'visible':'hidden';
    el.style.opacity=amount;
    el.inert=amount<.5;
  }
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const compactMotion=matchMedia('(pointer:coarse), (max-width:900px) and (orientation:portrait)');
  const portrait=matchMedia('(max-width:900px) and (orientation:portrait)');
  const shortTouchScreen=matchMedia('(pointer:coarse) and (orientation:landscape) and (max-height:540px)');
  const field=$('.optical-field'), optical=MemoryOptics.create(field);
  const heroGlass=MemoryOptics.mountHero($('.hero-glass'));
  const rail=$('.journey'), stage=$('.stage'), cue=$('.stage .scroll-cue'), mast=$('.mast');
  const chapters=all('.chapter').map(box=>({box,lines:[...box.querySelectorAll('h1>span,h2>span')],label:box.querySelector('.section-label'),body:box.querySelector('.body-copy')}));
  const openingTitle=$('#product-title');
  const device=$('.hardware'), screen=$('.device-content'), demo=CameraRoll.mount(screen);
  const strip=$('.negative-strip'), word=chapters[0].lines[1];
  const sequence=$('.experience-cut'), archive=$('.archive-landing'), intro=$('.archive-intro');
  const lake=$('.lake-photo'), frame=$('.lake-frame');
  const lakeImage=frame.querySelector('img[data-src]');
  let transfer=false, destination, screenW,screenH,lastTransfer=-1;
  let studioTimer=0,studioTime=0,origamiTurn=0,previousStudioTime=null;
  const ownership=$('.ownership'), coverSlot=$('.poster-cover-slot');
  const cover=PhotoCover.mount(ownership,$('.front-cover'),$('.shutter-wash'),motion,request);
  const posterStage=$('.ownership-stage'), spreads=all('.memory-spread');
  let coverStart=0, coverTravel=0, posterTravel=1, lastPoster=-1;

  const warmPosters=new IntersectionObserver(([entry])=>{
    if(!entry.isIntersecting)return;
    ownership.querySelectorAll('img').forEach(img=>{img.loading='eager'});
    warmPosters.disconnect();
  },{rootMargin:'125% 0px'});
  warmPosters.observe(ownership);
  let w,h,usable,top,distance,phoneW,phoneH;
  let openingArtTop=0,openingArtBottom=0,openingOverflow=0;
  let textBottoms=[],selected=null, actionStart=null, heldAction=null;
  let actionFrom=.45, actionTo=1, feedTimer=0, hiddenAt=null;
  const durations={order:7300,share:4800,delete:4300,album:7300};
  const buttons=all('.action-choices button'), actionCopy=$('#choice-copy');
  const defaultCopy=actionCopy.textContent;
  const explanations={order:'Discover forgotten memories.',share:'Share your favorite moments.',delete:'Delete what you don’t need.',album:'Give a new album a name and save it to your collection.'};
  let tick=0,chapter=-1;
  const studioStop=parseFloat($('#studio').style.getPropertyValue('--at'));
  const captureStop=parseFloat($('#capture').style.getPropertyValue('--at'));
  const swipeCaption=$('.swipe-caption');
  const captions=Array.from(swipeCaption.children);
  let captionIndex=0, captionTimer=0, captionInView=false;
  function showCaption(index){
    captions[captionIndex].setAttribute('aria-hidden','true');
    captions[index].removeAttribute('aria-hidden');
    captionIndex=index;
  }
  function syncCaptionClock(){
    const active=captionInView && chapter===1 && !chapters[0].box.inert && !document.hidden && !motion.matches;
    if(active===Boolean(captionTimer))return;
    swipeCaption.classList.toggle('is-cycling',active);
    if(active){
      
      captionTimer=setInterval(()=>showCaption((captionIndex+1)%captions.length),5400);
    }else{
      clearInterval(captionTimer);
      captionTimer=0;
    }
  }
  new IntersectionObserver(([entry])=>{
    captionInView=entry.intersectionRatio>=.5;
    syncCaptionClock();
  },{threshold:.5}).observe(swipeCaption);
  let lastDevice=-1,lastField='';
  function positionPosters(progress){
    if(progress===lastPoster)return;
    lastPoster=progress;
    spreads.forEach((spread,index)=>{
      const start=[0,.15,.57][index];
      const paper=index?ramp(start,start+.24,progress):1;
      const image=index?ramp(start+.045,start+.30,progress):1;
      const drift=ramp(Math.max(0,start-.10),Math.min(1,start+.57),progress);
      spread.style.setProperty('--paper-y',((1-paper)*100).toFixed(2)+'%');
      spread.style.setProperty('--photo-y',((1-image)*100).toFixed(2)+'%');
      spread.style.setProperty('--image-drift',((.5-drift)*6.8).toFixed(2)+'%');
      spread.style.setProperty('--letters-y',((1-paper)*h*.055-drift*h*.026).toFixed(2)+'px');
      spread.style.setProperty('--noun-x',(drift*w*.019).toFixed(2)+'px');
      spread.style.setProperty('--turn',(drift*22).toFixed(2)+'deg');
    });
  }
  function measure(){
    const width=stage.clientWidth, height=stage.clientHeight;
    if(width!==w || height!==h)cover.reset();
    transfer=!motion.matches && intro.offsetHeight<=height+1;
    sequence.classList.toggle('has-transfer',transfer);
    const bounds=lake.getBoundingClientRect(), origin=intro.getBoundingClientRect();
    destination={x:bounds.x-origin.x,y:bounds.y-origin.y,width:bounds.width,height:bounds.height};
    screenW=screen.offsetWidth;screenH=screen.offsetHeight;lastTransfer=-1;
    const start=rail.getBoundingClientRect().top+scrollY-mast.offsetHeight;
    const run=Math.max(1,rail.offsetHeight-height);
    coverStart=ownership.getBoundingClientRect().top+scrollY-mast.offsetHeight;
    coverTravel=coverSlot.offsetHeight;
    posterTravel=Math.max(1,ownership.offsetHeight-posterStage.offsetHeight-coverTravel-cover.held);
    lastPoster=-1;
    w=width;h=height;usable=h-cue.offsetHeight;top=start;distance=run;
    textBottoms=chapters.map(({box})=>box.offsetTop+box.offsetHeight);
    if(portrait.matches){
      const {box,body}=chapters[0];
      openingArtTop=box.offsetTop+openingTitle.offsetTop+openingTitle.offsetHeight;
      openingArtBottom=box.offsetTop+body.offsetTop;
      openingOverflow=Math.max(0,box.offsetTop+box.offsetHeight+parseFloat(getComputedStyle(box).bottom)-h);
    }
    phoneW=device.offsetWidth;phoneH=device.offsetHeight;
    optical.resize(w,h);heroGlass.resize(w,h);lastField='';request();
  }
  function request(){if(!tick)tick=requestAnimationFrame(paint)}
  function chapterFraction(y){
    const fraction=clamp((y-top)/distance);
    if(Math.abs(fraction-studioStop)*distance<=1)return studioStop;
    if(Math.abs(fraction-captureStop)*distance<=1)return captureStop;
    return fraction;
  }
  function placement(el,x,y,angle,size,width,height){
    el.style.transform='translate3d('+(x-width/2)+'px,'+(y-height/2)+'px,0) rotate('+angle+'deg) scale('+size+')';
  }
  function paintFinale(y,time){
    const offset=y-coverStart;
    const posterOffset=cover.seek(offset,coverTravel,time);
    if(!motion.matches && offset>=-innerHeight && offset<ownership.offsetHeight){
      positionPosters(clamp(posterOffset/posterTravel));
    }
  }
  function sceneText(item,enter,exit,dir,small,still,drift){
    const opacity=enter*(1-exit);
    expose(item.box,opacity);
    if(!opacity)return;
    const step=still?0:(1-enter)-exit;
    item.lines.forEach((line,k)=>{
      const sign=k%2?-1:1;
      const dx=dir*step*(small?w*.26:w*.32)*(k%2?.66:1)+(still?0:drift)*(small?0:sign*w*.024);
      line.style.transform='translate3d('+dx+'px,'+(step*(k+1)*9)+'px,0) skewY('+(sign*step*5)+'deg)';
    });
    item.label.style.transform='translateX('+(dir*step*32)+'px)';
    item.body.style.transform='translateY('+(step*22)+'px)';
  }
  function positionNegative(scatter,small){
    if(scatter>=.32){strip.style.visibility='hidden';word.style.removeProperty('--word-ink');return}

    const glyph=word.getBoundingClientRect(), page=stage.getBoundingClientRect();
    const y=glyph.top-page.top, bottom=y+glyph.height;
    let outline;
    if(small || shortTouchScreen.matches){
      
      const end=glyph.right-page.left+glyph.height*.66;
      const base=bottom+glyph.height*.065;
      outline=[[0,y],[end,y],[end-glyph.height*.38,base],[0,base]];
    }else{
      const step=Math.max(w*.46,glyph.right-page.left+w*.035);
      const knee=w*.68, edge=w*.948, shelf=y-h*.105;
      const thickness=glyph.height*.90;
      outline=[[0,y],[step,y],[step,shelf],[edge,shelf],[edge,shelf+thickness],[knee,shelf+thickness],[knee,bottom],[0,bottom]];
    }
    strip.style.clipPath='polygon('+outline.map(([x,y])=>x+'px '+y+'px').join(',')+')';
    const opacity=1-ramp(.035,.32,scatter);
    strip.style.visibility='visible';strip.style.opacity=opacity;
    word.style.setProperty('--word-ink',opacity>.52?'#fff4df':'#261627');
  }
  function positionMemory(reveal,travel,x,y,scale){
    if(!transfer){
      if(lastTransfer===0)return;
      archive.removeAttribute('style');frame.removeAttribute('style');
      archive.classList.remove('is-open');archive.inert=false;lastTransfer=0;
      return;
    }
    if(reveal===0 || travel===1){
      if(lastTransfer===(reveal===0?0:1))return;
    }
    lastTransfer=reveal===0?0:travel===1?1:-1;
    archive.inert=travel<.92;
    archive.classList.toggle('is-open',!archive.inert);
    archive.style.visibility=reveal>0?'visible':'hidden';
    if(!reveal)return;
    const paper=ramp(.07,.88,travel),ink=ramp(.39,.91,travel);
    archive.style.setProperty('--paper-in',paper);
    archive.style.setProperty('--heading-in',ink);
    archive.style.setProperty('--heading-lift',((1-ink)*h*(portrait.matches?-.043:.065))+'px');

    const sw=screenW*scale,sh=screenH*scale;
    const width=mix(sw,destination.width,travel),height=mix(sh,destination.height,travel);
    const left=mix(x-sw/2,destination.x,travel),upper=mix(y-sh/2,destination.y,travel);
    frame.style.width=width+'px';frame.style.height=height+'px';
    frame.style.transform='translate3d('+(left-destination.x)+'px,'+(upper-destination.y)+'px,0)';
    frame.style.borderRadius=sw*.14*(1-travel)+'px / '+sh*.064*(1-travel)+'px';
    frame.style.opacity=travel>0?'1':'0';
  }
  function setChapter(index){
    if(index===chapter)return;
    const browsing=(chapter===1 || chapter===2) && selected===null;
    chapter=index;stage.dataset.chapter=index;
    if(index===3){
      stopFeedClock();actionStart=null;heldAction=null;lastDevice=-1;
      selectAction(null);demo.begin('closing');
    }else if(!browsing){
      startFeed();
    }
  }
  function paint(time){
    tick=0;

    if(lakeImage.hidden && scrollY>=top+distance*.4 && scrollY<=top+distance+3*h){
      lakeImage.src=lakeImage.dataset.src;
      lakeImage.hidden=false;
    }
    paintFinale(scrollY,time);
    if(scrollY+innerHeight<top || scrollY>=top+distance+h){
      heroGlass.hide();previousStudioTime=null;
      const after=scrollY>=top+distance;
      stage.inert=after;
      positionMemory(Number(after),Number(after),0,0,1);
      if(after && (chapter===1 || chapter===2))setChapter(3);
      stopFeedClock();
      mast.style.backgroundColor='var(--paper)';
      return;
    }
    const still=motion.matches, small=portrait.matches;
    const fraction=chapterFraction(scrollY);
    const compact=compactMotion.matches;
    
    const openingLift=small?Math.min(openingOverflow,fraction*distance):0;
    if(small){
      stage.style.setProperty('--opening-lift',-openingLift+'px');
      stage.style.setProperty('--cue-offset',openingOverflow-openingLift+'px');
    }

    let p=mix(.325,1,fraction);
    if(compact){
      if(fraction<.5)p=mix(.449,.6,fraction/.5);
      else if(fraction<.81)p=mix(.6,.86,(fraction-.5)/.31);
      else p=mix(.86,1,(fraction-.81)/.19);
    }
    const index=p<.55?1:p<.8?2:3;
    setChapter(index);
    startFeedClock();
    const pos=still?[0,.40,.70,1][index]:p;
    const unfold=clamp(fraction/studioStop);
    const openingPos=still?pos:mix(.449,.6,unfold);
    const exit=clamp((fraction-captureStop)/(1-captureStop));
    const travel=transfer?mix(exit,ramp(0,1,exit),.48):0;
    stage.style.setProperty('--camera-ink',transfer?1-ramp(0,.22,exit):1);
    stage.inert=transfer && travel>=.94;
    const cross=ramp(.449,.6,openingPos);
    const turn=clamp((fraction-studioStop)/(captureStop-studioStop));
    const end=still ? Number(index===3) : mix(turn,ramp(0,1,turn),.34)+.38*turn*(1-turn);
    sceneText(chapters[0],1,ramp(.456,.523,openingPos),-1,small,still,ramp(.34,.48,pos));
    syncCaptionClock();
    sceneText(chapters[1],ramp(.513,.598,openingPos),end,1,small,still,ramp(.63,.75,pos));
    sceneText(chapters[2],end,ramp(.015,.39,travel),-1,small,still,ramp(.85,.99,pos));
    const scatter=still?Number(index!==1):unfold;
    
    const flight=clamp(scatter+.27*ramp(.40,.78,scatter));
    positionNegative(scatter,small);
    let bg=color([224,206,222],[190,229,207],cross);
    bg=color(bg,[221,205,247],end);
    const ground='rgb('+bg.join(',')+')';
    mast.style.backgroundColor='rgb('+color(color([243,240,231],bg,scatter),[243,240,231],travel).join(',')+')';
    expose(cue,1-ramp(.008,.075,fraction-openingLift/distance));
    const baseR=small?Math.min(w*.43,usable*.248):Math.min(w*.228,usable*.435);
    const feedX=small?w/2:w*mix(.778,.704,scatter);
    const albumX=w*(small?.50:.292), finalX=w*(small?.732:.79);
    const deviceX=mix(mix(feedX,albumX,cross),finalX,end);
    const openingFloor=small?openingArtTop-openingLift:textBottoms[0];
    const textFloor=mix(mix(openingFloor,textBottoms[1],cross),textBottoms[2],end)+12;
    const artBottom=small?mix(openingArtBottom-openingLift,usable,cross):usable;
    const usablePhoneHeight=small?Math.max(80,artBottom-textFloor-16):phoneH;
    const fit=small?Math.min(1,usablePhoneHeight/phoneH):1;
    const deviceY=small?(textFloor+artBottom-12)*.5:usable*.505;
    const curl=end;
    const cy=deviceY+(small?0:usable*.015);
    const maxRadius=small?Math.max(48,Math.min(cy-textFloor,artBottom-cy)-2):baseR*1.04;
    const fanRadius=Math.min(baseR*1.12,maxRadius)*(.90+.1*cross);
    const flowerRadius=small?Math.min(w*.225,usablePhoneHeight*.32):Math.min(w*.111,usable*.198);
    const movingStudio=flight===1 && travel<.72 && !still && !document.hidden;
    if(movingStudio){
      if(previousStudioTime!==null){
        const seconds=Math.min(75,time-previousStudioTime)*.001;
        studioTime+=seconds;origamiTurn+=seconds*.38*curl;
      }
      previousStudioTime=time;
      if(!studioTimer)studioTimer=setTimeout(()=>{studioTimer=0;request()},32);
    }else previousStudioTime=null;
    const paper={
      cx:mix(w*(small?.455:.263),w*(small?.245:.547),curl),
      cy:mix(cy,deviceY+usable*(small?.045:.035),curl),
      radius:mix(fanRadius,flowerRadius,curl),curl,
      turn:-.26+.48*cross+.075*Math.sin(studioTime*.29),
      phase:3.1+3.8*cross+studioTime*.52,spin:still?.65:.65+origamiTurn
    };
    const renderKey=pos.toFixed(5)+'/'+Math.floor(studioTime*30);
    if(renderKey!==lastField){
      optical.render({...paper,bg:ground,opacity:flight===1?1-ramp(.03,.72,travel):0});
      lastField=renderKey;
    }
    if(flight<1){
      const radius=small?Math.min(w*.55,Math.max(52,(artBottom-textFloor)*.46)):Math.min(w*.249,usable*.467);
      heroGlass.show({still,travel:flight,fan:paper,cx:w*(small?.445:.666),cy:deviceY,radius});
    }else heroGlass.hide();

    const deviceScale=mix(1,small?.80:.84,end)*fit;
    expose(device,1-ramp(.02,.57,travel));
    device.inert=index===3;
    positionMemory(transfer && index===3?1:0,travel,deviceX,deviceY,deviceScale);
    const angle=still?0:-3.3*Math.sin(cross*Math.PI);
    placement(device,deviceX,deviceY,angle,deviceScale,phoneW,phoneH);
    
    let ui=0;
    let finished=false;
    if(index!==3 && heldAction!==null)ui=heldAction;
    if(index!==3 && actionStart!==null){
      const duration=durations[selected]*(actionTo-actionFrom)/.55;
      const beat=clamp((time-actionStart)/duration);
      ui=mix(actionFrom,actionTo,beat);
      if(beat===1)finished=true;else request();
    }
    const mode=index===3?'closing':selected || 'idle';
    if(mode==='closing')ui=still?1:ramp(.805,.86,pos);
    const key=ui+'/'+mode;
    if(key!==lastDevice){demo.seek(ui,mode);lastDevice=key}
    if(finished){startFeed();request()}
  }
  function stopFeedClock(){clearInterval(feedTimer);feedTimer=0}
  function startFeedClock(){
    
    const browsing=chapter===2 || (chapter===1 && !motion.matches);
    if(!browsing || selected!==null || document.hidden){
      if(feedTimer)stopFeedClock();
      return;
    }
    if(!feedTimer)feedTimer=setInterval(demo.advance,2000);
  }
  function startFeed(touched=false){
    stopFeedClock();actionStart=null;heldAction=null;lastDevice=-1;
    selectAction(null);demo.begin('idle',false,touched);
    startFeedClock();
  }
  function selectAction(mode){
    selected=mode;actionCopy.textContent=explanations[mode] || defaultCopy;
    buttons.forEach(option=>option.setAttribute('aria-pressed',String(option.dataset.mode===mode)));
  }
  function startAction(mode,hold=null,touched=false){
    stopFeedClock();
    selectAction(mode);demo.begin(mode,hold===null,touched);
    actionFrom=.45;actionTo=mode==='album' ? 1.08 : 1;
    actionStart=hold===null?performance.now():null;heldAction=hold;lastDevice=-1;measure();
  }
  buttons.forEach(button=>button.addEventListener('click',()=>startAction(button.dataset.mode)));
  device.addEventListener('phone-control',e=>{
    const {phoneAction,phoneFrame,phoneContinue}=e.detail;
    stopFeedClock();
    if(phoneAction){
      const hold={album:.56,share:.72,delete:.72};
      startAction(phoneAction,hold[phoneAction]??null,true);
    }else if(phoneContinue){
      actionFrom=Number(phoneContinue);actionTo=1;actionStart=performance.now();
      heldAction=null;lastDevice=-1;request();
    }else if(phoneFrame){
      if(Number(phoneFrame)===.45){startFeed(true);request();return}
      actionStart=null;heldAction=Number(phoneFrame);lastDevice=-1;request();
    }
  });
  addEventListener('scroll',request,{passive:true});
  document.addEventListener('visibilitychange',()=>{
    stopFeedClock();
    syncCaptionClock();
    if(document.hidden){heroGlass.hide();hiddenAt=performance.now();return}
    if(hiddenAt!==null && actionStart!==null)actionStart+=performance.now()-hiddenAt;
    hiddenAt=null;startFeedClock();request();
  });
  const resize=new ResizeObserver(measure);resize.observe(stage);resize.observe(coverSlot);resize.observe(ownership);resize.observe(document.body);
  resize.observe(openingTitle);resize.observe(chapters[0].body);resize.observe(swipeCaption);
  addEventListener('resize',measure);
  function refreshMotion(){
    stopFeedClock();
    syncCaptionClock();
    if(motion.matches && captionIndex!==0)showCaption(0);
    cover.reset();lastPoster=-1;
    measure();
  }
  motion.addEventListener('change',refreshMotion);refreshMotion();
})();
