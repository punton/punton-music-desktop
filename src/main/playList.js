import {
  ipcMain
} from 'electron'
import 'util'
import { Playlist } from './models'

ipcMain.on('playlist:requestName', async (event) => {
  try {
    const playlists = await Playlist.findAll({
      attributes: ['id', 'name']
    })
    event.sender.send('playlist:receiveName', playlists)
  } catch (err) {
    console.error(err.message)
  }
})
