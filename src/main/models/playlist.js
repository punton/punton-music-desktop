import Sequelize from 'sequelize'

const Playlist = global.db.define('playlist', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: { type: Sequelize.STRING, allowNull: false }
})

global.db.sync().then(() => {
  Playlist.count().then(count => {
    if (count === 0) {
      Playlist.bulkCreate([
        { name: 'Machine Learning' },
        { name: 'Custom' }
      ])
    }
  })
})

export default Playlist
