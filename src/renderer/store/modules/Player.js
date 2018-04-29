import { ipcRenderer } from 'electron'

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
  playlist: [],
  isSongPlaying: false,
  isSongRepeat: false,
  isPlaylistRepeat: false,
  isShuffling: false,
  volume: 50,
  playlists: [],
  currentPlaylist: null,
  songs: [],
  showingSongs: [],
  contextTime: 0,
  seekTime: 0,
  isContextRunning: false,
  contextState: '',
  currentTab: 0,
  expandedRow: null
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
      state.songs.push(song)
    })
  },
  SET_SHOWING_SONG (state, songs) {
    state.showingSongs = []
    songs.forEach(song => {
      state.showingSongs.push(song.dataValues)
    })
  },
  SET_PLAYLISTS (state, playlists) {
    state.playlists = playlists
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
  SET_VOLUME (state, volume) {
    state.volume = volume
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
    state.isSongPlaying = true
    state.isContextRunning = state.player.context.state === 'running'
  },
  RESUME_PLAYER (state) {
    state.player.context.resume()
    state.isSongPlaying = true
    state.isContextRunning = state.player.context.state === 'running'
  },
  SUSPEND_PLAYER (state) {
    state.player.context.suspend()
    state.isSongPlaying = false
    state.isContextRunning = state.player.context.state === 'running'
  },
  STOP_PLAYER (state) {
    if (state.player.context && state.player.source) {
      try {
        state.player.source.stop(0)
        state.player.context.close(0)
        state.isSongPlaying = false
        state.isContextRunning = state.player.context.state === 'running'
      } catch (error) {
        console.error(error)
      }
    }
  },
  SET_SELECTED_SONG (state, song) {
    state.selectedSong = {
      id: song.id,
      data: song
    }
  },
  TOGGLE_REPEAT (State) {
    let isSongRepeat = state.isSongRepeat
    let isPlaylistRepeat = state.isPlaylistRepeat
    state.isSongRepeat = (isPlaylistRepeat) ? isSongRepeat : !isSongRepeat
    state.isPlaylistRepeat = (isSongRepeat || isPlaylistRepeat) ? !isPlaylistRepeat : isSongRepeat
  },
  TOGGLE_SHUFFLE (state) {
    state.isShuffling = !state.isShuffling
  },
  SET_CONTEXT_STATE (state, contextState) {
    state.contextState = contextState
  },
  SET_TAB (state, tabIndex) {
    state.currentTab = tabIndex
  },
  SORT_BY (state, sortStyle) {
    if (sortStyle.type === 'title') {
      utils.sortByTitle(state.songs, sortStyle.order)
      utils.sortByTitle(state.showingSongs, sortStyle.order)
    } else if (sortStyle.type === 'artist') {
      utils.sortByArtist(state.songs, sortStyle.order)
      utils.sortByArtist(state.showingSongs, sortStyle.order)
    } else if (sortStyle.type === 'duration') {
      utils.sortByDuration(state.songs, sortStyle.order)
      utils.sortByDuration(state.showingSongs, sortStyle.order)
    } else {
      utils.sortById(state.songs, sortStyle.order)
      utils.sortById(state.showingSongs, sortStyle.order)
    }
  },
  SET_EXPANDED_ROW (state, expandedRow) {
    state.expandedRow = expandedRow
  }
}

const utils = {
  getNextSong () {
    let nextSong
    let totalSongs = state.songs.length
    // console.log(`Total songs is ${totalSongs}.`)
    if (totalSongs > 0) {
      if (state.isSongRepeat) {
        nextSong = state.selectedSong.data
      } else if (state.isShuffling) {
        let index = Math.floor(Math.random() * totalSongs)
        nextSong = state.songs[index]
      } else {
        let songIndex = utils.getSongIndex(state.selectedSong.data)
        let nextSongIndex = songIndex === totalSongs - 1 ? 0 : songIndex + 1
        nextSong = state.songs[nextSongIndex]
      }
    }
    console.log(`Next song is ${JSON.stringify(nextSong)}`)
    return nextSong
  },
  getPrevSong () {
    let totalSongs = state.songs.length
    let prevSong
    if (totalSongs > 0) {
      let songIndex = this.getSongIndex(state.selectedSong.data)
      let prevSongIndex = songIndex === 0 ? 0 : songIndex - 1
      prevSong = state.songs[prevSongIndex]
    }
    return prevSong
  },
  getSongIndex (song) {
    let songIndex = -1
    state.songs.forEach(function (stateSong, index) {
      if (stateSong.id === song.id) {
        songIndex = index
      }
    })
    return songIndex
  },
  sortById (songs, order) {
    let orderMod = 1
    if (order === 'descending') {
      orderMod = -1
    }
    return songs.sort(function (a, b) {
      let aId = a.id.toLowerCase()
      let bId = b.id.toLowerCase()
      let diff
      if (aId < bId) {
        diff = -1 * orderMod
      } else if (aId > bId) {
        diff = 1 * orderMod
      } else {
        diff = 0
      }
      return diff
    })
  },
  sortByTitle (songs, order) {
    let orderMod = 1
    if (order === 'descending') {
      orderMod = -1
    }
    return songs.sort(function (a, b) {
      let aTitle = a.title.toLowerCase()
      let bTitle = b.title.toLowerCase()
      let diff
      if (aTitle < bTitle) {
        diff = -1 * orderMod
      } else if (aTitle > bTitle) {
        diff = 1 * orderMod
      } else {
        diff = 0
      }
      return diff
    })
  },
  sortByArtist (songs, order) {
    let orderMod = 1
    if (order === 'descending') {
      orderMod = -1
    }
    return songs.sort(function (a, b) {
      let aArtist = a.artist.toLowerCase()
      let bArtist = b.artist.toLowerCase()
      let diff
      if (aArtist < bArtist) {
        diff = -1 * orderMod
      } else if (aArtist > bArtist) {
        diff = 1 * orderMod
      } else {
        diff = 0
      }
      return diff
    })
  },
  sortByDuration (songs, order) {
    let orderMod = 1
    if (order === 'descending') {
      orderMod = -1
    }
    return songs.sort(function (a, b) {
      let aDuration = parseFloat(a.duration)
      let bDuration = parseFloat(b.duration)
      let diff
      if (aDuration < bDuration) {
        diff = -1 * orderMod
      } else if (aDuration > bDuration) {
        diff = 1 * orderMod
      } else {
        diff = 0
      }
      return diff
    })
  }
}

const actions = {
  setContextState ({ commit }, contextState) {
    commit('SET_CONTEXT_STATE', contextState)
  },
  setSongs ({ commit }, songs) {
    commit('SET_SONGS', songs)
  },
  setShowingSongs ({ commit }, songs) {
    commit('SET_SHOWING_SONG', songs)
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
  setExpandedRow ({ commit }, expandedRow) {
    commit('SET_EXPANDED_ROW', expandedRow)
  },
  stopPlayer ({ commit }) {
    commit('STOP_PLAYER')
  },
  async playSong ({ dispatch, commit, state }, songInfo) {
    await dispatch('createPlayer')
    state.player.source.buffer = await state.player.context.decodeAudioData(songInfo.bin.buffer)
    await dispatch('setSeekTime', songInfo.seekTime)
    await dispatch('setPlayerVolume', state.volume / 100)
    await new Promise((resolve, reject) => {
      state.player.source.start(0, songInfo.seekTime, state.selectedSong.data.duration)
      state.player.source.onended = function (event) {
        state.player.source.stop(0)
        state.player.context.close()
        let nextSong = utils.getNextSong()
        if (nextSong) {
          commit('SET_SELECTED_SONG', nextSong)
          ipcRenderer.send('select:song', nextSong)
        }
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
  async setVolume ({ dispatch, commit }, volume) {
    await new Promise((resolve, reject) => {
      commit('SET_VOLUME', volume)
      resolve()
    })
    await dispatch('setPlayerVolume', state.volume / 100)
  },
  setPlayerVolume ({ commit }, volume) {
    commit('SET_PLAYER_VOLUME', volume)
  },
  togglePlayerRepeat ({ commit }) {
    commit('TOGGLE_REPEAT')
  },
  toggleShuffle ({ commit }) {
    commit('TOGGLE_SHUFFLE')
  },
  setTab ({ commit }, tabIndex) {
    commit('SET_TAB', tabIndex)
  },
  sortBy ({ commit }, sortStyle) {
    commit('SORT_BY', sortStyle)
  }
}

const getters = {
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
    return state.volume
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
    return state.selectedSong
  },
  isPlayerRunning: state => {
    return state.player.context ? state.player.context.state === 'running' : false
  },
  isSongRepeating: state => {
    return state.isSongRepeat
  },
  isPlaylistRepeating: state => {
    return state.isPlaylistRepeat
  },
  isPlaylistShuffling: state => {
    return state.isShuffling
  },
  isPlaying: state => {
    return state.isSongPlaying
  },
  getPlayerContextState: state => {
    return state.contextState
  },
  getPrevSong: () => {
    return utils.getPrevSong()
  },
  getNextSong: () => {
    return utils.getNextSong()
  },
  getCurrentTab: state => {
    return state.currentTab
  },
  getShowingSongs: state => {
    return state.showingSongs
  },
  getExpandedRow: state => {
    return state.expandedRow
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
