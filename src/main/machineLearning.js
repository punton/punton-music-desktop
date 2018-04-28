import { Op } from 'sequelize'
import {Song} from './models'
import { ipcMain } from 'electron'
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

ipcMain.on('recommend:song', async (event, song) => {
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
