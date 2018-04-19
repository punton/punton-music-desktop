<template>
  <div class="scrollable playlist-grid">
<<<<<<< HEAD
    <el-dialog
      title="Delete Playlist"
      :visible.sync="deletePlaylistDialogVisible"
      width="40%"
      center>
      <span>Are you sure you want to delete this Playlist {{deletingPlaylistName}} ?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletePlaylistDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="deletePlaylist()">Delete</el-button>
      </span>
    </el-dialog>
    <el-table
      ref="playlistsTable"
      @expand-change="expandChange"
      height="75vh"
      :data="playlists">
      <el-table-column
        type="expand">
        <template
          slot-scope="props">
          <song-list></song-list>
=======
    <el-collapse accordion>
      <el-collapse-item
        v-for="playlist in playlists"
        :name="playlist.id"
        :key="playlist.id"
        @sort-change="">
        <template slot="title">
          {{playlist.name}}   
>>>>>>> Fixed volume style .
        </template>
      </el-table-column>
      <el-table-column
        label="Name"
        prop="name">
      </el-table-column>
      <el-table-column
        label="Operations">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="editPlaylist(scope.row.id)">Edit</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="callDeletePlaylistDialog(scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" class="add-btn" icon="el-icon-plus" @click="addPlaylist">Add new playlist</el-button>
  </div>
</template>

<script>
import songList from '@/components/SongList'
import { mapGetters, mapActions } from 'vuex'
import { ipcRenderer } from 'electron'

export default {
  components: {
    songList
  },
  props: ['playingSongId', 'isPlaying', 'songs'],
  data () {
    return {
      deletePlaylistDialogVisible: false,
      deletingPlaylistName: '',
      deletingPlaylistId: '',
      expandedRows: []
    }
  },
  computed: {
    playlists: function () {
      return this.getPlaylists.slice(2)
    },
    ...mapGetters([
      'getPlaylists'
    ])
  },
  watch: {
    expandedRows (newValue, oldValue) {
      if (newValue.length === 1) {
        this.selectPlaylist(newValue[0].id)
      } else if (newValue.length > 1) {
        this.selectPlaylist(newValue[1].id)
        this.$refs.playlistsTable.toggleRowExpansion(newValue[0], false)
      }
    }
  },
  methods: {
    expandChange (row, expandedRows) {
      this.expandedRows = expandedRows
    },
    selectPlaylist: function (playlistId) {
      const selectedPlaylist = this.getPlaylists.filter(playlist => playlist.id === playlistId)[0]
      this.setCurrentPlaylist(selectedPlaylist)
      if (selectedPlaylist !== undefined) ipcRenderer.send('songList:find', selectedPlaylist.id)
    },
    addPlaylist: function () {
      this.$prompt('Please type your new playlist name', 'New Playlist', {
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
    },
    editPlaylist (playlistId) {
      this.$prompt('Please type your new playlist name', 'Edit Playlist Name', {
        confirmButtonText: 'Edit',
        cancelButtonText: 'Cancel',
        inputPattern: /(.*[^\s])+/,
        inputErrorMessage: 'Invalid Name'
      }).then(playlistName => {
        ipcRenderer.send('playlist:update', { id: playlistId, name: playlistName.value })
        this.$message({
          type: 'success',
          message: `Edit playlist ${playlistName.value} successfully.`
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancel create playlist.'
        })
      })
    },
    callDeletePlaylistDialog (row) {
      this.deletingPlaylistName = row.name
      this.deletingPlaylistId = row.id
      this.deletePlaylistDialogVisible = true
    },
    deletePlaylist () {
      this.deletePlaylistDialogVisible = false
      ipcRenderer.send('playlist:delete', this.deletingPlaylistId)
    },
    ...mapActions([
      'setCurrentPlaylist'
    ])
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
  background: #272727;
}

.add-btn {
  width: 85%;
}

.playlist-control-panel {
  display: flex;
  width: 100%;
}

.playlist-control-panel-btn {
  flex: 1;
}

.song-table {
  background-color: #272727;
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

