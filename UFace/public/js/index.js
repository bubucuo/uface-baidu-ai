 function uploadImg() {
      var formData = new FormData();
      formData.append("file", $("#upload")[0].files[0]);
      $.ajax({
        type: 'POST',
        url: './file/uploading',
        data: formData,
        processData: false,
        contentType: false,
        success: function(res) {
          var json = JSON.parse(res)
          createFace(json);
  //从后端获取到人脸检测到结果后，调用createFace函数，进行图片合成  
        }
      });
    };

    function createFace(json) {
      var jzimg = $('#jz')[0];
      var img = $('#target')[0];
      var canvas = $('#canvas')[0];
      var ctx = canvas.getContext('2d');
      var sx = json.result[0].location.left,
        sy = json.result[0].location.top,
        swidth = json.result[0].location.width,
        sheight = json.result[0].location.height;
      img.src = json.imgSrc
      img.onload = function() { //异步
        ctx.drawImage(jzimg, 0, 0);
        ctx.drawImage(img, sx, sy, swidth, sheight, 210, 68, 70, 48);
      } 
    };