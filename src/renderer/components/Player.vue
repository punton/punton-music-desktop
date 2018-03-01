<template>
  <div class="container-fluid" id="player-box">
    <div class="row" id="main-panel">
      <div class="col">
        1
      </div>
      <div class="col" id="panel">
        <div class="row" id="icons">
          <div class="col" v-on:mouseenter="highlight" v-on:mouseleave="unhighlight" v-b-tooltip.hover.top="'Shuffle'">
            <shuffle-icon></shuffle-icon>
          </div>
          <div class="col" v-on:mouseenter="highlight" v-on:mouseleave="unhighlight" v-b-tooltip.hover.top="'Previous'">
            <step-backward-icon></step-backward-icon>
          </div>
          <div class="col" v-on:mouseenter="highlight" v-on:mouseleave="unhighlight" v-b-tooltip.hover.top="'Play'">
            <play-icon></play-icon>
          </div>
          <!-- TODO: Add Pause -->
          <div class="col" v-on:mouseenter="highlight" v-on:mouseleave="unhighlight" v-b-tooltip.hover.top="'Next'">
            <step-forward-icon></step-forward-icon>
          </div>
          <div class="col" v-on:mouseenter="highlight" v-on:mouseleave="unhighlight" v-b-tooltip.hover.top="'Repeat'">
            <repeat-icon></repeat-icon>
          </div>
        </div>
        <!-- <div class="row">
          <canvas id="bar" height="10vh" ></canvas>
        </div> -->
        <div class="row">
          <!-- TODO: better format string -->
          <!-- TODO: inline components -->
          <!-- <div class="col">{{parseInt(currentTime)/60}}.{{parseInt(currentTime)%60}}</div> -->
          <div class="col">{{formatTime(currentTime)}}</div>
          <div class="col">
            <b-progress :value="mockSong.currentTime" :max="mockSong.duration" animated show-progress></b-progress>
          </div>
          <div class="col">{{parseInt(mockSong.duration/60)}}.{{mockSong.duration%60}}</div>
        </div>
      </div>
      <div class="col">
        3
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
  // import {ipcRenderer} from 'electron'

  export default {
    props: ['currentTime'],
    data () {
      return {
        mockSong: {
          currentTime: 75,
          duration: 100
        }
      }
    },
    components: { ShuffleIcon, StepBackwardIcon, StepForwardIcon, PlayIcon, RepeatIcon },
    methods: {
      highlight: function (e) {
        // console.log('Highlighted.')
        // console.log(e.target.style)
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
      }
    }
  }
</script>

<style>
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
</style>
