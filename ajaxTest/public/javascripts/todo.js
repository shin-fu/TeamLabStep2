//画面遷移用定数
var TOP = 0;
var TODO = 1;
var SEARCH = 2;
//現在の画面
var viewMode = TOP;
//選択されているリスト
var currentList = null;


$(function(){
	getList();
});

// フォームを送信ボタンを押すと、ToDoを追加して再表示する。
$('#form').submit(function(){
	post();
	return false;
});
//タイトルボタンによりTopに遷移する
$('#title').click(function(){
	viewMode = TOP;
	flash();
});
$('#title').css('cursor','pointer');
$('#search').click(function(){
	viewMode = SEARCH;
	flash();
});
$('#search').css('cursor','pointer');

//画面を更新する
function flash(){
	switch(viewMode){
		case TOP:getList();break;
		case TODO:getTodo();break;
		case SEARCH:getSearch();break;
	}
}
//入力を受け取る
function post(){
	switch(viewMode){
		case TOP:postList();break;
		case TODO:postTodo();break;
		case SEARCH:showResult();break;
	}
}
//todoを取得し，画面に表示する
function getTodo(){
	$('#limitForm').show();
	var $list = $('.list');
	$list.val('');
	$('#submit').val('ToDoを作成する');
	$list.fadeOut(function(){
		$list.children().remove();
		$list.append('<h3 class="headline">'+currentList.text+'</h3>');
		$.get('/todo',{root:currentList._id},function(lists){
			if(lists.length===0){
				$list.append('<p>ToDoは登録されていません</p>');
			}
			// 時系列順にソート
      		lists.sort(function(a,b){
      			return new Date(a.createdDate) < new Date(b.createdDate) ? 1:-1;
      		});
			$.each(lists,function(index,todo){
				var c = '';
				if(todo.isCheck){
					c = 'checked'
				}
				var st = '';
     	 		st += '<input type=\"checkbox\" id=\"checkbox_';
		        st += todo._id + '\" value=\"';
		        st += todo._id + '\" class=\"checkbox\" '+c+' >';
		        st += '<label for=\"checkbox_'+todo._id+'\"class=\"checkbox\" id=label_'+todo._id+'>';
		        st += todo.text+'</br>期限日'+new Date(todo.limitDate).toLocaleString()+'</br>';
		        st += '作成日'+new Date(todo.createdDate).toLocaleString()+'</label>'
		        $list.append(st);
		        $('#checkbox_'+todo._id).change(function(){
		        	var cb = $(this);
		        	var checked =cb.prop("checked");
		        	console.log(todo._id);
		        	console.log(checked);
		        	$.post('/todo',{checked:checked,_id:todo._id},function(res){
		        		console.log(res);
		        	});
		        });
			});
		});
		$list.fadeIn();
	});
}

// Listを取得して表示する
function getList(){
  $('#limitForm').hide();
  // すでに表示されている一覧を非表示にして削除する
  var $list = $('.list');
  $('#submit').val('リストを追加する');
  $list.fadeOut(function(){
  	$list.children().remove();
  	$list.append('<h3 class="headline">リストの一覧</h3>');
    // /todoにGETアクセスする
    $.get('/list', function(lists){
      // 取得したToDoを追加していく
      $.each(lists, function(index, list){
      	var text = list.text;
      	console.log(list);
      	$.get('/todo',{root:list._id},function(res){
      		var cnt=0;
      		var minDate=null;
      		$.each(res,function(index,todo){
      			if(todo.isCheck){
      				cnt++;
      			}
      			var limitDate=new Date(todo.limitDate);
      			if(minDate){
      				if(minDate>limitDate)minDate=limitDate;
      			}else{
      				minDate = limitDate;
      			}
      		});
      		//リストを表示
	      	var st = '<button id='+list._id+' class="liststyle"><b><font size=4>'+text+'</font></b></br>';
	      	st += res.length+'個中'+cnt+'個のタスクが完了<br>';
	      	if(minDate){
	      		console.log(typeof(minDate));
	      		st += minDate.toLocaleString()+'~';
	      	}
	      	$list.append(st);
		    $('#'+list._id).click(function(){
      			viewMode = TODO;
      			$.get('/list',{name:list.text},function(res){
      				currentList = res;
	      		});
      		flash();
	      	});
	      	$('#'+list.text).css('cursor','pointer');
      	});
      });
      // 一覧を表示する
      $list.fadeIn();
  });
});
}

function escapeText(text) {
    return $("<div>").text(text).html();
}

// 入力チェックを行う
function checkText(text,isList) {
    // 文字数が0または30以上は不可
    if (0 === text.length || 30 < text.length) {
	    alert("文字数は1〜30字にしてください");
	    return false;
	}
	return true;
}

// フォームに入力されたListを追加する
function postList(){
  // フォームに入力された値を取得
  var name = $('#text').val();
  name = escapeText(name);
  //入力項目を空にする
  $('#text').val('');
  // /listにPOSTアクセスする
	if(checkText(name)){
	  $.post('/list', {name: name}, function(res){
	  	console.log(res);
	    //再度表示する
	    flash();
	  });
	}
}

function postTodo(){
	var name = $('#text').val();
	var limitDate = new Date($('#limit').val());
	var root = currentList._id;
	console.log(name);
	$('#text').val('');
	$('#limit').val('');
	name = escapeText(name);
	if(checkText(name)){
		$.post('/todo',{name:name,limit:limitDate,root:root},function(res){
			console.log(res);
			flash();
		});
	}
}

function getSearch(){
	$('#limitForm').hide();
	$('#submit').val('検索する');
	var $list = $('.list');
	$list.val('');
	$list.children().remove();
}
function showResult(){
	$('#limitForm').hide();
	$('#submit').val('検索する');
	var $list = $('.list');
	var query = $('#text').val();
	$list.val('');
	$('#text').val('');
	$list.children().remove();
	$.get('/todo',{},function(res){
		$.each(res,function(index,todo){
			if(todo.text.indexOf(query) != -1){
				var c = '';
				if(todo.isCheck){
					c = 'checked'
				}
				var st = '';
     	 		st += '<input type=\"checkbox\" id=\"checkbox_';
		        st += todo._id + '\" value=\"';
		        st += todo._id + '\" class=\"checkbox\" '+c+' >';
		        st += '<label for=\"checkbox_'+todo._id+'\"class=\"checkbox\" id=label_'+todo._id+'>';
		        st += todo.text+'</br>期限日'+new Date(todo.limitDate).toLocaleString()+'</br>';
		        st += '作成日'+new Date(todo.createdDate).toLocaleString()+'</label>'
		        $list.append(st);
		        $('#checkbox_'+todo._id).change(function(){
		        	var cb = $(this);
		        	var checked =cb.prop("checked");
		        	console.log(todo._id);
		        	console.log(checked);
		        	$.post('/todo',{checked:checked,_id:todo._id},function(res){
		        		console.log(res);
		        	});
		        });
			}
		});
	});
}