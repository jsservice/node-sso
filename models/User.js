const Sequelize = require('sequelize');

module.exports = {

    id:  { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },

    username: {
        type: Sequelize.STRING, unique: true, validate: {
            len: [5,30],
        }
    },

    nickname: {type: Sequelize.STRING},

    password: {type: Sequelize.STRING},

    avatar: {type: Sequelize.STRING},

    gender : {type: Sequelize.ENUM(0, 1)},

    mobile : {type: Sequelize.STRING},

    email : {type: Sequelize.STRING},

    county : {type: Sequelize.STRING},

    city : {type: Sequelize.STRING},

    wxUnionId: {type: Sequelize.STRING},

    aliOpenId: {type: Sequelize.STRING},

    lastLoginAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },

    lastLoginIp: {
        type: Sequelize.STRING,
        validate: {
            isIPv4: true
        }
    },

    roles : {type: Sequelize.STRING},

    modifiedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },

    modifiedBy: {type: Sequelize.STRING},

    createAt:{type: Sequelize.DATE, defaultValue: Sequelize.NOW},

    createBy:{type: Sequelize.STRING},

})