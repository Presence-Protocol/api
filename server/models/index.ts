import { Sequelize, Model, DataTypes } from 'sequelize';
import path from 'path';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false,
  retry: {max: 100 }
});

interface EventStatAttributes {
  id: number;
  processedCounter: number
}

class EventStat extends Model<EventStatAttributes> implements EventStatAttributes {
  public id!: number;
  public processedCounter!: number;
}

interface CollectionAttributes {
  contractId: string;
  eventName: string;
  caller: string
  isPublic: boolean
}

class Collection extends Model<CollectionAttributes> implements CollectionAttributes {
    public contractId!: string;
    public eventName!: string;
    public caller!: string;
    public isPublic!: boolean;
    
}

interface PoapAttributes {
    contractId: string;
    collectionContractId: string;
    nftIndex: number;
    caller: string;
    isPublic: boolean;

  }
  
  class Poap extends Model<PoapAttributes> implements PoapAttributes {
    public contractId!: string;
    public collectionContractId!: string;
    public nftIndex!: number;
    public caller!: string;
    public isPublic!: boolean;

  }

Collection.init({
  contractId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  eventName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  caller: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Event'
});

Poap.init({
    contractId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    collectionContractId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nftIndex: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    caller: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Poap'
  });

  EventStat.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    processedCounter: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'EventStat'
  })

export { sequelize, Collection, Poap, EventStat };