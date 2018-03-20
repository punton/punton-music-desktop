import Sequelize from 'sequelize'

const Song = global.db.define('song', {
  Id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  Name: { type: Sequelize.STRING, allowNull: false },
  Title: { type: Sequelize.STRING, allowNull: false },
  Path: { type: Sequelize.TEXT, allowNull: false },
  Duration: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false },
  Album: Sequelize.STRING,
  Artist: Sequelize.STRING,
  Picture: Sequelize.BLOB,
  WaveMax: Sequelize.JSON,
  WaveMin: Sequelize.JSON,
  SampleRate: Sequelize.INTEGER,
  PlayListId: Sequelize.UUID
})

export default Song
