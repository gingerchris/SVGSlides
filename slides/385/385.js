const stepTwo = () => {
  TweenMax.to("#left-bounds", 2, {
    stroke: "red",
    attr: { width: 376 }
  });

  TweenMax.to("#right-bounds", 2, {
    stroke: "red",
    attr: { width: 376, x: 435 },
    onComplete: stepThree
  });
};

const stepThree = () => {
  TweenMax.to("#thirtytwo-leftlogo", 2, {
    x: -187,
    y: 391,
    scale: 0.4635
  });
  TweenMax.to("#thirtytwo-rightlogo", 2, {
    x: 610,
    y: 391,
    scale: 0.4635,
    onComplete: () => {
      document
        .querySelectorAll(".thirtytwo-externalLogo")
        .forEach(l => l.setAttribute("opacity", 0));

      document
        .querySelectorAll(".thirtytwo-logo")
        .forEach(l => l.setAttribute("opacity", 1));

      slideIn();
    }
  });
};

const slideIn = () => {
  TweenMax.to("#thirtytwo-left", 2, {
    x: 402
  });
  TweenMax.to("#thirtytwo-right", 2, {
    x: 50,
    onComplete: () => {
      document
        .querySelector("#thirtytwo-left")
        .setAttribute("clip-path", "url(#thirtytwo-clipLeft)");
      document
        .querySelector("#thirtytwo-right")
        .setAttribute("clip-path", "url(#thirtytwo-clipRight)");
    }
  });
};

const thirtytwo = msg => {
  if (msg.data.step && msg.data.step === 2) {
    stepTwo();
  }
};

window.addEventListener("message", thirtytwo);
