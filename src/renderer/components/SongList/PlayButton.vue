<template>
  <div class="playing-status-icon" @mouseup="onMouseUp" @mousedown="onMouseDown" @mouseover="onMouseOver" @mouseleave="onMouseLeave" @click="onClick">
    <img :src="playingStatusIcon" />
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
      'isPlayerRunning'
    ]),
    isThisSongPlaying: function () {
      return (this.getSelectedSong.id === this.song.id) && this.isPlayerRunning
    },
    playingStatus: function () {
      return (this.getSelectedSong.id === this.song.id) && this.isPlayerRunning
    }
  },
  watch: {
    getSelectedSong: function (n, o) {
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
      this.setIcon(this.isThisSongPlaying ? pauseBtnIcon : playBtnIcon)
    },
    onMouseLeave: function (e) {
      this.showPlayOrNull()
    },
    onClick: function (e) {
      e.preventDefault()
      if (this.isThisSongPlaying) {
        ipcRenderer.send('set:state-isPlaying', false)
      } else {
        this.setSelectedSong(this.song)
        ipcRenderer.send('select:songv2', this.song)
      }
    },
    onMouseDown: function (e) {
      this.setIcon(this.isThisSongPlaying ? pauseBtnFillBlackIcon : playBtnFillBlackIcon)
    },
    onMouseUp: function (e) {
      this.setIcon(playBtnIcon)
    },
    setIcon: function (icon) {
      this.playingStatusIcon = icon
    },
    showPlayOrNull: function () {
      this.setIcon(this.isThisSongPlaying ? playIcon : null)
    },
    ...mapActions([
      'setSelectedSong'
    ])
  }
}
</script>

<style scoped>
.playing-status-icon {
  width: 100%;
  height: 100%;
}
</style>
