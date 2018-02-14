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
import Meyda from 'meyda'
import draggable from 'vuedraggable'

const audioCtx = new AudioContext()
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
      ipcRenderer.on('song:requestMfcc', async (event, song) => {
        try {
          console.log(song.total)
          let { songData, duration, sampleRate, songMetadata } = song
          let offlineCtx = new OfflineAudioContext(
            2,
            duration * sampleRate,
            sampleRate
          )
          let source = offlineCtx.createBufferSource()

          let buffer = await audioCtx.decodeAudioData(songData.buffer)
          source.buffer = buffer
          source.connect(offlineCtx.destination)
          source.start()

          const SLICING_WINDOW_SIZE = 1024
          let rendereredBuffer = await offlineCtx.startRendering()
          let channelData = rendereredBuffer.getChannelData(0)
          let results = []
          for (let i = 0; i < channelData.length - SLICING_WINDOW_SIZE; i += SLICING_WINDOW_SIZE) {
            const r = Meyda.extract(
              'mfcc',
              channelData.slice(i, i + SLICING_WINDOW_SIZE)
            )
            const reducer = (accumulator, currentValue) => accumulator + currentValue
            results.push(r.reduce(reducer) / r.length)
          }
          this.songs.push({ id: songMetadata.id, title: songMetadata.title, path: songMetadata.path })
          ipcRenderer.send('song:resultMfcc', { id: songMetadata.id, extractedMfcc: results })
        } catch (err) {
          console.log(err)
        }
      })
    }
  },
  mounted () {
    ipcRenderer.send('playlist:find', 'ml')
    ipcRenderer.on('song:retrieve', (event, songs) => {
      songs.forEach(song => {
        this.songs.push(song.dataValues)
      })
    })
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
