document.addEventListener("DOMContentLoaded", () => {
    const card = document.querySelector(".centered");
    const icon = card.querySelector(".icon");
    const audio = document.getElementById("player");
    const progressFill = document.querySelector(".progress-fill");
    const progarea = document.querySelector(".progress-area");
  
    let isDragging = false;
    let dragStartX = 0;
    let progressBarWidth = 0;

    const pressDown = () => card.classList.add("clicked");
    const liftUp = () => card.classList.remove("clicked");

    // Mouse
    card.addEventListener("mousedown", pressDown);
    document.addEventListener("mouseup", liftUp);

    // Touch (for mobile)
    card.addEventListener("touchstart", pressDown);
    document.addEventListener("touchend", liftUp);
    document.addEventListener("touchcancel", liftUp);

    // Handle play/pause toggling
    card.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        icon.classList.remove("bi-play-fill");
        icon.classList.add("bi-pause-fill");
      } else {
        audio.pause();
        icon.classList.remove("bi-pause-fill");
        icon.classList.add("bi-play-fill");
      }
    });
  
    // Update progress bar as the song plays
    audio.addEventListener("timeupdate", () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${progress}%`;
    });
  
    // Handle the mouse and touch drag functionality on the entire card
    const onDrag = (e) => {
      if (!isDragging) return;
  
      // Get clientX for mouse or touch event
      const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - dragStartX;
  
      // Calculate new width based on drag movement
      let newWidth = Math.min(Math.max(0, progressBarWidth + deltaX), progarea.offsetWidth);
  
      // Update progress bar width and audio currentTime
      progressFill.style.width = `${(newWidth / (progarea.offsetWidth)) * 100}%`;
      audio.currentTime = (newWidth / progarea.offsetWidth) * audio.duration;
    };
  
    const onDragEnd = () => {
      isDragging = false;
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", onDragEnd);
      document.removeEventListener("touchmove", onDrag);
      document.removeEventListener("touchend", onDragEnd);
    };
  
    // Start dragging on the whole card (not just the progress bar)
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
  
    // Reset progress bar when song ends
    audio.addEventListener("ended", () => {
      icon.classList.remove("bi-pause-fill");
      icon.classList.add("bi-play-fill");
      progressFill.style.width = "0%";
    });
  });
  