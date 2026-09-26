// Sound effects and chiptune music, synthesised live with the Web Audio API (no audio files).
import {P} from './profile.js';
let AC=null,master=null,musicGain=null,musicOn=false,mTimer=0,mStep=0,mNext=0;
export function audio(){if(AC)return;try{AC=new(window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=.5;master.connect(AC.destination);musicGain=AC.createGain();musicGain.gain.value=0;musicGain.connect(master);}catch(e){AC=null;}}
function tone(f,d,type='square',vol=.2,when=0,slide=0,dest){if(!AC)return;const t0=AC.currentTime+when,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t0+d);g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.001,t0+d);o.connect(g);g.connect(dest||master);o.start(t0);o.stop(t0+d+.02);}
function noise(d,vol=.2,hp=800){if(!AC)return;const b=AC.createBuffer(1,AC.sampleRate*d,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;const s=AC.createBufferSource(),g=AC.createGain(),f=AC.createBiquadFilter();f.type='highpass';f.frequency.value=hp;s.buffer=b;g.gain.setValueAtTime(vol,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);s.connect(f);f.connect(g);g.connect(master);s.start();}
const SFX={bell(){tone(1760,.25,'sine',.25);tone(2350,.35,'sine',.18,.06);},jump(){tone(300,.18,'square',.12,0,720);},coin(){tone(988,.07,'square',.1);tone(1319,.12,'square',.1,.07);},hit(){noise(.25,.35,200);tone(140,.25,'square',.2,0,60);},throw(){noise(.12,.12,2500);},honk(){tone(430,.12,'square',.1);tone(430,.12,'square',.1,.16);},woof(){tone(330,.08,'sawtooth',.14,0,180);tone(300,.08,'sawtooth',.12,.12,160);},miss(){tone(330,.2,'triangle',.15,0,180);},bundle(){[523,659,784,1047].forEach((f,i)=>tone(f,.1,'square',.1,i*.06));},win(){[523,659,784,1047,784,1047].forEach((f,i)=>tone(f,.16,'square',.13,i*.12));},lose(){[392,330,262,196].forEach((f,i)=>tone(f,.25,'triangle',.18,i*.18));},tick(){tone(880,.08,'square',.1);},go(){tone(1320,.25,'square',.12);},click(){tone(660,.04,'square',.06);}};
export function sfx(n){if(P.settings.sfx&&AC)try{SFX[n]();}catch(e){}}
export function buzz(ms){if(P.settings.vib&&navigator.vibrate)try{navigator.vibrate(ms);}catch(e){}}
/* Soundtrack. Each track is a loop of 8th-note steps.
   lead/bass: space-separated tokens – a note like F#5, '.' rest, '-' hold previous note.
   drums (one bar, repeats): k kick, s snare, h hat, t tabla ting, D dholak dha, n dholak na, S snare+dha. */
export const TRACKS={
menu:{bpm:104,type:'triangle',vol:.2,echo:.32,hat16:false,drums:'k . h t s . h h',
 lead:'E5 - G5 A5 G5 - E5 D5 C5 - D5 E5 G5 - - . A5 - G5 E5 D5 - C5 D5 E5 - - - . . . . G5 - A5 C6 A5 - G5 E5 D5 - E5 G5 A5 - - . G5 E5 D5 C5 D5 - E5 D5 C5 - - - . . . .',
 bass:'C3 . G3 . C3 . G3 . A2 . E3 . A2 . E3 . G2 . D3 . G2 . D3 . C3 . G3 . C3 - - . C3 . G3 . E3 . G3 . D3 . A3 . D3 . A3 . G2 . D3 . G2 . B2 . C3 . G3 . C3 - - .'},
ride:{bpm:138,type:'square',vol:.1,echo:.22,hat16:true,drums:'D h n h S D n h',
 lead:'D5 . F#5 A5 B5 A5 F#5 . G5 . A5 B5 C6 B5 A5 . F#5 A5 G5 F#5 E5 . D5 . E5 F#5 G5 A5 F#5 - - . A5 - B5 A5 G5 . F#5 . E5 F#5 G5 . A5 . C6 . B5 A5 G5 F#5 G5 . E5 . D5 - - . D6 . . .',
 bass:'D3 . D4 . D3 . A3 D3 G2 . G3 . G2 . D3 G2 D3 . D4 . D3 . A3 D3 A2 . A3 . C#3 . E3 A2 D3 . D4 . D3 . A3 D3 C3 . C4 . C3 . G3 C3 G2 . G3 . A2 . A3 A2 D3 . A2 . D3 . . .'},
event:{bpm:152,type:'square',vol:.1,echo:0,hat16:true,drums:'k h s k k h s s',
 lead:'E5 F5 E5 . B4 . E5 G5 F5 E5 D5 . E5 - - . A5 G5 F5 E5 F5 . G5 . F5 E5 D5 C5 B4 - - . E5 . E6 . D6 C6 B5 A5 G5 . A5 G5 F5 . E5 . F5 G5 A5 . B5 . C6 . B5 A5 G5 F5 E5 - - .',
 bass:'E2 E2 E3 E2 E2 E3 E2 E3 F2 F2 F3 F2 F2 F3 F2 F3 D2 D2 D3 D2 D2 D3 D2 D3 B1 B1 B2 B1 B1 B2 B1 B2 E2 E2 E3 E2 E2 E3 E2 E3 C2 C2 C3 C2 C2 C3 C2 C3 D2 D2 D3 D2 F2 F2 F3 F2 B1 B1 B2 B1 E2 . . .'}};
const NOTE={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function nmidi(tk){const m=/^([A-G])(#|b)?(\d)$/.exec(tk);if(!m)return 0;return 12*(+m[3]+1)+NOTE[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0);}
for(const k in TRACKS){const tr=TRACKS[k];tr.L=tr.lead.split(' ');tr.B=tr.bass.split(' ');tr.D=tr.drums.split(' ');}
function midi(n){return 440*Math.pow(2,(n-69)/12);}
let curTrack=null,echoIn=null,noiseBuf=null,duckOn=false;
function musicNodes(){if(echoIn||!AC)return;echoIn=AC.createGain();echoIn.gain.value=0;const dl=AC.createDelay(1),fb=AC.createGain(),lp=AC.createBiquadFilter();dl.delayTime.value=.27;fb.gain.value=.32;lp.type='lowpass';lp.frequency.value=2600;echoIn.connect(dl);dl.connect(lp);lp.connect(fb);fb.connect(dl);lp.connect(musicGain);
 noiseBuf=AC.createBuffer(1,AC.sampleRate*.4,AC.sampleRate);const a=noiseBuf.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;}
function mNote(f,t0,dur,type,vol,vib){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);
 if(vib&&dur>.25){const l=AC.createOscillator(),lg=AC.createGain();l.frequency.value=5.5;lg.gain.setValueAtTime(0,t0);lg.gain.linearRampToValueAtTime(f*.012,t0+.18);l.connect(lg);lg.connect(o.frequency);l.start(t0);l.stop(t0+dur+.05);}
 g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.008);g.gain.setTargetAtTime(vol*.7,t0+.03,.08);g.gain.setTargetAtTime(0,t0+dur*.92,.03);o.connect(g);g.connect(musicGain);if(echoIn)g.connect(echoIn);o.start(t0);o.stop(t0+dur+.2);}
function mNoise(t0,dur,vol,type,freq){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf;f.type=type;f.frequency.value=freq;g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.001,t0+dur);s.connect(f);f.connect(g);g.connect(musicGain);s.start(t0);s.stop(t0+dur+.02);}
function mDrum(p,t0){const sweep=(f0,f1,d,v,type='sine')=>{const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f0,t0);o.frequency.exponentialRampToValueAtTime(f1,t0+d);g.gain.setValueAtTime(v,t0);g.gain.exponentialRampToValueAtTime(.001,t0+d);o.connect(g);g.connect(musicGain);o.start(t0);o.stop(t0+d+.02);};
 if(p==='k')sweep(150,45,.16,.7);if(p==='s'||p==='S')mNoise(t0,.12,.28,'bandpass',1900);if(p==='h')mNoise(t0,.04,.12,'highpass',7000);
 if(p==='D'||p==='S')sweep(118,68,.24,.75);if(p==='n')sweep(560,470,.13,.26);if(p==='t')sweep(700,610,.2,.16,'triangle');}
function musicTick(){if(!AC||!curTrack)return;const tr=TRACKS[curTrack],st=60/tr.bpm/2;
 while(mNext<AC.currentTime+.2){const t0=Math.max(mNext,AC.currentTime+.005),i=mStep;
  const lt=tr.L[i%tr.L.length];if(lt!=='.'&&lt!=='-'){let n=1;while(tr.L[(i+n)%tr.L.length]==='-')n++;mNote(midi(nmidi(lt)),t0,n*st*.95,tr.type,tr.vol,true);}
  const bt=tr.B[i%tr.B.length];if(bt!=='.'&&bt!=='-'){let n=1;while(tr.B[(i+n)%tr.B.length]==='-')n++;mNote(midi(nmidi(bt)),t0,n*st*.9,'triangle',.24,false);}
  const dp=tr.D[i%tr.D.length];if(dp!=='.')mDrum(dp,t0);if(tr.hat16)mDrum('h',t0+st/2);
  mNext+=st;mStep++;}}
export function setMusicTrack(on,want){if(!AC||!on||!P.settings.music){musicOn=false;curTrack=null;clearInterval(mTimer);if(musicGain&&AC)musicGain.gain.setTargetAtTime(0,AC.currentTime,.05);return;}
 musicNodes();if(musicOn&&curTrack===want){duck(duckOn);return;}
 musicOn=true;curTrack=want;mStep=0;mNext=AC.currentTime+.08;const tr=TRACKS[want];echoIn.gain.value=tr.echo;duck(duckOn);clearInterval(mTimer);mTimer=setInterval(musicTick,40);musicTick();}
export function duck(on){duckOn=on;if(musicGain&&AC)musicGain.gain.setTargetAtTime(on?.18:.55,AC.currentTime,.12);}
export function resumeAudio(){if(AC&&AC.state==='suspended')AC.resume();}
export function musicPlaying(){return musicOn;}
