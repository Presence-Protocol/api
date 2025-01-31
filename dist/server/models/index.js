"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poap = exports.Collection = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
const sequelize = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: path_1.default.join(__dirname, 'database.sqlite'),
    logging: false
});
exports.sequelize = sequelize;
class Collection extends sequelize_1.Model {
}
exports.Collection = Collection;
class Poap extends sequelize_1.Model {
}
exports.Poap = Poap;
Collection.init({
    contractId: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    eventName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    caller: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Event'
});
Poap.init({
    contractId: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    collectionContractId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    nftIndex: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    caller: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Poap'
});
