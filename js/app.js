let player;
let startTime;
let pauseTime;
let isPaused = false; // Nuevo flag para controlar si el video está pausado
let frameAdvance = 1 / 30; // Avance por cuadro (1/30 segundos para videos a 30 fps)

function onPlayerReady(event) {
   document.getElementById('startButton').addEventListener('click', function () {
      startTime = new Date().getTime();
      player.playVideo();
      isPaused = false; // Reiniciar el flag de pausa
      updateClock();
   });

   document.getElementById('pauseButton').addEventListener('click', function () {
      pauseTime = new Date().getTime();
      player.pauseVideo();
      updateClock();
   });

   document.getElementById('backFrameButton').addEventListener('click', function () {
      // Retroceder un cuadro de tiempo
      const currentTime = player.getCurrentTime();
      player.seekTo(currentTime - frameAdvance, true);
      if (!isPaused) {
         // Actualizar el reloj inmediatamente después de retroceder el video
         const newTime = currentTime * 1000 - frameAdvance * 1000;
         startTime = new Date().getTime() - newTime;
         updateClock();
      }
   });

   document.getElementById('forwardFrameButton').addEventListener('click', function () {
      // Avanzar un cuadro de tiempo
      const currentTime = player.getCurrentTime();
      player.seekTo(currentTime + frameAdvance, true);
      if (!isPaused) {
         // Actualizar el reloj inmediatamente después de avanzar el video
         const newTime = currentTime * 1000 + frameAdvance * 1000;
         startTime = new Date().getTime() - newTime;
         updateClock();
      }
   });
}

function onPlayerStateChange(event) {
   if (event.data === YT.PlayerState.ENDED || isPaused) {
      // Video ha terminado o está pausado
      pauseTime = new Date().getTime();
      updateClock();
   }
}

function updateClock() {
   if (!isPaused) {
      const currentTime = player.getCurrentTime();
      startTime = new Date().getTime() - currentTime * 1000;
   }

   const currentTime = isPaused ? pauseTime - startTime : new Date().getTime() - startTime;
   const centiseconds = Math.floor(currentTime / 10) % 100;
   const totalSeconds = Math.floor(currentTime / 1000);
   const minutes = Math.floor(totalSeconds / 60);
   const seconds = totalSeconds % 60;

   document.getElementById('reloj').textContent = `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
   requestAnimationFrame(updateClock);
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
         'onStateChange': onPlayerStateChange
      }
   });
}
