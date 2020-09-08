window.onerror=console.error;
window.stopVibrato=function(){return 1;};
function go(el,url,swag){
  if(window.stopVibrato()!=1)return;
  el.setAttribute('disabled','');
  if(!swag)var swag=0;
  window.stopVibrato=function(){return 1;};
	var audioContext=new (window.AudioContext||window.webkitAudioContext)(),request=new XMLHttpRequest();
	request.open('GET','https://enable-cors.glitch.me/'+url,true);
	request.responseType='arraybuffer';
	request.crossOrigin="Anonymous";
	request.onload=()=>audioContext.decodeAudioData(request.response,buffer=>{
    var audioInput=audioContext.createBufferSource(),effect=audioContext.createGain(),bass=audioContext.createGain(),filter=audioContext.createBiquadFilter(),changePitch;
    audioInput.buffer=buffer;
    document.querySelector('progress').max=buffer.duration;
    document.querySelector('div').children[2].innerHTML=Math.floor(Math.round(buffer.duration)/60)+((Math.round(buffer.duration)%60)<10?':0':':')+(Math.round(buffer.duration)%60);
    filter.type='lowpass';
    filter.frequency.value=110;
    bass.gain.value=swag?2.5:0;
    effect.gain.value=1.5;
    audioInput.connect(bass);
    bass.connect(filter);
    filter.connect(audioContext.destination);
    effect.connect(audioContext.destination);
  var amount=swag?0:prompt('enter vibrato amount:',1),userFreq=swag?0:prompt('enter frequency:',6);
  audioInput.connect(createVibrato(audioContext,effect,userFreq?userFreq:6,amount?amount:1,swag));
    var scrollIndex=0,scrollText='— '+url+' —',progress=window.setInterval(()=>{
      document.querySelector('progress').value=audioContext.currentTime+(46*swag);
      document.querySelector('div').children[0].innerHTML=Math.floor(Math.round(audioContext.currentTime+(46*swag))/60)+((Math.round(audioContext.currentTime+(46*swag))%60)<10?':0':':')+(Math.round(audioContext.currentTime+(46*swag))%60);
      document.querySelector('div').children[1].innerHTML=scrollText.substr(scrollIndex++,5)+(scrollIndex>=scrollText.length?'':'…');
      if(scrollIndex>=scrollText.length)scrollIndex=0;
    },125);
    if(document.querySelector('input[type=checkbox]').checked)changePitch=window.setInterval(()=>audioInput.playbackRate.value=Math.random()+.5,1);
    audioInput.onended=e=>{
      clearInterval(progress);
      if(changePitch)clearInterval(changePitch);
      document.querySelector('progress').removeAttribute('value');
      document.querySelector('progress').max=0;
      document.querySelector('div').children[0].innerHTML=document.querySelector('div').children[2].innerHTML='--:--';
      document.querySelector('div').children[1].innerHTML='—';
      el.removeAttribute('disabled');
    };
    swag?audioInput.start(0,46,14):audioInput.start(0);
  document.querySelectorAll('button')[1].innerHTML="Stop";
  window.stopVibrato=function(){audioInput.stop();document.querySelectorAll('button')[1].innerHTML="Play";return window.stopVibrato=function(){return 1;};};
  },console.error);
	request.send();
}
function createVibrato(audioContext,effect,freq,amount,swag){
  var delayNode=audioContext.createDelay();
  delayNode.delayTime.value=.01;
  var inputNode=audioContext.createGain();
  var osc=audioContext.createOscillator();
  var gain=audioContext.createGain();
  gain.gain.value=amount/100;
  osc.type='sine';
  osc.frequency.value=freq;
  osc.connect(gain);
  gain.connect(delayNode.delayTime);
  inputNode.connect(delayNode);
  delayNode.connect(effect);
  swag?osc.start(0,46,14):osc.start(0);
  return inputNode;
}