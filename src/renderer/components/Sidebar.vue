<template>
  <div class="sidebar-grid">
    <el-tooltip effect="dark" placement="right">
      <div slot="content">Recommend<br/>Songs</div>
      <!-- <el-button
      class="tab-box"
      plain
      @click="setCurrentTab(0)"
      type="danger">
        <icon name="thumbs-up" scale=2></icon>
      </el-button> -->
      <button class="themed-btn" @click="setCurrentTab(0)">
        <icon name="thumbs-up" scale="2" color="white"></icon>
      </button>
    </el-tooltip>
    <el-tooltip effect="dark" placement="right">
      <div slot="content">All<br/>Songs</div>
      <!-- <el-button
      class="tab-box"
      @click="setCurrentTab(1)"
      type="danger">
        <icon name="list" scale="2"></icon>
      </el-button> -->
      <button class="themed-btn" @click="setCurrentTab(1)">
        <icon name="music" scale="2" color="white"></icon>
        <icon name="asterisk" scale="1" color="white"></icon>
      </button>
    </el-tooltip>
    <el-tooltip effect="dark" placement="right">
      <div slot="content">Custom<br/>Playlists</div>
      <!-- <el-button
      class="tab-box"
      @click="showAllPlaylists()"
      type="danger">
        <icon name="music" scale="2"></icon>
        <icon name="asterisk" scale="1"></icon>
      </el-button> -->
      <button class="themed-btn" @click="setCurrentTab(0)">
        <icon name="list" scale="2" color="white"></icon>
      </button>
    </el-tooltip>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: ['isShowPlaylists'],
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
      this.$emit('setShowPlaylists', false)
      this.setCurrentPlaylist(this.getPlaylistByIndex(playlistIndex))
      ipcRenderer.send('songList:find', this.getCurrentPlaylist.id)
    },
    showAllPlaylists: function () {
      this.$emit('setShowPlaylists', true)
    },
    ...mapActions([
      'setCurrentPlaylist'
    ])
  },
  computed: {
    ...mapGetters([
      'getPlaylistByIndex',
      'getCurrentPlaylist'
    ])
  }
}
</script>

<style scoped>
  .tab-box {
    width: 95%;
    grid-area: 'tb';
    display: grid;
    justify-items: center;
    align-items: center;
    margin-left: 0;
  }

  .rec-cell {
    grid-area: 'rc'
  }

  .playlists-cell {
    grid-area: 'pc'
  }

  .all-songs-cell {
    grid-area: 'ac'
  }

  .create-cell {
    grid-area: 'cc'
  }

  .sidebar-grid {
    width: 100%;
    height: 100%;
    background-color: #272727;
    /* display: grid;
    grid-template: 
    "rc" 3fr
    "pc" 3fr
    "ac" 3fr
    "cc" 2fr / 1fr; */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    /* justify-items:  */
    align-items: center;
  }

  .tab-icon-inline {
    display: inline-flex; align-items: center; justify-content: center;
  }

  .themed-btn {
    width:90%;
    height: 15%;
    background-color:#F10707;
    border:0.35rem solid white;
    margin:0.5rem 0 0.1rem 0;
  }
</style>
