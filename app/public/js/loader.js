
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

// 获取制定数目的题目
function getTopics(number) {
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

// 获取正在学习的
function getTodoList() {
  let result = Array();

  for (i = poems.length - 1; i >= 0; i--) {
    let item = poems[i];
    if (item.inProgress) {
      result.push(item);
    } else {
      break;
    }
  }
  return result.reverse();
}

// 获取要复习的10首
function getReviewList() {
  let result = Array();

  for (i = poems.length - 1; i >= 0; i--) {
    let item = poems[i];
    if (!item.inProgress) {
      result.push(item);
    }
    if (result.length >= 10) {
      break;
    }
  }
  return result.reverse();
}

// let poemArray = getTodoList(); // getTopics(100);
// console.log(poemArray);
