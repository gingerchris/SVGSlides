const opener = window.opener;
const systemTimeContainer = document.querySelector("#systemTime span");
const overallTimeContainer = document.querySelector("#overallTime span");
const slideTimeContainer = document.querySelector("#slideTime span");
const notesContainer = document.querySelector("#notes");
const slideCountContainer = document.querySelector("#slideCount");

let currentSlide = -1;

let overallTime = 0;
let slideTime = 0;

const d = new Date();
let systemTime = d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds();

let timer;

const padNumber = number => {
  const str = number.toString();
  if (str.length == 1) {
    return `0${number}`;
  }
  return number;
};

const formatSeconds = seconds => {
  const remainingSeconds = seconds % 60;
  const minutes = Math.floor(seconds / 60);
  const remainingMinutes = minutes % 60;
  const hours = Math.floor(minutes / 60);
  return `${hours}:${padNumber(remainingMinutes)}:${padNumber(
    remainingSeconds
  )}`;
};

const post = message => {
  iframe.contentWindow.postMessage(message);
};

const setup = () => {
  opener.postMessage("ready");
};

const start = () => {
  if (timer) {
    resetOverallTime();
    resetSlideTime();
    clearTimeout(timer);
  }
  timer = setInterval(updateTimers, 1000);
};

const nextSlide = () => {
  if (currentSlide === -1) {
    start();
  }
  currentSlide += 1;
  const { notes: text } = slides[currentSlide];
  notes.textContent = text;
  notes.textContent = notes.innerHTML;

  post("nextSlide");
  resetSlideTime();
};

const prevSlide = () => {
  post("prevSlide");
  resetSlideTime();
  if (currentSlide > -1) {
    currentSlide -= 1;
  }

  if (currentSlide === -1) {
    resetOverallTime();
  }
};

const updateTimers = () => {
  overallTime += 1;
  slideTime += 1;
  systemTime += 1;

  overallTimeContainer.innerHTML = formatSeconds(overallTime);
  slideTimeContainer.innerHTML = formatSeconds(slideTime);
  systemTimeContainer.innerHTML = formatSeconds(systemTime);
};

const resetSlideTime = () => {
  slideTime = 0;
};

const resetOverallTime = () => {
  overallTime = 0;
};

const handlePostMessage = ({ source, data }) => {
  if (source === opener) {
    if (data.script) {
      if (data.start === true || !timer) start();
      notesContainer.innerHTML = "";
      slideCountContainer.innerHTML = `Slide ${data.slide} of ${
        data.slides
      } | Click ${data.step} of ${data.steps - 1}`;
      data.script.forEach((line, index) => {
        const node = document.createElement("li");
        node.textContent = line;
        node.innerHTML = node.innerHTML.replace(/(?:\r\n|\r|\n)/g, "<br>");
        if (index === data.step) {
          node.classList.add("active");
        }
        if (index === data.step - 1) {
          node.classList.add("prev");
        }
        if (index === data.step + 1) {
          node.classList.add("next");
        }
        node.classList.add("line");
        notesContainer.appendChild(node);
        resetSlideTime();
      });
    }
  }
};

const increment = () => {
  opener.postMessage("increment");
};

const decrement = () => {
  opener.postMessage("decrement");
};

window.addEventListener("load", setup);
window.addEventListener("message", handlePostMessage);
document.addEventListener("keydown", event => {
  switch (event.key) {
    case "ArrowRight":
    case "PageDown":
      return increment();
    case "ArrowLeft":
    case "PageUp":
      return decrement();
  }
});
