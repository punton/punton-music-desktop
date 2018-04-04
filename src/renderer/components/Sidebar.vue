<template>
   <div class="sidebar-grid">
     <div class="tab-box"
     @mouseenter="highlight"
     @mouseleave="unhighlight"
     v-b-tooltip.hover.right="'Recommend\n Songs'"
     @click="setCurrentTab(0)">
      <icon name="thumbs-up" scale=2></icon>
     </div>
     <div class="tab-box tab-icon-inline"
     @mouseenter="highlight"
     @mouseleave="unhighlight"
     v-b-tooltip.hover.right="'All\n Songs'"
     @click="setCurrentTab(1)">
      <icon name="list" scale="2"></icon>
     </div>
     <div class="tab-box tab-icon-inline"
     @mouseenter="highlight"
     @mouseleave="unhighlight"
     v-b-tooltip.hover.right="'Custom\n Playlists'"
     @click="showAllPlaylists()">
      <icon name="music" scale="2"></icon>
      <icon name="asterisk" scale=1></icon>
     </div>
   </div>
</template>

<script>
// import MusicNoteIcon from 'vue-material-design-icons/music-note.vue'
// import PlaylistIcon from 'vue-material-design-icons/playlist-play.vue'
// import ThumbupIcon from 'vue-material-design-icons/thumb-up.vue'
// import AsteriskIcon from 'vue-material-design-icons/asterisk.vue'

import {ipcRenderer} from 'electron'

export default {
  // components: { MusicNoteIcon, PlaylistIcon, ThumbupIcon, AsteriskIcon },
  data () {
    return {
      playlists: []
    }
  },
  methods: {
    highlight: function (e) {
      e.target.style.backgroundColor = 'black'
      let icons = e.target.childNodes
      icons.forEach((icon) => {
        if (icon.nodeName === 'svg') {
          icon.style.fill = 'white'
        }
      })
    },
    unhighlight: function (e) {
      e.target.style.backgroundColor = 'white'
      let icons = e.target.childNodes
      icons.forEach((icon) => {
        if (icon.nodeName === 'svg') {
          icon.style.fill = 'black'
        }
      })
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
  .tab-box {
    width: 100%;
    grid-area: 'tb';
    display: grid;
    justify-items: center;
    align-items: center;
    border-top-right-radius: 15%;
    border-bottom-right-radius: 15%;
  }

  .sidebar-grid {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: repeat(6, 1fr);
    grid-template-areas: 
    "tb"
    "tb"
    "tb";
    background-color: white
  }

  .tab-icon-inline {
    display: inline-flex; align-items: center; justify-content: center;
  }
/*   
  .material-design-icon {
    height: 100%;
    width: 100%;
  }

  .circular-icon {
    border: 2px;
    border-radius: 50%;
  } */
</style>
