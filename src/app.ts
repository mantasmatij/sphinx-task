import express from 'express'
import { Readable } from 'stream'
import readFile from './fileRead.js'

const app = express()
const port = 3000
const artistsFilePath = './data/artists.csv'
const tracksFilePath = './data/tracks.csv'

const readArtists = Readable.from(readFile(artistsFilePath))
const readTracks = Readable.from(readFile(tracksFilePath))

readArtists.on('data', (line) => {
  console.log(line)
})

readTracks.on('data', (line) => {
  console.log(line)
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Express izs listening at http://localhost:${port}`)
})
