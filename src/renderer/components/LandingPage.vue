<template>
  <div v-if="state" id="wrapper" class="container-fluid">
    <div class="row">
      <div class="col-1 framed">
        <sidebar @setPlaylist="setPlaylist" @showPlaylists="showPlaylists"></sidebar>
      </div>
      <div class="col-11 framed">
          <song-list
            v-if="!isPlaylist"
            :songs="songs"
            :playingSongId="state.song.id"
            :isPlaying="state.isPlaying"
            :playlist="currentPlaylist"
            ></song-list>
          <playlist
            v-else-if="isPlaylist"
            :playlists="currentPlaylist"
            @setPlaylist="setPlaylist">
          </playlist>
      </div>
    </div>
    <div class="row framed">
      <player :state="state" :player="player"></player>
    </div>
  </div>
</template>
<script>
import {ipcRenderer} from 'electron'
import Sidebar from './Sidebar'
import Player from './Player'
import SongList from './SongList'
import Playlist from './Playlist'

export default {
  name: 'landing-page',
  components: { Sidebar, Player, SongList, Playlist },
  data () {
    return {
      state: {
        song: {
          id: null
        }
      },
      player: {
        context: null,
        source: null,
        gainNode: null
      },
      songs: [],
      currentPlaylist: null,
      isPlaylist: false
    }
  },
  created: function () {
    // Listen to state:reply
    ipcRenderer.on('state:reply', (event, arg) => {
      // console.log('Before: ' + JSON.stringify(this.state))
      this.state = arg
      // console.table(arg.song)
      // console.log('After: ' + JSON.stringify(this.state))
    })

    // Get initial state
    ipcRenderer.send('get:state')
    // Listen to song:retrieve
    ipcRenderer.on('songList:retrieve', (event, songs) => {
      this.songs = []
      songs.forEach(song => {
        this.songs.push(song.dataValues)
      })
    })

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

    // ipcRenderer.on('player:resume', (event, arg) => {
    //   if (this.player.context) {
    //     console.log('Resuming ...')
    //     this.player.context.resume()
    //   }
    // })

    // ipcRenderer.on('player:suspend', (event, arg) => {
    //   if (this.player.context) {
    //     console.log('Suspending ...')
    //     this.player.context.suspend()
    //   }
    // })
    ipcRenderer.on('player:switchState', (event, arg) => {
      if (this.player.context) {
        console.log('Switch state to: ' + arg)
        if (arg) {
          this.player.context.resume()
        } else {
          this.player.context.suspend()
        }
      }
    })

    ipcRenderer.on('play:song', (event, song) => {
      console.log('Playing song . . .')
      if (this.player.context) {
        if (this.player.context.state === 'running') {
          this.player.source.stop(0)
          this.player.context.close()
        }
      }

      let newCtx = new AudioContext()
      this.player.context = newCtx
      this.player.source = newCtx.createBufferSource()
      this.player.gainNode = newCtx.createGain()
      // Change volume to 50%
      this.player.gainNode.gain.value = 0.3
      let audioData = song.buffer
      // ipcRenderer.send('set:player', this.state.player)
      this.playSong(audioData)
    })
  },
  beforeDestroy () {
    if (this.player.context) {
      this.player.context.close()
      this.state.isPlaying = false
      console.log(JSON.stringify(this.state))
      ipcRenderer.send('set:state-isPlaying', this.state.isPlaying)
    }
  },
  methods: {
    playSong: function (audioData) {
      // let source = this.currentSong.source
      // let audioCtx = this.currentSong.context
      // let gainNode = this.currentSong.gainNode
      let updateTime = this.updateTime

      let source = this.player.source
      let audioCtx = this.player.context
      let gainNode = this.player.gainNode

      source.start(0)
      audioCtx.decodeAudioData(audioData, function (buffer) {
        source.buffer = buffer
        source.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        window.requestAnimationFrame(updateTime)
      })
    },
    updateTime: function () {
      if (this.player.context) {
        // console.log('Time: ' + this.player.context.currentTime)
        // ipcRenderer.send('set:time', this.player.context.currentTime)
        // this.currentSong.time = this.currentSong.context.currentTime
        window.requestAnimationFrame(this.updateTime)
      }
    },
    setPlaylist: function ({isPlaylist, songList}) {
      this.isPlaylist = isPlaylist
      this.currentPlaylist = songList
      ipcRenderer.send('songList:find', this.currentPlaylist.id)
    },
    showPlaylists: function ({isPlaylist, playlists}) {
      this.isPlaylist = isPlaylist
      this.currentPlaylist = playlists
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
