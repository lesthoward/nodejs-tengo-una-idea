const { DataTypes } = require('sequelize')
const db = require('../config/db-conncection')
const Objetive = require('./Objetive')

const Idea = db.define('idea', 
    {
        name: {
            type: DataTypes.STRING(25),
            allowNull: false,
            validate: {
                len: {
                    args: [1, 25],
                    msg: 'Escribe un nombre entre 1 y 25 carácteres'
                }
            }
        },
        description: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [0, 200],
                    msg: 'La descripción es demasiado larga, intenta resumir'
                }
            }
        },
        isComplete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }
)

Idea.belongsTo(Objetive)

module.exports = Idea