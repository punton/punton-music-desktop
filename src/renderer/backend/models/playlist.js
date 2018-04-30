import Sequelize from 'sequelize'
import db from '@/backend/datastore'

const Playlist = db.define('playlist', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: { type: Sequelize.STRING, allowNull: false }
})

db.sync().then(() => {
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
