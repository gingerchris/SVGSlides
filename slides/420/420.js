const steptwo = () => {
  const shirt = document.querySelector("#fourtytwo-mini");
  let y = 0;
  let x = 0;
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      if (i > 0 && i % 10 === 0) {
        x = 0;
        y += 1;
      }
      const newShirt = shirt.cloneNode(true);
      newShirt.setAttribute("x", 825 + x * 50);
      newShirt.setAttribute("y", 227 + y * 50);
      shirt.setAttribute("data-i", i);
      shirt.parentNode.appendChild(newShirt);
      x += 1;
    }, i * 50);
  }
};

const stepthree = () => {
  for (let i = 99; i > 83; i--) {
    setTimeout(() => {
      const shirt = document.querySelector(`#fourtytwo-mini[data-i='${i}']`);
      shirt.setAttribute("href", "#fourtytwo-flaming-smallshirt");
    }, 5000 - i * 50);
  }
};

const topline = document.querySelector("#fourtytwo-text-one");
const secondLine = document.querySelector("#fourtytwo-text-small-1");
const thirdLine = document.querySelector("#fourtytwo-text-small-2");
const fourthLine = document.querySelector("#fourtytwo-text-small-3");
const fifthLine = document.querySelector("#fourtytwo-text-small-4");
let number = 400;
const stepfive = () => {
  updateTotal();
};

const countDown = (target, increment = 1) => {
  if (increment === 1);
  number = Math.round(number);
  if (number > target) {
    number -= increment;
    updateTotal();
    requestAnimationFrame(() => countDown(target, increment));
  }
};

const stepsix = () => {
  secondLine.innerHTML = "Time Warner: $73B";
  countDown(400 - 73, 3);
};

const stepseven = () => {
  thirdLine.innerHTML = "Game of Thrones: $100m (season)";
  fourthLine.innerHTML = "x 3000";
  countDown(400 - 73.1 - 300, 10);
};

const stepeight = () => {
  number = 400;
  updateTotal();
  secondLine.innerHTML = "twitter: $29b";
  thirdLine.innerHTML = "reddit: $3b";
  countDown(400 - 32, 10);
  fourthLine.innerHTML = "";
};

const stepnine = () => {
  fourthLine.innerHTML = "$151 for every FB user: $359.380b";
  countDown(9, 9);
};

const updateTotal = () => {
  topline.innerHTML = `$${number}B`;
};

const fourtytwo = message => {
  if (!message.data.step) return;
  switch (message.data.step) {
    case 2:
      return steptwo();
    case 3:
      return stepthree();
    case 5:
      return stepfive();
    case 6:
      return stepsix();
    case 7:
      return stepseven();
    case 8:
      return stepeight();
    case 9:
      return stepnine();
  }
};

window.addEventListener("message", fourtytwo);
