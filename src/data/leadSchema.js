export const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: '#6C63FF' },
  { value: 'called', label: 'Called', color: '#00BCD4' },
  { value: 'follow-up', label: 'Follow-Up', color: '#FF9800' },
  { value: 'converted', label: 'Converted', color: '#4CAF50' },
  { value: 'lost', label: 'Lost', color: '#F44336' },
  { value: 'not-interested', label: 'Not Interested', color: '#9E9E9E' },
  { value: 'on-hold', label: 'On Hold', color: '#FFC107' },
  { value: 'not-picked', label: 'Not-picked', color: '#607D8B' },
  { value: 'wrong-number', label: 'Wrong Number', color: '#E91E63' },
];

export const SERVICE_NEED_OPTIONS = [
  { value: 'warranties', label: 'Warranties' },
  { value: '2fa', label: '2FA' },
  { value: 'both', label: 'Both' },
];

export const CONTACT_TYPE_OPTIONS = [
  { value: 'customer-care', label: 'Customer Care' },
  { value: 'purchase-manager', label: 'Purchase Manager' },
  { value: 'owner', label: 'Owner' },
  { value: 'idk', label: 'IDK' },
];

export const INDUSTRY_OPTIONS = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'it', label: 'IT' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail' },
  { value: 'construction', label: 'Construction' },
  { value: 'food-beverage', label: 'Food & Beverage' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'textiles', label: 'Textiles' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'others', label: 'Others' },
];

export const createEmptyLead = () => ({
  id: crypto.randomUUID(),
  status: 'new',
  serviceNeed: 'warranties',
  companyName: '',
  industry: 'others',
  mainProducts: '',
  phone1: '',
  phone1Type: 'idk',
  phone2: '',
  phone2Type: 'idk',
  whatsappNumber: '',
  calledAt: '',
  task: '',
  email: '',
  location: '',
  website: '',
  dateAdded: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  notes: '',
});
