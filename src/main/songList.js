import {
  ipcMain
} from 'electron'
import 'util'
import { Op } from 'Sequelize'
import {Song} from './models'
import Promise from 'bluebird'
import Queue from 'better-queue'
const fs = Promise.promisifyAll(require('fs'))
const mm = require('music-metadata')

const readingSong = async ({ event, song }, cb) => {
  const songData = await fs.readFileAsync(song.path)
  event.sender.send('song:requestWaveform', {
    songMetadata: {
      id: song.dataValues.id,
      title: song.dataValues.title,
      artist: song.dataValues.artist,
      duration: song.dataValues.duration,
      path: song.dataValues.path
    },
    songData: songData
  })
  cb(null, true)
}

ipcMain.on('songList:save', (event, { songs, playlist }) => {
  let q = new Queue(readingSong, {
    concurrent: 1,
    batchSize: 1 })
  songs.forEach(async song => {
    try {
      const metadata = await mm.parseFile(song.path, {
        native: true
      })
      const newSong = await Song.create({
        name: song.name,
        title: metadata.common.title || song.name,
        path: song.path,
        duration: metadata.format.duration,
        album: metadata.common.album,
        artist: metadata.common.artist,
        picture: metadata.common.picture,
        sampleRate: metadata.format.sampleRate,
        playlistId: playlist.id
      })
      event.sender.send('songList:refresh')
      if (playlist.name === 'Machine Learning') {
        q.push({ event, song: newSong })
      }
    } catch (err) {
      console.error(err)
    }
  })
})

ipcMain.on('song:result', (event, { id, waveMax, waveMin }) => {
  Song.update({
    waveMax: waveMax,
    waveMin: waveMin
  }, {
    where: {
      id: {
        [Op.eq]: id
      }
    }
  })
})

ipcMain.on('songList:find', async (event, playlistId) => {
  try {
    const songs = await Song.findAll({
      attributes: ['id', 'title', 'path', 'duration', 'artist'],
      where: {
        playlistId: {
          [Op.eq]: playlistId
        }
      }
    })
    event.sender.send('songList:retrieve', songs)
  } catch (err) {
    console.error(err)
  }
})
