let fs = require("fs");

/**
 * 读取全部诗词
 */
function getPoems() {
  // 同步读取
  let data = fs.readFileSync("../爱上古诗/唐诗.md");
  // console.log("同步读取: " + data.toString());

  let dataStr = data.toString();
  let dataArr = dataStr.split("\n");
  let poem = null;
  let poemArr = Array();

  for (i = 0; i < dataArr.length; i++) {
    const lineData = dataArr[i];

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

  // 读取内容开始标识
  if (!poem.isStart && lineData.substr(0, 3) === "```") {
    poem.isStart = true;
    return;
  }

  // 读取内容正文
  if (poem.isStart && lineData.substr(0, 3) !== "```") {
    poem.content += lineData + "\n";
    return;
  }

  // 读取内容结束标识
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

function getTopic() {
  // 读取文件
  const poems = getPoems();

  // 随机抽取一首诗
  let num = getRandomNum(0, poems.length);
  const poem = poems[num];

  let contentArr = poem.content.split("\n");
  console.log(contentArr);

  // 随机抽取诗中的一行
  let num2 = getRandomNum(0, contentArr.length - 1);
  content = contentArr[num2];
  if (content === "") {
    num2 = num2 - 1;
    content = contentArr[num2];
  }
  console.log("num2: " + num2);
  console.log(content);

  // 随机抽取诗中的一句
  let lineArr = content.split("。"); // [ '人闲桂花落，夜静春山空', '' ]
  console.log(lineArr);
  let num3 = getRandomNum(0, lineArr.length - 2); // 去掉最后一个为空的 item
  console.log("num3: " + num3);
  let lineStr = lineArr[num3];

  // 随机抽取诗中的半句
  let sentenceArr = lineStr.split("，");
  let num4 = getRandomNum(0, sentenceArr.length - 1);
  let sentence = sentenceArr[num4];
  console.log(sentenceArr);
  console.log("num4: " + num4);
  console.log(sentence);

  // 替换诗句，得到输出题目
  let replaceStr = getReplaceString(sentence.length);
  let output = lineStr.replace(sentence, replaceStr);
  console.log(output);

  return {
    topic: output,
    answer: sentence,
    poem: poem
  }
}

// let test = getTopic();
// console.log(test);

exports.getTopic = getTopic;