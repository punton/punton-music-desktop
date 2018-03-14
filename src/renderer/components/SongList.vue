<template>
  <div class="dropzone scrollable" @dragover.prevent @drop="onDrop">
    <b-table striped hover :foot-clone="footClone" :items="songs" :fields="fields">
      <template slot="duration" slot-scope="data">
        {{ durationFormat(data.item.duration) }}
      </template>
    </b-table>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import _ from 'lodash'
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
      songs: [],
      fields: [
        { key: 'playing', label: '⯈', class: 'text-center' },
        { key: 'title', sortable: true },
        { key: 'artist', sortable: true },
        { key: 'duration', sortable: true, class: 'text-center' }
      ],
      footClone: true
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
    },
    durationFormat: function (duration) {
      return (parseInt(duration / 60) + parseInt(duration % 60) / 100).toFixed(2)
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
      this.songs.push({ id: songMetadata.id, title: songMetadata.title, path: songMetadata.path, duration: songMetadata.duration, artist: songMetadata.artist })
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
  min-height: 100%;
  width: 100%;
}

.scrollable {
  overflow-y: auto;
  height: 85vh;
}
</style>
