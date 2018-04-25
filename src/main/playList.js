import {
  ipcMain
} from 'electron'
import 'util'
import { Op } from 'sequelize'
import { Playlist, Song } from './models'

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

ipcMain.on('playlist:create', async (event, playlistName) => {
  try {
    await Playlist.create({
      name: playlistName
    })
    event.sender.send('playlist:callRequest')
  } catch (e) {
    console.error(e)
  }
})

ipcMain.on('playlist:update', (event, {id, name}) => {
  try {
    Playlist.update({
      name: name
    }, {
      where: {
        id: {
          [Op.eq]: id
        }
      }
    })
    event.sender.send('playlist:callRequest')
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('playlist:delete', (event, playlistId) => {
  try {
    Song.destroy({
      where: {
        playlistId: {
          [Op.eq]: playlistId
        }
      }
    })
    Playlist.destroy({
      where: {
        id: {
          [Op.eq]: playlistId
        }
      }
    })
    event.sender.send('playlist:callRequest')
  } catch (err) {
    console.error(err)
  }
})
