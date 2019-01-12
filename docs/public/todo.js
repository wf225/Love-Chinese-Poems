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
    default:
      break;
  }
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

function render(poem) {
  poem.contentList = poem.content.split("\n");

  viewRender('poem_view', "poemView", poem);
  // index_view
  document.getElementById("index_view").innerHTML = `${index} / ${NUM}`;
}

// init
let poemArray = getTodoList();
let index = 0;
let NUM = poemArray.length;

function getNext() {
  // 重新计数
  if (index === poemArray.length) {
    index = 0;
  }
  const jsonObj = poemArray[index++];
  render(jsonObj);
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
}

getNext();
