module.exports = {
    html : (title, list, body, control) => {
      return `
      <!doctype html>
      <html>
      <head>
      <title>WEB - ${title}</title>
      <meta charset="utf-8">
      </head>
      <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
      </body>
      </html>
      `;
    },
  
    list : (files) => {
      var list = '<ul>';
      files.forEach((file) => {
         list = list + `<li><a href="/?id=${file}">${file}</a></li>`
      })
      list = list + '</ul>';
      return list;
    }
  }


// const template = {
//     html : (title, list, body, control) => {
//       return `
//       <!doctype html>
//       <html>
//       <head>
//       <title>WEB - ${title}</title>
//       <meta charset="utf-8">
//       </head>
//       <body>
//       <h1><a href="/">WEB</a></h1>
//       ${list}
//       ${control}
//       ${body}
//       </body>
//       </html>
//       `;
//     },
  
//     list : (files) => {
//       var list = '<ul>';
//       files.forEach((file) => {
//          list = list + `<li><a href="/?id=${file}">${file}</a></li>`
//       })
//       list = list + '</ul>';
//       return list;
//     }
//   }

// module.exports = template;

