import { PrismaClient } from '@prisma/client'
import { addArtistId, type Danceability, type Track } from './types/track.js'
import { type Artist } from './types/artist.js'
import logger from './util/logger.js'

const prisma = new PrismaClient()

export async function createTrack (track: Track): Promise<Track | undefined> {
  try {
    const createdTrack = await prisma.track.create({ data: track })
    const parsedCreatedTrack = {
      ...createdTrack,
      danceability: createdTrack.danceability as Danceability
    }
    await addArtistId(parsedCreatedTrack.id_artists)
    return parsedCreatedTrack
  } catch (error) {
    logger.error(error)
  }
  return undefined
}

export async function checkIfArtistHasTracks (artist: Artist): Promise<boolean> {
  try {
    const track = await prisma.track.findFirst({
      where: {
        id_artists: {
          has: artist.id
        }
      }
    })
    return track !== null && track !== undefined
  } catch (error) {
    return false
  }
}

export async function createArtist (artist: Artist): Promise<Artist | undefined> {
  try {
    const createdArtist = await prisma.artist.create({ data: artist })
    return createdArtist
  } catch (error) {
    logger.error(error)
  }
  return undefined
}
