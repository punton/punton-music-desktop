<template>
  <div class="playback-ctrl-grid">
    <div class="playback-left-cell"></div>
    <div class="playback-ctrl-cell">
      <el-tooltip effect="dark" placement="top">
        <div class="random-cell" slot="content">SHUFFLE</div>
        <el-button
        class="tab-box"
        plain
        circle
        type="info">
          <icon name="random" scale=2></icon>
        </el-button>
      </el-tooltip>
      <el-tooltip effect="dark" placement="top">
        <div class="backward-cell" slot="content">PREVIOUS</div>
        <el-button
        class="tab-box"
        plain
        circle
        type="info">
          <icon name="backward" scale=2></icon>
        </el-button>
      </el-tooltip>
      <el-tooltip effect="dark" placement="top">
        <div class="play-cell" slot="content">PAUSE</div>
        <el-button
        class="tab-box"
        plain
        circle
        @click="switchContextState"
        type="info">
          <icon name="pause" scale=2></icon>
        </el-button>
      </el-tooltip>
      <el-tooltip effect="dark" placement="top">
        <div class="forward-cell" slot="content">FORWARD</div>
        <el-button
        class="tab-box"
        plain
        circle
        type="info">
          <icon name="forward" scale=2></icon>
        </el-button>
      </el-tooltip>
      <el-tooltip effect="dark" placement="top">
        <div class="random-cell" slot="content">REPEAT</div>
        <el-button
        class="tab-box"
        plain
        circle
        type="info">
          <icon name="retweet" scale=2></icon>
        </el-button>
      </el-tooltip>
      <!-- <icon class="random-cell white-icon" scale=2 name="random" v-b-tooltip.hover.top="'Shuffle'"></icon>
      <icon class="backward-cell white-icon" scale=2 name="backward" v-b-tooltip.hover.top="'Previous'"></icon>
      <div @click="switchContextState">
        <icon v-if="this.isContextRunning" class="play-cell white-icon" scale=2 name="pause" v-b-tooltip.hover.top="'Pause'"></icon>
        <icon v-else class="play-cell white-icon" scale=2 name="play" v-b-tooltip.hover.top="'Resume'"></icon>
      </div>
      <icon class="forward-cell white-icon" scale=2 name="forward" v-b-tooltip.hover.top="'Forward'"></icon>
      <icon class="repeat-cell white-icon" scale=2 name="retweet" v-b-tooltip.hover.top="'Repeat'"></icon> -->
      <div class="time-cell">
        {{formatTime(this.getCurrentTime).toFixed(2)}}
      </div>
      <div class="progressbar-cell">
        <vue-slider 
          :value="formatTime(this.getCurrentTime).toFixed(2)" 
          :min="0"
          :interval="0.01"
          :max="formatTime(this.getSongDuration)" 
          tooltip='hover' 
          :dotSize='15'
          @callback='seek'
          :lazy='true'>
        </vue-slider>
      </div>
      <div class="duration-cell">
        {{formatTime(this.getSongDuration).toFixed(2)}}
      </div>
    </div>
    <div class="playback-right-cell">
      <icon name="volume-down"></icon>
      <vue-slider
        direction='horizontal'
        :min='0'
        :interval='1'
        :max='100'
        :value='this.getVolume'
        tooltip='hover'
        :width="'50%'"
        @callback='changeVolume'
      >
      </vue-slider>
    </div>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import vueSlider from 'vue-slider-component'
  import { mapGetters, mapActions, mapState } from 'vuex'

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
        this.setVolume(value / 100)
      },
      seek: function (time) {
        console.log(`[PlaybackCtrl] Seek time = ${time}`)
        ipcRenderer.send('set:seek-time', time)
      },
      switchContextState: async function () {
        let player = await this.getPlayer
        if (await player.context.state === 'running') {
          this.suspend()
        } else if (await player.context.state === 'suspended') {
          this.resume()
        }
      },
      ...mapActions([
        'resume',
        'suspend',
        'setVolume'
      ])
    },
    computed: {
      ...mapGetters([
        'getCounter',
        'getCurrentTime',
        'getSongDuration',
        'getPlayer',
        'getVolume'
      ]),
      ...mapState([
        'isContextRunning'
      ])
    }
  }
</script>

<style scoped>
  .playback-ctrl-cell {
    width: 100%;
    height: 100%;
    grid-area: pcc;
    /* background-color: royalblue; */
    background-color: #afafaf;
    display: grid;
    /* grid-auto-columns: auto; */
    grid-template-areas:
    "rc bc pc fc tc"
    "zc gc gc gc dc";
    align-items: center;
    justify-items: center;
  }

  .playback-left-cell {
    grid-area: plc;
    background-color: #afafaf;
    /* background-color: red; */
  }

  .playback-right-cell {
    grid-area: prc;
    background-color: #afafaf;
    /* background-color: peachpuff; */
    display: grid;
    justify-items: center;
    align-items: center;
  }

  .playback-ctrl-grid {
    width: 100%;
    display: grid;
    /* grid-auto-columns: minmax(11.11vw, 11.11vw); */
    grid-auto-rows: minmax(7.5vh, 7.5vh);
    grid-auto-columns: auto;
    grid-template-areas:
    "plc plc plc pcc pcc pcc prc prc prc"
    "plc plc plc pcc pcc pcc prc prc prc";
  }

  .random-cell {
    grid-area: rc;
  }

  .backward-cell {
    grid-area: bc;
  }

  /* .resume-cell {
    grid-area: rc;
  }

  .pause-cell {
    grid-area: pc;
  } */

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
