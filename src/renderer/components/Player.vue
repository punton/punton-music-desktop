<template>
  <div class="container-fluid" id="player-box">
    <div class="row" id="main-panel">
      <div class="col">
        <p>Playing: {{this.state.song.title}}</p>
        <p>{{this.player.context ? this.player.context.currentTime : 0}}</p>
        <!-- {{this.state.isPlaying}} {{this.player.volume}} {{this.player.context ? this.player.context.currentTime : 0 }} {{this.state.song ? this.state.song.duration : -1}} -->
      </div>
      <div class="col" id="panel">
        <div class="row" id="icons">
          <div class="col" v-on:mouseenter="highlight" v-on:mouseleave="unhighlight" v-b-tooltip.hover.top="'Shuffle'">
            <shuffle-icon></shuffle-icon>
          </div>
          <div class="col" v-on:mouseenter="highlight" v-on:mouseleave="unhighlight" v-b-tooltip.hover.top="'Previous'">
            <step-backward-icon></step-backward-icon>
          </div>
          <div class="col" v-on:mouseenter="highlight" v-on:mouseleave="unhighlight" v-b-tooltip.hover.top="this.state.isPlaying ? 'Resume' : 'Play'" v-on:click="switchState">
            <play-icon v-if="!state.isPlaying"></play-icon>
            <!-- <div v-else>Stop</div> -->
            <pause-icon v-else></pause-icon>
          </div>
          <!-- TODO: Add Pause -->
          <div class="col" v-on:mouseenter="highlight" v-on:mouseleave="unhighlight" v-b-tooltip.hover.top="'Next'">
            <step-forward-icon></step-forward-icon>
          </div>
          <div class="col" v-on:mouseenter="highlight" v-on:mouseleave="unhighlight" v-b-tooltip.hover.top="'Repeat'">
            <repeat-icon></repeat-icon>
          </div>
        </div>
        <div class="row">
          <div class="col timeLabel">{{formatTime(this.player.context ? this.player.context.currentTime : 0)}}</div>
          <div class="col">
            <b-progress :value="this.player.context ? this.player.context.currentTime : 0" :max="this.state.song ? this.state.song.duration : 100" animated></b-progress>
          </div>
          <div class="col timeLabel">{{formatTime(this.state.song ? this.state.song.duration : 0)}}</div>
        </div>
      </div>
      <div class="col">
        <input type="range" min="0" max="100" v-on:input="changeVolume($event)">
        <p>{{(this.player.gainNode ? this.player.gainNode.gain.value * 100 : 0).toFixed(2)}}%</p>
      </div>
    </div>
  </div>
</template>

<script>
  import ShuffleIcon from 'vue-material-design-icons/shuffle.vue'
  import StepBackwardIcon from 'vue-material-design-icons/step-backward.vue'
  import StepForwardIcon from 'vue-material-design-icons/step-forward.vue'
  import PlayIcon from 'vue-material-design-icons/play-circle-outline.vue'
  import RepeatIcon from 'vue-material-design-icons/repeat.vue'
  import PauseIcon from 'vue-material-design-icons/pause-circle-outline.vue'
  import {ipcRenderer} from 'electron'

  export default {
    props: ['player', 'state'],
    data () {
      return {
      }
    },
    components: { ShuffleIcon, StepBackwardIcon, StepForwardIcon, PlayIcon, RepeatIcon, PauseIcon },
    methods: {
      highlight: function (e) {
        // console.log('Highlighted.')
        e.target.style.backgroundColor = 'black'
        e.target.style.fill = 'white'
      },
      unhighlight: function (e) {
        // console.log('Unhighlighted.')
        e.target.style.backgroundColor = 'white'
        e.target.style.fill = 'black'
      },
      formatTime: function (second) {
        let min = parseInt(second / 60)
        let sec = (parseInt(second) % 60) / 100
        return (min + sec).toFixed(2)
      },
      maxValue: function () {
        return (this.state.selectedSong) ? this.state.selectedSong.duration : 100
      },
      resume: function () {
        ipcRenderer.send('set:state-isPlaying', true)
      },
      suspend: function () {
        ipcRenderer.send('set:state-isPlaying', false)
      },
      switchState: function () {
        let ctxState = this.player.context.state
        if (ctxState === 'running') {
          this.suspend()
        } else if (ctxState === 'suspended') {
          this.resume()
        }
      },
      changeVolume: function (event) {
        // TO:DO move to LandingPage
        let gainNode = this.player.gainNode
        if (gainNode) {
          gainNode.gain.value = event.target.valueAsNumber / 100
        }
      }
    }
  }
</script>

<style scoped>
  #player-box {
    height: 14vh;
  }  

  #main-panel {
    height: inherit
  }

  #panel {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: stretch
  }

  #icons {
    display: flex;
    justify-content: space-around;
  }

  .b-progress {
    Width: 100%;
  }

  #timeLabel {
    width: fit-content;
  }
</style>
