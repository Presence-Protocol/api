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
  disabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class Collection extends Model<CollectionAttributes> implements CollectionAttributes {
    public contractId!: string;
    public eventName!: string;
    public caller!: string;
    public isPublic!: boolean;
    public disabled!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// SeriesCollection table: Stores series collections (parent container for series events)
// This is separate from the Collection/Event table which stores single events
interface SeriesCollectionAttributes {
  contractId: string;
  eventName: string;
  caller: string;
  isPublic: boolean;
  disabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class SeriesCollection extends Model<SeriesCollectionAttributes> implements SeriesCollectionAttributes {
  public contractId!: string;
  public eventName!: string;
  public caller!: string;
  public isPublic!: boolean;
  public disabled!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// SeriesEvent table: Stores individual events within a series collection
// Each record represents one event that can have multiple attendees
interface SeriesEventAttributes {
  contractId: string;
  seriesContractId: string;
  eventName: string;
  eventId: number;
  organizer: string;
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class SeriesEvent extends Model<SeriesEventAttributes> implements SeriesEventAttributes {
  public contractId!: string;
  public seriesContractId!: string;
  public eventName!: string;
  public eventId!: number;
  public organizer!: string;
  public isPublic!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// PoapSerie table: Stores POAPs minted for events within a series
// Each record represents one person attending one event in the series
// Multiple records can exist for the same eventId (multiple people attending the same event)
interface PoapSerieAttributes {
  contractId: string;
  seriesContractId: string;
  eventId: number; // References which event in the series
  nftIndex: number;
  caller: string;
  isPublic: boolean;
  hasParticipated?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class PoapSerie extends Model<PoapSerieAttributes> implements PoapSerieAttributes {
  public contractId!: string;
  public seriesContractId!: string;
  public eventId!: number;
  public nftIndex!: number;
  public caller!: string;
  public isPublic!: boolean;
  public hasParticipated!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
    
interface PoapAttributes {
    contractId: string;
    collectionContractId: string;
    nftIndex: number;
    caller: string;
    isPublic: boolean;
    hasParticipated?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }

  class Poap extends Model<PoapAttributes> implements PoapAttributes {
    public contractId!: string;
    public collectionContractId!: string;
    public nftIndex!: number;
    public caller!: string;
    public isPublic!: boolean;
    public hasParticipated!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
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
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Event'
});

SeriesCollection.init({
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
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'SeriesCollection'
});

SeriesEvent.init({
  contractId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  seriesContractId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'SeriesCollections',
      key: 'contractId'
    }
  },
  eventName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  organizer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'SeriesEvent'
});

PoapSerie.init({
  contractId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  seriesContractId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'SeriesCollections',
      key: 'contractId'
    }
  },
  eventId: {
    type: DataTypes.INTEGER,
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
  },
  hasParticipated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'PoapSerie'
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
    },
    hasParticipated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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

// Define associations
// SeriesCollection has many SeriesEvents (events within a series)
SeriesCollection.hasMany(SeriesEvent, { foreignKey: 'seriesContractId', sourceKey: 'contractId' });
SeriesEvent.belongsTo(SeriesCollection, { foreignKey: 'seriesContractId', targetKey: 'contractId' });

// SeriesCollection has many PoapSerie (POAPs minted for the series)
SeriesCollection.hasMany(PoapSerie, { foreignKey: 'seriesContractId', sourceKey: 'contractId' });
PoapSerie.belongsTo(SeriesCollection, { foreignKey: 'seriesContractId', targetKey: 'contractId' });

export { sequelize, Collection, SeriesCollection, SeriesEvent, PoapSerie, Poap, EventStat };