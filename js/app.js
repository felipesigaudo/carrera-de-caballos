let player;
let startTime;
let pauseTime;
let isPaused = true; // Iniciar pausado
let frameAdvance = 1 / 30; // Avance por cuadro (1/30 segundos para videos a 30 fps)
let frameAdvanceMillis = 33.33; // Avance por cuadro en milisegundos

function onPlayerReady(event) {
   document.getElementById('startButton').addEventListener('click', function () {
      if (isPaused) {
         startTime = new Date().getTime();
         player.playVideo();
         isPaused = false;
         updateClock();
      }
   });

   document.getElementById('pauseButton').addEventListener('click', function () {
      pauseTime = new Date().getTime();
      player.pauseVideo();
      isPaused = true; // Pausar también el reloj
      updateClock();
   });

   document.getElementById('backFrameButton').addEventListener('click', function () {
      // Retroceder un cuadro de tiempo
      const currentTime = player.getCurrentTime();
      player.seekTo(currentTime - frameAdvance, true);
      adjustClockTime(-frameAdvanceMillis);
   });

   document.getElementById('forwardFrameButton').addEventListener('click', function () {
      // Avanzar un cuadro de tiempo
      const currentTime = player.getCurrentTime();
      player.seekTo(currentTime + frameAdvance, true);
      adjustClockTime(frameAdvanceMillis);
   });
}

function onPlayerStateChange(event) {
   if (event.data === YT.PlayerState.ENDED) {
      // Video ha terminado
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
   if (!isPaused) {
      requestAnimationFrame(updateClock);
   }
}

function pad(value) {
   return value < 10 ? `0${value}` : value;
}

function adjustClockTime(timeDifferenceMillis) {
   if (!isPaused) {
      startTime += timeDifferenceMillis; // Ajustar el tiempo de inicio directamente
      updateClock();
   }
}

function onYouTubeIframeAPIReady() {
   player = new YT.Player('video-container', {
      height: '360',
      width: '640',
      videoId: 'WhtaL5Zu4wc', // Reemplaza con el ID de tu video de YouTube
      events: {
         'onReady': onPlayerReady,
         'onStateChange': onPlayerStateChange
      }
   });
}
