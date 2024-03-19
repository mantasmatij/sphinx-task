import { Readable } from 'stream'
import fs from 'fs'

export async function readFileByChunks (filePath: string, chunkSize: number): Promise<Readable> {
  const readableStream = new Readable({
    read () {}
  })

  let currentPosition = 0

  try {
    const fileStats = await fs.promises.stat(filePath)
    const fileSize = fileStats.size
    const fileDescriptor = await fs.promises.open(filePath, 'r');

    (async () => {
      try {
        const buffer = Buffer.alloc(chunkSize)

        while (currentPosition < fileSize) {
          const { bytesRead } = await fileDescriptor.read(buffer, 0, chunkSize, currentPosition)

          if (bytesRead === 0) {
            break // Reached end of file
          }

          let chunk = buffer.subarray(0, bytesRead)
          const lastNewlineIndex = chunk.lastIndexOf('\n')

          if (lastNewlineIndex !== -1 && lastNewlineIndex < bytesRead - 1) {
            chunk = chunk.subarray(0, lastNewlineIndex + 1)
          }

          readableStream.push(chunk)

          currentPosition += bytesRead
        }

        readableStream.push(null) // End of stream
      } finally {
        await fileDescriptor.close()
      }
    })().catch(error => {
      console.error('Error reading file:', error)
      readableStream.destroy(error as Error)
    })
  } catch (error) {
    console.error('Error reading file:', error)
    readableStream.destroy(error as Error)
  }

  return readableStream
}
