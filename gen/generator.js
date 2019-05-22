const path = require("path");
const fs = require("fs");
const watch = require("node-watch");
const HBS = require("handlebars");
const directoryPath = path.join(__dirname, "../slides/");

const template = HBS.compile(
  fs.readFileSync(path.join(__dirname, "template.hbs"), "UTF8")
);

const usesTweenMax = path => {
  return fs.readFileSync(path, "utf8").indexOf("TweenMax") !== -1;
};

const generateIndex = (path, slideNum, hasCSS, hasJS, hasTweenMax) => {
  const SVG = fs.readFileSync(`${path}/${slideNum}.svg`);
  const html = template({ slideNum, hasCSS, hasJS, hasTweenMax, SVG });
  fs.writeFileSync(`${path}/index.html`, html);
};

const generateIndexFromSlideDir = (dir, slideNum) => {
  const hasCSS = fs.existsSync(`${dir}/${slideNum}.css`);
  const hasJS = fs.existsSync(`${dir}/${slideNum}.js`);
  const hasTweenMax = hasJS && usesTweenMax(`${dir}/${slideNum}.js`);
  generateIndex(dir, slideNum, hasCSS, hasJS, hasTweenMax);
};

fs.readdir(directoryPath, function(err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  //listing all files using forEach
  files.forEach(file => {
    const fullPath = path.join(__dirname, `../slides/${file}`);
    if (fs.lstatSync(fullPath).isDirectory()) {
      generateIndexFromSlideDir(fullPath, file);
    }
  });
});

watch(directoryPath, { recursive: true }, (evt, name) => {
  const dir = path.dirname(name);
  const nameArr = name
    .split("/")
    .pop()
    .split(".");
  nameArr.pop();
  const slideNum = parseFloat(nameArr.join("."));
  if (!isNaN(slideNum)) {
    console.log("regenerating", slideNum);
    generateIndexFromSlideDir(dir, slideNum);
  }
});
