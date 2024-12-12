// server/controllers/loaController.js
import logger from '../config/logger.js';
import { LOA, Tender, User } from '../models/index.js';

class LOAController {
  async create(req, res) {
    try {
      const loaData = {
        ...req.body,
        createdBy: req.user.id
      };

      const loa = await LOA.create(loaData);
      return res.status(201).json(loa);
    } catch (error) {
      logger.error('Error creating LOA:', error);
      return res.status(500).json({ error: 'Failed to create LOA' });
    }
  }

  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (status) where.status = status;

      const loas = await LOA.findAndCountAll({
        where,
        limit,
        offset,
        include: [
          {
            model: Tender,
            as: 'Tender',
            attributes: ['tenderNumber', 'equipmentName']
          },
          {
            model: User,
            as: 'creator',
            attributes: ['username', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return res.json({
        loas: loas.rows,
        total: loas.count,
        totalPages: Math.ceil(loas.count / limit),
        currentPage: parseInt(page)
      });
    } catch (error) {
      logger.error('Error fetching LOAs:', error);
      return res.status(500).json({ error: 'Failed to fetch LOAs' });
    }
  }

  async getById(req, res) {
    try {
      const loa = await LOA.findByPk(req.params.id, {
        include: [
          {
            model: Tender,
            as: 'Tender'
          },
          {
            model: User,
            as: 'creator',
            attributes: ['username', 'email']
          }
        ]
      });

      if (!loa) {
        return res.status(404).json({ error: 'LOA not found' });
      }

      return res.json(loa);
    } catch (error) {
      logger.error('Error fetching LOA:', error);
      return res.status(500).json({ error: 'Failed to fetch LOA' });
    }
  }

  async update(req, res) {
    try {
      const loa = await LOA.findByPk(req.params.id);
      if (!loa) {
        return res.status(404).json({ error: 'LOA not found' });
      }

      await loa.update(req.body);
      return res.json(loa);
    } catch (error) {
      logger.error('Error updating LOA:', error);
      return res.status(500).json({ error: 'Failed to update LOA' });
    }
  }

  async delete(req, res) {
    try {
      const loa = await LOA.findByPk(req.params.id);
      if (!loa) {
        return res.status(404).json({ error: 'LOA not found' });
      }

      await loa.destroy();
      return res.json({ message: 'LOA deleted successfully' });
    } catch (error) {
      logger.error('Error deleting LOA:', error);
      return res.status(500).json({ error: 'Failed to delete LOA' });
    }
  }

  async uploadAcceptanceDocument(req, res) {
    try {
      const loa = await LOA.findByPk(req.params.id);
      if (!loa) {
        return res.status(404).json({ error: 'LOA not found' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      await loa.update({
        acceptanceDocumentPath: req.file.path,
        acceptanceDate: new Date(),
        status: 'Accepted'
      });

      return res.json(loa);
    } catch (error) {
      logger.error('Error uploading acceptance document:', error);
      return res.status(500).json({ error: 'Failed to upload acceptance document' });
    }
  }
}

export default new LOAController();