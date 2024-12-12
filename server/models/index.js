import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import defineAccessory from './definitions/Accessory.js';
import defineChallanReceipt from './definitions/ChallanReceipt.js';
import defineConsignee from './definitions/Consignee.js';
import defineConsumable from './definitions/Consumable.js';
import EquipmentInstallation from './definitions/EquipmentInstallation.js';
import EquipmentLocation from './definitions/EquipmentLocation.js';
import defineInstallationReport from './definitions/InstallationReport.js';
import defineInvoice from './definitions/Invoice.js';
import defineLogisticsDetails from './definitions/LogisticsDetails.js';
import defineTender from './definitions/Tender.js';
import defineUser from './definitions/User.js';
// Import new model definitions
import defineLOA from './definitions/LOA.js';
import definePO from './definitions/PO.js';
// import defineAuditLog from './definitions/AuditLog.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "equipment_management",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "admin",
  {
    host: process.env.DB_HOST,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialect: "postgres",
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  }
);

// Initialize existing models
const User = defineUser(sequelize);
const Tender = defineTender(sequelize);
const Consignee = defineConsignee(sequelize);
const LogisticsDetails = defineLogisticsDetails(sequelize);
const ChallanReceipt = defineChallanReceipt(sequelize);
const InstallationReport = defineInstallationReport(sequelize);
const Invoice = defineInvoice(sequelize);
const EquipmentInstallationModel = EquipmentInstallation.init(sequelize);
const EquipmentLocationModel = EquipmentLocation.init(sequelize);
const Accessory = defineAccessory(sequelize);
const Consumable = defineConsumable(sequelize);

// Initialize new models
const LOA = defineLOA(sequelize);
const PO = definePO(sequelize);
// const AuditLog = defineAuditLog(sequelize);

// Define existing associations
Tender.hasMany(Consignee, {
  foreignKey: 'tenderId',
  as: 'consignees'
});

Consignee.belongsTo(Tender, {
  foreignKey: 'tenderId'
});

// Define new associations for LOA and PO
Tender.hasMany(LOA, {
  foreignKey: 'tenderId',
  as: 'loas'
});

LOA.belongsTo(Tender, {
  foreignKey: 'tenderId'
});

LOA.hasMany(PO, {
  foreignKey: 'loaId',
  as: 'purchaseOrders'
});

PO.belongsTo(LOA, {
  foreignKey: 'loaId'
});

// Add user associations for audit trail
User.hasMany(LOA, {
  foreignKey: 'createdBy',
  as: 'createdLOAs'
});

User.hasMany(PO, {
  foreignKey: 'createdBy',
  as: 'createdPOs'
});

LOA.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

PO.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

// Existing accessory and consumable associations
Tender.belongsToMany(Accessory, {
  through: 'TenderAccessories',
  foreignKey: 'tenderId',
  otherKey: 'accessoryId',
  as: 'accessoryItems'
});

Accessory.belongsToMany(Tender, {
  through: 'TenderAccessories',
  foreignKey: 'accessoryId',
  otherKey: 'tenderId',
  as: 'accessoryTenders'
});

Tender.belongsToMany(Consumable, {
  through: 'TenderConsumables',
  foreignKey: 'tenderId',
  otherKey: 'consumableId',
  as: 'consumableItems'
});

Consumable.belongsToMany(Tender, {
  through: 'TenderConsumables',
  foreignKey: 'consumableId',
  otherKey: 'tenderId',
  as: 'consumableTenders'
});

// Existing logistics and installation associations
Consignee.hasOne(LogisticsDetails, {
  foreignKey: 'consigneeId',
  as: 'logisticsDetails'
});

LogisticsDetails.belongsTo(Consignee, {
  foreignKey: 'consigneeId'
});

Consignee.hasOne(ChallanReceipt, {
  foreignKey: 'consigneeId',
  as: 'challanReceipt'
});

ChallanReceipt.belongsTo(Consignee, {
  foreignKey: 'consigneeId'
});

Consignee.hasOne(InstallationReport, {
  foreignKey: 'consigneeId',
  as: 'installationReport'
});

InstallationReport.belongsTo(Consignee, {
  foreignKey: 'consigneeId'
});

Consignee.hasOne(Invoice, {
  foreignKey: 'consigneeId',
  as: 'invoice'
});

Invoice.belongsTo(Consignee, {
  foreignKey: 'consigneeId'
});

EquipmentInstallation.hasMany(EquipmentLocation, {
  foreignKey: 'installationId',
  as: 'locations'
});

EquipmentLocation.belongsTo(EquipmentInstallation, {
  foreignKey: 'installationId'
});

// Add PO associations with Consignee
PO.hasMany(Consignee, {
  foreignKey: 'poId',
  as: 'consignees'
});

Consignee.belongsTo(PO, {
  foreignKey: 'poId'
});

export {
  Accessory,
  ChallanReceipt,
  Consignee,
  Consumable,
  EquipmentInstallation,
  EquipmentLocation,
  InstallationReport,
  Invoice,
  LOA,
  LogisticsDetails,
  PO,
  sequelize,
  Tender,
  User
};
