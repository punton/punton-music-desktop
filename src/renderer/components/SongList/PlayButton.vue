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
      'getPlayer',
      'getPlayerContextState'
    ]),
    isThisSongPlaying: async function () {
      return (await this.getSelectedSong.id === this.song.id) && this.getPlayerContextState === 'running'
    },
    playingStatus: async function () {
      return (await this.getSelectedSong.id === this.song.id) && this.getPlayerContextState === 'running'
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
    onClick: async function (e) {
      e.preventDefault()
      if (await this.isThisSongPlaying === true) {
        console.log('Pause song')
        // หยุดเพลงปัจจุบัน
        this.playingStatusIcon = null
        this.setContextState('suspended')
        this.suspend()
      } else {
        if (this.getSelectedSong.id === this.song.id && this.getPlayerContextState === 'suspended') {
          // ถ้าเพลงเดิมหยุดอยู่ให้เล่นต่อ
          console.log('[Resume playing] change state')
          this.setContextState('running')
          this.resume()
        } else {
          // ถ้ากดเพลงใหม่ให้เริ่มเล่นเพลงใหม่
          console.log('[Start playing new song]')
          this.setSelectedSong(this.song)
          this.setContextState('running')
          ipcRenderer.send('select:songv2', this.song)
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
</style>
