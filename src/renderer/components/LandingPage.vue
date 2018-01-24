<template>
  <div id="wrapper">
    <song-list></song-list>
  </div>
</template>

<script>
  import SongList from './SongList'

  export default {
    name: 'landing-page',
    components: { SongList }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  body { font-family: 'Source Sans Pro', sans-serif; }
</style>
