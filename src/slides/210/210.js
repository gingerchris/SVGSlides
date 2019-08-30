const rect = document.querySelectorAll(".twentyone-patternFill");
const circle = document.querySelectorAll(".twentyone-circleFill");
const bbox = rect[0].getBBox();
const centreX = bbox.x + bbox.width / 2;
const centreY = bbox.y + bbox.height / 2;

let rotate = 0;
let scaleX, scaleY;

const applyMatrix = (scaleX, scaleY) => {
  let matrix = new DOMMatrixReadOnly();
  matrix = matrix.translate(centreX, centreY);
  matrix = matrix.rotate(rotate);
  matrix = matrix.scale(scaleX, scaleY);
  matrix = matrix.translate(-centreX, -centreY);
  rect.forEach(r => r.setAttribute("transform", matrix));
};

const update = () => {
  if (window.step < 5) {
    if (rotate < 360) {
      rotate += 1;
    } else {
      rotate = 0;
    }

    if (window.step > 2) {
      const radians = (rotate / 180) * Math.PI;

      const abscos = Math.abs(Math.cos(radians));
      const abssin = Math.abs(Math.sin(radians));

      const newWidth = bbox.width * abscos + bbox.height * abssin;
      const newHeight = bbox.width * abssin + bbox.height * abscos;

      scaleX = newWidth / bbox.width;
      scaleY = newHeight / bbox.height;

      applyMatrix(scaleX, scaleY);
    } else {
      applyMatrix(1, 1);
    }
  } else if (window.step === 5 && (scaleX >= 0 || scaleY >= 0)) {
    if (scaleX >= 0) scaleX -= 0.1;
    if (scaleY >= 0) scaleY -= 0.1;
    applyMatrix(scaleX, scaleY);
  } else if (window.step === 5) {
    rect.forEach(r => r.setAttribute("opacity", 0));
    circle.forEach(c => c.setAttribute("r", "405"));
  }

  requestAnimationFrame(update);
};
requestAnimationFrame(update);
