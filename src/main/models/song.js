import Sequelize from 'sequelize'

const Song = global.db.define('song', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: { type: Sequelize.STRING, allowNull: false },
  title: { type: Sequelize.STRING, allowNull: false },
  path: { type: Sequelize.TEXT, allowNull: false },
  duration: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false },
  track: Sequelize.INTEGER,
  disk: Sequelize.STRING,
  album: Sequelize.STRING,
  year: Sequelize.STRING,
  date: Sequelize.STRING,
  artist: Sequelize.STRING,
  artists: Sequelize.JSON,
  picture: Sequelize.BLOB,
  mfcc: Sequelize.JSON,
  sampleRate: Sequelize.INTEGER
})

export default Song
