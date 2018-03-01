<template>
  <div class="container-fluid" id="side-bar">
    <b-list-group>
      <b-list-group-item 
        v-on:mouseenter="highlight"
        v-on:mouseleave="unhighlight"
        v-b-tooltip.hover.right="'Recommendation'"
        v-on:click="setCurrentTab(0)">
        <thumbup-icon/>
      </b-list-group-item>
      <b-list-group-item 
        v-on:mouseenter="highlight" 
        v-on:mouseleave="unhighlight" 
        v-b-tooltip.hover.right="'Songs'"
        v-on:click="setCurrentTab(1)">
        <music-note-icon/><sup><asterisk-icon/></sup>
      </b-list-group-item>
      <b-list-group-item 
        v-on:mouseenter="highlight" 
        v-on:mouseleave="unhighlight" 
        v-b-tooltip.hover.right="'Playlists'"
        v-on:click="setCurrentTab(2)">
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
  components: { MusicNoteIcon, PlaylistIcon, ThumbupIcon, AsteriskIcon },
  data () {
    return {

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
    showRecommendation: function () {
      // console.log('Getting ML playlists . . .')
      // ipcRenderer.send('getMlPlaylists')
    },
    setCurrentTab: function (tab) {
      ipcRenderer.send('setCurrentTab', tab)
    }
  },
  mounted: function () {
    // ipcRenderer.send('getMlPlaylists')
    // ipcRenderer.send('getUserPlaylists')
    // ipcRenderer.send('getAllSongs')
  }
}
</script>

<style>

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
