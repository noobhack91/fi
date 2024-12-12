// server/models/definitions/LOA.js
import { DataTypes } from 'sequelize';

const defineLOA = (sequelize) => {
  const LOA = sequelize.define('LOA', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    loaNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    tenderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tenders',
        key: 'id'
      }
    },
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    validityPeriod: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    equipmentDetails: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    termsConditions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Issued', 'Accepted', 'Expired', 'Cancelled'),
      defaultValue: 'Draft'
    },
    acceptanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    acceptanceDocumentPath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'loas',
    timestamps: true,
    underscored: true
  });

  LOA.associate = (models) => {
    LOA.belongsTo(models.Tender, {
      foreignKey: 'tenderId',
      as: 'Tender'
    });
    LOA.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
  };

  return LOA;
};

export default defineLOA;