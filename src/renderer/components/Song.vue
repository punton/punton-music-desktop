<template>
  <div>
    <b-container v-if="songInfo" fluid v-on:click="play(songInfo.path)">
      <b-row>
        <!-- <b-col>{{songId}}</b-col> -->
        <b-col cols="2">{{songInfo.id}}</b-col>
        <b-col cols="5">{{songInfo.name}}</b-col>
        <b-col cols="5">{{songInfo.path}}</b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
export default {
  props: ['songId'],
  data () {
    return {
      songInfo: null
    }
  },
  mounted: function () {
    console.log('Getting Song information.')
    ipcRenderer.send('getSong', this.songId)
    ipcRenderer.on('getSong-reply-' + this.songId, (event, arg) => {
      // console.log('Reply from getting a song: ')
      // console.log(arg)
      this.songInfo = arg
    })
  },
  methods: {
    play: function (path) {
      console.log(path)
      ipcRenderer.send('selectSong', this.songInfo)
    }
  }
}
</script>
