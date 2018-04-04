<template>
  <!-- <div class="container-fluid" id="side-bar">
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
   -->
   <div class="sidebar-grid">
     <div class="tab-box"
     @mouseenter="highlight"
     @mouseleave="unhighlight"
     v-b-tooltip.hover.right="'Recommend\n Songs'"
     @click="setTab(0)">
      <icon name="thumbs-up" scale=2></icon>
     </div>
     <div class="tab-box tab-icon-inline"
     @mouseenter="highlight"
     @mouseleave="unhighlight"
     v-b-tooltip.hover.right="'All\n Songs'"
     @click="setTab(1)">
      <icon name="list" scale="2"></icon>
     </div>
     <div class="tab-box tab-icon-inline"
     @mouseenter="highlight"
     @mouseleave="unhighlight"
     v-b-tooltip.hover.right="'Custom\n Playlists'"
     @click="setTab(2)">
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
    setTab: function (tab) {
      ipcRenderer.send('setCurrentTab', tab)
    }
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
