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
      console.log(e.dataTransfer.files)
      _.values(e.dataTransfer.files).forEach(song => {
        this.songs.push(song)
      })
    },
    onDragover: function (e) {
      e.preventDefault()
    }
  }
}
</script>

<style scoped>
  .dropzone {
    border: 5px dashed skyblue;
    height: 95vh;
  }
</style>
