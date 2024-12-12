// models/definitions/PO.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PO = sequelize.define('PO', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    poNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    poDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    equipmentName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'equipment_name' // This maps the camelCase JS property to snake_case DB column
    },
    leadTimeToDeliver: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    leadTimeToInstall: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    hasAccessories: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    accessories: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Active', 'Completed', 'Cancelled'),
      defaultValue: 'Draft'
    },
    remarks: {
      type: DataTypes.TEXT
    },
    tenderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tenders',
        key: 'id'
      }
    },
    createdBy: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'purchase_orders',
    underscored: true,
    timestamps: true
  });

  return PO;
};