<template>
  <div class="scrollable playlist-grid">
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
      <el-button type="primary" class="add-btn" icon="el-icon-plus" @click="addPlaylist">Add new playlist</el-button>
    </el-collapse>
  </div>
</template>

<script>
import songList from '@/components/SongList'
import { mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'

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
    },
    addPlaylist: function () {
      this.$prompt('Please input your new playlist name', 'New Playlist', {
        confirmButtonText: 'Create',
        cancelButtonText: 'Cancel',
        inputPattern: /(.*[^\s])+/,
        inputErrorMessage: 'Invalid Name'
      }).then(playlistName => {
        ipcRenderer.send('playlist:create', playlistName.value)
        this.$message({
          type: 'success',
          message: `Create playlist ${playlistName} successfully.`
        })
      })
    }
  }
}
</script>

<style scoped>
.scrollable {
  width: 100%;
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

.add-btn {
  width: 100%;
}
</style>
