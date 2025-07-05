document.addEventListener('DOMContentLoaded', function () {
  const pokeButton = document.getElementById('poke-button');
  if (!pokeButton) return;

  const POKE_STORAGE_KEY = 'lastPokeTime';
  const COOLDOWN_HOURS = 24;

  // Check if the button should be disabled
  function updateButtonState() {
    const lastPoke = localStorage.getItem(POKE_STORAGE_KEY);
    if (!lastPoke) return;

    const lastTime = new Date(parseInt(lastPoke, 10));
    const now = new Date();
    const hoursDiff = (now - lastTime) / (1000 * 60 * 60);

    if (hoursDiff < COOLDOWN_HOURS) {
      pokeButton.disabled = true;
      pokeButton.textContent = `Poked (wait ${Math.ceil(COOLDOWN_HOURS - hoursDiff)}h)`;
    }
  }

  updateButtonState();

  pokeButton.addEventListener('click', async () => {
    try {
      const response = await fetch('https://iot.joszuijderwijk.nl/poke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Agent': 'personal-website',
          'X-Referer': document.title
        },
        body: JSON.stringify({ action: 'poke' })
      });

      if (!response.ok) throw new Error('Request failed');
      const result = await response.json();

      // Set cooldown in localStorage
      localStorage.setItem(POKE_STORAGE_KEY, Date.now().toString());

      alert('Poke sent!');

      // Disable the button and update text
      pokeButton.disabled = true;
      pokeButton.textContent = `Poked (wait ${COOLDOWN_HOURS}h)`;
    } catch (err) {
      console.error(err);
      alert('Failed to send poke. :(');
    }
  });
});
