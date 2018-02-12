import {
  ipcMain
} from 'electron'
import 'util'
import fs from 'fs'
import { Op } from 'Sequelize'
import {Song} from './models'
const mm = require('music-metadata')

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
        picture: metadata.common.picture
      })
      fs.readFile(song.path, (err, data) => {
        if (err) console.log(err)
        event.sender.send('song:requestMfcc', {
          name: song.name,
          songMetadata: {
            id: newSong.dataValues.id,
            title: newSong.dataValues.title,
            path: newSong.dataValues.path
          },
          data,
          duration: metadata.format.duration,
          sampleRate: metadata.format.sampleRate
        })
      })
    } catch (err) {
      console.error(err)
    }
  })
})

ipcMain.on('song:resultMfcc', (event, { id, extractedMfcc }) => {
  Song.update({
    mfcc: extractedMfcc
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
      attributes: ['id', 'title', 'path']
    })
    event.sender.send('song:retrieve', songs)
  } catch (err) {
    console.error(err)
  }
})
