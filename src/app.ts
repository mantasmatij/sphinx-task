import express from 'express'
import { chunkToTrack, hasAName, isLongerThanAMinute, type Track } from './types/track'
import Papa from 'papaparse'
import fs from 'fs'
import stream from 'stream'
import { createArtist, createTrack } from './database'
import { type Artist, chunkToArtist, hasTracks } from './types/artist'
import { uploadFile } from './util/awsFileStorage'
const app = express()

app.set('port', process.env.PORT ?? 3000)
const tracksFilePath = './data/tracks.csv'

const transformTrack = new stream.Transform({
  objectMode: true,
  transform: (chunk, _encoding, callback) => {
    callback(null, chunkToTrack(chunk))
  }
})

const transformArtist = new stream.Transform({
  objectMode: true,
  transform: (chunk, _encoding, callback) => {
    callback(null, chunkToArtist(chunk))
  }
})

const trackFileStream = fs.createReadStream(tracksFilePath, { encoding: 'utf8' })
const fileOutputStream = fs.createWriteStream('./data/filteredTracks.csv')
const artistFileStream = fs.createReadStream('./data/artists.csv', { encoding: 'utf8' })
const artistOutputStream = fs.createWriteStream('./data/filteredArtists.csv')

trackFileStream
  .pipe(new stream.PassThrough({
    objectMode: true,
    transform (chunk, _encoding, callback) {
      callback(null, chunk.toString())
    }
  }))
  .pipe(Papa.parse(Papa.NODE_STREAM_INPUT, {
    header: true,
    dynamicTyping: true,
    delimiter: ',',
    quoteChar: '"',
    newline: '\n',
    skipEmptyLines: true
  }))
  .pipe(transformTrack)
  .filter(hasAName).filter(isLongerThanAMinute)
  .on('data', (track) => {
    void createTrack(track as Track)
      .then((createdTrack) => {
        if (createdTrack != null) {
          fileOutputStream.write(Papa.unparse<Track>([createdTrack], {
            header: false
          }) + '\n', 'utf8')
        }
      })
  })
  .on('end', () => {
    console.log('Done processing tracks.')
    console.log('Uploading file to S3...')
    void uploadFile('./data/filteredTracks.csv', 'sphinx-files')
    processArtists.resume().filter(hasTracks)
      .on('data', (artist) => {
        void createArtist(artist as Artist)
          .then((createdArtist) => {
            if (createdArtist != null) {
              artistOutputStream.write(Papa.unparse<Artist>([createdArtist], {
                header: false
              }) + '\n', 'utf8')
            }
          })
      })
      .on('end', () => {
        console.log('Done processing artists.')
        console.log('Uploading file to S3...')
        void uploadFile('./data/filteredArtists.csv', 'sphinx-files')
      })
  })

const processArtists = artistFileStream
  .pipe(new stream.PassThrough({
    objectMode: true,
    transform (chunk, _encoding, callback) {
      callback(null, chunk.toString())
    }
  }))
  .pipe(Papa.parse(Papa.NODE_STREAM_INPUT, {
    header: true,
    dynamicTyping: true
  }))
  .pipe(transformArtist)
  .pause()

export default app
