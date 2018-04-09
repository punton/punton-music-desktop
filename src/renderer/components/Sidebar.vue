<template>
  <div class="sidebar-grid">
    <el-tooltip effect="dark" placement="right">
      <div slot="content">Recommend<br/>Songs</div>
      <el-button
      class="tab-box"
      plain
      @click="setCurrentTab(0)"
      type="primary">
        <icon name="thumbs-up" scale=2></icon>
      </el-button>
    </el-tooltip>
    <el-tooltip effect="dark" placement="right">
      <div slot="content">All<br/>Songs</div>
      <el-button
      class="tab-box"
      plain
      @click="setCurrentTab(1)"
      type="primary">
        <icon name="list" scale="2"></icon>
      </el-button>
    </el-tooltip>
    <el-tooltip effect="dark" placement="right">
      <div slot="content">Custom<br/>Playlists</div>
      <el-button
      class="tab-box"
      plain
      @click="showAllPlaylists()"
      type="primary">
        <icon name="music" scale="2"></icon>
        <icon name="asterisk" scale="1"></icon>
      </el-button>
    </el-tooltip>
    <el-tooltip effect="dark" placement="right">
      <div slot="content">Create<br/>a playlist</div>
      <el-button
      class="tab-box"
      plain
      type="success">
        <icon name="plus" scale="2"></icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'

export default {
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
    /* height: 100%; */
    display: grid;
    /* grid-template-rows: repeat(6, 1fr); */
    grid-template: 
    /* "tb"
    "tb"
    "tb"; */
    "rc" 3fr
    "pc" 3fr
    "ac" 3fr
    "cc" 2fr / 1fr;
    background-color: white
  }

  .tab-icon-inline {
    display: inline-flex; align-items: center; justify-content: center;
  }
</style>
