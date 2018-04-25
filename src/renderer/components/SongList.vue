<template>
  <div @dragover.prevent @drop="onDrop">
    <el-table
      class="dropzone"
      :data="getSongs"
      empty-text="Drop song here!"
      height="85vh"
      @sort-change="sortSongs"
      :header-cell-style="{'background-color': '#272727', 'color': '#F4F4F4'}"
      :cell-style="{'background-color': '#474747', 'color': '#F4F4F4'}"
      style="width: 100%;">
        <el-table-column
          type="index"
          label="Play"
          header-align="center"
          width="140">
            <template slot-scope="scope">
              <div class="playing-icon">
                <play-button :song="scope.row"></play-button>
              </div>
            </template>
        </el-table-column>
        <el-table-column
          sortable="custom"
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
  </div>
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
  methods: {
    onDrop: function (e) {
      e.stopPropagation()
      e.preventDefault()
      const songs = []
      _.values(e.dataTransfer.files).forEach(song => {
        songs.push({ name: song.name, path: song.path })
      })
      ipcRenderer.send('songList:save', { songs, playlist: this.getCurrentPlaylist })
    },
    durationFormat: function (duration) {
      return (parseInt(duration / 60) + parseInt(duration % 60) / 100).toFixed(2)
    },
    refreshSongList: function () {
      ipcRenderer.send('songList:find', this.getCurrentPlaylist.id)
    },
    sortSongs: function (sortStyle) {
      console.log(sortStyle)
      this.sortBy({type: sortStyle.prop, order: sortStyle.order})
    },
    ...mapActions([
      'sortBy'
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
      this.refreshSongList()
    })
  },
  destroyed () {
    ipcRenderer.removeAllListeners('song:requestWaveform')
  },
  computed: {
    ...mapGetters([
      'getSongs',
      'getCurrentPlaylist'
    ])
  }
}
</script>

<style scoped>
.dropzone {
  /* border: 5px dashed rgb(0, 17, 255); */
  min-height: 100%;
  width: 100%;
  background-color: #272727;
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

.white-frame {
  border:0.35rem solder white;
}

.themed-txt {
  background-color: #272727;
  border:0.35rem solid #F4F4F4;
  color: #F4F4F4;
}

</style>
