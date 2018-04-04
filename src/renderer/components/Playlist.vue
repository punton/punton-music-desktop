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
  </div>
</template>

<script>
import songList from '@/components/SongList'

export default {
  components: {
    songList
  },
  name: 'playlists',
  props: ['playlists', 'setPlaylist', 'playingSongId', 'isPlaying', 'songs'],
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
</style>
