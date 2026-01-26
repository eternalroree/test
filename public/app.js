const beatsGrid = document.getElementById('beats-grid');
const beatCount = document.getElementById('beat-count');

const formatPrice = (price) => {
  if (!price) return 'Pricing on request';
  const parsed = Number(price);
  if (Number.isNaN(parsed)) return `$${price}`;
  return parsed.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const renderBeats = (beats) => {
  beatsGrid.innerHTML = '';

  if (!beats.length) {
    const emptyState = document.createElement('div');
    emptyState.className = 'beat-card placeholder';
    emptyState.textContent = 'No beats uploaded yet. Head to the admin page to add one!';
    beatsGrid.appendChild(emptyState);
    beatCount.textContent = '0 beats';
    return;
  }

  beatCount.textContent = `${beats.length} beat${beats.length === 1 ? '' : 's'}`;

  beats.forEach((beat) => {
    const card = document.createElement('article');
    card.className = 'beat-card';

    const title = document.createElement('h3');
    title.textContent = beat.title || 'Untitled beat';

    const price = document.createElement('p');
    price.textContent = formatPrice(beat.price);

    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = beat.audioUrl;

    card.append(title, price, audio);
    beatsGrid.appendChild(card);
  });
};

fetch('/api/beats')
  .then((response) => response.json())
  .then((beats) => renderBeats(beats))
  .catch(() => {
    beatsGrid.innerHTML = '';
    const errorState = document.createElement('div');
    errorState.className = 'beat-card placeholder';
    errorState.textContent = 'Unable to load beats right now.';
    beatsGrid.appendChild(errorState);
    beatCount.textContent = '0 beats';
  });
