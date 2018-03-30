<template>
  <b-list-group>
    <b-list-group-item v-for="playlist in playlists" :key="playlist.id" @click="selectPlaylist(playlist.id)">
      {{playlist.name}}
    </b-list-group-item>
  </b-list-group>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'playlists',
  props: ['playlists', 'setPlaylist'],
  methods: {
    selectPlaylist: function (playlistId) {
      this.$emit('setPlaylist', { isPlaylist: false, songList: _.find(this.playlists, { id: playlistId }) })
    }
  }
}
</script>
