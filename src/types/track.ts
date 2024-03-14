export function parseCsvToTrack (line: string): Track {
  const fixedLine = line.replace(/"/g, '')
  const [firstPart, lastPart] = fixedLine.split('],[')
  if (lastPart === undefined || lastPart.length === 0) {
    throw new Error('Invalid line')
  }
  const [lineBeforeArtists, artists] = firstPart.split(',[')
  const [idArtists, lineAfterIdArtists] = lastPart.split('],')
  const [id, name, popularity, durationMs, explicit] = lineBeforeArtists.split(',')
  const [releaseDate, danceability, energy, key, loudness, mode, speechiness, acousticness, instrumentalness, liveness, valence, tempo, timeSignature] = lineAfterIdArtists.split(',')
  let [releaseYear, releaseMonth, releaseDay] = releaseDate.split('-')
  if (releaseYear === undefined) {
    releaseYear = '1900'
  }
  if (releaseMonth === undefined) {
    releaseMonth = '1'
  }
  if (releaseDay === undefined) {
    releaseDay = '1'
  }
  let danceabilityValue = Danceability.LOW
  const danceabilityNumber = parseFloat(danceability)
  if (danceabilityNumber >= 0.5) {
    danceabilityValue = Danceability.MEDIUM
  }
  if (danceabilityNumber >= 0.6) {
    danceabilityValue = Danceability.HIGH
  }

  return {
    id,
    name,
    popularity: parseInt(popularity),
    duration_ms: parseInt(durationMs),
    explicit: explicit === '1',
    artists: artists.split(','),
    id_artists: idArtists.split(','),
    release_year: parseInt(releaseYear),
    release_moth: parseInt(releaseMonth),
    release_day: parseInt(releaseDay),
    danceability: danceabilityValue,
    energy: parseFloat(energy),
    key: parseInt(key),
    loudness: parseFloat(loudness),
    mode: parseInt(mode),
    speechiness: parseFloat(speechiness),
    acousticness: parseFloat(acousticness),
    instrumentalness: parseFloat(instrumentalness),
    liveness: parseFloat(liveness),
    valence: parseFloat(valence),
    tempo: parseFloat(tempo),
    time_signature: parseInt(timeSignature)
  }
}

export interface Track {
  id: string
  name: string
  popularity: number
  duration_ms: number
  explicit: boolean
  artists: string[]
  id_artists: string[]
  release_year: number
  release_moth: number
  release_day: number
  danceability: Danceability
  energy: number
  key: number
  loudness: number
  mode: number
  speechiness: number
  acousticness: number
  instrumentalness: number
  liveness: number
  valence: number
  tempo: number
  time_signature: number
}

export enum Danceability {
  LOW,
  MEDIUM,
  HIGH
}
