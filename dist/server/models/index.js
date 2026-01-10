"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStat = exports.Poap = exports.PoapSerie = exports.Series = exports.Collection = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
const sequelize = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: path_1.default.join(__dirname, 'database.sqlite'),
    logging: false,
    retry: { max: 100 }
});
exports.sequelize = sequelize;
class EventStat extends sequelize_1.Model {
}
exports.EventStat = EventStat;
class Collection extends sequelize_1.Model {
}
exports.Collection = Collection;
class Series extends sequelize_1.Model {
}
exports.Series = Series;
class PoapSerie extends sequelize_1.Model {
}
exports.PoapSerie = PoapSerie;
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
    },
    isPublic: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    },
    disabled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'Event'
});
Series.init({
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
        allowNull: false,
        references: {
            model: 'Events',
            key: 'contractId'
        }
    },
    eventName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    organizer: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    isPublic: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Series'
});
PoapSerie.init({
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
        allowNull: false,
        references: {
            model: 'Series',
            key: 'contractId'
        }
    },
    eventId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    nftIndex: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    caller: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    isPublic: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    },
    hasParticipated: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'PoapSerie'
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
    },
    isPublic: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    },
    hasParticipated: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'Poap'
});
EventStat.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    processedCounter: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'EventStat'
});
// Define associations
Collection.hasMany(Series, { foreignKey: 'collectionContractId', sourceKey: 'contractId' });
Series.belongsTo(Collection, { foreignKey: 'collectionContractId', targetKey: 'contractId' });
Series.hasMany(PoapSerie, { foreignKey: 'collectionContractId', sourceKey: 'contractId' });
PoapSerie.belongsTo(Series, { foreignKey: 'collectionContractId', targetKey: 'contractId' });
