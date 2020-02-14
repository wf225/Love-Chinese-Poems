const fs = require("fs");
const path = require("path");
const convertMarkdownToJson = require("./convertMarkdown").convertMarkdownToJson;

// 1. 读取文件 1-9年级204篇.md，转为 json 格式
let markdownPath = path.join(__dirname, "../../docs/爱上古诗/1-9年级204篇.md");
let output_JSON = path.join(__dirname, "./data/data_1-9年级204篇.json");
let output_JS = path.join(__dirname, "../../docs/public/js/data_1-9年级204篇.js");
if (fs.existsSync(output_JSON)) {
  fs.unlinkSync(output_JSON);
}
if (fs.existsSync(output_JS)) {
  fs.unlinkSync(output_JS);
}

const poemsObj1 = convertMarkdownToJson(markdownPath, output_JSON, output_JS);

// 2. 读取文件 乐学古诗.md，转为 json 格式
markdownPath = path.join(__dirname, "../../docs/爱上古诗/乐学古诗.md");
output_JSON = path.join(__dirname, "./data/data_le.json");
output_JS = path.join(__dirname, "../../docs/public/js/data_le.js");
if (fs.existsSync(output_JSON)) {
  fs.unlinkSync(output_JSON);
}
if (fs.existsSync(output_JS)) {
  fs.unlinkSync(output_JS);
}

const poemsObj2 = convertMarkdownToJson(markdownPath, output_JSON, output_JS);

function getKeyword(poem) {
  let arr = poem.content.split(/，|。|？|！/);
  return arr[0];
}

function getDuplicates() {
  const duplicateItems = [];

  for (i = 0; i < poemsObj1.length; i++) {
    const poem1 = poemsObj1[i];
    const keyword1 = getKeyword(poem1);
    // if(poem1.title === "02 迢迢牵牛星") {
    //   console.log(keyword1);
    // }

    for (j = 0; j < poemsObj2.length; j++) {
      const poem2 = poemsObj2[j];
      const keyword2 = getKeyword(poem2);
      // if(poem2.title === "152.迢迢牵牛星") {
      //   console.log(keyword2);
      // }

      if (keyword1 === keyword2) {
        duplicateItems.push(poem1);
        break;
      }
    }
  }

  // console.log("poemsObj1.length: " + poemsObj1.length);
  // console.log("poemsObj2.length: " + poemsObj2.length);
  // console.log("result.length: " + duplicateItems.length);

  return duplicateItems;
}

function getDiff() {
  const duplicateItems = getDuplicates();
  const diffItems = poemsObj1.slice(0);

  for (i = 0; i < duplicateItems.length; i++) {
    const poem1 = duplicateItems[i];
    const keyword1 = getKeyword(poem1);

    for (j = 0; j < poemsObj1.length; j++) {
      const poem2 = poemsObj1[j];
      const keyword2 = getKeyword(poem2);
      if (keyword1 === keyword2) {
        // console.log("poem1.title: " + poem1.title);
        const index = diffItems.findIndex(item => {
          const diffKeyword = getKeyword(item);
          return diffKeyword == keyword1;
        });
        // console.log("diff-index: " + index);
        diffItems.splice(index, 1);
        break;
      }
    }
  }

  console.log(diffItems);
  console.log(diffItems.length);
  return diffItems;
}


// getDuplicates();
getDiff();
