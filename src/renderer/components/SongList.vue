<template>
  <div class="dropzone" @dragover="onDragover" @drop="onDrop">
    <ul>
      <li v-for="(song, index) in songs" :key="index">
        {{ song.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import _ from 'lodash'
import { ipcRenderer } from 'electron'
import Meyda from 'meyda'

const audioCtx = new AudioContext()
export default {
  data () {
    return {
      songs: []
    }
  },
  methods: {
    onDrop: function (e) {
      e.stopPropagation()
      e.preventDefault()
      const songList = []
      _.values(e.dataTransfer.files).forEach(song => {
        songList.push({ name: song.name, path: song.path })
      })
      songList.sort((a, b) => {
        let nameA = a.name.toUpperCase()
        let nameB = b.name.toUpperCase()
        if (nameA < nameB) return -1
        else if (nameA > nameB) return 1
        else return 0
      })
      this.songs = this.songs.concat(songList)
      ipcRenderer.send('songList:save', songList)
      ipcRenderer.on('song:requestMfcc', async (event, song) => {
        try {
          const { data, duration, sampleRate, songMetadata } = song
          const offlineCtx = new OfflineAudioContext(
            2,
            duration * sampleRate,
            sampleRate
          )
          let source = offlineCtx.createBufferSource()

          const buffer = await audioCtx.decodeAudioData(data.buffer)
          source.buffer = buffer
          source.connect(offlineCtx.destination)
          source.start()

          const slicingWindowSize = 1024
          const rendereredBuffer = await offlineCtx.startRendering()
          const channelData = rendereredBuffer.getChannelData(0)
          const results = []
          for (let i = 0; i < channelData.length - slicingWindowSize; i += slicingWindowSize) {
            const r = Meyda.extract(
              'mfcc',
              channelData.slice(i, i + slicingWindowSize)
            )
            results.push(r)
          }
          songMetadata['mfcc'] = results
          songMetadata['type'] = 'song'
          this.$db.insert(songMetadata, (err, insertedSong) => {
            if (err) console.log(err)
            console.dir(insertedSong)
          })
          // ipcRenderer.send('song:resultMfcc', results)
        } catch (err) {
          console.log(err)
        }
      })
    },
    onDragover: function (e) {
      e.preventDefault()
    }
  },
  beforeMount () {
    this.$db.find({ type: /song/ }, (err, songs) => {
      if (err) console.error(err)
      console.dir(songs)
      songs.forEach((song) => {
        this.songs.push({name: song.title})
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
