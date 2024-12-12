export const validateLOA = (data) => {
    const errors = [];
  
    if (!data.loaNumber) {
      errors.push('LOA number is required');
    }
  
    if (!data.tenderId) {
      errors.push('Tender ID is required');
    }
  
    if (!data.issueDate) {
      errors.push('Issue date is required');
    }
  
    if (!data.validityPeriod || data.validityPeriod < 1) {
      errors.push('Valid validity period is required');
    }
  
    if (!data.totalValue || data.totalValue <= 0) {
      errors.push('Valid total value is required');
    }
  
    if (!data.equipmentDetails) {
      errors.push('Equipment details are required');
    }
  
    if (!data.status || !['Draft', 'Issued', 'Accepted', 'Expired', 'Cancelled'].includes(data.status)) {
      errors.push('Valid status is required');
    }
  
    return {
      valid: errors.length === 0,
      errors
    };
  };