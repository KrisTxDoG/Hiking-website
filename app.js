// 以 Express 建立 Web 伺服器
var express = require("express");
var app = express();

// 以 body-parser 模組協助 Express 解析表單與JSON資料
var bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended: false}) );

// Web 伺服器的靜態檔案置於 public 資料夾
app.use( express.static( "public" ) );

// 以 express-session 管理狀態資訊
var session = require('express-session');
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true
}));

// 指定 esj 為 Express 的畫面處理引擎
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/view');

// 一切就緒，開始接受用戶端連線
app.listen(5544);
console.log("Web伺服器就緒，開始接受用戶端連線.");
console.log("「Ctrl + C」可結束伺服器程式.");


// 建立資料庫連線
var mysql = require('mysql');
var connection = mysql.createConnection({
	host : '127.0.0.1',
	user : 'root',
	password : 'root',
	database : 'labDB',
    port: 8889
    
});



connection.connect(function(err) {
	// if (err) throw err;
	if (err) {
		console.log(JSON.stringify(err));
		return;
	}
});

// get data
app.get("/home/news", function (request, response) {

	connection.query('select * from news', 
		'',
		function(err, rows) {
			if (err)	{
				console.log(JSON.stringify(err));
				return;
			}
			
			response.send(JSON.stringify(rows));
		}
	);
    
})

// Add data
app.post("/home/news", function(request, response){

        connection.query(

            "INSERT INTO news (title, ymd) VALUES (?, ?)",
            [
                request.body.title, 
                request.body.ymd
            ],
            function(error, result) {
                console.log(result);
                response.send("OK, row(s) inserted");
            }

    )

    }

)

// update
app.put("/home/news", function(request, response){

	connection.query(
		"UPDATE news SET title = ?, ymd = ? WHERE newsId =" + request.body.newsId,
		[
			request.body.title,
			request.body.ymd

		]);
		response.send("row updated");

})

// delete
app.delete("/home/news", function (request, response) {

	connection.query(
		"delete from news where newsId = " + request.body.newsId,
			[]
		);
	response.send("row deleted.");
    
})



