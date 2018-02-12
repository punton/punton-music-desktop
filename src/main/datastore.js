import Sequelize from 'sequelize'
import path from 'path'
import { app } from 'electron'

export default new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  storage: path.join(app.getPath('userData'), `${process.env.DB_NAME}.sqlite`)
})
