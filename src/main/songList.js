import {
  ipcMain
} from 'electron'
import 'util'
import fs from 'fs'
const mm = require('music-metadata')
// import Realm from 'realm'

// const SongSchema = {
//   name: 'Song',
//   properties: {
//     name: 'string',
//     path: 'string',
//     duration: 'int',
//     track: 'int',
//     disk: 'string',
//     year: 'string',
//     date: 'string',
//     artist: 'string'
//   }
// }

ipcMain.on('songList:save', async (event, songs) => {
  console.log('song:', songs)
  songs.map(async song => {
    try {
      const metadata = await mm.parseFile(song.path, {
        native: true
      })
      fs.readFile(song.path, (err, data) => {
        if (err) console.log(err)

        event.sender.send('song:requestMfcc', {
          data,
          duration: metadata.format.duration,
          sampleRate: metadata.format.sampleRate
        })
      })
      console.log('metadata: ', metadata)
    } catch (err) {
      console.log(err)
    }
  })
})

ipcMain.on('song:resultMfcc', (event, results) => {
  console.log(results)
})
