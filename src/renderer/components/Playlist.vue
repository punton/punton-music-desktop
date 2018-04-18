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
        <song-list></song-list>
      </el-collapse-item>
      <div style="display:flex; align-items: center; justify-content: center;">
        <button class="themed-btn themed-btn-font" @click="addPlaylist">
          <icon name="plus" color="#F4F4F4"></icon>
          New Playlist
        </button>
      </div>
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
          message: `Create playlist ${playlistName.value} successfully.`
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancel create playlist.'
        })
      })
    }
  }
}
</script>

<style>
.el-collapse-item__header {
  background-color: #272727;
  color: #F4F4F4;
}

.el-collapse-item__content {
  background-color: #272727;
  color: #F4F4F4;
}
</style>

<style scoped>
.scrollable {
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  min-height: 85vh;
  max-height: 85vh;
}

.playlist-grid {
  width: 100%;
  height: 100%;
}

.add-btn {
  width: 85%;
}

.themed-btn {
  width: 80%;
  height: 30%;
  background-color:#F10707;
  border:0.2rem solid #F4F4F4;
  transition-property: border-width;
  transition-duration: 0.25s;
  border-radius: 0.15em;
  color: #F4F4F4;
}

.themed-btn-font {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

</style>
