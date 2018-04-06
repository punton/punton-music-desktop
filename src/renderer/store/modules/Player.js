const state = {
  selectedSong: {
    id: null,
    data: null
  },
  player: {
    context: null,
    source: null,
    gainNode: null
  },
  playlists: [],
  currentPlaylist: null,
  songs: [],
  contextTime: 0,
  seekTime: 0,
  isContextRunning: false
}

const mutations = {
  SET_PLAYING_SONG (state, newSong) {
    state.selectedSong = newSong
  },
  SET_PLAYER (state, player) {
    state.player = player
  },
  SET_PLAYLIST (state, playlist) {
    state.playlists = playlist
  },
  SET_SONGS (state, songs) {
    state.songs = []
    songs.forEach(song => {
      state.songs.push(song.dataValues)
    })
  },
  SET_PLAYLISTS (state, playlists) {
    state.playlists = playlists
    console.log(`[Playlists state] Add all playlists to store.`)
  },
  SET_CURRENT_PLAYLIST (state, playlist) {
    state.currentPlaylist = playlist
  },
  SET_CONTEXT_TIME (state, contextTime) {
    state.contextTime = contextTime
  },
  SET_SEEK_TIME (state, seekTime) {
    state.seekTime = seekTime
  },
  SET_PLAYER_VOLUME (state, volume) {
    state.player.gainNode.gain.value = volume
  },
  CREATE_PLAYER (state) {
    let audioContext = new AudioContext()
    state.player.context = audioContext
    state.player.source = audioContext.createBufferSource()
    state.player.gainNode = audioContext.createGain()
    state.player.source.connect(state.player.gainNode)
    state.player.gainNode.connect(state.player.context.destination)
    state.isContextRunning = state.player.context.state === 'running'
    console.log(`[Player state] ${state.player.context.state}`)
  },
  RESUME_PLAYER (state) {
    console.log(`[Player state] Before: ${state.player.context.state}`)
    state.player.context.resume()
    state.isContextRunning = state.player.context.state === 'running'
    console.log(`[Player state] After: ${state.player.context.state}`)
  },
  SUSPEND_PLAYER (state) {
    console.log(`[Player state] Before: ${state.player.context.state}`)
    state.player.context.suspend()
    state.isContextRunning = state.player.context.state === 'running'
    console.log(`[Player state] After: ${state.player.context.state}`)
  },
  STOP_PLAYER (state) {
    if (state.player.context && state.player.source) {
      state.player.source.stop(0)
      state.player.context.close(0)
      state.isContextRunning = state.player.context.state === 'running'
      console.log(`[Player state] ${state.player.context.state}`)
    }
  },
  SET_SELECTED_SONG (state, song) {
    console.log(`[Selected Song State]  ${song.id} ${song.title}`)
    state.selectedSong = {
      id: song.id,
      data: song
    }
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  },
  setSongs ({ commit }, songs) {
    commit('SET_SONGS', songs)
  },
  setSeekTime ({ commit }, seekTime) {
    commit('SET_SEEK_TIME', seekTime)
  },
  setContextTime ({ commit }, contextTime) {
    commit('SET_CONTEXT_TIME', contextTime)
  },
  setPlaylists ({ commit }, playlists) {
    commit('SET_PLAYLISTS', playlists)
  },
  setCurrentPlaylist ({ commit }, playlist) {
    commit('SET_CURRENT_PLAYLIST', playlist)
  },
  createPlayer ({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('CREATE_PLAYER')
      resolve()
    })
  },
  stopPlayer ({ commit }) {
    commit('STOP_PLAYER')
  },
  async playSong ({ dispatch, commit, state }, songInfo) {
    await dispatch('createPlayer')
    state.player.source.buffer = await state.player.context.decodeAudioData(songInfo.bin.buffer)
    await dispatch('setSeekTime', songInfo.seekTime)
    await new Promise((resolve, reject) => {
      console.log('[Vuex] Successfully decoded. Start playing ...')
      // console.table(state.player)
      state.player.source.start(0, songInfo.seekTime, state.selectedSong.data.duration)
      state.player.source.onended = function (event) {
        state.player.source.stop(0)
        state.player.context.close()
        console.log('[Context] song ended.')
      }
      resolve()
    })
  },
  setSelectedSong ({ commit }, song) {
    commit('SET_SELECTED_SONG', song)
  },
  resume ({ commit }) {
    commit('RESUME_PLAYER')
  },
  suspend ({ commit }) {
    commit('SUSPEND_PLAYER')
  },
  stopSong ({ commit }) {
    commit('STOP_PLAYER')
  },
  setVolume ({ commit }, volume) {
    commit('SET_PLAYER_VOLUME', volume)
  }
}

const getters = {
  getCounter: state => {
    return state.main
  },
  getSongs: state => {
    return state.songs
  },
  getContextTime: state => {
    return state.contextTime
  },
  getSeekTime: state => {
    return state.seekTime
  },
  getCurrentTime: state => {
    return state.contextTime + state.seekTime
  },
  getVolume: state => {
    return state.player.gainNode ? state.player.gainNode.gain.value * 100 : 0
  },
  getPlaylists: state => {
    return state.playlists
  },
  getPlaylistByIndex: state => index => {
    return state.playlists[index]
  },
  getCurrentPlaylist: state => {
    return state.currentPlaylist
  },
  getSongDuration: state => {
    return state.selectedSong.id ? state.selectedSong.data.duration : 0
  },
  getPlayer: state => {
    return state.player
  },
  getSelectedSong: state => {
    // console.table(state.selectedSong)
    return state.selectedSong
  },
  isPlayerRunning: state => {
    console.log(state.player.context ? state.player.context.state === 'running' : false)
    return state.player.context ? state.player.context.state === 'running' : false
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
