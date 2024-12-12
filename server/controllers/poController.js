// controllers/poController.js
import logger from '../config/logger.js';
import { Consignee, PO, sequelize, Tender } from '../models/index.js';
import { updateTenderStatus } from '../utils/tenderStatus.js';

export const createPO = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      poNumber,
      poDate,
      equipmentName,
      leadTimeToDeliver,
      leadTimeToInstall,
      hasAccessories,
      accessories,
      remarks,
      tenderId,
      locations
    } = req.body;

    // Validate tender exists
    const tender = await Tender.findByPk(tenderId);
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    // Create PO
    const po = await PO.create({
      poNumber,
      poDate: new Date(poDate),
      equipmentName,
      leadTimeToDeliver,
      leadTimeToInstall,
      hasAccessories,
      accessories,
      remarks,
      tenderId,
      createdBy: req.user.id,
      status: 'Active'
    }, { transaction });

    // Create consignees if locations provided
    if (locations?.length > 0) {
      await Consignee.bulkCreate(
        locations.map((loc, index) => ({
          tenderId,
          poId: po.id,
          srNo: (index + 1).toString(),
          districtName: loc.districtName,
          blockName: loc.blockName,
          facilityName: loc.facilityName,
          consignmentStatus: 'Processing'
        })),
        { transaction }
      );
    }

    await transaction.commit();
    logger.info(`PO created: ${po.id}`);
    res.status(201).json(po);

  } catch (error) {
    await transaction.rollback();
    logger.error('Error creating PO:', error);
    res.status(400).json({ error: error.message });
  }
};

export const getPOById = async (req, res) => {
  try {
    const po = await PO.findByPk(req.params.id, {
      include: [{
        model: Consignee,
        as: 'consignees',
        include: ['logisticsDetails', 'challanReceipt', 'installationReport', 'invoice']
      }]
    });

    if (!po) {
      return res.status(404).json({ error: 'Purchase Order not found' });
    }

    res.json(po);
  } catch (error) {
    logger.error('Error fetching PO:', error);
    res.status(500).json({ error: error.message });
  }
};

export const searchPOs = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      poNumber,
      status,
      page = 1,
      limit = 50
    } = req.query;

    const where = {};

    if (startDate && endDate) {
      where.poDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    if (poNumber) {
      where.poNumber = {
        [Op.iLike]: `%${poNumber}%`
      };
    }

    if (status) {
      where.status = status;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await PO.findAndCountAll({
      where,
      include: [{
        model: Consignee,
        as: 'consignees'
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      purchaseOrders: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    logger.error('Error searching POs:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updatePOStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const po = await PO.findByPk(id);
    if (!po) {
      return res.status(404).json({ error: 'Purchase Order not found' });
    }

    await po.update({ status });
    await updateTenderStatus(po.tenderId);

    logger.info(`PO ${id} status updated to ${status}`);
    res.json(po);
  } catch (error) {
    logger.error('Error updating PO status:', error);
    res.status(500).json({ error: error.message });
  }
};