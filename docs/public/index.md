# 
  <link rel="stylesheet" href="./res/layui/css/layui.css">
  <link rel="stylesheet" href="./res/static/css/index.css">
  <script src="./res/layui/layui.js"></script>
  <script src="./js/dataSource.js"></script>
  <script src="./js/loader.js"></script>

  <!-- nav部分 -->
  <div class="nav">
    <div class="layui-container">
      <div class="nav-list">
        <ul class="layui-nav">
          <li class="layui-nav-item layui-this"><a href="./">答题</a></li>
          <li class="layui-nav-item"><a href="todo">学习</a></li>
          <li class="layui-nav-item"><a href="review">回顾</a></li>
          <li class="layui-nav-item"><a href="feihua">飞花令</a></li>
        </ul>
        <ul class="layui-nav-right">
          <a class="layui-btn layui-btn-primary" onclick="getAnswer()">答案</a>
          <a class="layui-btn layui-btn-primary" onclick="getPrevious()">上一个</a>
          <a class="layui-btn layui-btn-primary layui-this" onclick="getNext()">下一个</a>
        </ul>
      </div>
      <span id="index_view" class="nav-index"></span>
    </div>
  </div>

  <!-- main部分 -->
  <div class="main-about">
    <div class="layui-container">
      <div class="layui-row">
        <div class="tabJob">
          <div class="content">
            <ul>
              <li>
                <p id="topic_view2">爱上古诗：100题闯关</p>
              </li>
              <li>
                <p id="answer_view" style="color: #ff00a3"></p>
              </li>
            </ul>
          </div>
          <div id="poem_view_container">
            <p id="poem_view"></p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script id="topicView" type="text/html">
    {{ d.topic }}
  </script>

  <script id="answerView" type="text/html">
    {{ d.answer }}
  </script>

  <script id="poemView" type="text/html">
    <section class="section">
      <div class="border">
        <div class="container">
          <div class="left-ball"></div>
          <div class="right-ball"></div>
        </div>
        <article>
          <p class="title">
            {{# if(d.url === ""){ }}
              <a style="color: #0000ff" href ="https://baike.baidu.com/item/{{ d.title }}" target="_blank">{{ d.title }}</a>
            {{# }else{ }}
              <a style="color: #0000ff" href ="{{ d.url }}" target="_blank">{{ d.title }}</a>
            {{# } }}
          </p>
          <p class="author">{{ d.author }}</p>
          <!-- contentList -->
          {{#  layui.each(d.contentList, function(index, item){ }}
          <p>{{ item }}</p>
          {{#  }); }}
          <!-- contentList is empty -->
          {{#  if(d.contentList.length === 0){ }}
            无数据
          {{#  } }}
        </article>
      </div>
    </section>
  </script>

  <!--[if lt IE 9]>
  <script src="https://cdn.staticfile.org/html5shiv/r29/html5.min.js"></script>
  <script src="https://cdn.staticfile.org/respond.js/1.4.2/respond.min.js"></script>
  <![endif]-->
  <script>
    layui.config({
      base: './res/static/js/'
    }).use('firm');
  </script>

  <script src="./index.js">
  </script>
