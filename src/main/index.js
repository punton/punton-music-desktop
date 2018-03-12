'use strict'

import { app, BrowserWindow } from 'electron'
// import fs from 'fs'
import path from 'path'
require('dotenv').config()
require('./player')
const db = require('./datastore')
global.db = db.default
global.db.sync()
require('./songList')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

// let collection = null
// let playlists = null
// let songs = null

function createWindow () {
  // Mock data up
  // let mockUpData = mockSongUp()
  // collection = mockUpData.collection
  // playlists = mockUpData.playlists
  // songs = mockUpData.songs

  /**
   * Initial window options
   */
  global.mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    height: 768,
    useContentSize: true,
    width: 1024,
    backgroundThrottling: false
  })

  global.mainWindow.loadURL(winURL)

  global.mainWindow.on('closed', () => {
    global.mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (global.mainWindow === null) {
    createWindow()
  }
})

// ipcMain.on('getPlaylists', (event, arg) => {
//   console.log('Receive playlists: ')
//   console.log(arg)
//   let reqPlaylists = []
//   for (let id of arg) {
//     console.log(id)
//     console.log(playlists[id])
//     reqPlaylists.push(playlists[id])
//   }
//   console.log(reqPlaylists)
//   event.sender.send('getPlaylists-reply', reqPlaylists)
// })

// ipcMain.on('getPlaylist', (event, arg) => {
//   console.log(arg)
//   let channel = 'getPlaylist-reply' + '-' + arg.type
//   console.log(channel)
//   console.log(playlists[arg.id])
//   event.sender.send(channel, playlists[arg.id])
// })

// ipcMain.on('getSong', (event, arg) => {
//   event.sender.send('getSong-reply-' + arg, songs[arg])
// })

// ipcMain.on('setCurrentTab', (event, arg) => {
//   // currentTab = arg
//   currentState.tab = arg
//   console.log('Set tab to ' + currentState.tab)
//   event.sender.send('currentState-reply', currentState)
// })

// ipcMain.on('getCurrentState', (event, arg) => {
//   event.sender.send('currentState-reply', currentState)
// })

// ipcMain.on('getCollection', (event, arg) => {
//   console.log('ipcMain receive getCollection channel')
//   let collection = {
//     mlPlaylists: null,
//     userPlaylists: null,
//     allSongs: null
//   }
//   collection.mlPlaylists = getMlPlaylists()
//   collection.userPlaylists = getUserPlaylists()
//   collection.allSongs = getAllSongs()
//   collection.mlPlaylists = []
//   collection.userPlaylists = []
//   collection.allSongs = []
//   console.log('ipcMain\'s replying from getCollection channel')
//   console.log(collection)
//   event.sender.send('getCollection-reply', collection)
// })

// ipcMain.on('selectSong', (event, song) => {
//   console.log('Selected song: ')
//   console.log(song)
//   fs.readFile(song.path, (err, data) => {
//     if (err) throw err
//     console.log(data)
//     currentState.isPlaying = true
//     currentState.selectedSong = song
//     event.sender.send('currentState-reply', currentState)
//     event.sender.send('playSong', data)
//   })
// })

// let tabs = {
//   recommendation: 0,
//   user: 1,
//   all: 2
// }

// Mock-up songs function
// function mockSongUp () {
//   let locations = dialog.showOpenDialog({properties: ['openDirectory']})
//   let location = locations[0]
//   let songs = []
//   let songId = 0
//   console.log(location)
//   let dirs = fs.readdirSync(location)
//   // console.log(dirs)
//   for (let dir of dirs) {
//     let albumPath = path.join(location, dir)
//     if (fs.statSync(albumPath).isDirectory()) {
//       // console.log(albumPath)
//       let fileNames = fs.readdirSync(albumPath)
//       // console.log(files)
//       for (let fileName of fileNames) {
//         let filePath = path.join(albumPath, fileName)
//         if (path.extname(filePath) === '.mp3') {
//           // console.log(filePath)
//           songs.push({
//             id: songId++,
//             name: fileName,
//             path: filePath
//           })
//         }
//       }
//     }
//   }
//   console.log(songs.length)

//   let collection = {
//     mlPlaylists: {
//       list: []
//     },
//     userPlaylists: {
//       list: []
//     },
//     allSongs: {
//       list: []
//     }
//   }
//   let playlistId = 0
//   let playlists = []
//   let playlistSizes = Math.floor(Math.random() * (songs.length / 10)) + 5
//   console.log('Playlist sizes = ' + playlistSizes)
//   // console.log('User playlists #' + userPlaylistSizes)
//   for (let i = 0; i < playlistSizes; i++) {
//     let playlist = {
//       id: playlistId,
//       name: 'Playlist #' + playlistId++,
//       songs: []
//     }
//     let totalSongs = Math.floor(Math.random() * (songs.length / 10))
//     for (let j = 0; j < totalSongs; j++) {
//       let randomSongId = Math.floor(Math.random() * (songs.length))
//       playlist.songs.push(randomSongId)
//     }
//     console.log(playlist)
//     playlists.push(playlist)
//   }

//   // For the ALL SONGS playlist
//   let allSongPlaylist = {
//     id: playlistId,
//     name: 'Playlist #' + playlistId,
//     songs: []
//   }
//   for (let i = 0; i < songs.length; i++) {
//     allSongPlaylist.songs.push(i)
//   }

//   playlists.push(allSongPlaylist)

//   let mlPlaylistSizes = Math.floor(Math.random() * (playlists.length / 2)) + 2
//   let userPlaylistSizes = Math.floor(Math.random() * (playlists.length / 2)) + 2

//   console.log('ML Playlist sizes: ' + mlPlaylistSizes)
//   console.log('User Playlist sizes: ' + userPlaylistSizes)

//   for (let i = 0; i < mlPlaylistSizes; i++) {
//     let randomId = Math.floor(Math.random() * (playlists.length))
//     collection.mlPlaylists.list.push(randomId)
//   }

//   for (let i = 0; i < userPlaylistSizes; i++) {
//     let randomId = Math.floor(Math.random() * (playlists.length))
//     collection.userPlaylists.list.push(randomId)
//   }

//   console.log('ML Playlist IDs: ' + collection.mlPlaylists.list)
//   console.log('User Playlist IDs: ' + collection.userPlaylists.list)
//   collection.allSongs.list.push(playlists.length - 1)

//   console.log(collection)
//   let mockUpData = {
//     collection: collection,
//     playlists: playlists,
//     songs: songs
//   }
//   return mockUpData
// }

// Initial State
// let state = {
//   isPlaying: false,
//   tab: tabs.recommendation,
//   selectedSong: null
// }

// let currentState = state

// function getMlPlaylists () {
//   console.log('Getting ML playlists . . .')
//   return collection.mlPlaylists.list.slice()
// }

// function getUserPlaylists () {
//   console.log('Getting user playlists . . .')
//   return collection.userPlaylists.list.slice()
// }

// function getAllSongs () {
//   console.log('Getting all songs . . .')
//   // let songIds = []
//   // for (let song of songs) {
//   //   songIds.push(song.id)
//   // }
//   return collection.allSongs.list.slice()
// }

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
*/
