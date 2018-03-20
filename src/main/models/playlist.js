import Sequelize from 'sequelize'

const Playlist = global.db.define('playlist', {
  Id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  Name: { type: Sequelize.STRING, allowNull: false }
})

export default Playlist
