var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');



var app = http.createServer(function(request,response){
    var _url = request.url; // request.url은 요청한 pathname + queryString = path
    var queryData = url.parse(_url, true).query; // queryString
    var pathname = url.parse(_url, true).pathname;
    if (pathname === `/`) {
      // Read Home (just '/')
      if(!queryData.id) {
        fs.readdir('./data', (err , files) => {
          var list = template.list(files);
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var html = template.html(title, list, `<h2>${title}</h2>
          <p>${description}<p>`, `<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(html);
          
        });
      // Read a specific page ('/?id=specific item in list')
      } else {
        fs.readdir('./data', (err , files) => {
          var filteredId = path.parse(queryData.id).base;
          if (files.includes(filteredId)){
            fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => { 
              var list = template.list(files);
              var title = queryData.id;
              var sanitizedTitle = sanitizeHtml(title);
              var sanitizedDescription = sanitizeHtml(description, {
                allowedTags: ['h1']
              });
              var html = template.html(sanitizedTitle, list, 
                `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}<p>`,
                `<a href="/create">create</a>
                <form action="/delete_process" method="post"> 
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete"> 
                </form>
                <a href="/update?id=${sanitizedTitle}">update</a>`);              
              response.writeHead(200);
              response.end(html); 
            });
          } else {
            response.writeHead(404);
            response.end('Not found');
          };
        });
      };
    // Create a page
    } else if(pathname === '/create'){
      fs.readdir('./data', (err , files) => {
        var list = template.list(files);
        var title = 'WEB - create';
        var html = template.html(title, list, `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
          </form>
        `, '');
        response.writeHead(200);
        response.end(html);
        
      });
    // Create a page and Make a file in data folder
    } else if(pathname === '/create_process') {
      // if (request.method == 'POST') {
        var body = '';

        request.on('data', (data) => {
            body += data;
        });
        
        request.on('end', () => {
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          var filteredTitle = path.parse(title).base;
          fs.readdir('./data', (err , files) => {
            if (files.includes(filteredTitle) === false){
              fs.writeFile(`data/${filteredTitle}`, description, 'utf8', (err) => {
                if(err){
                  console.log(`\n-- '${filteredTitle} file' : Failed Create --\n`)
                  throw err;
                } else{
                  console.log(`\n-- '${filteredTitle} file' : Completed Create --\n`)
                  response.writeHead(302, {Location: `/?id=${filteredTitle}`});
                  response.end();
                }
              });
            } else {
              response.writeHead(404);
              response.end('failed Create : Require a different name.\nTry to do again!');
            };
          });
        });
    // }
    // Update a specific page
    } else if(pathname === '/update') {
      fs.readdir('./data', (err , files) => {
        var filteredId = path.parse(queryData.id).base;
        if (files.includes(filteredId)){
          fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => { 
            var list = template.list(files);
            var title = filteredId;
            var html = template.html(title, list, 
              `
              <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
              </form>
              `,
              `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);              
            response.writeHead(200);
            response.end(html); 
          });
        } else {
          response.writeHead(404);
          response.end('Not found');
        };
      });
    // Update a specific page and Update specific data file in data 
    } else if (pathname === '/update_process') {
      var body = '';

      request.on('data', (data) => {
          body += data;
      });
      
      request.on('end', () => {
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var filteredId = path.parse(id).base;
        var filteredTitle = path.parse(title).base;
        var description = post.description;
        fs.readdir('./data', (err , files) => {
          
          if (filteredTitle !== filteredId) {
            if (files.includes(filteredTitle) === false){
              fs.rename(`data/${filteredId}`, `data/${filteredTitle}`, (err)=>{
                  if (err) {
                    console.log(`\n-- '${filteredId} -> ${filteredTitle} file' : Failed Rename --\n`);
                    throw err;
                  } else {
                    console.log(`\n-- '${filteredId} -> ${filteredTitle} file' : Completed Rename ! --\n`);
                    fs.writeFile(`data/${filteredTitle}`, description, 'utf8', (err) => {
                      if(err){
                        console.log(`\n-- '${filteredId} -> ${filteredTitle} file' : Failed Update description --\n`);
                        throw err;
                      } else{
                        console.log(`\n-- '${filteredId} -> ${filteredTitle} file' : Completed Update ! --\n`)
                        response.writeHead(302, {Location: `/?id=${filteredTitle}`});
                        response.end();
                      }
                    });
                  }
              });
            } else {
              response.writeHead(404);
              response.end('failed Update : Require a different name.\nTry to do again!');
            }; 

          } else {
            fs.writeFile(`data/${filteredTitle}`, description, 'utf8', (err) => {
              if(err){
                console.log(`\n-- '${filteredId} -> ${filteredTitle} file' : Failed Update description --\n`);
                throw err;
              } else{
                console.log(`\n-- '${filteredId} -> ${filteredTitle} file' : Completed Update ! --\n`)
                response.writeHead(302, {Location: `/?id=${filteredTitle}`});
                response.end();
              }
            });
          
          }; 
        });
      });
    // Delete a specific file in data folder
    } else if (pathname === "/delete_process") {
      var body = '';

      request.on('data', (data) => {
          body += data;
      });
      
      request.on('end', () => {
          var post = qs.parse(body);
          var id = post.id;
          var filteredId = path.parse(id).base;
          fs.unlink(`data/${filteredId}`, (err)=>{
              if (err) {
                console.log(`\n-- '${filteredId} file' : Failed Delete --\n`)
                throw err;
              } else {
                console.log(`\n-- '${filteredId} file' : Completed Delete --\n`)
                response.writeHead(302, {Location: `/`});
                response.end();
              }
          });
      });
    } else {
    response.writeHead(404);
    response.end('Not found');
  }
  
});
app.listen(3000);

