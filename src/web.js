const iframe = document.querySelector("iframe");
let step;
let slides;
let slideKeys;

const getHash = () =>
  window.location.hash ? parseFloat(window.location.hash.replace("#", "")) : 10;

const onHashChange = async () => {
  step = 1;
  document.body.className = "";
  const hash = getHash();
  if (hash) {
    const path = `slides/${hash}`;
    iframe.setAttribute("src", path);
  }
};

const init = async () => {
  const slidesReq = await fetch("./slides/slides.json");
  slides = await slidesReq.json();
  slideKeys = Object.keys(slides)
    .map(Number)
    .sort((a, b) => (a < b ? -1 : 1));

  onHashChange();
  window.focus();
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
  iframe.contentWindow.postMessage({ step }, "*");
};

const decrement = () => {
  const hash = getHash();
  const index = slideKeys.indexOf(hash);
  goToSlide(slideKeys[index - 1]);
};

window.addEventListener("hashchange", onHashChange);
window.addEventListener("message", ({ source, data }) => {
  if (data === "increment") {
    increment();
  }
  if (data === "decrement") {
    decrement();
  }
});

window.addEventListener("click", increment);
window.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowRight":
      return increment();
    case "ArrowLeft":
      return decrement();
  }
});
