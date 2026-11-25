(() => {
  const q=s=>document.querySelector(s);
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const coarsePointer=matchMedia('(pointer:coarse)');
  const connection=navigator.connection;
  const memoryTurn=q('.memory-turn'), attentionPage=q('.attention-page'), attentionMark=q('#attention');
  const shutters=[...document.querySelectorAll('.highlight-words span')];
  const memoryPapers=[...memoryTurn.querySelectorAll('.memory-paper')];
  const clamp=x=>Math.max(0,Math.min(1,x));
  const mix=(a,b,t)=>a+(b-a)*t;
  function ease(from,to,value){
    const t=clamp((value-from)/(to-from));
    return t*t*(3-2*t);
  }
  let mastHeight=0,frame=0;
  const album=q('.album-viewport'), years=q('.years-stage');
  const calendarLayers=Array.from(years.querySelectorAll('.year-photos > div'));
  const yearVideos=calendarLayers.map(layer=>layer.querySelector('video'));
  let activeYearVideo=null, yearSuspended=false;
  const editorial=[q('.photo-story'),q('.video-story'),q('.years-flow'),memoryTurn];
  const filmStage=q('.film-stage'), filmRail=q('.film-viewport'), filmTitle=q('#videos-title');
  const photoStrip=trackStrip(album), videoStrip=trackStrip(filmRail);
  const lanes=Array.from(filmRail.querySelectorAll('.film-column'),column=>[...column.children]);
  let sceneBounds=[], filmPinned=false, memoryPinned=false, lastFilmTime=null, idleTurns=0;
  document.documentElement.classList.add('with-reels');

  function trackStrip(rail){
    let width=0, previous=null, written=0, anchor=0, anchorLeft=0;
    let drag=null;
    rail.addEventListener('pointerdown',event=>{
      drag=coarsePointer.matches && event.pointerType==='touch' && event.isPrimary
        ? {id:event.pointerId,x:event.clientX,y:event.clientY,left:rail.scrollLeft,horizontal:false}
        : null;
    },{passive:true});
    rail.addEventListener('pointermove',event=>{
      if(!drag || event.pointerId!==drag.id)return;
      const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
      if(!drag.horizontal){
        if(Math.max(Math.abs(dx),Math.abs(dy))<8)return;
        if(Math.abs(dx)<1.5*Math.abs(dy)){drag=null;return}
        drag.horizontal=true;
      }
      rail.scrollLeft=drag.left-dx;
    },{passive:true});
    function finishDrag(){drag=null}
    rail.addEventListener('pointercancel',finishDrag);
    rail.addEventListener('pointerup',finishDrag);
    rail.addEventListener('keydown',event=>{
      if(!coarsePointer.matches || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)return;
      if(event.key!=='ArrowLeft' && event.key!=='ArrowRight')return;
      event.preventDefault();
      rail.scrollLeft+=(event.key==='ArrowLeft'?-1:1)*40;
    });
    function reset(){previous=null;anchor=0;anchorLeft=0}
    return {
      measure(){
        const extent=Math.max(0,rail.scrollWidth-rail.clientWidth);
        if(width!==extent){width=extent;reset()}
        return width;
      },
      reset,
      move(progress){
        if(progress===previous)return false;
        if(previous!==null && Math.abs(rail.scrollLeft-written)>1){
          anchor=previous;anchorLeft=rail.scrollLeft;
        }
        let left=progress*width;
        if(progress>anchor && anchor<1)left=mix(anchorLeft,width,(progress-anchor)/(1-anchor));
        else if(anchor>0)left=anchorLeft*progress/anchor;
        rail.scrollLeft=left;written=rail.scrollLeft;previous=progress;
        if(progress===0 || progress===1){anchor=0;anchorLeft=0}
        return true;
      }
    };
  }

  function positionEditorial(y){
    if(reduced.matches)return;
    const [photos,film,calendar,ending]=sceneBounds;
    const photoProgress=clamp((y-photos.start)/photos.travel);
    if(photoStrip.move(photoProgress))editorial[0].style.setProperty('--album',photoProgress);
    if(filmPinned)videoStrip.move(ease(.03,.97,(y-film.start)/film.travel));
    const year=clamp((y-calendar.start)/calendar.travel);
    if(year!==calendar.progress){
      const position=year*(calendarLayers.length-1);
      let counter=0;
      calendar.clip=null;
      for(let i=1;i<calendarLayers.length;i++){
        const reveal=ease(.25,.77,position-(i-1));
        counter+=reveal;
        
        const plane=ease(0,.52,reveal), image=ease(.48,1,reveal);
        
        if(plane>.6)calendar.clip=image>.35?yearVideos[i]:null;
        const layer=calendarLayers[i], leftDelay=i%2===0 ? .22 : 0, rightDelay=.22-leftDelay;
        layer.style.setProperty('--plane-left',100*(1-clamp(plane*1.22-leftDelay))+'%');
        layer.style.setProperty('--plane-right',100*(1-clamp(plane*1.22-rightDelay))+'%');
        layer.style.setProperty('--image-left',100*(1-clamp(image*1.22-leftDelay))+'%');
        layer.style.setProperty('--image-right',100*(1-clamp(image*1.22-rightDelay))+'%');
      }
      years.style.setProperty('--year-step',counter);
      calendar.progress=year;
    }
    if(memoryPinned){
      const progress=clamp((y-ending.start)/ending.travel);
      if(progress!==ending.progress){
        positionMemory(progress);
        ending.progress=progress;
      }
    }
  }

  function setYearVideo(video){
    if(document.hidden){
      if(!yearSuspended)activeYearVideo?.pause();
      yearSuspended=true;
      return;
    }
    const changed=video!==activeYearVideo;
    if(!changed && !yearSuspended)return;
    activeYearVideo?.pause();
    activeYearVideo=video;yearSuspended=false;
    if(!video)return;
    if(changed){
      video.classList.remove('has-frame');
      if(!video.hasAttribute('src'))video.src=video.dataset.src;
      else if(video.currentTime>0)video.currentTime=0;
    }else if(video.ended)return;
    video.play().catch(()=>{if(video===activeYearVideo && video.paused)video.classList.remove('has-frame')});
  }
  for(const video of yearVideos.filter(Boolean)){
    video.addEventListener('playing',()=>{
      const reveal=()=>{if(video===activeYearVideo && !video.paused)video.classList.add('has-frame')};
      if(video.requestVideoFrameCallback)video.requestVideoFrameCallback(reveal);
      else reveal();
    });
    video.addEventListener('error',()=>video.classList.remove('has-frame'));
  }

  function positionMemory(progress){
    const paper=ease(.31,.51,progress), personal=ease(.73,.87,progress);
    const style=memoryTurn.style;
    style.setProperty('--paper-cut',(100*(1-paper))+'%');
    style.setProperty('--title-drop',(12*(1-paper))+'%');
    style.setProperty('--leave',(-10*paper)+'%');
    style.setProperty('--zoom-away',1+.055*ease(.02,.43,progress));
    
    style.setProperty('--back-photo',progress>=.50?'1':'0');
    style.setProperty('--zoom-back',1+.06*(1-ease(.60,.93,progress)));
    style.setProperty('--daily',1-ease(.68,.74,progress));
    style.setProperty('--personal',personal);
    style.setProperty('--copy-drop',(15*(1-personal))+'%');
    shutters.forEach((strip,i)=>{
      const delay=i*.036;
      const enter=ease(.12+delay,.35+delay,progress);
      const exit=ease(.61+delay,.78+delay,progress);
      strip.style.setProperty('--shutter',((i%2?1:-1)*101*(1-enter-exit))+'%');
    });
  }

  function positionFilm(time,y){
    const film=sceneBounds[1];
    if(reduced.matches || document.hidden || y+innerHeight<=film.start || y>=film.start+film.height+mastHeight){
      lastFilmTime=null;
      return;
    }
    if(lastFilmTime!==null)idleTurns+=Math.min(64,time-lastFilmTime)/15000;
    lastFilmTime=time;
    const travel=clamp((y-film.start)/Math.max(film.travel,film.viewport*.60));
    if(travel!==film.turn){
      filmTitle.style.setProperty('--title-descent',ease(0,.85,travel).toFixed(5));
      film.turn=travel;
    }
    lanes.forEach((tiles,column)=>{
      const phase=(column%2?1:-1)*(travel*2.4+idleTurns);
      tiles.forEach((tile,i)=>{
        
        const slot=((i+phase+1)%tiles.length+tiles.length)%tiles.length-1;
        tile.style.setProperty('--slot',slot.toFixed(5));
      });
    });
    queue();
  }

  function queue(){if(!frame)frame=requestAnimationFrame(draw)}
  function measure(){
    mastHeight=q('.mast').offsetHeight;
    const pageY=scrollY;
    const stageHeight=parseFloat(getComputedStyle(filmStage).minHeight);
    photoStrip.measure();videoStrip.measure();
    filmPinned=!reduced.matches && filmStage.offsetHeight<=stageHeight+1;
    editorial[1].classList.toggle('has-film-run',filmPinned);
    memoryPinned=!reduced.matches && stageHeight>=235;
    memoryTurn.classList.toggle('has-memory-turn',memoryPinned);
    if(memoryPinned && memoryPapers.some(paper=>paper.scrollHeight>paper.clientHeight+2)){
      memoryPinned=false;
      memoryTurn.classList.remove('has-memory-turn');
    }
    const anchorParent=memoryPinned?memoryTurn:attentionPage;
    if(attentionMark.parentNode!==anchorParent)anchorParent.prepend(attentionMark);
    sceneBounds=editorial.map(section=>{
      const box=section.getBoundingClientRect();
      return {start:pageY+box.top-mastHeight,height:box.height,viewport:stageHeight,travel:Math.max(1,box.height-stageHeight)};
    });
    queue();
  }
  function draw(time){
    frame=0;
    positionEditorial(scrollY);
    const calendar=sceneBounds[2];
    const inView=scrollY+innerHeight>calendar.start+mastHeight && scrollY<calendar.start+calendar.height;
    setYearVideo(inView && !reduced.matches && !connection?.saveData ? calendar.clip : null);
    positionFilm(time,scrollY);
  }

  const clips=Array.from(filmRail.querySelectorAll('video'));
  const visible=new Set(), running=new Set(), failed=new Set();
  function syncClips(){
    const allowed=!document.hidden && !reduced.matches && !connection?.saveData;
    for(const clip of running){
      if(allowed && visible.has(clip))continue;
      running.delete(clip);clip.pause();
      if(!allowed)clip.parentElement.classList.remove('has-frame');
    }
    if(!allowed)return;
    for(const clip of visible){
      if(running.has(clip) || failed.has(clip))continue;
      running.add(clip);
      if(!clip.hasAttribute('src'))clip.src=clip.dataset.src;
      clip.play().catch(error=>{
        if(error.name==='AbortError' || !running.has(clip))return;
        running.delete(clip);failed.add(clip);
      });
    }
  }
  const clipObserver=new IntersectionObserver(entries=>{
    for(const {target,isIntersecting} of entries){
      if(isIntersecting)visible.add(target);
      else {visible.delete(target);failed.delete(target)}
    }
    syncClips();
  });
  for(const clip of clips){
    clipObserver.observe(clip);
    clip.addEventListener('playing',()=>clip.parentElement.classList.add('has-frame'));
    clip.addEventListener('error',()=>{
      clip.parentElement.classList.remove('has-frame');
      running.delete(clip);failed.add(clip);
    });
  }
  function refreshMedia(){
    if(reduced.matches || connection?.saveData){
      setYearVideo(null);
      for(const video of yearVideos)video?.classList.remove('has-frame');
    }
    syncClips();queue();
  }
  connection?.addEventListener('change',refreshMedia);
  addEventListener('scroll',queue,{passive:true});addEventListener('resize',measure);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)setYearVideo(activeYearVideo);failed.clear();syncClips();queue()});
  reduced.addEventListener('change',()=>{photoStrip.reset();videoStrip.reset();refreshMedia();measure()});
  const size=new ResizeObserver(measure);size.observe(q('.experience-cut'));size.observe(q('.archive-intro'));editorial.forEach(s=>size.observe(s));
  document.fonts.ready.then(measure);measure();
})();
