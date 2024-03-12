import express from 'express'
import { Readable } from 'stream'
import readFile from './util/fileRead.js'

const app = express()

app.set('port', process.env.PORT ?? 3000)
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

export default app
