<template>
  <div class="playing-status-icon" @mouseup="onMouseUp" @mousedown="onMouseDown" @mouseover="onMouseOver" @mouseleave="onMouseLeave" @click="onClick">
    <img v-if="playingStatusIcon" class="themed-btn" :src="playingStatusIcon" />
  </div>
</template>

<script>
import playBtnIcon from '../../assets/icons/ic_play_circle_outline_black_24dp.png'
import playBtnFillBlackIcon from '../../assets/icons/ic_play_circle_filled_black_24dp.png'
import pauseBtnIcon from '../../assets/icons/ic_pause_circle_outline_black_24dp.png'
import playIcon from '../../assets/icons/ic_play_arrow_black_24dp.png'
import pauseBtnFillBlackIcon from '../../assets/icons/ic_pause_circle_filled_black_24dp.png'
import { ipcRenderer } from 'electron'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: [
    'song'
  ],
  data () {
    return {
      playingStatusIcon: this.playingStatus ? playIcon : null
    }
  },
  computed: {
    ...mapGetters([
      'getSelectedSong',
      'getPlayerContextState'
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
    }
  },
  methods: {
    onMouseOver: function (e) {
      this.setIcon(this.isThisSongPlaying === true ? pauseBtnIcon : playBtnIcon)
    },
    onMouseLeave: function (e) {
      this.showPlayOrNull()
    },
    onClick: function (e) {
      e.preventDefault()
      if (this.isThisSongPlaying === true) {
        this.setContextState('suspended')
        this.suspend()
      } else {
        if (this.getSelectedSong.id === this.song.id && this.getPlayerContextState === 'suspended') {
          this.setContextState('running')
          this.resume()
        } else {
          this.setSelectedSong(this.song)
          this.setContextState('running')
          ipcRenderer.send('select:song', this.song)
        }
      }
    },
    onMouseDown: function (e) {
      this.setIcon(this.isThisSongPlaying === true ? pauseBtnFillBlackIcon : playBtnFillBlackIcon)
    },
    onMouseUp: function (e) {
      this.setIcon(playBtnIcon)
    },
    setIcon: function (icon) {
      this.playingStatusIcon = icon
    },
    showPlayOrNull: function () {
      this.setIcon(this.isThisSongPlaying === true ? playIcon : null)
    },
    ...mapActions([
      'resume',
      'suspend',
      'setSelectedSong',
      'setContextState'
    ])
  }
}
</script>

<style scoped>
.playing-status-icon {
  width: 100%;
  height: 100%;
}

.themed-btn {
  background-color:#F10707;
  border:0.2rem solid #F4F4F4;
}
</style>
