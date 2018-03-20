<template>
  <div>
    <!-- <p>{{collection}}</p> -->
    <!-- <p>Is playing: {{state.isPlaying}}</p> -->
    <!-- <div v-if="state.tab == 0">
      <playlists key="ml" :playlists=collection.mlPlaylists :state="state"></playlists>
    </div>
    <div v-else-if="state.tab == 1">
      <playlists key="user" :playlists=collection.userPlaylists :state="state"></playlists>
    </div>
    <div v-else-if="state.tab == 2">
      <playlists key="all" :playlists=collection.allSongs :state="state"></playlists>
    </div> -->
    <song-list :songs="songs" :playingSongId="playingSongId"></song-list>
  </div>
</template>

<script>
// import {ipcRenderer} from 'electron'
import Playlists from './Playlists'
import SongList from './SongList'

export default {
  components: { Playlists, SongList },
  props: ['state', 'collection', 'songs', 'playingSongId']
}
</script>
