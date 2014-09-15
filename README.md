 ========= =========  
 ToDoリスト　
 フロントエンド＋サーバーサイド
 ========= =========

####[ソフト名]
ToDoリスト
####[製作者]
藤原　新
####[開発環境]
Emacs
####[動作環境]
Mac OSX 10.9.4
Google Chorome
####[概要]
TeamLabオンラインスキルアップStep2の課題である，ToDoリストのリポジトリ．
####[内容物]
'lists.csv'と'todos.csv'はデータベースをエクスポートしたデータである．
ajaxTestはExpressのデータである．


db:OnlineSkillUp
collections:lists,todos
listsはリストの名前とID
todosはToDoのID，名前，チェック，作られた日，期限日，属するリスト
のデータベースである．
####[使い方]
シェルで'sudo npm start'を実行し，
ブラウザでlocalhost:3000にアクセスする．
######[ヘッダー]
左上の'TODOリスト'をクリックすることで，Top画面に遷移する．
右上の'検索'をクリックすることで，検索画面に遷移する．
######[Top画面]
リストを表示している画面．
リスト名をテキストボックスに記入し，'リストを追加する'をクリックすることで，
リストが追加される．
リストのボタンをクリックすることで，TODO画面に遷移し，リストに登録されたTODOが
表示される．
######[TODO画面]
TODOを表示する画面．
TODO名，期限をリスト内に記述し，'ToDoを作成する'をクリックすることで，新しいTODOが追加
される．TODOは作った日が新しい順に表示される．TODOをクリックするとチェックが付き，そのデータはDBに
保存される．
######[検索画面]
TODOを検索する画面．
単語を入れて検索するとその単語を含むTODOが表示される．






