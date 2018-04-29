import { Op } from 'sequelize'
import { Song } from './models'
import { ipcMain } from 'electron'
import convnetjs from 'convnetjs'
import DynamicTimeWarping from 'dynamic-time-warping'

const waveMean = (el) => {
  let waveMax = el.waveMax
  let waveMin = el.waveMin
  if (waveMax.length !== 1024) {
    waveMax.length = 1024
    waveMin.length = 1024
  }
  let waveMean = []

  for (let index = 0; index < waveMax.length; index++) {
    let curentMean = (waveMax[index] + waveMin[index]) / 2.0
    waveMean.push(curentMean)
  }
  el.waveMean = waveMean
  return waveMean
}

const distFunc = (a, b) => {
  return Math.abs(a - b)
}

const compareWave = (a, b) => {
  if (a.dataValues.distance < b.dataValues.distance) {
    return -1
  }
  if (a.dataValues.distance > b.dataValues.distance) {
    return 1
  }
  return 0
}

ipcMain.on('recommend:DTW', async (event, song) => {
  let currentSong = (await Song.findById(song.id)).dataValues
  let playlist = await Song.findAll({
    attributes: ['id', 'title', 'path', 'duration', 'artist', 'playlistId', 'waveMax', 'waveMin'],
    where: {
      playlistId: {
        [Op.eq]: song.playlistId
      }
    }
  })
  playlist.forEach((song) => {
    waveMean(song.dataValues)
  })
  waveMean(currentSong)

  let recommendedPlaylist = []
  playlist.forEach((tempSong) => {
    const song = tempSong.dataValues
    const dtw = new DynamicTimeWarping(currentSong.waveMean, song.waveMean, distFunc)
    const dist = dtw.getDistance()
    recommendedPlaylist.push({
      dataValues: {
        id: song.id,
        title: song.title,
        path: song.path,
        duration: song.duration,
        artist: song.artist,
        playlistId: song.playlistId,
        distance: dist
      }
    })
  })
  recommendedPlaylist.sort(compareWave)
  event.sender.send('retrieveRecommended:playlist', recommendedPlaylist)
})

ipcMain.on('recommend:deep', async (event, song) => {
  const model = require('./models/deepLearning.json')
  const deepLearningModel = JSON.parse(model)
  let currentSong = (await Song.findById(song.id))
  let playlist = await Song.findAll({
    attributes: ['id', 'title', 'path', 'duration', 'artist', 'playlistId', 'waveMax', 'waveMin'],
    where: {
      playlistId: {
        [Op.eq]: song.playlistId
      }
    }
  })

  const net = new convnetjs.Net()
  net.fromJSON(deepLearningModel)

  const waveMeanDeep = el => {
    const songWaveMean = waveMean(el)
    let tempVol = new convnetjs.Vol(1024, 1, 1)
    for (let i = 0; i < songWaveMean.length; i++) {
      tempVol.w[i] = songWaveMean[i]
    }
    el.waveMean = songWaveMean

    net.forward(tempVol)
    el.waveDeep = net.layers[6].out_act.w
  }

  playlist.forEach(el => {
    waveMeanDeep(el.dataValues)
  })
  waveMeanDeep(currentSong.dataValues)

  let recommendedPlaylist = []
  for (var i = 0; i < playlist.length;) {
    for (let j = 0; j < playlist.length; j++) {
      let dtw = new DynamicTimeWarping(currentSong.dataValues.waveDeep, playlist[j].dataValues.waveDeep, distFunc)
      const dist = dtw.getDistance()
      playlist[j].distance = dist
    }
    playlist.sort(compareWave)
    recommendedPlaylist.push({
      dataValues: {
        id: playlist[0].id,
        title: playlist[0].title,
        path: playlist[0].path,
        duration: playlist[0].duration,
        artist: playlist[0].artist,
        playlistId: playlist[0].playlistId
      }
    })
    playlist.shift()
    currentSong = playlist[0]
  }

  function compareWave (a, b) {
    if (a.distance < b.distance) { return -1 }
    if (a.distance > b.distance) { return 1 }
    return 0
  }
  event.sender.send('retrieveRecommended:playlist', recommendedPlaylist)
})

ipcMain.on('recommend:seriesDTW', async (event, song) => {
  let currentSong = await Song.findById(song.id)
  let playlist = await Song.findAll({
    attributes: ['id', 'title', 'path', 'duration', 'artist', 'playlistId', 'waveMax', 'waveMin'],
    where: {
      playlistId: {
        [Op.eq]: song.playlistId
      }
    }
  })
  playlist.forEach((song) => {
    waveMean(song.dataValues)
  })
  waveMean(currentSong.dataValues)

  let recommendedPlaylist = []
  for (var i = 0; i < playlist.length;) {
    for (let j = 0; j < playlist.length; j++) {
      let dtw = new DynamicTimeWarping(currentSong.dataValues.waveMean, playlist[j].dataValues.waveMean, distFunc)
      const dist = dtw.getDistance()
      playlist[j].distance = dist
    }
    playlist.sort(compareWave)
    recommendedPlaylist.push({
      dataValues: {
        id: playlist[0].id,
        title: playlist[0].title,
        path: playlist[0].path,
        duration: playlist[0].duration,
        artist: playlist[0].artist,
        playlistId: playlist[0].playlistId
      }
    })
    playlist.shift()
    currentSong = playlist[0]
  }

  function compareWave (a, b) {
    if (a.distance < b.distance) { return -1 }
    if (a.distance > b.distance) { return 1 }
    return 0
  }
  event.sender.send('retrieveRecommended:playlist', recommendedPlaylist)
})

ipcMain.on('recommend:kdt', async (event, song) => {
  var createKDTree = require('static-kdtree')
  let currentSong = (await Song.findById(song.id)).dataValues
  let playlist = await Song.findAll({
    attributes: ['id', 'title', 'path', 'duration', 'artist', 'playlistId', 'waveMax', 'waveMin'],
    where: {
      playlistId: {
        [Op.eq]: song.playlistId
      }
    }
  })
  playlist.forEach((song) => {
    waveMean(song.dataValues)
  })
  waveMean(currentSong)

  let points = []
  playlist.forEach(element => {
    points.push(element.dataValues.waveMean)
  })

  const tree = createKDTree(points)

  let result = tree.knn(currentSong.waveMean)

  let recommendedPlaylist = []
  result.forEach(element => {
    playlist[element].dataValues.waveDeep = null
    playlist[element].dataValues.waveMin = null
    playlist[element].dataValues.waveMax = null
    recommendedPlaylist.push(playlist[element])
  })

  event.sender.send('retrieveRecommended:playlist', recommendedPlaylist)
  tree.dispose()
})
