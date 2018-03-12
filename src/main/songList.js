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

let q = new Queue(async ({ event, song }, cb) => {
  const songData = await fs.readFileAsync(song.path)
  event.sender.send('song:requestWaveform', {
    songMetadata: {
      id: song.dataValues.id,
      title: song.dataValues.title,
      path: song.dataValues.path
    },
    duration: song.dataValues.duration,
    songData: songData,
    sampleRate: song.dataValues.sampleRate,
    total: q.getStats().total
  })
  cb(null, true)
})

ipcMain.on('songList:save', (event, songs) => {
  songs.forEach(async song => {
    console.dir(song)
    try {
      const metadata = await mm.parseFile(song.path, {
        native: true
      })
      const newSong = await Song.create({
        name: song.name,
        title: metadata.common.title || song.name,
        path: song.path,
        duration: metadata.format.duration,
        track: metadata.common.track.no,
        disk: metadata.common.disk.no,
        album: metadata.common.album,
        year: metadata.common.year,
        date: metadata.common.date,
        artist: metadata.common.artist,
        artists: metadata.common.artists,
        picture: metadata.common.picture,
        sampleRate: metadata.format.sampleRate
      })
      console.log(newSong.title)
      q.push({ event, song: newSong })
    } catch (err) {
      console.error(err)
    }
  })
})

ipcMain.on('song:result', (event, { id, waveMax, waveMin }) => {
  console.log('Succeed')
  Song.update({
    wave_max: waveMax,
    wave_min: waveMin
  }, {
    where: {
      id: {
        [Op.eq]: id
      }
    }
  })
})

ipcMain.on('playlist:find', async (event, playlist) => {
  // TODO: Check playlist and query data
  try {
    const songs = await Song.findAll({
      attributes: ['id', 'title', 'path', 'duration']
    })
    event.sender.send('song:retrieve', songs)
  } catch (err) {
    console.error(err)
  }
})
