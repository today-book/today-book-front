function createSnowflakes() {
  const snowflakesContainer = document.getElementById('snowflakes');
  if (!snowflakesContainer) return;

  const snowflakeCount = 50;

  for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.textContent = '❄';
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.animationDuration = Math.random() * 3 + 5 + 's';
    snowflake.style.animationDelay = Math.random() * 5 + 's';
    snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
    snowflake.style.opacity = Math.random() * 0.6 + 0.4;
    snowflakesContainer.appendChild(snowflake);
  }
}

function preventDoubleTapZoom() {
  let lastTouchEnd = 0;
  document.addEventListener(
      'touchend',
      (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) e.preventDefault();
        lastTouchEnd = now;
      },
      false
  );
}

export {
  createSnowflakes,
  preventDoubleTapZoom
}