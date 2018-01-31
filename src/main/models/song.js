const SongSchema = {
  name: 'Song',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    title: 'string',
    path: 'string',
    duration: 'int',
    track: 'int?',
    disk: 'string?',
    album: 'string?',
    year: 'string?',
    date: 'string?',
    artist: 'string?',
    artists: 'Artist[]?',
    picture: 'data?',
    mfcc: 'Mfcc[]'
  }
}

export default SongSchema
