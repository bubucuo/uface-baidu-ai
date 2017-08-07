# uface-baidu-ai
人民日报的换军装，利用了baidu-ai、canvas、node、express

主要参考：https://www.youyong.top/article/11597fcc6b4ee?yyfr=sf，这里大神有些小细节没有写，由于我还是小白，看了很久，才把代码全部写出来。因此写出了详细的步骤，有不懂的可以再私信我 bubucuovinci@163.com，目前只是写出了最简单的一部分，接下来再调整整体脸色。

环境搭建（主要来自https://www.youyong.top/article/11597fcc6b4ee?yyfr=sf，稍有补充）：
1. express -e ejs  UFace （没有express的需要事先安装），生成的package.json中最后加一个"multiparty": "latest"，这个在最后上传图片（3.7步骤）的时候需要依赖。
2. 调通后端接口：
    2.0 UFace目录下安装依赖文件，npm install，生成node_modules文件夹
    2.1 找到 views/index.ejs 文件，添加
    <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
    2.2 找到routes/index.js文件，添加
        router.post('/', function(req, res, next) {
          res.send('UFace post ok')
        });

    2.3 终端输入 node bin/www
        浏览器访问：http://localhost:3000/

    2.4 打开开发者工具，在console里调试接口，输入：
        $.post("/", function(data) {
          console.log(data);
        });
    看到控制台打印出：UFace post ok
    自此，我们的前后端调通了。
3. 百度ai人脸识别环境补充
    3.0  UFace/node_modules下面新建文件夹baidu-ai
    3.1 下载node SDK压缩包，下载地址：http://ai.baidu.com/sdk#sdk-category-bfr
    3.2 UFace/node_modules/baidu-ai下解压aip-node-sdk-1.1.0.zip，选择解压到当前文件夹即可，在该文件夹下npm install，安装sdk依赖库
    3.3 在百度AI中申请好APPID；就是右上角的控制台处，然后页面下方点击人脸识别，创建应用或者管理应用。地址：https://console.bce.baidu.com/ai/?fromai=1#/ai/face/app/list
    3.4 继续到routes/index.js文件中，加入

        var AipFace = require("baidu-ai").face;

        var APP_ID = "9964551";
        var API_KEY = "fCTk95tO6MIKgROeBhBEigcD";
        var SECRET_KEY = "E8Ij9ftcDMhu5h2b898TzzYzem0161Dc";
         //这三个key记得替换为你申请的appid 

        var client = new AipFace(APP_ID, API_KEY, SECRET_KEY); 
        （注意：routes中文件更改的话，node bin/www命令需重启）
    3.5 上传本地的一张图片，调试下百度AI接口

        var fs = require('fs');
        var image = fs.readFileSync('./public/images/face/face.png');
        var base64Img = new Buffer(image).toString('base64');

        client.detect(base64Img).then(function(result) {  
             console.log(JSON.stringify(result)); 
        });
        终端打印出获取到的结果，接口获取成功。
    3.6 找到 views/index.ejs 文件，添加  <script src="/javascripts/index.js"></script>
        然后在javascripts中添加index.js文件，具体代码参看文件
    3.7 找到routes/index.js文件，添加
        var multiparty = require('multiparty');
        var util=require('util');
        var fs = require('fs');

        router.post('/file/uploading', function(req, res, next) {

          var form = new multiparty.Form({
            uploadDir: './public/files/'
          });
         
          form.parse(req, function(err, fields, files) {
            var filesTmp = JSON.stringify(files, null, 2);

            if (err) {
              console.log('parse error: ' + err);
            } else {
              console.log('parse files: ' + filesTmp);

              var inputFile = files.file[0];
              var uploadedPath = inputFile.path;

              var image = fs.readFileSync(uploadedPath);
              var base64Img = new Buffer(image).toString('base64');

              client.detect(base64Img).then(function(result) {
                  res.send(JSON.stringify(result));
              });

            };

          });

        });
    3.8 UFace/public中新建files文件，存放生成的图片
    3.9 UFace/public中我存放了一张脸部透明的军装照片，UFace/public/javascripts/index.js中参数是按照这张军装照片的写的，如果你想换照片，参数也需要更换。
        face文件夹中我存了两张大头贴，当然你也可以自己找图片。









