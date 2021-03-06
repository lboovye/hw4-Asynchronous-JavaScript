window.onload = function(){
	addEvent();
  aPlussEvent();
}

function getMylist(){
  return document.getElementById("control-ring").getElementsByTagName("li");
}

// a+ 的事件
function addEvent(){
  document.getElementsByClassName('apb')[0].onclick = function(){
    addLiClick(0);
  }
}

// 给li的onclick添加addClick函数
function addLiClick(i){
  var mylist = getMylist();
  if(i>=mylist.length)
    return;
  mylist[i].disabled = true;
  beforeClick(mylist,i);
  sendAjax(mylist[i],i, function(data) {
    mylist[i].querySelector('span').innerText = data;
    allowOtherLi(mylist,i);
    bigIsReady();
    setTimeout("addLiClick("+(i+1)+")",500);
  });
}

//发送ajax
function sendAjax(ob,i, callback){
  var xhr = new XMLHttpRequest();
  var mylist = getMylist();
  xhr.open("get","/",true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if( xhr.readyState == 4  && xhr.status == 200 ||xhr.status == 304) {
      callback(xhr.responseText);
    }
  }
}

//点击li，等待服务器反应
function beforeClick(list,i){
  num = document.createElement("span");
  num.className = "num";
  num.innerText = "...";
  list[i].appendChild(num);
  forbitOtherLi(list,i);
}

//灭活其他li，使它不可点击
function forbitOtherLi(list,i){
  for(var j=0;j<list.length;j++){
    if(j!=i){
      fbLi(list[j]);
    }
  }
}

//灭活某个li
function fbLi(ob){
  ob.onclick = null;
  ob.style.background = "rgba(0,0,20,.6)";
}

//激活其他li 使得其可以被点击,灭活当前的mylist[i]
function allowOtherLi(list,i){
  if(i>=0)
    fbLi(list[i]);
  for(var j=0;j<list.length;j++){
    if(j!=i && !list[j].querySelector("span")){
      alLi(list[j], j);
    }
  }
}

//激活某个li
function alLi(ob,i){
  ob.style.background = "rgb(34,72,157)";
}

//判断大气泡是否激活
function bigIsReady(){
  var info_bar = true;
  var list = getMylist();
  for(var j=0;j<list.length;j++){
    if(!list[j].querySelector('span')){
       info_bar = false;
    }
  }
  if(info_bar){
    bubble();
  }
}

//大气泡被激活
function bubble(){
  alBubble();
  var sum = 0;
  var mylist = getMylist();
  for(var i=0;i<mylist.length;i++){
    sum+=parseInt( mylist[i].querySelector('span').innerText);
  }
  document.getElementById('sum').innerText = sum.toString();
  var t = setTimeout("fbBubble()",1000);
}

//大气泡激活显示
function alBubble(){
  var temp = document.getElementById('info-bar');
  temp.style.background = "rgb(34,72,157)";
  temp.style.boxShadow = "0 0  30px  rgba(0, 204, 204, .5)";
}

//灭活大气泡
function fbBubble(){
  var temp = document.getElementById('info-bar');
  temp.style.background = "rgba(0,0,10,.4)";
  temp.style.boxShadow = "0 0 30px transparent";
  temp.onclick = null;
}

// 添加a+事件
function aPlussEvent(){
  var aPluss = document.getElementById('at-plus-container');
  aPluss.onmouseleave = function(){
    var mylist = getMylist();
    for(var i=0;i<mylist.length;i++){
      if(mylist[i].querySelector("span"))
        mylist[i].removeChild(mylist[i].querySelector("span"));
    }
    allowOtherLi(mylist,-1);
    fbBubble();
    document.getElementById('sum').innerText = "";
  }
}