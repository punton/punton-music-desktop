<template>
  <div class="playback-ctrl-grid">
    <div class="playback-left-cell">
      <div class="themed-txt song-title-label">
        <div class="slide-anim">
          {{this.getSelectedSong.id ? this.getSelectedSong.data.title : ''}}
        </div>
      </div>
    </div>
    <div class="playback-ctrl-cell">
      <el-tooltip effect="light" placement="top">
        <div slot="content">Shuffle</div>
        <button class="themed-btn btn-ctrl-size rotate-right" @click="toggleShuffle">
          <icon v-show="this.isPlaylistShuffling" class="random-cell" scale=1 name="random" color="#F4F4F4"></icon>
          <icon v-show="!this.isPlaylistShuffling" class="random-cell" scale=1 name="random" color="#272727"></icon>
        </button>
      </el-tooltip>
      <el-tooltip effect="light" placement="top">
        <div slot="content">Previous</div>
        <button class="themed-btn btn-ctrl-size rotate-right" @click="playPrevSong">
          <icon class="backward-cell" scale=1 name="backward" color="#F4F4F4"></icon>
        </button>
      </el-tooltip>
      <el-tooltip effect="light" placement="top">
        <div slot="content">Resume / Pause</div>
        <button class="themed-btn btn-ctrl-size" @click="switchContextState">
          <icon v-if="this.isPlaying" class="play-cell" scale=1 name="pause" color="#F4F4F4"></icon>
          <icon v-else class="play-cell" scale=1 name="play" color="#F4F4F4"></icon>
        </button>
      </el-tooltip>
      <el-tooltip effect="light" placement="top">
        <div slot="content">Next</div>
        <button class="themed-btn btn-ctrl-size  rotate-left" @click="playNextSong">
          <icon class="forward-celln" scale=1 name="forward" color="#F4F4F4"></icon>
        </button>
      </el-tooltip>
      <el-tooltip effect="light" placement="top">
        <div slot="content">Repeat / Repeat Playlist</div>
        <button class="themed-btn btn-ctrl-size  rotate-left" @click="toggleRepeat">
          <icon v-show="this.isSongRepeating & !this.isPlaylistRepeating" name="retweet" scale=1 color="#F4F4F4"></icon>
          <icon v-show="!this.isSongRepeating & this.isPlaylistRepeating" name="asterisk" scale=1 color="#F4F4F4"></icon>
          <icon v-show="!this.isSongRepeating & !this.isPlaylistRepeating" label="no-repeat">
            <icon name="retweet" scale=1 color="#272727"></icon>
          </icon>
        </button>
      </el-tooltip>
      <div class="time-cell themed-txt rotate-right">
        {{formatTime(this.getCurrentTime).toFixed(2)}}
      </div>
      <div class="progressbar-cell">
        <vue-slider 
          :value="toPercentage(this.getCurrentTime, this.getSongDuration)" 
          :min="0"
          :interval="1"
          :max="100" 
          tooltip='hover' 
          :dotSize="15"
          @callback='seek'
          :lazy='true'
          :disabled="!this.getPlayer.context"
          :speed="0.1"
          :process-style="processStyle">
          <div class="themed-txt" slot="tooltip">{{formatTime(this.getCurrentTime).toFixed(2)}}</div>
        </vue-slider>
      </div>
      <div class="duration-cell themed-txt rotate-left">
        {{formatTime(this.getSongDuration).toFixed(2)}}
      </div>
    </div>
    <div class="playback-right-cell">
      <div style="width:80%; height:20%; display:flex; justify-content:center; align-items:center;">
        <div class="themed-btn" style="width:15%; height:100%;">
          <icon v-if="this.getVolume > 75" name="volume-up" color="#F4F4F4"></icon>
          <icon v-else-if="this.getVolume > 1" name="volume-down" color="#F4F4F4"></icon>
          <icon v-else name="volume-off" color="#F4F4F4"></icon>
        </div>
        <vue-slider
          direction='horizontal'
          :min='0'
          :interval='1'
          :max='100'
          :value='this.getVolume'
          tooltip='hover'
          :width="'70%'"
          :disabled="!this.getPlayer.context"
          :process-style="processStyle"
          @callback='changeVolume'>
          <div class="themed-txt" slot="tooltip" slot-scope="{ value }">{{value}}</div>
        </vue-slider>
      </div>
    </div>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import vueSlider from 'vue-slider-component'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    props: ['player', 'state', 'currentTime', 'seekTime'],
    data () {
      return {
        playbackTime: -1,
        volume: 30,
        processStyle: {
          'backgroundColor': '#F10707'
        }
      }
    },
    components: { vueSlider },
    methods: {
      highlight: function (e) {
        e.target.style.backgroundColor = 'black'
        e.target.style.fill = '#F4F4F4'
      },
      unhighlight: function (e) {
        e.target.style.backgroundColor = '#F4F4F4'
        e.target.style.fill = 'black'
      },
      formatTime: function (second) {
        let min = parseInt(second / 60)
        let sec = (parseInt(second) % 60) / 100
        return (min + sec)
      },
      changeVolume: function (value) {
        this.setVolume(value)
      },
      seek: function (time) {
        let seekTime = (time / 100) * this.getSongDuration
        ipcRenderer.send('set:seek-time', seekTime)
      },
      switchContextState: async function () {
        let player = await this.getPlayer
        if (await player.context.state === 'running') {
          this.setContextState('suspended')
          this.suspend()
        } else if (await player.context.state === 'suspended') {
          this.setContextState('running')
          this.resume()
        }
      },
      toggleRepeat: function (value) {
        this.togglePlayerRepeat()
      },
      toPercentage: function (value, max) {
        return Math.min(value / max * 100, 100)
      },
      playPrevSong: function () {
        let prevSong = this.getPrevSong
        if (prevSong) {
          this.setSelectedSong(prevSong)
          ipcRenderer.send('select:song', prevSong)
        }
      },
      playNextSong: function () {
        let nextSong = this.getNextSong
        if (nextSong) {
          this.setSelectedSong(nextSong)
          ipcRenderer.send('select:song', nextSong)
        }
      },
      ...mapActions([
        'resume',
        'suspend',
        'setVolume',
        'togglePlayerRepeat',
        'toggleShuffle',
        'stopSong',
        'playSong',
        'setSelectedSong',
        'setContextState'
      ])
    },
    computed: {
      ...mapGetters([
        'getCurrentTime',
        'getSongDuration',
        'getPlayer',
        'getVolume',
        'isSongRepeating',
        'isPlaylistRepeating',
        'isPlaylistShuffling',
        'isPlaying',
        'getSelectedSong',
        'getPrevSong',
        'getNextSong'
      ])
    }
  }
</script>

<style scoped>
  .playback-ctrl-cell {
    width: 100%;
    height: 100%;
    grid-area: pcc;
    background-color: #272727;
    display: grid;
    grid-template-areas:
    "rc bc pc fc tc"
    "zc gc gc gc dc";
    align-items: center;
    justify-items: center;
  }

  .playback-left-cell {
    grid-area: plc;
    background-color: #272727;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .playback-right-cell {
    grid-area: prc;
    background-color: #272727;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .playback-ctrl-grid {
    width: 100%;
    height: 15vh;
    display: grid;
    grid-template:
    "plc plc pcc pcc pcc prc prc" 1fr
    "plc plc pcc pcc pcc prc prc" 1fr / 1fr 1fr 1fr 1fr 1fr 1fr 1fr
  }

  .random-cell {
    grid-area: rc;
  }

  .backward-cell {
    grid-area: bc;
  }

  .play-cell {
    grid-area: pc;
  }

  .forward-cell {
    grid-area: fc;
  }

  /* retweet icon */
  .repeat-cell {
    grid-area: tc;
  }
  
  .empty-cell {
    grid-area: ec;
  }

  .progressbar-cell {
    width: 100%;
    grid-area: gc;
  }

  .time-cell {
    grid-area: zc;
  }

  .duration-cell {
    grid-area: dc;
  }

  .white-icon {
    fill: #F4F4F4;
  }

  .btn-ctrl-size {
    min-width: 75%;
    width: 75%;
    max-width: 75%;
    min-height: 75%;
    height: 75%;
    max-height: 75%;
  }

  .themed-btn {
    background-color:#F10707;
    border:0.2rem solid #F4F4F4;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.15em;
  }

  .themed-btn:hover {
    background-color: #FB5C5C;
  }

  .volume-cell-border {
    border-width: medium 0.4em medium thin;
  }

  .rotate-left {
    transform: rotate(5deg);
  }

  .rotate-right {
    transform: rotate(-5deg);
  }

  .themed-txt {
    background-color: #272727;
    border:0.2rem solid #F4F4F4;
    color: #F4F4F4;
    border-radius: 0.15em;
  }

  .song-title-label {
    display: flex;
    align-items:
    center;
    justify-content:
    center;
    width:75%;
    height:50%;
    transform: rotate(-5deg);
    white-space: nowrap;
    overflow: hidden;
  }

  .slide-anim {
    animation-duration: 10s;
    animation-name: slide;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  @keyframes slide {
    from {
      margin-left: 250%
    }

    to {
      margin-left: -250%
    }
  }

  @keyframes bounce {
    from {
      width: 80%;
      height: 15%;
    }
    to {
      width: 90%;
      height: 12.5%;
    }
  }
</style>
