var fs = require('fs');
var path = require('path');

/**
 * Get all files from the spacified dir path.
 */
function getAllFiles(rootPath, fileExtension) {
  let allFiles = [];

  function findDirFile(dir) {
    let files = fs.readdirSync(dir);
    files.forEach(function (item, index) {
      let fPath = path.join(dir, item);
      let stat = fs.statSync(fPath);
      var extname = path.extname(fPath);
      var basename = path.basename(fPath);

      if (stat.isDirectory() === true) {
        findDirFile(fPath);
      }

      if (stat.isFile() === true && extname === fileExtension && basename !== "README.md") {
        allFiles.push(fPath);
      }
    });
  }

  findDirFile(rootPath);
  // console.log(allFiles);
  return allFiles;
}

function replaceStr(filePath, oldStr, newStr) {
  let data = fs.readFileSync(filePath);
  let dataStr = data.toString();
  let dataStrNew = dataStr.replace(oldStr, newStr);
  fs.writeFileSync(filePath, dataStrNew);
}

let allFiles = getAllFiles(path.join(__dirname, "../../docs/机器人编程/"), ".md");

// const ImagePathForGithub = /<img src=\".\/images\//g;
// const ImagePathForMkdocs = "<img src=\"..\/images\/";
// function replaceImageSrc() {
//   allFiles.forEach(filePath => {
//     replaceStr(filePath, ImagePathForMkdocs, ImagePathForGithub);
//   });
// }

var arguments = process.argv.splice(2);
console.log(arguments);

if (arguments.length > 0) {
  let oldStr, newStr;
  if (arguments[0] === "mkdocs") {
    oldStr = /<img src=\".\/images\//g;
    newStr = "<img src=\"..\/images\/";
  } else if (arguments[0] === "github") {
    oldStr = /<img src=\"..\/images\//g;
    newStr = "<img src=\".\/images\/";
  }

  allFiles.forEach(filePath => {
    replaceStr(filePath, oldStr, newStr);
  });
}
