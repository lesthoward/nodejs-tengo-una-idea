const { DataTypes, Model, Sequelize } = require('sequelize')
const db = require('../config/db-conncection')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const User = db.define('users', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    msg: 'Nombre de usuario debe tener un mínimo de 4 carácteres',
                    args: [4]
                }
            },
            unique: {
                args: true,
                msg: 'Ya existe otra cuenta con este nombre de usuario'
            }
        },
        email: {
            type: DataTypes.STRING(60),
            allowNull: false,
            validate: {
                isEmail: {
                    msg: 'Ingrese un correo válido'
                },
            },
            unique: {
                args: true,
                msg: 'El correo ya está registrado'
            }
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Selecciona tu género'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    msg: 'La contraseña debe ser mayor que 5 carácteres',
                    args: [5, 150]
                }
            }
        },
        isVerify: {
            type: DataTypes.STRING
        },
        token: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        tokenExpiredDate: {
            type: DataTypes.BIGINT,
            defaultValue: null
        }
    },
    {
        hooks: {
            beforeCreate: (user) => {
                user.username = user.email.toLowerCase().trim()
                user.email = user.email.toLowerCase().trim()
                
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(user.password, salt)
                user.password = hash
            }
        }
    }
    
)

User.prototype.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = User