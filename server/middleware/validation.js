// middleware/validation.js
export const validatePO = (req, res, next) => {
    const {
      poNumber,
      poDate,
      equipmentName,
      leadTimeToDeliver,
      leadTimeToInstall,
      tenderId,
      locations
    } = req.body;
  
    const errors = [];
  
    if (!poNumber) errors.push('PO number is required');
    if (!poDate) errors.push('PO date is required');
    if (!equipmentName) errors.push('Equipment name is required');
    if (!leadTimeToDeliver) errors.push('Lead time to deliver is required');
    if (!leadTimeToInstall) errors.push('Lead time to install is required');
    if (!tenderId) errors.push('Tender ID is required');
    if (!locations || !Array.isArray(locations) || locations.length === 0) {
      errors.push('At least one location is required');
    }
  
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
  
    // Validate date
    if (new Date(poDate) > new Date()) {
      return res.status(400).json({ error: 'PO date cannot be in the future' });
    }
  
    next();
  };