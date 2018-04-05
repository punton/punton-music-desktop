<template>
  <el-table
    class="dropzone"
    @dragover.prevent @drop="onDrop"
    :data="getSongs"
    height="85vh"
    style="width: 100%">
      <el-table-column
        type="index"
        label="Play"
        header-align="center"
        width="140">
          <template slot-scope="scope">
            <div class="playing-icon">
              <play-button :song="scope.row" :playingSongId="playingSongId" @selectSong="selectSong" :isPlaying="isPlaying"></play-button>
            </div>
          </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="title"
        label="Title">
      </el-table-column>
      <el-table-column
        sortable
        prop="artist"
        label="Artist">
      </el-table-column>
      <el-table-column
        sortable
        header-align="center"
        align="center"
        prop="duration"
        width="160"
        label="Duration">
        <template slot-scope="scope">
          {{durationFormat(scope.row.duration)}}
        </template>
      </el-table-column>
  </el-table>
</template>

<script>
import { ipcRenderer } from 'electron'
import _ from 'lodash'
import webAudioBuilder from 'waveform-data/webaudio'
import draggable from 'vuedraggable'
import PlayButton from './SongList/PlayButton'
import { mapGetters, mapActions } from 'vuex'

const audioCtx = new AudioContext()
const getWaveform = (songData) => {
  return new Promise((resolve, reject) => {
    webAudioBuilder(audioCtx, songData.buffer.slice(0), (err, waveform) => {
      if (err) reject(err)
      try {
        resolve(waveform.resample({width: 1024}))
      } catch (e) {
        if (e) resolve(waveform)
      }
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
    'playingSongId',
    'isPlaying',
    'playlist'
  ],
  methods: {
    onDrop: function (e) {
      e.stopPropagation()
      e.preventDefault()
      const songs = []
      _.values(e.dataTransfer.files).forEach(song => {
        songs.push({ name: song.name, path: song.path })
      })
      ipcRenderer.send('songList:save', { songs, playlist: this.playlist })
    },
    selectSong: function (song) {
      console.log(song.path)
      this.setSelectedSong(song)
      ipcRenderer.send('select:songv2', song)
    },
    durationFormat: function (duration) {
      return (parseInt(duration / 60) + parseInt(duration % 60) / 100).toFixed(2)
    },
    ...mapActions([
      'setSelectedSong'
    ])
  },
  beforeCreate () {
    ipcRenderer.on('song:requestWaveform', (event, song) => {
      let { songData, songMetadata } = song
      getWaveform(songData)
        .then(waveform => {
          ipcRenderer.send('song:result', {
            id: songMetadata.id,
            waveMax: waveform.max,
            waveMin: waveform.min
          })
        })
    })
    ipcRenderer.on('songList:refresh', () => {
      ipcRenderer.send('songList:find', this.playlist.id)
    })
  },
  computed: {
    ...mapGetters([
      'getSongs'
    ])
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
  height: 85vh;
  overflow-y: auto;
}

.playing-icon {
  min-width: 100%;
  height: 30px;
  text-align: center;
}
</style>
