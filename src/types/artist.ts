export function chunkToArtist (chunk: any): Artist {
  const escapedGenres = chunk.genres.replace(/['\[\]]/g, '').split(',')
  return {
    id: chunk.id.toString(),
    followers: parseFloat((chunk.followers ?? 0) as string),
    genres: escapedGenres,
    name: chunk.name.toString(),
    popularity: parseInt(chunk.popularity as string)
  }
}

export interface Artist {
  id: string
  followers: number
  genres: string[]
  name: string
  popularity: number
}
