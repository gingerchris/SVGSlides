const fullscreen = () => {
  document.documentElement.requestFullscreen();
};

const fsButton = document.querySelector("#fs");

fsButton.addEventListener("click", fullscreen, false);

const iframe = document.querySelector("iframe");
let step;
let slides;
let slideKeys;

let notesWindow;

const updateScript = (script, step, hash) => {
  const { steps, bullets } = slides[getHash()];
  notesWindow.postMessage(
    {
      script,
      step,
      steps,
      bullets,
      slide: slideKeys.indexOf(hash),
      slides: slideKeys.length - 1,
      start: script === slides[10].script || getHash() === 12
    },
    "*"
  );
};

const getHash = () =>
  window.location.hash ? parseFloat(window.location.hash.replace("#", "")) : 10;

const onHashChange = async () => {
  step = 1;
  document.body.className = "";
  const hash = getHash();
  if (hash) {
    updateScript(slides[hash].script, step - 1, hash);
    const path = `slides/${hash}`;
    iframe.setAttribute("src", path);
  }
};

const waitForNotesReady = () =>
  new Promise(resolve => {
    const handleMessage = ({ source, data }) => {
      if (source === notesWindow && data === "ready") {
        resolve();
        window.removeEventListener("message", handleMessage);
      }
    };
    window.addEventListener("message", handleMessage);
  });

const init = async () => {
  const slidesReq = await fetch("./slides/slides.json");
  slides = await slidesReq.json();
  slideKeys = Object.keys(slides)
    .map(Number)
    .sort((a, b) => (a < b ? -1 : 1));

  notesWindow = window.open("/speaker.html", "speakerNotes");
  await waitForNotesReady();

  onHashChange();
};

const goToSlide = key => {
  if (!isNaN(key)) {
    window.location.hash = `#${key}`;
  }
};

init();

const increment = () => {
  const hash = getHash();
  const { steps, script } = slides[hash];
  if (step >= steps) {
    const slideIndex = slideKeys.indexOf(hash);
    const nextIndex = slideIndex + 1;
    if (slides[slideKeys[nextIndex]]) {
      return goToSlide(slideKeys[nextIndex]);
    }
  }
  step += 1;
  updateScript(script, step - 1, hash);
  iframe.contentWindow.postMessage({ step }, "*");
};

const decrement = () => {
  const hash = getHash();
  const index = slideKeys.indexOf(hash);
  goToSlide(slideKeys[index - 1]);
};

window.addEventListener("hashchange", onHashChange);
window.addEventListener("message", ({ source, data }) => {
  if (source === notesWindow) {
    if (data === "increment") {
      increment();
    }
    if (data === "decrement") {
      decrement();
    }
  }
});

navigator.serviceWorker.register("/service-worker.js", {
  scope: "/"
});
