export function isLongerThanAMinute (track: Track): boolean {
  return track.duration_ms >= 60000
}

export function hasAName (track: Track): boolean {
  return track.name !== ''
}

export function chunkToTrack (chunk: any): Track {
  const escapedIdArtists = chunk.id_artists.replace(/['\[\]]/g, '').split(',')

  const releaseDate = chunk.release_date.toString()
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
  const danceabilityNumber = parseFloat(chunk.danceability as string)
  if (danceabilityNumber >= 0.5) {
    danceabilityValue = Danceability.MEDIUM
  }
  if (danceabilityNumber >= 0.6) {
    danceabilityValue = Danceability.HIGH
  }

  if (chunk.id === null || chunk.id === undefined || chunk.id === '') {
    chunk.id = uuidv4()
  }

  if (chunk.name === null || chunk.id === undefined || chunk.id === '') {
    chunk.name = ''
  }

  return {
    id: chunk.id.toString(),
    name: chunk.name.toString(),
    popularity: parseInt(chunk.popularity as string),
    duration_ms: parseInt(chunk.duration_ms as string),
    explicit: parseInt(chunk.explicit as string),
    artists: chunk.artists.split(','),
    id_artists: escapedIdArtists,
    release_year: parseInt(releaseYear as string),
    release_month: parseInt(releaseMonth as string),
    release_day: parseInt(releaseDay as string),
    danceability: danceabilityValue,
    energy: parseFloat(chunk.energy as string),
    key: parseInt(chunk.key as string),
    loudness: parseFloat(chunk.loudness as string),
    mode: parseInt(chunk.mode as string),
    speechiness: parseFloat(chunk.speechiness as string),
    acousticness: parseFloat(chunk.acousticness as string),
    instrumentalness: parseFloat(chunk.instrumentalness as string),
    liveness: parseFloat(chunk.liveness as string),
    valence: parseFloat(chunk.valence as string),
    tempo: parseFloat(chunk.tempo as string),
    time_signature: parseInt(chunk.time_signature as string)
  }
}

export interface Track {
  id: string
  name: string
  popularity: number
  duration_ms: number
  explicit: number
  artists: string[]
  id_artists: string[]
  release_year: number
  release_month: number
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
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

function uuidv4 (): string {
  return 'xxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
