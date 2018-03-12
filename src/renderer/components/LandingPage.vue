<template>
  <div v-if="state" id="wrapper" class="container-fluid">
    <div class="row">
      <div class="col-1 framed">
        <sidebar></sidebar>
      </div>
      <div class="col-11 framed">
        <content-list :state="state" :songs="songs"></content-list>
      </div>
    </div>
    <div class="row framed">
      <player :state="state"></player>
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
        // state: {
        //   isPlaying: false,
        //   tab: 0,
        //   selectedSong: null
        // },
        // collection: {
        //   mlPlaylists: [],
        //   userPlaylists: [],
        //   allSongs: []
        // },
        state: null,
        // currentSong: {
        //   context: null,
        //   source: null,
        //   gainNode: null,
        //   time: 0,
        //   duration: 0
        // },
        songs: []
      }
    },
    created: function () {
      // Listen to state:reply
      ipcRenderer.on('state:reply', (event, arg) => {
        console.log('Before: ' + JSON.stringify(this.state))
        this.state = arg
        console.log('After: ' + JSON.stringify(this.state))
      })
      // Get initial state
      ipcRenderer.send('get:state')
      // Listen to song:retrieve
      ipcRenderer.on('song:retrieve', (event, songs) => {
        this.songs = []
        console.log(songs)
        songs.forEach(song => {
          this.songs.push(song.dataValues)
        })
      })
      // Get songs
      ipcRenderer.send('playlist:find', 'ml')

      // ipcRenderer.send('getCollection')

      // ipcRenderer.on('getCollection-reply', (event, arg) => {
      //   this.collection = {
      //     mlPlaylists: arg.mlPlaylists,
      //     userPlaylists: arg.userPlaylists,
      //     allSongs: arg.allSongs
      //   }
      // })

      // ipcRenderer.on('currentTab-reply', (event, arg) => {
      //   console.log('Current tab: ' + arg)
      //   this.state.tab = arg
      // })

      ipcRenderer.on('playSong', (event, song) => {
        console.log('Playing song . . .')
        // if (this.currentSong.context) {
        //   if (this.currentSong.context.state === 'running') {
        //     this.currentSong.source.stop(0)
        //   }
        // }

        let currentCtx = this.state.player.context

        if (currentCtx) {
          if (currentCtx.state === 'running') {
            currentCtx.source.stop(0)
          }
        }

        // this.currentSong.context = new AudioContext()
        // this.currentSong.source = this.currentSong.context.createBufferSource()
        // this.currentSong.gainNode = this.currentSong.context.createGain()
        // console.log('Default gain node value: ' + this.currentSong.gainNode.gain.value)
        // // Change volume to 40%
        // this.currentSong.gainNode.gain.value = 0.5
        // console.log('Changed gain node value: ' + this.currentSong.gainNode.gain.value)
        // let audioData = arg.buffer
        // this.playSong(audioData)

        let newCtx = new AudioContext()
        this.state.player.context = newCtx
        this.state.player.source = newCtx.context.createBufferSource()
        this.state.player.gainNode = newCtx.context.createGain()
        // Change volume to 50%
        this.state.player.gainNode.gain.value = 0.5
        let audioData = song.buffer
        this.playerSong(audioData)
      })
    },
    methods: {
      playSong: function (audioData) {
        // let source = this.currentSong.source
        // let audioCtx = this.currentSong.context
        // let gainNode = this.currentSong.gainNode
        let updateTime = this.updateTime

        let source = this.state.player.source
        let audioCtx = this.state.player.context
        let gainNode = this.state.player.gainNode

        source.start(0)
        audioCtx.decodeAudioData(audioData, function (buffer) {
          source.buffer = buffer
          source.connect(gainNode)
          gainNode.connect(audioCtx.destination)
          window.requestAnimationFrame(updateTime)
        })
      },
      updateTime: function () {
        if (this.currentSong.context) {
          ipcRenderer.send('set:time', this.player.context.currentTime)
          // this.currentSong.time = this.currentSong.context.currentTime
          window.requestAnimationFrame(this.updateTime)
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
