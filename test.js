var http = require('http');
var fs = require('fs');
var url = require('url');


var app = http.createServer(function(request,response){
    var _url = request.url; // request.url은 요청한 pathname + queryString = path
    var queryData = url.parse(_url, true).query; // queryString
    var pathname = url.parse(_url, true).pathname;
    if (pathname === `/`) {
      if(!queryData.id) {
        fs.readdir('./data', (err , files) => {
          var list = '<ul>';
          var i = 0;
          while(i < files.length) {
            list = list + `<li><a href="/?id=${files[i]}">${files[i]}</a></li>`
            // i = i + 1 
            i += 1        
            }
            list = list + '</ul>';

          // var list = `<ul>
          //   <li><a href="/?id=HTML">HTML</a></li>
          //   <li><a href="/?id=CSS">CSS</a></li>
          //   <li><a href="/?id=JavaScript">JavaScript</a></li>
          // </ul>`

          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var template = `
          <!doctype html>
          <html>
          <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
          </head>
          <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <h2>${title}</h2>
          <p>${description}<p>
          </body>
          </html>
          `;
          response.writeHead(200);
          response.end(template);
          
        });
        
      } else {
        fs.readdir('./data', (err , files) => {
          var list = '<ul>';
          var i = 0;
          while(i < files.length) {
            list = list + `<li><a href="/?id=${files[i]}">${files[i]}</a></li>`
            // i = i + 1
            i += 1         
            }
            list = list + '</ul>';
          fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => { 
            var title = queryData.id;
            var template = `
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            ${description}
            </body>
            </html>
            `;
            response.writeHead(200);
            response.end(template); 
          });
        });
      };
    } else {
    response.writeHead(404);
    response.end('Not found');
  }
  
});
app.listen(3000);

