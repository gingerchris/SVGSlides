window.step = 1;

const onMessage = msg => {
  if (msg.data.step) {
    document.body.classList.add(`step${msg.data.step}`);
    window.step = parseFloat(msg.data.step);
  }
};

window.addEventListener("message", onMessage);
