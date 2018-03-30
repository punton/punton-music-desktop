<template>
  <b-list-group flush>
    <b-list-group-item v-for="playlist in playlists" :key="playlist.id">
      {{playlist.name}}
    </b-list-group-item>
  </b-list-group>
</template>

<script>
export default {
  name: 'playlists',
  props: ['playlists']
}
</script>
