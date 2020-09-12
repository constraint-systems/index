let fs = require('fs')
let path = require('path')
let matter = require('gray-matter')
let { exec } = require('child_process')

// this script writes the resolution of the tool gif images to the tool entry files

fs.readdir('../content/tools_content', (err, files) => {
  if (err) console.log(err)

  let queue = files
  console.log(queue)

  function runNext() {
    let file = queue.splice(0, 1)[0]
    fs.readFile('../content/tools_content/' + file, 'utf8', function(
      err,
      data
    ) {
      if (err) throw err

      let content = matter(data)
      let img_path = '../static/images/tool_gifs/' + content.data.image

      exec(`convert ${img_path} -print "%w,%h\n" /dev/null`, (err, stdout) => {
        if (err) {
          console.log(err)
        } else {
          let dims = stdout.split(',').map(v => parseInt(v))
          delete content.data.image_resolution
          content.data.aspect_ratio = dims[0] / dims[1]
          let new_content = content.stringify()
          fs.writeFile(
            '../content/tools_content/' + file,
            new_content,
            'utf-8',
            function(err, data) {
              if (err) throw err
              console.log('written')
              if (queue.length > 0) {
                runNext()
              }
            }
          )
        }
      })
    })
  }
  runNext()

  // files.forEach(file => {
  // })
})
