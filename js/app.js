let player;
let startTime;
let pauseTime;
let isPaused = true;
let frameAdvance = 1 / 30; // Avance por cuadro (1/30 segundos para videos a 30 fps)

function onPlayerReady(event) {
   document.getElementById('startButton').addEventListener('click', function () {
      startTime = new Date().getTime() - player.getCurrentTime() * 1000;
      player.playVideo();
      isPaused = false;
      updateClock();
   });

   document.getElementById('pauseButton').addEventListener('click', function () {
      pauseTime = new Date().getTime();
      player.pauseVideo();
      isPaused = true;
      updateClock();
   });

   document.getElementById('backFrameButton').addEventListener('click', function () {
      const currentTime = player.getCurrentTime() - frameAdvance;
      player.seekTo(currentTime, true);
      startTime = new Date().getTime() - currentTime * 1000;
      updateClock();
   });

   document.getElementById('forwardFrameButton').addEventListener('click', function () {
      const currentTime = player.getCurrentTime() + frameAdvance;
      player.seekTo(currentTime, true);
      startTime = new Date().getTime() - currentTime * 1000;
      updateClock();
   });

   document.getElementById('resetClockButton').addEventListener('click', function () {
      startTime = new Date().getTime();
      pauseTime = 0;
      isPaused = true;
      updateClock();
   });
}

function onPlayerStateChange(event) {
   if (event.data === YT.PlayerState.ENDED || isPaused) {
      pauseTime = new Date().getTime();
      updateClock();
   }
}

function updateClock() {
   const currentTime = isPaused ? pauseTime - startTime : new Date().getTime() - startTime;
   const centiseconds = Math.floor(currentTime / 10) % 100;
   const totalSeconds = Math.floor(currentTime / 1000);
   const minutes = Math.floor(totalSeconds / 60);
   const seconds = totalSeconds % 60;

   document.getElementById('reloj').textContent = `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}

function pad(value) {
   return value < 10 ? `0${value}` : value;
}

function onYouTubeIframeAPIReady() {
   player = new YT.Player('video-container', {
      height: '360',
      width: '640',
      videoId: 'WhtaL5Zu4wc', // Reemplaza con el ID de tu video de YouTube
      events: {
         'onReady': onPlayerReady,
         'onStateChange': onPlayerStateChange,
         'onPlaybackRateChange': function (event) {
            // Ajustar el valor de frameAdvance según la velocidad de reproducción del video
            frameAdvance = 1 / (30 * event.target.getPlaybackRate());
         },
         'onError': function (event) {
            console.error('Error en el reproductor de YouTube:', event.data);
         }
      }
   });
}
