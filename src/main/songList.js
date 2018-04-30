import {
  ipcMain
} from 'electron'
import 'util'
import { Op } from 'sequelize'
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

ipcMain.on('songList:save', (event, { songs, playlist }) => {
  if (!q || q.length === 0) {
    q = []
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
          readingSong({ song: q.pop(), event, total: q.length })
        }
      } else {
        event.sender.send('songList:refresh', false)
      }
    } catch (err) {
      console.error(err)
    }
  })
})

ipcMain.on('song:result', (event, { id, waveMax, waveMin, playlist, isPlaying }) => {
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
    readingSong({ song: q.pop(), event })
  } else if (q.length === 0) {
    if (isPlaying && playlist.name === 'Machine Learning') {
      event.sender.send('ml-drop:refresh')
    } else {
      event.sender.send('songList:refresh', false)
    }
  }
})

ipcMain.on('songList:find', async (event, {playlistId, isDeleteSong}) => {
  try {
    const songs = await Song.findAll({
      attributes: ['id', 'title', 'path', 'duration', 'artist', 'playlistId'],
      where: {
        playlistId: {
          [Op.eq]: playlistId
        }
      }
    })
    if (isDeleteSong === true) {
      event.sender.send('songList:retrieveAfterDelete', songs)
    } else {
      event.sender.send('songList:retrieve', songs)
    }
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('song:delete', (event, songId) => {
  try {
    Song.destroy({
      where: {
        id: songId
      }
    })
    event.sender.send('songList:refresh', true)
  } catch (err) {
    console.error(err)
  }
})
