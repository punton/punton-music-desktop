<template>
  <div class="dropzone" @dragover="onDragover" @drop="onDrop">
    <ul>
      <li v-for="(song, index) in songs" :key="index">
        {{ song.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import _ from 'lodash'
import { ipcRenderer } from 'electron'

export default {
  data () {
    return {
      songs: []
    }
  },
  methods: {
    onDrop: function (e) {
      e.stopPropagation()
      e.preventDefault()
      const songList = []
      _.values(e.dataTransfer.files).forEach(song => {
        songList.push({ name: song.name, path: song.path })
      })
      songList.sort((a, b) => {
        let nameA = a.name.toUpperCase()
        let nameB = b.name.toUpperCase()
        if (nameA < nameB) return -1
        else if (nameA > nameB) return 1
        else return 0
      })
      this.songs = this.songs.concat(songList)
      ipcRenderer.send('songList:save', songList)
    },
    onDragover: function (e) {
      e.preventDefault()
    }
  }
}
</script>

<style scoped>
  .dropzone {
    border: 5px dashed rgb(0, 17, 255);
    height: auto;
    min-height: 100%;
    width: 100%;
  }
</style>
