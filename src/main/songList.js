import {
  ipcMain
} from 'electron'
import 'util'
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
  try {
    const metadata = await mm.parseFile(songs[0].path, {
      native: true
    })
    console.log('metadata: ', metadata)
  } catch (err) {
    console.log(err)
  }
})
