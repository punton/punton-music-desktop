import Sequelize from 'sequelize'
import db from '@/backend/datastore'

const Song = db.define('song', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: { type: Sequelize.STRING, allowNull: false },
  title: { type: Sequelize.STRING, allowNull: false },
  path: { type: Sequelize.TEXT, allowNull: false },
  duration: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false },
  album: Sequelize.STRING,
  artist: Sequelize.STRING,
  picture: Sequelize.BLOB,
  waveMax: Sequelize.JSON,
  waveMin: Sequelize.JSON,
  sampleRate: Sequelize.INTEGER,
  playlistId: Sequelize.UUID
})

export default Song
