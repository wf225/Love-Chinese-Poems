document.addEventListener("keydown", keydown);

function keydown(event) {
  //表示键盘监听所触发的事件，同时传递参数event
  switch (event.keyCode) {
    case 37: // ArrowLeft
      getPrevious();
      break;
    case 39: // ArrowRight
      getNext();
      break;
    case 40: // ArrowDown
      getAnswer();
      break;
    default:
      break;
  }
}

function init() {
  keysArray = getFeiHuaLing();
  keysRender(keysArray);
}

function getNext() {
  console.log(index);

  if (poemArray.length === 0 || index === NUM) {
    // // 一次抽取100题
    // poemArray = getQuestions(NUM);

    // 重新计数
    if (index === NUM) {
      index = 0;
    }

    // 重置 NUM
    if (NUM > poemArray.length) {
      NUM = poemArray.length;
    }
  }

  const jsonObj = poemArray[index++];
  render(jsonObj);
  showAnswer(false);
}

function getPrevious() {
  // 重新计数
  if (index === 1) {
    index = poemArray.length + 1;
  }

  index = index - 2;
  const jsonObj = poemArray[index];

  index = index + 1; // for display
  render(jsonObj);
  showAnswer(false);
}

function viewRender(viewId, templateId, data) {
  layui.use('laytpl', function (laytpl) {

    var view = document.getElementById(viewId);
    var getTpl = document.getElementById(templateId).innerHTML;
    var controller = function (view) {
      try {
        var html = laytpl(getTpl).render(data);
        view.innerHTML = html;
      } catch (e) {
        view.innerHTML = '<span style="color: #c00;">' + e.toString() + '</span>';
      }
    };

    controller(view);
  });
}

function render(jsonObj) {
  let poem = jsonObj.poem;
  poem.contentList = poem.content.split("\n");

  viewRender('topicView', "topicViewTpl", jsonObj);
  // viewRender('answerView', "answerViewTpl", jsonObj);
  viewRender('poemView', "poemViewTpl", poem);
  // indexView
  document.getElementById("indexView").innerHTML = `"${KEY}": ${index}/${NUM}`;
}

function keysRender(data) {
  layui.use('laytpl', function (laytpl) {

    var view = document.getElementById("keysView");
    var getTpl = document.getElementById("keysViewTpl").innerHTML;
    var controller = function (view) {
      try {
        var html = laytpl(getTpl).render(data);
        view.innerHTML = html;
      } catch (e) {
        view.innerHTML = '<span style="color: #c00;">' + e.toString() + '</span>';
      }
    };

    controller(view);
  });
}

function getAnswer() {
  showAnswer(true);
}

function showAnswer(isDisplay) {
  // document.getElementById("answerView").hidden = !isDisplay;
  document.getElementById("poem_view_container").hidden = !isDisplay;
}

function enableNavButtons(enable) {
  document.getElementById("btnNav").hidden = !enable;
}

function handleKeyClick(key) {
  keysArray.forEach((item, _index) => {
    if (item.key === key) {
      poemArray = item.value.list;
      NUM = poemArray.length;
      KEY = key;

      // 初始化提示
      document.getElementById("topicView").innerHTML = `飞花令关键字："${KEY}"`;
      document.getElementById("indexView").innerHTML = `"${KEY}"`;
      enableNavButtons(true);
      return;
    }
  });
}

// init()
var keysArray = [];
var poemArray = []; // init in getNext().
var index = 0;
var KEY = "";
var NUM = 0; // 题目数量

init();

showAnswer(false);
enableNavButtons(false);
