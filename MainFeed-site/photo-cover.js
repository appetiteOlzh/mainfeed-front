const PhotoCover = {
  mount(ownership, sheet, wash, motion, request) {
    const image = sheet.querySelector('.cover-photo');
    const focus = image.querySelector('.focus-corners');
    const video = image.querySelector('video');
    const still = image.querySelector('img');
    const snapshot = ownership.querySelector('.selfie-snapshot');
    const printPhoto = ownership.querySelector('.spread-life img');
    const type = sheet.querySelector('.cover-type');
    const lines = [...type.querySelectorAll('h2 > span')];
    const proceed = sheet.querySelector('.scroll-cue');
    const portrait = matchMedia('(max-width:900px) and (orientation:portrait)');
    let previous=null, held=0, exposing=false, armed=false, lastPose=-1, lastShot=-Infinity;
    let playback='poster';
    function showVideoFrame(){
      if(playback==='play' && !video.paused)image.classList.add('has-frame');
    }
    video.addEventListener('playing',()=>{
      if(video.requestVideoFrameCallback)video.requestVideoFrameCallback(showVideoFrame);
      else showVideoFrame();
    });
    video.addEventListener('error',()=>image.classList.remove('has-frame'));
    function takePhoto(){
      if(image.classList.contains('has-frame') && video.readyState>=video.HAVE_CURRENT_DATA){
        snapshot.width=video.videoWidth;
        snapshot.height=video.videoHeight;
        const context=snapshot.getContext('2d',{alpha:false});
        if(context){
          context.drawImage(video,0,0);
          snapshot.hidden=false;
          return;
        }
      }
      printPhoto.src=still.currentSrc || still.src;
      snapshot.hidden=true;
    }
    function setPlayback(next){
      if(next===playback)return;
      playback=next;
      if(next==='play'){
        if(!video.ended)video.play().catch(()=>{
          if(playback==='play' && video.paused)image.classList.remove('has-frame');
        });
      }else{
        video.pause();
        if(next==='poster'){
          image.classList.remove('has-frame');
          if(video.readyState && video.currentTime)video.currentTime=0;
        }
      }
    }
    function syncSelfie(offset,travel){
      if(motion.matches || navigator.connection?.saveData || offset < -innerHeight*1.4 || offset>travel+innerHeight){
        setPlayback('poster');return;
      }
      if(document.hidden){setPlayback('hold');return}
      if(!video.hasAttribute('src')){
        video.preload='auto';video.src=video.dataset.src;
      }
      setPlayback(offset > -innerHeight*.42 && offset<travel ? 'play' : 'hold');
    }
    function reserve(pixels){
      if(held===pixels)return;
      held=pixels;
      ownership.style.setProperty('--flash-travel',pixels+'px');
    }
    function finish(){
      exposing=false;
      document.body.classList.remove('shutter-active');
    }
    function reset(){
      finish();reserve(0);previous=null;armed=false;lastPose=-1;
    }
    function pose(t){
      if(t===lastPose)return;
      lastPose=t;
      const n=t*t*(3-2*t),mobile=portrait.matches;
      image.style.transform=mobile
        ? 'translateY('+(-37*n)+'%) scale('+(1+.12*n)+')'
        : 'translateX('+(-51*n)+'%) scale('+(1+.08*n)+')';
      focus.style.inset=(12+15*n)+'% '+(8+16*n)+'%';
      lines.forEach((line,i)=>{
        line.style.translate=(-n*(18+16*i))+'% 0';
      });
      type.style.opacity=Math.max(0,1-n*1.35);
      proceed.style.opacity=1-Math.min(1,n*3);
      proceed.inert=t>.5;
    }
    wash.addEventListener('animationend',()=>{if(exposing){finish();request()}});
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden){if(playback==='play')setPlayback('hold');finish();armed=false;previous=null}
      else request();
    });
    document.addEventListener('click',event=>{
      const link=event.target.closest?.('a[href]');
      if(link && link!==proceed){armed=false;finish()}
    },true);
    addEventListener('keydown',event=>{
      if(event.key==='Home'||event.key==='End'){armed=false;finish()}
    });
    return {reset,get held(){return held},seek(offset,travel,time){
      if(motion.matches){
        setPlayback('poster');
        snapshot.hidden=true;
        if(printPhoto.src!==still.src)printPhoto.src=still.src;
        sheet.hidden=false;sheet.inert=false;pose(0);
        return 0;
      }

      const beyond=Math.ceil(offset-travel);
      if(offset<0 || beyond>ownership.offsetHeight){
        syncSelfie(offset,travel);
        if(exposing)finish();
        if(offset<0)reserve(0);
        sheet.hidden=offset>=0;sheet.inert=offset>=0;pose(0);
        previous=null;armed=false;
        return Math.max(0,beyond-held);
      }
      if(beyond<0){
        if(exposing)finish();
        reserve(0);
        if(offset<travel*.93)armed=true;
      }else if(armed && previous!==null && previous<travel && beyond<travel*1.6
          && !document.hidden && time-lastShot>1300){
        setPlayback('hold');
        takePhoto();
        exposing=true;armed=false;lastShot=time;
        document.body.classList.add('shutter-active');
      }
      if(!exposing)syncSelfie(offset,travel);
      if(exposing)reserve(Math.max(held,Math.ceil(beyond)));
      sheet.hidden=beyond>=0 && !exposing;
      sheet.inert=beyond>=0;
      pose(Math.max(0,Math.min(1,offset/travel)));
      previous=offset;
      return Math.max(0,beyond-held);
    }};
  }
};
