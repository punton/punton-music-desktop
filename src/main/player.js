import {ipcMain} from 'electron'
import fs from 'fs'
import {promisify} from 'util'

const tabs = {
  suggest: 0,
  user: 1,
  all: 2
}

const readFile = promisify(fs.readFile)
async function readFileAsync (path) {
  return readFile(path)
}

async function sendIpc (event, channel, data) {
  return new Promise((resolve, reject) => {
    let content = event.sender.send(channel, data)
    resolve(content)
  })
}

async function playSong (event, path, seekTime) {
  let bin = await readFileAsync(path)
  cachedSongBin = Buffer.from(bin)
  await sendIpc(event, 'state:update', currentState)
  await sendIpc(event, 'play:song', {bin: bin, seekTime: seekTime})
}

let initialState = {
  // Selected tab: ml, user, or all songs
  tab: tabs.user,
  // Selected song to play
  song: { id: null },
  isPlaying: false
  // currentSong: null
}

let currentState = initialState
let cachedSongBin = null

// Set current tab
ipcMain.on('set:tab', (event, arg) => {
  currentState.tab = arg
  event.sender.send('state:reply', currentState)
})
// Get current tab
ipcMain.on('get:tab', (event, arg) => {
  event.sender.send('state:reply', currentState)
})

ipcMain.on('get:state', (event, arg) => {
  event.sender.send('state:reply', currentState)
})

// select current song
ipcMain.on('select:song', (event, song) => {
  currentState.song = {
    id: song.id,
    data: song
  }
  currentState.isPlaying = true

  playSong(event, song.path, 0)
})

// Set player
ipcMain.on('set:player', (event, player) => {
  currentState.player = player
  event.sender.send('state:reply', currentState)
})

// Set current time
ipcMain.on('set:time', (event, time) => {
  event.sender.send('state:reply', currentState)
})

// Set playing state
ipcMain.on('set:state-isPlaying', (event, isPlaying) => {
  currentState.isPlaying = isPlaying
  event.sender.send('player:switchState', isPlaying)
})

ipcMain.on('set:seek-time', (event, time) => {
  event.sender.send('play:song', {bin: cachedSongBin, seekTime: time})
})
