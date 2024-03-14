export function parseCsvToArtist (line: string): Artist {
  try {
    const fixedLine = line.replace(/"/g, '')
    const [beforeGenres, secondPart] = fixedLine.split(/,\[(.*)/s)
    const [genres, lastPart] = secondPart.split(/\],(.*)/s)
    const [id, followers] = beforeGenres.split(',')
    const [name, popularity] = lastPart.split(',')
    let genresArray: string[] = []
    if (genres !== undefined && genres.length !== 0) {
      genresArray = genres.split(',')
    }

    return {
      id,
      followers: parseFloat(followers),
      genres: genresArray,
      name,
      popularity: parseInt(popularity)
    }
  } catch (error) {
    console.error(error)
    console.log('line: ', line)
    throw new Error('Invalid line')
  }
}

export interface Artist {
  id: string
  followers: number
  genres: string[]
  name: string
  popularity: number
}
