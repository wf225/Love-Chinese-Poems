
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
  var Range = Max - Min;
  var Rand = Math.random();
  return (Min + Math.round(Rand * Range));
}

/**
 * 获取替换站位符
 */
function getReplaceString(length) {
  var result = "";
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
  var num1 = getRandomNum(0, poems.length - 1);
  var poem = poems[num1];
  var index = `${num1}`;

  try {
    var contentArr = poem.content.split("\n");

    // 随机抽取诗中的一行
    var num2 = getRandomNum(0, contentArr.length - 1);
    var lineContent = contentArr[num2];
    var regex1 = /\n[\s| ]*\r/; // 匹配空行
    if (lineContent.match(regex1)) {
      num2 = num2 - 1;
      lineContent = contentArr[num2];
    }
    index = `${num1}_${num2}`;
    // console.log(lineContent);

    // 随机抽取诗中的一句
    // 查找“0 或多个空白符接着的标点符号[，,。，？，；]，再接着 0 或多个空白符”模式的字符串。
    var regex2 = /\s*(?:[，,。,？,；]|$)\s*/;
    var sentenceArr = lineContent.split(regex2); // [ '人闲桂花落，夜静春山空', '' ]

    // 去掉最后一个为空的 item
    if (sentenceArr[sentenceArr.length - 1] === '') {
      sentenceArr.pop();
    }
    // console.log(sentenceArr);

    // 随机抽取诗中的一句
    var num3 = getRandomNum(0, sentenceArr.length - 1);
    index = `${num1}_${num2}_${num3}`;
    var sentence = sentenceArr[num3];

    // 替换诗句，得到输出题目
    var replaceStr = getReplaceString(sentence.length);
    var output = lineContent.replace(sentence, replaceStr);
    // console.log(output);

    return {
      topic: output,
      answer: sentence,
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

// 获取指定数目的题目
function getQuestions(number) {
  var result = Array();
  var indexArr = Array();

  if (number > POEMS.length) {
    number = POEMS.length;
  }

  do {
    const topic = getRandomTopic(POEMS);
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
  var result = Array();

  for (i = POEMS.length - 1; i >= 0; i--) {
    var item = POEMS[i];
    if (item.inProgress) {
      result.push(item);
    } else {
      break;
    }
  }
  return result.reverse();
}

// 获取已学习过的古诗，进行复习
function getReviewList(num = undefined) {
  var result = Array();

  for (i = POEMS.length - 1; i >= 0; i--) {
    var item = POEMS[i];
    if (!item.inProgress) {
      result.push(item);
    }
    // if (result.length >= num) {
    //   break;
    // }
  }
  return result.reverse();
}

// 获取飞花令统计列表
function getFeiHuaLing() {
  return countWords(POEMS);
}

/**
 * 文字统计
 * result = {
     {
       key: keyword
       value: {
                count: 1,
                list: [{
                  answer: lineContent,
                  poem: poem
                }]
              }
      }
    }
 */
function countWords(poems) {
  var wordsMap = new Map();
  var mapKeys = [];

  // 处理一首
  for (i = 0; i < poems.length; i++) {
    var poem = poems[i];
    var contentArr = poem.content.split("\n");

    // 处理一行
    for (j = 0; j < contentArr.length; j++) {
      var isDuplicate = false;
      var lineContent = contentArr[j];
      var regex1 = /\n[\s| ]*\r/; // 匹配空行
      if (lineContent.match(regex1)) {
        continue;
      }

      // 处理一句
      var regex2 = /\s*(?:[，,。,？,；]|$)\s*/;
      var sentenceArr = lineContent.split(regex2);
      for (k = 0; k < sentenceArr.length; k++) {
        if (isDuplicate) {
          break;
        }

        var sentence = sentenceArr[k];
        // 去除空字符
        if (sentence === "") {
          continue;
        }

        // 分割成单个汉字
        var wordArr = sentence.split("");
        for (l = 0; l < wordArr.length; l++) {
          if (isDuplicate) {
            break;
          }

          var key = wordArr[l];
          var item = {};
          if (wordsMap.has(key)) {
            // 累计计数
            item = wordsMap.get(key);
            item.count = item.count + 1;
            item.list.push({
              answer: lineContent,
              poem: poem
            });
          } else {
            // 首次计数
            mapKeys.push(key);
            item = {
              count: 1,
              list: [{
                answer: lineContent,
                poem: poem
              }]
            };
          }

          wordsMap.set(key, item);

          // 去除重复
          var regex3 = `\s*(?:[${key}]|$)\s*`;
          var reg3 = new RegExp(regex3);
          if (lineContent.split(reg3).length > 2) {
            isDuplicate = true;
            break;
          }
        }
      }
    }
  }

  // 排序，并获取出现次数大于5的文字
  mapKeys.sort(function (a, b) {
    return wordsMap.get(b).count - wordsMap.get(a).count;
  });
  
  // var result = new Map();
  var result = [];
  var minCount = 5;
  mapKeys.forEach((key, index) => {
    var value = wordsMap.get(key);
    if (value.count >= minCount) {
      // result.set(key, value);
      result.push({ key, value });
    }
  });

  // console.log(result);
  return result;
}

// var poemArray = getTodoList(); // getQuestions(100);
// console.log(poemArray);
