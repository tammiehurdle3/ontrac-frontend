import { useEffect, useRef, useState } from 'react';
import TrackingForm from './TrackingForm';
import './NetworkHandoffHero.css';

const LOGO = 'https://www.ontrac.com/wp-content/uploads/2023/02/logo.svg';
const KEY = 'ontrac-network-handoff-visited-v1';
const DURATION = 5200;
const ease = value => { const n = Math.max(0, Math.min(1, value)); return n * n * (3 - 2 * n); };
const progress = (t,a,b) => ease((t-a)/(b-a));
const shouldAnimate = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    if (import.meta.env.DEV && new URLSearchParams(location.search).get('replayMotion') === '1') return true;
    return sessionStorage.getItem(KEY) !== 'done';
  } catch { return true; }
};
function NetworkHandoffHero() {
  const [animated, setAnimated] = useState(shouldAnimate);
  const root = useRef(null);
  const words = useRef([]);
  const paths = useRef([]);
  const dot = useRef(null);
  const ring = useRef(null);
  const svg = useRef(null);
  const done = useRef(false);
  const finishRef = useRef(null);
  function finish() {
    if (done.current) return;
    done.current = true;
    try { sessionStorage.setItem(KEY, 'done'); } catch { /* blocked storage */ }
    setAnimated(false);
  }
  finishRef.current = finish;
  useEffect(() => {
    if (!animated || !root.current) return undefined;
    const host = root.current;
    // Mark the intro as seen as soon as it starts, including interrupted visits.
    try { sessionStorage.setItem(KEY, 'done'); } catch { /* blocked storage */ }
    let raf, start = performance.now(), lengths = [0,0,0], measured = false;
    function measure() {
      const box = host.getBoundingClientRect();
      const list = words.current.map(node => node.getBoundingClientRect());
      const logo = words.current[2]?.querySelector('.nh-logo-reveal')?.getBoundingClientRect();
      if (list.length !== 3 || !logo || !box.width) return;
      const at = rect => ({x:rect.left-box.left,r:rect.right-box.left,y:rect.top-box.top,b:rect.bottom-box.top,w:rect.width,h:rect.height});
      const a=at(list[0]), b=at(list[1]), z=at(list[2]), img=at(logo), w=box.width;
      const edge=Math.max(10,Math.min(60,w*.055)), wing=Math.max(16,Math.min(65,w*.10));
      const left1=Math.max(edge,a.x-wing),right1=Math.min(w-edge,a.r+wing),y1=a.b-a.h*.12;
      const left2=Math.max(edge,b.x-wing),right2=Math.min(w-edge,b.r+wing),y2=b.b-b.h*.12;
      const left3=Math.max(edge,img.x-wing),right3=Math.min(w-edge,img.r+wing),y3=z.b-z.h*.27;
      const capX=img.x+img.w*.49,capY=img.y+img.h*.20,fr=w-edge*.5,fl=edge*.5;
      const first='M '+left1+' '+y1+' C '+(left1+(right1-left1)*.28)+' '+(y1-16)+', '+(left1+(right1-left1)*.72)+' '+(y1+9)+', '+right1+' '+y1;
      const second='M '+right1+' '+y1+' C '+fr+' '+(y1-1)+', '+fr+' '+(y2+8)+', '+right2+' '+y2+' C '+(right2-(right2-left2)*.29)+' '+(y2+13)+', '+(right2-(right2-left2)*.74)+' '+(y2-9)+', '+left2+' '+y2;
      const third='M '+left2+' '+y2+' C '+fl+' '+(y2+13)+', '+fl+' '+(y3+29)+', '+left3+' '+y3+' C '+(left3+(right3-left3)*.35)+' '+(y3+14)+', '+(left3+(right3-left3)*.77)+' '+(y3-8)+', '+right3+' '+y3+' C '+fr+' '+(y3+18)+', '+fr+' '+(capY-35)+', '+capX+' '+capY;
      svg.current.setAttribute('viewBox','0 0 '+box.width+' '+box.height);
      [first,second,third].forEach((value,i)=>{ paths.current[i].setAttribute('d',value); lengths[i]=paths.current[i].getTotalLength(); });
      measured=true;
    }
    const obs = new ResizeObserver(measure);
    obs.observe(host);
    const img=words.current[2]?.querySelector('.nh-logo-reveal');
    img?.addEventListener('load',measure);
    document.fonts?.ready.then(measure);
    measure();
    function tick(now) {
      if (done.current) return;
      const t=now-start;
      const travel=[progress(t,240,1530),progress(t,1530,2960),progress(t,2960,4250)];
      const reveals=[progress(t,430,1530),progress(t,1840,2960),progress(t,3350,4500)];
      host.style.setProperty('--nh-clip-one',100*(1-reveals[0])+'%');
      host.style.setProperty('--nh-clip-two',100*(1-reveals[1])+'%');
      host.style.setProperty('--nh-clip-three',100*(1-reveals[2])+'%');
      host.style.setProperty('--nh-accent-gray',1-progress(t,4220,4490));
      host.style.setProperty('--nh-form-opacity',progress(t,4130,4800));
      const opacity=1-progress(t,4150,4930);
      host.style.setProperty('--nh-route-opacity',opacity);
      const phase=t<1530?0:t<2960?1:2;
      if (measured) {
        paths.current.forEach((path,i)=>{
          const length=lengths[i]; const tail=path.nextElementSibling;
          const end=length*travel[i],begin=Math.max(0,end-Math.min(54,length*.16));
          tail.setAttribute('d',path.getAttribute('d'));
          tail.setAttribute('stroke-dasharray',Math.max(0,end-begin)+' '+(length+2));
          tail.setAttribute('stroke-dashoffset',-begin);
          tail.setAttribute('opacity',i===phase?opacity:opacity*.1);
        });
        const p=paths.current[phase].getPointAtLength(lengths[phase]*travel[phase]);
        dot.current.setAttribute('cx',p.x);dot.current.setAttribute('cy',p.y);
        dot.current.setAttribute('opacity',Math.min(1,t/350)*opacity);
        ring.current.setAttribute('cx',p.x);ring.current.setAttribute('cy',p.y);
        ring.current.setAttribute('opacity',.26*opacity);
      }
      if(t>=DURATION){ finishRef.current(); return; }
      raf=requestAnimationFrame(tick);
    }
    const onVisible=()=>{if(document.hidden)finishRef.current();};
    const onEscape=e=>{if(e.key==='Escape')finishRef.current();};
    const onTrackHeader=e=>{
      if (e.target instanceof Element && e.target.closest('.main-header .button-header')) {
        e.preventDefault(); finishRef.current();
        requestAnimationFrame(() => host.querySelector('.nh-form-slot input')?.focus());
      }
    };
    document.addEventListener('visibilitychange',onVisible);
    document.addEventListener('keydown',onEscape);
    document.addEventListener('click',onTrackHeader,true);
    window.addEventListener('resize',measure);
    raf=requestAnimationFrame(tick);
    return ()=>{cancelAnimationFrame(raf);obs.disconnect();img?.removeEventListener('load',measure);
      document.removeEventListener('visibilitychange',onVisible);
      document.removeEventListener('keydown',onEscape);
      document.removeEventListener('click',onTrackHeader,true);
      window.removeEventListener('resize',measure);};
  },[animated]);
  return <section className="hero nh-hero" aria-label="Track your shipment">
    <div className="container">
      <div className="nh-stage" ref={root} data-motion={animated?'running':'finished'}>
        <svg className="nh-network" ref={svg} aria-hidden="true">
          {[0,1,2].map(index=><g key={index}>
            <path ref={el=>{paths.current[index]=el;}} className="nh-network-path" />
            <path className="nh-network-trail" />
          </g>)}
          <circle ref={ring} className="nh-network-ring" r="17" />
          <circle ref={dot} className="nh-network-dot" r="6" />
        </svg>
        <h1 className="nh-headline">
          <span ref={el=>{words.current[0]=el;}} className="line nh-word nh-time" data-copy="On Time.">On Time.</span>
          <span ref={el=>{words.current[1]=el;}} className="line nh-word nh-point" data-copy="On Point.">On Point.</span>
          <span ref={el=>{words.current[2]=el;}} className="line logo-line nh-logo">
            <img className="nh-logo-base" src={LOGO} alt="" aria-hidden="true" />
            <img className="nh-logo-reveal" src={LOGO} alt="OnTrac" />
          </span>
        </h1>
        <div className="nh-form-slot" inert={animated}><TrackingForm /></div>
        {animated&&<button type="button" className="nh-skip" onClick={finish}>Skip intro <span aria-hidden="true">↗</span></button>}
      </div>
    </div>
  </section>;
}
export default NetworkHandoffHero;
