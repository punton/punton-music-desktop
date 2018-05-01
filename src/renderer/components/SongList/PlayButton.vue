<template>
  <div class="playing-status-icon" @mouseup="onMouseUp" @mousedown="onMouseDown" @mouseover="onMouseOver" @mouseleave="onMouseLeave" @click="onClick">
    <icon
      v-if="playingStatusIcon !== null"
      :name="playingStatusIcon"
      scale="1"
      class="themed-btn">
    </icon>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapGetters, mapActions } from 'vuex'
import { deep, DTW, kdt, seriesDTW } from '@/backend/machineLearning'

export default {
  props: [
    'song',
    'selectedAlgorithm'
  ],
  data () {
    return {
      playingStatusIcon: this.playingStatus ? 'play' : null
    }
  },
  computed: {
    ...mapGetters([
      'getSelectedSong',
      'getPlayerContextState',
      'getShowingSongs',
      'getCurrentPlaylist',
      'getPlaylists',
      'getSelectedAlgorithm'
    ]),
    isThisSongPlaying: function () {
      return (this.getSelectedSong.id === this.song.id) && this.getPlayerContextState === 'running'
    },
    playingStatus: function () {
      return (this.getSelectedSong.id === this.song.id) && this.getPlayerContextState === 'running'
    }
  },
  watch: {
    getSelectedSong: function () {
      this.showPlayOrNull()
    },
    song: function () {
      this.showPlayOrNull()
    },
    isPlayerRunning: function () {
      this.showPlayOrNull()
    },
    getPlayerContextState: function () {
      this.showPlayOrNull()
    }
  },
  methods: {
    onMouseOver: function (e) {
      this.setIcon(this.isThisSongPlaying === true ? 'regular/pause-circle' : 'regular/play-circle')
    },
    onMouseLeave: function (e) {
      this.showPlayOrNull()
    },
    onClick: async function (e) {
      e.preventDefault()
      this.setSonglistLoading(true)
      if (this.isThisSongPlaying === true) {
        this.setSonglistLoading(false)
        this.setContextState('suspended')
        this.suspend()
      } else {
        if (this.getSelectedSong.id === this.song.id && this.getPlayerContextState === 'suspended') {
          this.setSonglistLoading(false)
          this.setContextState('running')
          this.resume()
        } else {
          if (this.getPlaylists[0].id === this.getCurrentPlaylist.id) {
            switch (this.getSelectedAlgorithm) {
              case 'deep':
                this.setShowingSongs(await deep(this.song))
                break
              case 'kdt':
                this.setShowingSongs(await kdt(this.song))
                break
              case 'DTW':
                this.setShowingSongs(await DTW(this.song))
                break
              case 'seriesDTW':
                this.setShowingSongs(await seriesDTW(this.song))
                break
            }
          }
          this.setSonglistLoading(false)
          this.setSongs(this.getShowingSongs)
          this.setSelectedSong(this.song)
          this.setContextState('running')
          ipcRenderer.send('select:song', this.song)
        }
      }
    },
    onMouseDown: function (e) {
      this.setIcon(this.isThisSongPlaying === true ? 'pause-circle' : 'play-circle')
    },
    onMouseUp: function (e) {
      this.setIcon('regular/play-circle')
    },
    setIcon: function (icon) {
      this.playingStatusIcon = icon
    },
    showPlayOrNull: function () {
      this.setIcon(this.isThisSongPlaying === true ? 'play' : null)
    },
    ...mapActions([
      'resume',
      'suspend',
      'setSongs',
      'setSelectedSong',
      'setContextState',
      'setSonglistLoading',
      'setShowingSongs'
    ])
  },
  mounted () {
    this.showPlayOrNull()
  }
}
</script>

<style scoped>
.playing-status-icon {
  width: 100%;
  min-height: 100%;
}

.themed-btn {
  background-color:#F10707;
  padding: 0.1rem;
  border: 0.2rem solid #F4F4F4;
}
</style>
