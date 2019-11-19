const path = require("path");
const fs = require("fs");
const ncp = require("ncp");
const watch = require("node-watch");
const HBS = require("handlebars");
const slides = require("../src/slides/slides.json");

const srcPath = path.join(__dirname, "../src/");
const directoryPath = path.join(__dirname, "../src/slides/");
const distSlidesPath = path.join(__dirname, "../dist/slides/");
const distPath = path.join(__dirname, "../dist/");

const buildForWeb = process.argv[3] === "web";

const mkDirIfNotExists = path => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

mkDirIfNotExists(distPath);
mkDirIfNotExists(distSlidesPath);

const template = HBS.compile(
  fs.readFileSync(path.join(__dirname, "template.hbs"), "UTF8")
);

const indexTemplate = HBS.compile(
  fs.readFileSync(path.join(srcPath, "index.hbs"), "UTF8")
);

const usesTweenMax = path => {
  return fs.readFileSync(path, "utf8").indexOf("TweenMax") !== -1;
};

const generateIndex = (pathName, slideNum, hasCSS, hasJS, hasTweenMax) => {
  const SVG = fs.readFileSync(`${pathName}/${slideNum}.svg`);
  const CSS = hasCSS && fs.readFileSync(`${pathName}/${slideNum}.css`);
  const JS = hasJS && fs.readFileSync(`${pathName}/${slideNum}.js`);
  const html = template({
    slideNum,
    CSS,
    JS,
    hasTweenMax,
    SVG,
    presenter: !buildForWeb
  });
  const exportPath = path.join(distSlidesPath, slideNum);
  mkDirIfNotExists(exportPath);
  fs.writeFileSync(`${exportPath}/index.html`, html);
};

const generateIndexFromSlideDir = (dir, slideNum) => {
  const hasCSS = fs.existsSync(`${dir}/${slideNum}.css`);
  const hasJS = fs.existsSync(`${dir}/${slideNum}.js`);
  const hasTweenMax = hasJS && usesTweenMax(`${dir}/${slideNum}.js`);
  generateIndex(dir, slideNum, hasCSS, hasJS, hasTweenMax);
};

const copyOtherAssets = () => {
  ncp(path.join(srcPath, "favicon.ico"), path.join(distPath, "favicon.ico"));
  ncp(path.join(srcPath, "scripts"), path.join(distPath, "scripts"));
  ncp(path.join(srcPath, "common"), path.join(distPath, "common"));
  ncp(path.join(srcPath, "logos"), path.join(distPath, "logos"));
  ncp(path.join(srcPath, "videos"), path.join(distPath, "videos"));
  ncp(
    path.join(srcPath, "slides/slides.json"),
    path.join(distPath, "slides/slides.json")
  );
  const html = indexTemplate({ presenter: !buildForWeb });
  fs.writeFileSync(`${distPath}/index.html`, html);

  if (!buildForWeb) {
    ncp(path.join(srcPath, "presenter.js"), path.join(distPath, "index.js"));
    ncp(path.join(srcPath, "speaker.css"), path.join(distPath, "speaker.css"));
    ncp(
      path.join(srcPath, "speaker.html"),
      path.join(distPath, "speaker.html")
    );
    ncp(path.join(srcPath, "speaker.js"), path.join(distPath, "speaker.js"));
  } else {
    ncp(path.join(srcPath, "web.js"), path.join(distPath, "index.js"));
  }
};

if (process.argv[2] === "all") {
  const keys = Object.keys(slides);
  keys.forEach(key => {
    const dir = path.join(directoryPath, key);
    generateIndexFromSlideDir(dir, key);
  });
  copyOtherAssets();
} else {
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
}
