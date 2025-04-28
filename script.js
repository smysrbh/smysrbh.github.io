const allPlayers = []; // Global list of all players (audios)

const songs = [
    { id: 'player1', song: "Souvenir", artist: "Selena Gomez", bgcolor: '#3d251b', progcolor: '#5a3628' },
    { id: 'player2', song: "Blinding Lights", artist: "The Weeknd", bgcolor: '#a85a08', progcolor: '#c66b0b' },
    { id: 'player3',song: "Shape of You", artist: "Ed Sheeran", bgcolor: '#00627b', progcolor: '#008aad'},
    { id: 'player4',song: "Levitating", artist: "Dua Lipa",  bgcolor: '#8d4b55', progcolor: '#b2626e' },
    { id: 'player5',song: "Like Crazy", artist: "Jimin", bgcolor: '#908c89', progcolor: '#aea9a6' },
    { id: 'player6',song: "I'm a B (I'm a 빛)", artist: "Hwasa", bgcolor: '#15524b', progcolor: '#269689' },
    { id: 'player7', song: "Advice", artist: "Taemin", bgcolor: '#751320', progcolor: '#991325' },
    { id: 'player8',song: "To Be Honest", artist: "KAI" , bgcolor: '#651230', progcolor: '#9a2346'},
    { id: 'player9', song: "Stay", artist: "The Kid LAROI & Justin Bieber",  bgcolor: '#04414c', progcolor: '#097285' },
    { id: 'player10', song: "Lonely", artist: "RM", bgcolor: '#253a3a', progcolor: '#476f6f'},
    { id: 'player11',song: "Don't Go Insane", artist: "DPR Ian", bgcolor: '#62177e', progcolor: '#761a98'},
    { id: 'player12',song: "Go Ghost", artist: "Jackson Wang", bgcolor: '#642a18', progcolor: '#9a4025' }
  ];
  
  songs.forEach(song => {
    createAudioPlayer({
      targetId: song.id,
      artistName: song.artist,
      songName: song.song,
      backgroundColor: song.bgcolor,
      progressColor: song.progcolor,
    });
  });

function createAudioPlayer({
    targetId,
    artistName,
    songName,
    backgroundColor,
    progressColor,
    
}) {
  const container = document.createElement("div");
  container.className = "audioPlayer";
  container.style.backgroundColor = backgroundColor || "#A9A9A9";

  container.innerHTML = `
    <img class="albumart" src="assets/${songName}.jpg" onerror="this.onerror=null;this.src='assets/${songName}.png';">
    <div class="progress-area">
      <div class="progress-fill" style="background-color: ${progressColor || '#D3D3D3'}"></div>
    </div>
    <div class="songdetails">
      <div class="songname">${songName}</div>
      <div class="artistname">${artistName}</div>
    </div>
    <i class="bi bi-play-fill icon"></i>
    <audio class="player" src="assets/${songName}.mp3"></audio>
  `;

  const target = document.getElementById(targetId);
  if (target) {
    target.innerHTML = ""; // clear anything inside
    target.appendChild(container);
  } else {
    console.warn(`Target div with id "${targetId}" not found.`);
  }

  const icon = container.querySelector(".icon");
  const audio = container.querySelector(".player");
  const progressFill = container.querySelector(".progress-fill");
  const progarea = container.querySelector(".progress-area");

  allPlayers.push({ audio, icon }); // Add this player's audio + icon to global list

  let isDragging = false;
  let dragStartX = 0;
  let progressBarWidth = 0;

  const pressDown = () => container.classList.add("clicked");
  const liftUp = () => container.classList.remove("clicked");

  container.addEventListener("mousedown", pressDown);
  document.addEventListener("mouseup", liftUp);
  container.addEventListener("touchstart", pressDown);
  document.addEventListener("touchend", liftUp);
  document.addEventListener("touchcancel", liftUp);

  container.addEventListener("click", (e) => {
    if (e.target.classList.contains('albumart') || e.target.classList.contains('songname') || e.target.classList.contains('artistname')) return;

    if (audio.paused) {
      pauseAllExcept(audio); // <- Call global pause
      audio.play();
      icon.classList.remove("bi-play-fill");
      icon.classList.add("bi-pause-fill");
    } else {
      audio.pause();
      icon.classList.remove("bi-pause-fill");
      icon.classList.add("bi-play-fill");
    }
  });

  audio.addEventListener("timeupdate", () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${progress}%`;
  });

  const onDrag = (e) => {
    if (!isDragging) return;
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartX;
    let newWidth = Math.min(Math.max(0, progressBarWidth + deltaX), progarea.offsetWidth);
    progressFill.style.width = `${(newWidth / progarea.offsetWidth) * 100}%`;
    audio.currentTime = (newWidth / progarea.offsetWidth) * audio.duration;
  };

  const onDragEnd = () => {
    isDragging = false;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", onDragEnd);
    document.removeEventListener("touchmove", onDrag);
    document.removeEventListener("touchend", onDragEnd);
  };

  progarea.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    progressBarWidth = progressFill.offsetWidth;
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", onDragEnd);
  });

  progarea.addEventListener("touchstart", (e) => {
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    progressBarWidth = progressFill.offsetWidth;
    document.addEventListener("touchmove", onDrag);
    document.addEventListener("touchend", onDragEnd);
  });

  audio.addEventListener("ended", () => {
    icon.classList.remove("bi-pause-fill");
    icon.classList.add("bi-play-fill");
    progressFill.style.width = "0%";
  });
}

// Helper function to pause all other players
function pauseAllExcept(currentAudio) {
  allPlayers.forEach(({ audio, icon }) => {
    if (audio !== currentAudio) {
      audio.pause();
      if (icon) {
        icon.classList.remove("bi-pause-fill");
        icon.classList.add("bi-play-fill");
      }
    }
  });
}
