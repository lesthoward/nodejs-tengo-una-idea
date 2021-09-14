const { DataTypes } = require('sequelize')
const db = require('../config/db-conncection')
const User = require('./User')
const { nanoid } = require('nanoid')
const slug = require('slug')


const Objetive = db.define('Objetive',
    {
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'Tienes que definir un nombre de objetivo'
                }
            }
        },
        url: {
            type: DataTypes.STRING
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        hooks: {
            beforeCreate(uniqueObjetive) {
                const newSlug = uniqueObjetive.name + nanoid(5)
                uniqueObjetive.url = slug(newSlug)
                
            }
        }
    }
)

Objetive.belongsTo(User)
module.exports = Objetive