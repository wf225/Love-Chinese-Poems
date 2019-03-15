/**
 * Convert Markdown to JSON
 */

const fs = require("fs");
const path = require("path");

// endsWith
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (search, this_len) {
    if (this_len === undefined || this_len > this.length) {
      this_len = this.length;
    }
    return this.substring(this_len - search.length, this_len) === search;
  };
}

// trim
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

/**
 * 读取 markdown 文件中的全部内容，返回 JSON 格式的数组。
 */
function loadFile(markdownPath) {
  // 同步读取
  let data = fs.readFileSync(markdownPath);
  // console.log("同步读取: " + data.toString());

  let dataStr = data.toString();
  let dataArr = dataStr.split("\n");
  let poem = null;
  let poemArr = Array();
  let inProgress = false;

  for (i = 0; i < dataArr.length; i++) {
    const lineData = dataArr[i];

    // 过滤没学过的
    if (lineData === "### TODO") {
      inProgress = true;
    }
    if (lineData === "### TODO-end") {
      break;
    }

    if (lineData.substr(0, 3) == "## ") {
      poem = {
        title: "",
        author: "",
        content: "",
        url: "",
        isStart: false,
        isEnd: false,
        inProgress: inProgress
      };
    }

    if (poem !== null && !poem.isEnd) {
      getPoem(lineData, poem);
    }

    if (poem !== null && poem.isEnd) {
      // 删除属性
      delete poem.isStart;
      delete poem.isEnd;

      poemArr.push(poem);
      poem = null; // set poem to null when the reading is ended.
    }
  }

  return poemArr;
}

/**
 * 读取一首诗词
 */
function getPoem(lineData, poem) {
  // 读到空行，直接返回
  if (lineData === "") {
    return;
  }
  lineData = lineData.trim();

  // 读取诗名
  if (lineData.substr(0, 3) === "## ") {
    var title = lineData.substring(3);
    poem.title = title;
    if (title.substr(0, 1) === "[") {
      poem.title = title.substring(1, title.indexOf("]"));
      poem.url = title.substring(title.lastIndexOf("(") + 1, title.lastIndexOf(")"));
    }
    return;
  }

  // 读取作者
  if (lineData.substr(0, 5) === "#### ") {
    poem.author = lineData.substring(5);
    return;
  }

  // 内容开始标识
  if (!poem.isStart && lineData.substr(0, 3) === "```") {
    poem.isStart = true;
    return;
  }

  // 读取内容正文
  if (poem.isStart && lineData.substr(0, 3) !== "```") {
    poem.content += lineData + "\n"; // 给每句结尾加上换行符
    return;
  }

  // 内容结束标识
  if (!poem.isEnd && lineData.substr(0, 3) === "```") {
    poem.isEnd = true;
    poem.content = poem.content.substr(0, poem.content.length - 1);
    return;
  }
}

/**
 * 获取全部诗词，返回一个 json 对象。
 */
function getPoems(markdownPath, outputJSONPath, outputJSPath) {
  try {
    if (!fs.existsSync(outputJSONPath)) {
      const poemsObj = loadFile(markdownPath);
      const poemsStr = JSON.stringify(poemsObj, null, 2);

      fs.writeFileSync(outputJSONPath, poemsStr);
      fs.writeFileSync(outputJSPath, `var POEMS = \n${poemsStr};`);

      return poemsObj;
    } else {
      // 读取 json 文件
      const poemsStr = fs.readFileSync(outputJSONPath);
      const poems = JSON.parse(poemsStr);
      return poems;
    }
  } catch (error) {
    console.log(error);
  }
}


// 读取文件 markdown 文件，转为 json 格式
const markdownPath = path.join(__dirname, "../../docs/爱上古诗/乐学古诗.md");
const outputJSONPath = path.join(__dirname, "./dataSource.json");
const outputJSPath = path.join(__dirname, "../../docs/public/js/dataSource.js");

getPoems(markdownPath, outputJSONPath, outputJSPath);

// exports.getQuestions = getQuestions;