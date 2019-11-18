let char = 29;
let size = 48;
const initialString = "SO YOU CAN SVG WHILE YOU SVG";
const string = "SO YOU CAN BANG ON ABOUT HOW MUCH YOU LOVE SVGS";
const string2 = "EVEN THOUGH YOU CAN'T EVEN ALIGN TEXT PROPERLY";
const textBox = document.querySelector("#mod");
const textBox2 = document.querySelector("#mod2");

const deleteText = () => {
    char -=1;
    if (char > 10) {
        textBox.innerHTML = initialString.substr(0, char);
    } else {
        updateFunction = updateText;
    }
}

let updateFunction = deleteText;

const updateText = () => {
  char += 1;
  if (char < string.length) {
    textBox.innerHTML = string.substring(0, char);
    if (char > 29) {
        const x = textBox.getAttribute('x');
        textBox.setAttribute('x', x - 5);
    }
  } else {
      char = 0
      updateFunction = null;
      setTimeout(() => {
        updateFunction = update2;
      }, 1500);
      
  }
};

const update2 = () => {
char += 1;
  if (char < string.length) {
    textBox2.innerHTML = string2.substring(0, char);
  } else {
      updateFunction = null;
  }
}



const update = () => {
    if (window.step === 3 && updateFunction){
        updateFunction();
        setTimeout(update, 40);
    } else {
        requestAnimationFrame(update);   
    }
}

requestAnimationFrame(update);