import {
  ipcMain
} from 'electron'
import 'util'
import { Op } from 'Sequelize'
import {Song} from './models'
import Promise from 'bluebird'
const fs = Promise.promisifyAll(require('fs'))
const mm = require('music-metadata')

const readingSong = async ({ song, event, current, total }) => {
  const songData = await fs.readFileAsync(song.path)
  event.sender.send('song:requestWaveform', {
    songMetadata: {
      id: song.dataValues.id,
      title: song.dataValues.title,
      artist: song.dataValues.artist,
      duration: song.dataValues.duration,
      path: song.dataValues.path
    },
    current,
    total,
    songData: songData
  })
}

let q
let count

ipcMain.on('songList:save', (event, { songs, playlist }) => {
  if (!q || q.length === 0) {
    q = []
    count = 1
  }
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
      if (playlist.name === 'Machine Learning') {
        q.push(newSong)
        if (q.length === songs.length) {
          console.dir(q.length)
          readingSong({ song: q.pop(), event, current: count, total: q.length })
        }
      }
    } catch (err) {
      console.error(err)
    }
  })
})

ipcMain.on('song:result', (event, { id, waveMax, waveMin }) => {
  count++
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
  if (q.length > 0) {
    readingSong({ song: q.pop(), event, current: count, total: q.length })
  }
  if (q.length === 0) {
    event.sender.send('songList:refresh')
  }
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
