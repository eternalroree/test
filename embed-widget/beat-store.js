(function(){
  async function fetchBeats() {
    const res = await fetch('/api/beats');
    return res.json();
  }

  function createBeatItem(beat) {
    const item = document.createElement('div');
    item.className = 'beat-item';

    const title = document.createElement('h3');
    title.textContent = beat.title;
    item.appendChild(title);

    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = beat.audioUrl;
    item.appendChild(audio);

    const paypalContainer = document.createElement('div');
    item.appendChild(paypalContainer);

    if (window.paypal) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: beat.price } }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then(details => {
            alert('Thank you, ' + details.payer.name.given_name + '!');
          });
        }
      }).render(paypalContainer);
    } else {
      const buyBtn = document.createElement('a');
      buyBtn.className = 'buy-button';
      buyBtn.textContent = `Buy - $${beat.price}`;
      buyBtn.href = '#';
      item.appendChild(buyBtn);
    }

    return item;
  }

  async function renderBeatStore(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const beats = await fetchBeats();
    const list = document.createElement('div');
    list.className = 'beat-list';

    beats.forEach(beat => list.appendChild(createBeatItem(beat)));

    container.appendChild(list);
  }

  window.renderBeatStore = renderBeatStore;
})();
