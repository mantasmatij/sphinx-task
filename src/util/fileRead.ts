import fs from 'fs'
import readline from 'readline'

async function * readFile (filePath: string): AsyncGenerator<string> {
  const readStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({
    input: readStream
  })
  let firstLine = true
  for await (const line of rl) {
    if (firstLine) {
      firstLine = false
      return
    }
    yield line
  }
}

export default readFile
