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

export default {
  props: [
    'songPath',
    'songId',
    'playingSongId'
  ],
  data () {
    return {
      playingStatusIcon: this.playingSongId === this.songId ? playIcon : null
    }
  },
  computed: {
    isThisSongPlaying: function () {
      return this.playingSongId === this.songId
    }
  },
  watch: {
    playingSongId: function (newVal, oldVal) {
      this.playingStatusIcon = this.playingSongId === this.songId ? playIcon : null
    }
  },
  methods: {
    onMouseOver: function (e) {
      this.setIcon(this.isThisSongPlaying ? pauseBtnIcon : playBtnIcon)
    },
    onMouseLeave: function (e) {
      this.setIcon(this.playingSongId === this.songId ? playIcon : null)
    },
    onClick: function (e) {
      e.preventDefault()
      this.$emit('setPlayingSongId', this.isThisSongPlaying ? null : this.songId)
    },
    onMouseDown: function (e) {
      this.setIcon(this.isThisSongPlaying ? pauseBtnFillBlackIcon : playBtnFillBlackIcon)
    },
    onMouseUp: function (e) {
      this.setIcon(playBtnIcon)
    },
    setIcon: function (icon) {
      this.playingStatusIcon = icon
    }
  }
}
</script>

<style scoped>
.playing-status-icon {
  width: 100%;
  height: 100%;
}
</style>
