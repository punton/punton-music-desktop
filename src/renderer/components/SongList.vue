<template>
  <div class="dropzone" @dragover.prevent @drop="onDrop">
    <draggable v-model="songs">
      <div v-for="song in songs" :key="song.id">
        {{song.title}}
      </div>
    </draggable>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import _ from 'lodash'
// import Meyda from 'meyda'
import webAudioBuilder from 'waveform-data/webaudio'
import draggable from 'vuedraggable'

const audioCtx = new AudioContext()
const getWaveform = (songData) => {
  return new Promise((resolve, reject) => {
    webAudioBuilder(audioCtx, songData.buffer.slice(0), (err, waveform) => {
      if (err) reject(err)
      resolve(waveform)
    })
  })
}

export default {
  components: {
    draggable
  },
  data () {
    return {
      songs: []
    }
  },
  methods: {
    onDrop: function (e) {
      e.stopPropagation()
      e.preventDefault()
      const songs = []
      _.values(e.dataTransfer.files).forEach(song => {
        songs.push({ name: song.name, path: song.path })
      })
      console.table(songs)
      ipcRenderer.send('songList:save', songs)
    }
  },
  beforeCreate () {
    ipcRenderer.on('song:retrieve', (event, songs) => {
      songs.forEach(song => {
        this.songs.push(song.dataValues)
      })
    })
    ipcRenderer.on('song:requestWaveform', (event, song) => {
      let { songData, songMetadata, total } = song
      console.log(total)
      getWaveform(songData)
        .then(waveform => {
          ipcRenderer.send('song:result', { id: songMetadata.id, waveMax: waveform.max, waveMin: waveform.min })
        })
      this.songs.push({ id: songMetadata.id, title: songMetadata.title, path: songMetadata.path })
    })
  },
  mounted () {
    ipcRenderer.send('playlist:find', 'ml')
  },
  beforeDestroy () {
    audioCtx.close()
  }
}
</script>

<style scoped>
.dropzone {
  border: 5px dashed rgb(0, 17, 255);
  height: auto;
  min-height: 100%;
  width: 100%;
}
</style>
