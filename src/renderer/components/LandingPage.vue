<template>
  <div id="wrapper" class="container-fluid">
    <div class="row">
      <div class="col-1 framed">
        <sidebar></sidebar>
      </div>
      <div class="col-11 framed">
        <content-list :state="state" :collection="collection"></content-list>
      </div>
    </div>
    <div class="row framed">
      <player :currentTime="currentSong.time"></player>
    </div>
  </div>
</template>
<script>
  import {ipcRenderer} from 'electron'
  import Sidebar from './Sidebar'
  import Player from './Player'
  import ContentList from './ContentList'

  export default {
    name: 'landing-page',
    components: { Sidebar, Player, ContentList },
    data () {
      return {
        state: {
          isPlaying: false,
          tab: 0,
          selectSong: null
        },
        collection: {
          mlPlaylists: [],
          userPlaylists: [],
          allSongs: []
        },
        currentSong: {
          context: null,
          source: null,
          gainNode: null,
          time: 0,
          duration: 0
        }
      }
    },
    created: function () {
      // console.log('Created at Parent')

      // ipcRenderer.send('getCurrentTab')
      ipcRenderer.send('getCurrentState')
      ipcRenderer.send('getCollection')

      ipcRenderer.on('getCollection-reply', (event, arg) => {
        // console.log('Reply from getting collection :')
        // console.log(arg)

        this.collection = {
          mlPlaylists: arg.mlPlaylists,
          userPlaylists: arg.userPlaylists,
          allSongs: arg.allSongs
        }
      })
      ipcRenderer.on('currentState-reply', (event, arg) => {
        console.log('Current state: ' + arg)
        this.state.isPlaying = arg.isPlaying
        this.state.tab = arg.tab
      })

      ipcRenderer.on('currentTab-reply', (event, arg) => {
        console.log('Current tab: ' + arg)
        this.state.tab = arg
      })

      ipcRenderer.on('playSong', (event, arg) => {
        console.log('Playing song . . .')
        if (this.currentSong.context) {
          if (this.currentSong.context.state === 'running') {
            this.currentSong.source.stop(0)
          }
        }
        this.currentSong.context = new AudioContext()
        this.currentSong.source = this.currentSong.context.createBufferSource()
        this.currentSong.gainNode = this.currentSong.context.createGain()
        console.log('Default gain node value: ' + this.currentSong.gainNode.gain.value)
        // Change volume to 40%
        this.currentSong.gainNode.gain.value = 0.4
        console.log('Changed gain node value: ' + this.currentSong.gainNode.gain.value)
        let audioData = arg.buffer
        this.playSong(audioData)
      })
    },
    methods: {
      playSong: function (audioData) {
        let source = this.currentSong.source
        let audioCtx = this.currentSong.context
        let gainNode = this.currentSong.gainNode
        let getCurrentTime = this.getCurrentTime
        source.start(0)
        audioCtx.decodeAudioData(audioData, function (buffer) {
          source.buffer = buffer
          source.connect(gainNode)
          gainNode.connect(audioCtx.destination)
          window.requestAnimationFrame(getCurrentTime)
        })
      },
      getCurrentTime: function () {
        if (this.currentSong.context) {
          this.currentSong.time = this.currentSong.context.currentTime
          // console.log(this.currentSong.time)
          window.requestAnimationFrame(this.getCurrentTime)
        }
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  body { font-family: 'Source Sans Pro', sans-serif; }

  .container-fluid {
    padding-right: 0px;
    padding-left: 0px;
  }

  .row {
    margin-left: 0px;
    margin-right: 0px;
  }

  .col-1 {
    padding-left: 0px;
    padding-right: 0px;
  }

  .col-11 {
    /* padding-left: 5px; */
    padding-left: 1px;
    padding-right: 0px;
  }

  .framed {
    border-width: 1px;
    border-style: solid
  }
</style>
