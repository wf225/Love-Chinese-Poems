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

function getNext() {
  console.log(index);

  if (poemArray.length === 0 || index === NUM) {
    // 一次抽取100题
    poemArray = getQuestions(NUM);

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

  viewRender('topic_view2', "topicView", jsonObj);
  viewRender('answer_view', "answerView", jsonObj);
  viewRender('poem_view', "poemView", poem);
  // index_view
  document.getElementById("index_view").innerHTML = `${index}/${NUM}`;
}

function getAnswer() {
  showAnswer(true);
}

function showAnswer(isDisplay) {
  document.getElementById("answer_view").hidden = !isDisplay;
  document.getElementById("poem_view_container").hidden = !isDisplay;
}

// init()
let poemArray = Array(); // init in getNext().
let index = 0;
let NUM = 100; // 每次抽取的题目数量, 如果大于文章数量，将自动调整
showAnswer(false);
