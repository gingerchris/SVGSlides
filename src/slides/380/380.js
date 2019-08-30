const updateDimensions = (selector, width, height) => {
  TweenMax.to(selector, 2, { attr: { width, height } });
};

const thirtyeight = () => {
  updateDimensions("#thirtyeight-logo-one", 400, 400);
  updateDimensions("#thirtyeight-rect-one", 400, 400);
  setTimeout(() => {
    updateDimensions("#thirtyeight-logo-two", 400, 121);
    updateDimensions("#thirtyeight-rect-two", 400, 121);
  }, 1000);
  setTimeout(() => {
    updateDimensions("#thirtyeight-logo-three", 129, 450);
    updateDimensions("#thirtyeight-rect-three", 129, 450);
  }, 2000);
};

window.addEventListener("load", thirtyeight);
