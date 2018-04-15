import {
  ipcMain
} from 'electron'
import 'util'
import { Playlist } from './models'

ipcMain.on('playlist:requestName', async (event) => {
  console.log('request playlist name')
  try {
    const playlists = await Playlist.findAll({
      attributes: ['id', 'name']
    })
    event.sender.send('playlist:receiveName', playlists)
  } catch (err) {
    console.error(err.message)
  }
})

ipcMain.on('playlist:create', async (event, playlistName) => {
  try {
    await Playlist.create({
      name: playlistName
    })
    event.sender.send('playlist:callRequest')
  } catch (e) {
    console.dir(e)
  }
})
