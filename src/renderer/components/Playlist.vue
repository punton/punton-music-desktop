<template>
  <div class="scrollable">
    <el-collapse accordion>
      <el-collapse-item
        v-for="playlist in playlists"
        :name="playlist.id"
        :key="playlist.id">
        <template slot="title">
          {{playlist.name}}
        </template>
        <song-list
          :songs="songs"
          :playingSongId="playingSongId"
          :isPlaying="isPlaying"
          :playlist="playlist.id"
        ></song-list>
      </el-collapse-item>
    </el-collapse>
    <div class="playlist-grid"></div>
  </div>
</template>

<script>
import songList from '@/components/SongList'
import { mapGetters } from 'vuex'

export default {
  components: {
    songList
  },
  props: ['playingSongId', 'isPlaying', 'songs'],
  computed: {
    playlists: function () {
      return this.getPlaylists.slice(2)
    },
    ...mapGetters([
      'getPlaylists'
    ])
  },
  methods: {
    selectPlaylist: function (playlistId) {
      this.$emit('setPlaylist', { isPlaylist: true, songList: playlistId })
    }
  }
}
</script>

<style scoped>
.scrollable {
  overflow-x: hidden;
  overflow-y: scroll;
  min-height: 85vh;
  max-height: 85vh;
  padding: 0 8px 0 8px;
}
  .playlist-grid {
    width: 100%;
    height: 100%;
    display: grid;
  }
</style>
