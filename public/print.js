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

function render(poemArray) {
  viewRender('poem_view', "poemView", poemArray);
}

// init
let poemArray = getPrintList();
render(poemArray);
