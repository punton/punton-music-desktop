<template>
  <div class="dropzone" @dragover.prevent @drop="onDrop">
    <el-table
      ref="songListTable"
      class="song-table"
      :data="getShowingSongs"
      @selection-change="handleSelectionChange"
      height="75vh"
      empty-text="Drop song here!"
      @sort-change="sortSongs"
      :header-cell-style="{'background-color': '#272727', 'color': '#F4F4F4'}"
      :cell-style="{'background-color': '#474747', 'color': '#F4F4F4'}"
      style="width: 100%;">
        <el-table-column
          type="selection"
          label="Delete"
          width="55">
        </el-table-column>
        <el-table-column
          type="index"
          label="Play"
          header-align="center"
          width="80">
            <template slot-scope="scope">
              <div class="playing-icon">
                <play-button :song="scope.row"></play-button>
              </div>
            </template>
        </el-table-column>
        <el-table-column
          sortable="custom"
          prop="title"
          label="Title">
        </el-table-column>
        <el-table-column
          sortable
          prop="artist"
          label="Artist">
        </el-table-column>
        <el-table-column
          sortable
          header-align="center"
          align="center"
          prop="duration"
          width="120"
          label="Duration">
          <template slot-scope="scope">
            {{durationFormat(scope.row.duration)}}
          </template>
        </el-table-column>
    </el-table>
    <div class="delete-panel">
       <button class="themed-btn themed-btn-font" @click="deleteSong">
        <div class="btn-text-and-icon">
          <icon name="regular/trash-alt" color="#F4F4F4"></icon>
          <label class="btn-text">Delete Song</label>
        </div>
      </button>
      <button class="clear-btn themed-btn-font" @click="clearSelection">
        <div class="btn-text-and-icon">
          <icon name="regular/square" color="#F4F4F4"></icon>
          <label class="btn-text">Clear Selection</label>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import _ from 'lodash'
import draggable from 'vuedraggable'
import PlayButton from './SongList/PlayButton'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    draggable,
    PlayButton
  },
  data () {
    return {
      multipleSelection: []
    }
  },
  methods: {
    onDrop: function (e) {
      e.stopPropagation()
      e.preventDefault()
      const songs = []
      const regex = RegExp('audio/.+', 'i')
      _.values(e.dataTransfer.files).forEach(song => {
        if (regex.test(song.type)) songs.push({ name: song.name, path: song.path })
      })
      ipcRenderer.send('songList:save', { songs, playlist: this.getCurrentPlaylist })
    },
    durationFormat: function (duration) {
      return (parseInt(duration / 60) + parseInt(duration % 60) / 100).toFixed(2)
    },
    deleteSong () {
      ipcRenderer.send('song:delete', this.multipleSelection.map(song => song.id))
    },
    clearSelection () {
      this.$refs.songListTable.clearSelection()
    },
    handleSelectionChange (rows) {
      this.multipleSelection = rows
    },
    refreshSongList: function () {
      ipcRenderer.send('songList:find', this.getCurrentPlaylist.id)
    },
    sortSongs: function (sortStyle) {
      console.log(sortStyle)
      this.sortBy({type: sortStyle.prop, order: sortStyle.order})
    },
    ...mapActions([
      'sortBy'
    ])
  },
  computed: {
    ...mapGetters([
      'getCurrentPlaylist',
      'getShowingSongs'
    ])
  }
}
</script>

<style scoped>
.dropzone {
  /* border: 5px dashed rgb(0, 17, 255); */
  min-height: 85vh;
  width: 100%;
  background-color: #272727;
}

.song-table {
  background-color: #272727;
}

.scrollable {
  height: 85vh;
  overflow-y: auto;
}

.playing-icon {
  min-width: 100%;
  height: 30px;
  text-align: center;
}

.white-frame {
  border:0.35rem solder white;
}

.themed-txt {
  background-color: #272727;
  border:0.35rem solid #F4F4F4;
  color: #F4F4F4;
}

.delete-panel {
  margin-top: 8px;
  background: #272727;
}

.themed-btn {
  padding: 14px;
  background-color:#F10707;
  border:0.2rem solid #F4F4F4;
  transition-property: background-color;
  transition-duration: 0.25s;
  border-radius: 0.15em;
  color: #F4F4F4;
}

.themed-btn:hover {
    background-color: #FB5C5C;
  }

.themed-btn-font {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 16px;
}

.clear-btn {
  padding: 14px;
  background-color: #272727;
  border: 0.2rem solid #F4F4F4;
  transition-property: background-color;
  transition-duration: 0.25s;
  border-radius: 0.15em;
  color: #F4F4F4;
}

.clear-btn:hover {
  background-color: #353535;
}

.btn-text-and-icon {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.btn-text {
  padding-left: 8px;
}
</style>
