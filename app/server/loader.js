let fs = require("fs");

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
function loadPoems(markdownPath) {
  // 同步读取
  let data = fs.readFileSync(markdownPath);
  // console.log("同步读取: " + data.toString());

  let dataStr = data.toString();
  let dataArr = dataStr.split("\n");
  let poem = null;
  let poemArr = Array();

  for (i = 0; i < dataArr.length; i++) {
    const lineData = dataArr[i];

    // 过滤没学过的
    if (lineData === "### TODO-List") {
      break;
    }

    if (lineData.substr(0, 3) == "## ") {
      poem = {
        title: "",
        author: "",
        content: "",
        isStart: false,
        isEnd: false
      };
    }

    if (poem !== null && !poem.isEnd) {
      getPoem(lineData, poem);
    }

    if (poem !== null && poem.isEnd) {
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
  if(lineData === "") {
    return;
  }
  lineData = lineData.trim();

  // 读取诗名
  if (lineData.substr(0, 3) === "## ") {
    poem.title = lineData.substring(3);
    if (poem.title.substr(0, 1) === "[") {
      poem.title = poem.title.substr(1, poem.title.indexOf("]") - 1);
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
 * 获取随机数
 */
function getRandomNum(Min, Max) {
  let Range = Max - Min;
  let Rand = Math.random();
  return (Min + Math.round(Rand * Range));
}

/**
 * 获取替换站位符
 */
function getReplaceString(length) {
  let result = "";
  for (i = 0; i < length; i++) {
    result += "_ ";
  }
  return result;
}

/**
 * 获取全部诗词，返回一个 json 对象。
 */
function getPoems() {
  try {
    // 读取文件 markdown 文件，转为 json 格式
    const markdownPath = "../爱上古诗/唐诗.md";
    const jsonPath = "./server/poems.json";
    if (!fs.existsSync(jsonPath)) {
      const poemsObj = loadPoems(markdownPath);
      fs.writeFileSync(jsonPath, JSON.stringify(poemsObj, null, 2));
    }

    // 读取 json 文件
    const poemsStr = fs.readFileSync(jsonPath);
    const poems = JSON.parse(poemsStr);
    return poems;
  } catch (error) {
    console.log(error);
  }
}

/**
 * 随机抽取出题
 */
function getRandomTopic(poems) {

  // 随机抽取一首诗
  let num1 = getRandomNum(0, poems.length - 1);
  let poem = poems[num1];
  let index = `${num1}`;

  try {
    let contentArr = poem.content.split("\n");

    // 随机抽取诗中的一行
    let num2 = getRandomNum(0, contentArr.length - 1);
    let lineContent = contentArr[num2];
    if (lineContent === "") {
      num2 = num2 - 1;
      lineContent = contentArr[num2];
    }
    index = `${num1}_${num2}`;
    // console.log(lineContent);

    // 随机抽取诗中的一句
    let sentenceArr = lineContent.split("。"); // [ '人闲桂花落，夜静春山空', '' ]
    if (sentenceArr[sentenceArr.length - 1] === '') {
      sentenceArr.pop(); // 去掉最后一个为空的 item
    }
    // console.log(sentenceArr);
    let num3 = getRandomNum(0, sentenceArr.length - 1);
    index = `${num1}_${num2}_${num3}`;
    let sentence = sentenceArr[num3];

    // 随机抽取诗中的半句
    let topicArr = sentence.split("，");
    let num4 = getRandomNum(0, topicArr.length - 1);
    // index = `${num1}_${num2}_${num3}_${num4}`;
    let topic = topicArr[num4];
    // console.log(topicArr);
    // console.log(topic);

    // 替换诗句，得到输出题目
    let replaceStr = getReplaceString(topic.length);
    let output = sentence.replace(topic, replaceStr);

    return {
      topic: output,
      answer: topic,
      poem: poem,
      index: index
    }
  } catch (error) {
    console.log(error);
    console.log(num1);
    console.log(poem);
    console.log(index);
  }

}

function getQuestions(number) {
  const poems = getPoems();
  let result = Array();
  let indexArr = Array();

  if (number > poems.length) {
    number = poems.length;
  }

  do {
    const topic = getRandomTopic(poems);
    try {
      if (indexArr.indexOf(topic.index) === -1) {
        result.push(topic);
        indexArr.push(topic.index);
      }
    } catch (error) {
      console.log(error);
      console.log(topic);
    }

  } while (result.length < number);

  return result;
}

// let test = getQuestions(100);
// console.log(test);

exports.getQuestions = getQuestions;