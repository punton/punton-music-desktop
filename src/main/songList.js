import {
  ipcMain
} from 'electron'
import 'util'
import fs from 'fs'
// import uniqid from 'uniqid'
const mm = require('music-metadata')

ipcMain.on('songList:save', async (event, songs) => {
  // console.log('song:', songs)
  songs.map(async song => {
    try {
      const metadata = await mm.parseFile(song.path, {
        native: true
      })
      const songMetadata = {
        // id: uniqid('song'),
        name: song.name,
        title: metadata.common.title,
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
      }
      fs.readFile(song.path, (err, data) => {
        if (err) console.log(err)

        event.sender.send('song:requestMfcc', {
          name: song.name,
          songMetadata,
          data,
          duration: metadata.format.duration,
          sampleRate: metadata.format.sampleRate
        })
      })
      // console.log('metadata: ', metadata)
    } catch (err) {
      console.log(err)
    }
  })
})

ipcMain.on('song:resultMfcc', (event, results) => {
  console.log(results)
})
