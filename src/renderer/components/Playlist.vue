<template>
  <div>
    <b-list-group>
      <b-list-group-item v-for="playlist in playlists" :key="playlist.id">{{playlist.name}}</b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'

export default {
  data () {
    return {
      playlists: [],
      currentTab: -1
    }
  },
  methods: {
  },
  created () {
  },
  mounted: function () {
    ipcRenderer.send('getCurrentTab')

    ipcRenderer.on('getMlPlaylists-reply', (event, arg) => {
      console.log('Get ML Playlists')
      for (let id of arg) {
        // console.log(id)
        ipcRenderer.send('getPlaylist', id)
      }
    })

    ipcRenderer.on('getUserPlaylists-reply', (event, arg) => {
      console.log('Get User playlists')
    })

    ipcRenderer.on('getAllSongs-reply', (event, arg) => {
      console.log('Get all songs')
    })

    ipcRenderer.on('getPlaylist-reply', (event, arg) => {
      // console.log('Playlist song ID')

      console.log(this.playlists)
      this.playlists.push(arg)

      // for (let id of arg.songs) {
      //   ipcRenderer.send('getSong', id)
      // }
    })

    ipcRenderer.on('getSong-reply', (event, arg) => {
      console.log(arg)
    })

    ipcRenderer.on('currentTab-reply', (event, arg) => {
      console.log('Current tab = ' + arg)
      this.currentTab = arg
    })
  }
}
</script>
