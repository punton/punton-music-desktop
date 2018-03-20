<template>
  <div class="dropzone scrollable" @dragover.prevent @drop="onDrop">
    <b-table striped hover foot-clone :items="songs" :fields="fields" class="playlist">
      <template slot="playing" slot-scope="data">
        <div class="playing-icon">
          <play-button :song="data.item" :playingSongId="playingSongId" @selectSong="selectSong"></play-button>
        </div>
      </template>
      <template slot="duration" slot-scope="data">
        {{durationFormat(data.item.duration)}}
      </template>
    </b-table>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import _ from 'lodash'
import webAudioBuilder from 'waveform-data/webaudio'
import draggable from 'vuedraggable'
import PlayButton from './SongList/PlayButton'

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
    draggable,
    PlayButton
  },
  props: [
    'songs',
    'playingSongId'
  ],
  data () {
    return {
      fields: [
        { key: 'playing', label: '⯈', class: 'text-center', tdClass: 'playing-icon' },
        { key: 'title', sortable: true },
        { key: 'artist', sortable: true },
        { key: 'duration', sortable: true, class: 'text-center' }
      ]
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
    selectSong: function (song) {
      console.log(song.path)
      ipcRenderer.send('select:song', song)
    },
    durationFormat: function (duration) {
      return (parseInt(duration / 60) + parseInt(duration % 60) / 100).toFixed(2)
    }
  },
  beforeCreate () {
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
  /* border: 5px dashed rgb(0, 17, 255); */
  min-height: 100%;
  width: 100%;
}

.scrollable {
  overflow-y: auto;
  height: 85vh;
}

.playing-icon {
  min-width: 100%;
  width: 30px;
  height: 30px;
}

table.playlist tr {
  line-height: 100px;
}
</style>
