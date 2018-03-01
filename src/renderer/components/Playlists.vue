<template>
  <div class="scrollable">
    {{_uid}}
    <div>
      <!-- <b-list-group>
        <b-list-group-item v-for="playlist in playlists" :key="playlist.id">{{playlist}}</b-list-group-item>
      </b-list-group> -->
      <b-list-group>
        <b-list-group-item v-for="playlist in playlistsContent" :key="playlist.id">
          {{playlist.name}}
          <b-list-group>
            <b-list-group-item>
              <b-row>
                <b-col cols="2">ID</b-col>
                <b-col cols="5">Name</b-col>
                <b-col cols="5">Path</b-col>
              </b-row>
            </b-list-group-item>
            <b-list-group-item v-for="song in playlist.songs" :key="song">
              <song :key="song" :songId="song"></song>
            </b-list-group-item>
          </b-list-group>
        </b-list-group-item>
      </b-list-group>
    </div>
    <!-- <div v-else>
      Hello
    </div> -->
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
import Song from './Song'

export default {
  components: {Song},
  props: [ 'playlists', 'channel', 'state' ],
  data () {
    return {
      showPlaylist: false,
      playlistsContent: []
    }
  },
  methods: {
    togglePlaylist: function (event) {
      console.log('Toggled show playlist: ' + this.showPlaylist)
      console.log(event.target.innerText)
      // this.showPlaylist = !this.showPlaylist
      // for (let id of this.playlists) {
      //   console.log(id)
      ipcRenderer.send('getPlaylist', {type: this.type, id: event.target.innerText})
      // }
    }
  },
  mounted: function () {
    console.log(this._uid + ' Mounted')
    console.log(this.playlists)
    ipcRenderer.send('getPlaylists', this.playlists)
    ipcRenderer.on('getPlaylists-reply', (event, arg) => {
      console.log(arg)
      this.playlistsContent = arg
    })
  }
}
</script>

<style>
  .scrollable {
    overflow-y: scroll;
    height: 85vh;
  }
</style>