let runSteps = {
  2: false,
  3: false
};

const thirtyfour = msg => {
  if (!msg.data.step) return;
  switch (msg.data.step) {
    case 2: {
      TweenMax.to("#thirtyfour-pattern", 2, {
        attr: { width: 50, height: 50 }
      });

      break;
    }
    case 3: {
      const placeholder = { rotation: 0 };
      const element = document.querySelector("#thirtyfour-pattern");
      TweenMax.to(placeholder, 2, {
        rotation: 75,
        transformOrigin: "50% 50%",
        onUpdate: () =>
          element.setAttribute(
            "patternTransform",
            `translate(50 50) rotate(${
              placeholder.rotation
            }) translate(-50 -50)`
          )
      });
      break;
    }
  }
};

window.addEventListener("message", thirtyfour);
