import fs from 'fs'
import Papa from 'papaparse'

function readFile (filePath: string): any {
  const file = fs.createReadStream(filePath)
  const parseStream = Papa.parse(Papa.NODE_STREAM_INPUT, {
    header: true
  })
  file.pipe(parseStream)
  parseStream.on('end', function () {
    console.log('Finished!')
  })

  return parseStream // Add a return statement here
}

export default readFile
