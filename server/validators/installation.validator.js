import { z } from 'zod';

const locationSchema = z.object({
  districtName: z.string().min(1),
  blockName: z.string().min(1),
  facilityName: z.string().min(1)
});

const installationSchema = z.object({
  tender_number: z.string().min(1).max(100),
  authority_type: z.enum([
    'UPSMC',
    'UKSMC',
    'SGPGIMS',
    'UPMSCL',
    'AMSCL',
    'CMSD',
    'DGME',
    'AIIMS',
    'SGPGI',
    'KGMU',
    'BHU',
    'BMSICL',
    'OSMCL',
    'TRADE',
    'GDMC',
    'AUTONOMOUS'
  ]),
  po_contract_date: z.string().datetime(),
  equipment: z.string().min(1),
  lead_time_to_deliver: z.number().positive(),
  lead_time_to_install: z.number().positive(),
  remarks: z.string().optional(),
  has_accessories: z.boolean(),
  // selected_accessories: z.array(z.string()).default([]),
  locations: z.array(locationSchema),
  selected_accessories: z.array(z.string()).optional().nullable(),
  has_consumables: z.boolean(),
  selected_consumables: z.array(z.string()).optional().nullable()
})


export function validateInstallationRequest(data) {
  return installationSchema.parse(data);
}

// middleware/validation.js
export const validateLOA = (req, res, next) => {
  const { loaNumber, loaDate, tenderId } = req.body;

  if (!loaNumber || !loaDate || !tenderId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (new Date(loaDate) > new Date()) {
    return res.status(400).json({ error: 'LOA date cannot be in the future' });
  }

  next();
};

export const validatePO = (req, res, next) => {
  const {
    poNumber,
    poDate,
    leadTimeToDeliver,
    leadTimeToInstall,
    machines,
    machineCount,
    loaId
  } = req.body;

  if (!poNumber || !poDate || !leadTimeToDeliver || !leadTimeToInstall || !machines || !machineCount || !loaId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (new Date(poDate) > new Date()) {
    return res.status(400).json({ error: 'PO date cannot be in the future' });
  }

  next();
};