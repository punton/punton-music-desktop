<template>
  <div class="playback-ctrl-grid">
    <div class="playback-left-cell">{{this.getSelectedSong.id ? this.getSelectedSong.data.title : ''}}</div>
    <div class="playback-ctrl-cell">
      <el-button type="text" @click="toggleShuffle">
        <icon v-show="this.isPlaylistShuffling" class="random-cell" scale=1 name="random" color="lime"></icon>
        <icon v-show="!this.isPlaylistShuffling" class="random-cell" scale=1 name="random" color="red"></icon>
      </el-button>
      <el-button type="text" @click="playPrevSong">
        <icon class="backward-cell white-icon" scale=1 name="backward"></icon>
      </el-button>
      <div @click="switchContextState">
        <icon v-if="this.isPlaying" class="play-cell white-icon" scale=1 name="pause"></icon>
        <icon v-else class="play-cell white-icon" scale=1 name="play"></icon>
      </div>
      <el-button type="text" @click="playNextSong">
        <icon class="forward-cell white-icon" scale=1 name="forward"></icon>
      </el-button>
      <el-button type="text" @click="toggleRepeat">
        <icon v-show="this.isSongRepeating & !this.isPlaylistRepeating" name="retweet" scale=1 color="lime"></icon>
        <icon v-show="!this.isSongRepeating & this.isPlaylistRepeating" name="asterisk" scale=1 color="lime"></icon>
        <icon v-show="!this.isSongRepeating & !this.isPlaylistRepeating" label="no-repeat">
          <icon name="retweet" scale=1 color="red"></icon>
        </icon>
      </el-button>
      <div class="time-cell">
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
          :speed="0.1">
          <div slot="tooltip">{{formatTime(this.getCurrentTime).toFixed(2)}}</div>
        </vue-slider>
      </div>
      <div class="duration-cell">
        {{formatTime(this.getSongDuration).toFixed(2)}}
      </div>
    </div>
    <div class="playback-right-cell">
      <icon v-if="this.getVolume > 75" name="volume-up" color="white"></icon>
      <icon v-else-if="this.getVolume > 1" name="volume-down" color="white"></icon>
      <icon v-else name="volume-off" color="white"></icon>
      <vue-slider
        direction='horizontal'
        :min='0'
        :interval='1'
        :max='100'
        :value='this.getVolume'
        tooltip='hover'
        :width="'50%'"
        :disabled="!this.getPlayer.context"
        @callback='changeVolume'>
      </vue-slider>
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
        volume: 30
      }
    },
    components: { vueSlider },
    methods: {
      highlight: function (e) {
        e.target.style.backgroundColor = 'black'
        e.target.style.fill = 'white'
      },
      unhighlight: function (e) {
        e.target.style.backgroundColor = 'white'
        e.target.style.fill = 'black'
      },
      formatTime: function (second) {
        let min = parseInt(second / 60)
        let sec = (parseInt(second) % 60) / 100
        return (min + sec)
      },
      changeVolume: function (value) {
        console.log(value)
        this.setVolume(value)
      },
      seek: function (time) {
        let seekTime = (time / 100) * this.getSongDuration
        console.log(`[PlaybackCtrl] Seek time = ${seekTime}`)
        ipcRenderer.send('set:seek-time', seekTime)
      },
      switchContextState: async function () {
        let player = await this.getPlayer
        if (await player.context.state === 'running') {
          this.suspend()
        } else if (await player.context.state === 'suspended') {
          this.resume()
        }
      },
      toggleRepeat: function (value) {
        // console.log(`Toggle repeat ${value}`)
        this.togglePlayerRepeat()
      },
      toPercentage: function (value, max) {
        return Math.min(value / max * 100, 100)
      },
      playPrevSong: function () {
        let prevSong = this.getPrevSong
        console.log(`Start playing previous song: ${JSON.stringify(prevSong)} ...`)
        this.setSelectedSong(prevSong)
        ipcRenderer.send('select:song', prevSong)
      },
      playNextSong: function () {
        let nextSong = this.getNextSong
        console.log(`Start playing next song ${JSON.stringify(nextSong)} ...`)
        this.setSelectedSong(nextSong)
        ipcRenderer.send('select:song', nextSong)
      },
      ...mapActions([
        'resume',
        'suspend',
        'setVolume',
        'togglePlayerRepeat',
        'toggleShuffle',
        'stopSong',
        'playSong',
        'setSelectedSong'
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
    background-color: #afafaf;
    display: grid;
    grid-template-areas:
    "rc bc pc fc tc"
    "zc gc gc gc dc";
    align-items: center;
    justify-items: center;
  }

  .playback-left-cell {
    grid-area: plc;
    background-color: #afafaf;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .playback-right-cell {
    grid-area: prc;
    background-color: #afafaf;
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
    fill: white;
  }
</style>
