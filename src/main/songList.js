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

let q = new Queue(({ song, songData }, cb) => {
  global.mainWindow.webContents.send('song:requestMfcc', {
    songMetadata: {
      id: song.dataValues.id,
      title: song.dataValues.title,
      path: song.dataValues.path
    },
    songData,
    duration: song.dataValues.duration,
    sampleRate: song.dataValues.sampleRate,
    total: q.getStats().total
  })
  cb()
})

ipcMain.on('songList:save', (event, songs) => {
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
      let data = await fs.readFileAsync(song.path)
      console.log(newSong.title)
      q.push({ song: newSong, songData: data })
    } catch (err) {
      console.error(err)
    }
  })
})

ipcMain.on('song:resultMfcc', (event, { id, extractedMfcc }) => {
  console.log(id)
  Song.update({
    mfcc: extractedMfcc
  }, {
    where: {
      id: {
        [Op.eq]: id
      }
    }
  })
  const stats = q.getStats()
  console.log(stats.total)
  console.log(stats.average)
})

ipcMain.on('playlist:find', async (event, playlist) => {
  // TODO: Check playlist and query data
  try {
    const songs = await Song.findAll({
      attributes: ['id', 'title', 'path']
    })
    event.sender.send('song:retrieve', songs)
  } catch (err) {
    console.error(err)
  }
})
