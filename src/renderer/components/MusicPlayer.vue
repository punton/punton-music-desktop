<template>
  <div class="player-grid">
      <div class="side-bar">
        <sidebar></sidebar>
      </div>
      <div class="tab-content">
        <content-list></content-list>
      </div>
      <div class="playback-controller">
        <playback-controller></playback-controller>
      </div>
  </div>
</template>

<script>
  import Sidebar from './Sidebar'
  import { ipcRenderer } from 'electron'
  import ContentList from './ContentList'
  import PlaybackController from './PlaybackController'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'music-player',
    components: { Sidebar, ContentList, PlaybackController },
    data () {
      return {
      }
    },
    created: function () {
      ipcRenderer.on('song:retrieve', (event, songs) => {
        this.setSongs(songs)
      })

      ipcRenderer.send('playlist:find', 'ml')

      ipcRenderer.on('play:song', (event, songInfo) => {
        this.initializePlayer(songInfo)
      })
    },
    beforeDestroy () {
      this.stopSong()
      console.log('[BeforeDestroying]: Context closed.')
    },
    methods: {
      updateTime: async function () {
        if (this.getSelectedSong.id) {
          let player = await this.getPlayer
          await new Promise((resolve, reject) => {
            this.setContextTime(player.context.currentTime)
            window.requestAnimationFrame(this.updateTime)
            resolve()
          })
        }
      },
      initializePlayer: async function (songInfo) {
        await this.stopSong()
        await this.playSong(songInfo, this.updateTime)
        this.updateTime()
      },
      ...mapActions([
        'setSongs',
        'setSeekTIme',
        'setContextTime',
        'createPlayer',
        'playSong',
        'stopSong'
      ])
    },
    computed: {
      ...mapGetters([
        'getSeekTime',
        'getContextTime',
        'getSongDuration',
        'getPlayer',
        'getSelectedSong'
      ])
    }
  }
</script>

<style scoped>
  .side-bar {
    grid-area: sb;
  }

  .tab-content {
    grid-area: tc;
  }

  .playback-controller {
    grid-area: pc;
  }

  .player-grid {
    display: grid;
    grid-auto-rows: minmax(auto, 25%); 
    grid-auto-columns: minmax(15% 25%);
    grid-template-areas:
    "sb tc tc tc tc"
    "sb tc tc tc tc"
    "sb tc tc tc tc"
    "pc pc pc pc pc";
    max-width: 100%;
  }
</style>
