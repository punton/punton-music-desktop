<template>
  <div class="container-fluid" id="side-bar">
    <b-list-group>
      <b-list-group-item 
        @mouseenter="highlight"
        @mouseleave="unhighlight"
        v-b-tooltip.hover.right="'Recommendation'"
        @click="setCurrentTab(0)">
        <thumbup-icon/>
      </b-list-group-item>
      <b-list-group-item 
        @mouseenter="highlight" 
        @mouseleave="unhighlight" 
        v-b-tooltip.hover.right="'Songs'"
        @click="setCurrentTab(1)">
        <music-note-icon/><sup><asterisk-icon/></sup>
      </b-list-group-item>
      <b-list-group-item 
        @mouseenter="highlight" 
        @mouseleave="unhighlight" 
        v-b-tooltip.hover.right="'Playlists'"
        @click="showAllPlaylists()">
        <playlist-icon/>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import MusicNoteIcon from 'vue-material-design-icons/music-note.vue'
import PlaylistIcon from 'vue-material-design-icons/playlist-play.vue'
import ThumbupIcon from 'vue-material-design-icons/thumb-up.vue'
import AsteriskIcon from 'vue-material-design-icons/asterisk.vue'

import {ipcRenderer} from 'electron'

export default {
  props: ['setPlaylist', 'showPlaylists'],
  components: { MusicNoteIcon, PlaylistIcon, ThumbupIcon, AsteriskIcon },
  data () {
    return {
      playlists: []
    }
  },
  methods: {
    highlight: function (e) {
      e.target.style.backgroundColor = 'black'
      e.target.style.fill = 'white'
    },
    unhighlight: function (e) {
      e.target.style.backgroundColor = 'white'
      e.target.style.fill = 'black'
    },
    setCurrentTab: function (playlistIndex) {
      this.$emit('setPlaylist', { isPlaylist: false, songList: this.playlists[playlistIndex] })
    },
    showAllPlaylists: function () {
      this.$emit('showPlaylists', { isPlaylist: true, playlists: this.playlists.slice(2) })
    }
  },
  mounted: function () {
    ipcRenderer.send('playlist:requestName')
  },
  created () {
    ipcRenderer.on('playlist:receiveName', (event, playlists) => {
      playlists.forEach(playlist => {
        this.playlists.push(playlist.dataValues)
      })
      this.$emit('setPlaylist', { isPlaylist: false, songList: playlists[0].dataValues })
    })
  }
}
</script>

<style scoped>

  .container-fluid {
    padding-right: 0px;
    padding-left: 0px;
    text-align: center;
    min-width: 100%;
  }

  #side-bar {
    height: 85vh;
  }

  .material-design-icon {
    font-size: 3em;
    height:0.5em;
    width:0.5em;
  }

  .asterisk-icon {
    height: 1rem;
    width: 1rem
  }

  .list-group-item {
    padding-right: 0px;
    padding-left: 0px;
  }
  
</style>
