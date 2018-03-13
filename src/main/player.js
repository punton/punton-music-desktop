import {ipcMain} from 'electron'
import fs from 'fs'

const tabs = {
  suggest: 0,
  user: 1,
  all: 2
}

let initialState = {
  // Selected tab: ml, user, or all songs
  tab: tabs.user,
  // Selected song to play
  song: null,
  isPlaying: false
}

let currentState = initialState

// Make a clone of current state
// function cloneState () {
//   return Object.assign({}, currentState)
// }

// function newState () {
//   return {
//     // Selected tab: ml, user, or all songs
//     tab: tabs.user,
//     // Selected song to play
//     song: null,
//     // player state
//     player: {
//       // Player is reading any songs.
//       isPlaying: false,
//       context: null,
//       source: null,
//       gainNode: null,
//       time: 0
//     }
//   }
// }

// Get Playlists

// Get Playlist from type and id

// Set current tab
ipcMain.on('set:tab', (event, arg) => {
  currentState.tab = arg
  console.log('Set tab to : ' + arg)
  // event.sender.send('state:reply', cloneState())
  event.sender.send('state:reply', currentState)
})
// Get current tab
ipcMain.on('get:tab', (event, arg) => {
  // event.sender.send('state:reply', cloneState())
  event.sender.send('state:reply', currentState)
})

ipcMain.on('get:state', (event, arg) => {
  // event.sender.send('state:reply', cloneState())
  event.sender.send('state:reply', currentState)
})

// select current song
ipcMain.on('select:song', (event, song) => {
  console.log('Selected song: ' + JSON.stringify(song))
  fs.readFile(song.path, (err, data) => {
    if (err) throw err
    // currentState = cloneState()
    currentState.song = song
    currentState.isPlaying = true
    // event.sender.send('update:state', cloneState())
    event.sender.send('state:reply', currentState)
    event.sender.send('play:song', data)
  })
})

// Set player
ipcMain.on('set:player', (event, player) => {
  console.log(player)
  currentState.player = player
  event.sender.send('state:reply', currentState)
})

// Set current time
ipcMain.on('set:time', (event, time) => {
  // currentState = cloneState()
  // console.log(time)
  event.sender.send('state:reply', currentState)
})

// Set playing state
ipcMain.on('set:state-isPlaying', (event, isPlaying) => {
  currentState.isPlaying = isPlaying
  console.log(JSON.stringify(currentState))
  // if(isPlaying) {
  //   event.sender.send('player:resume')
  // } else {
  //   event.sender.send('player:suspend')
  // }
  event.sender.send('player:switchState', isPlaying)
})
