let char = 0;
const string = "svg transform pattern";
const textBox = document.querySelector("#text tspan");

const updateText = () => {
  char += 1;
  textBox.innerHTML = string.substring(0, char);
  if (char < string.length) {
    setTimeout(updateText, 70);
  } else {
    setTimeout(() => {
      document.querySelector("#mask").setAttribute("opacity", 0);
    }, 280);
  }
};

updateText();
