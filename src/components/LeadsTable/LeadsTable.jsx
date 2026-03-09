import { useState, useMemo, useEffect } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Select, MenuItem, IconButton, Button, Chip, Tooltip, Typography,
    InputAdornment, FormControl, TableSortLabel, Dialog, DialogTitle,
    DialogContent, DialogActions, Stack, TablePagination, useMediaQuery, useTheme,
    Card, CardContent, Divider, Grid,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    RestartAlt as ResetIcon,
    Business as BusinessIcon,
    Phone as PhoneIcon,
    WhatsApp as WhatsAppIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    Notes as NotesIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Close as CloseIcon,
    ExpandMore as ExpandMoreIcon,
    ContactPhone as ContactPhoneIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
    STATUS_OPTIONS,
    SERVICE_NEED_OPTIONS,
    CONTACT_TYPE_OPTIONS,
    INDUSTRY_OPTIONS,
    createEmptyLead,
} from '../../data/leadSchema';
import './LeadsTable.css';

const MotionTableRow = motion.create(TableRow);
const MotionCard = motion.create(Card);

const statusColorMap = Object.fromEntries(STATUS_OPTIONS.map((s) => [s.value, s.color]));

function StatusChip({ value, onChange }) {
    return (
        <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                sx={{
                    '& .MuiSelect-select': { py: 0.5, display: 'flex', alignItems: 'center' },
                    border: 'none',
                    '& fieldset': { border: 'none' },
                }}
                renderValue={(val) => {
                    const opt = STATUS_OPTIONS.find((s) => s.value === val);
                    return (
                        <Chip
                            label={opt?.label || val}
                            size="small"
                            sx={{
                                backgroundColor: `${statusColorMap[val]}22`,
                                color: statusColorMap[val],
                                borderRadius: '8px',
                                fontWeight: 600,
                                border: `1px solid ${statusColorMap[val]}44`,
                            }}
                        />
                    );
                }}
            >
                {STATUS_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                        <Chip
                            label={opt.label}
                            size="small"
                            sx={{
                                backgroundColor: `${opt.color}22`,
                                color: opt.color,
                                fontWeight: 600,
                                border: `1px solid ${opt.color}44`,
                            }}
                        />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

function ServiceNeedChip({ value, onChange }) {
    const colorMap = { warranties: '#6C63FF', '2fa': '#00E5FF', both: '#FF9800' };
    return (
        <FormControl size="small" sx={{ minWidth: 110 }}>
            <Select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                sx={{
                    '& .MuiSelect-select': { py: 0.5 },
                    '& fieldset': { border: 'none' },
                }}
                renderValue={(val) => {
                    const opt = SERVICE_NEED_OPTIONS.find((s) => s.value === val);
                    return (
                        <Chip
                            label={opt?.label || val}
                            size="small"
                            sx={{
                                backgroundColor: `${colorMap[val]}22`,
                                color: colorMap[val],
                                borderRadius: '8px',
                                fontWeight: 600,
                                border: `1px solid ${colorMap[val]}44`,
                            }}
                        />
                    );
                }}
            >
                {SERVICE_NEED_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                        <Chip
                            label={opt.label}
                            size="small"
                            sx={{
                                backgroundColor: `${colorMap[opt.value]}22`,
                                color: colorMap[opt.value],
                                fontWeight: 600,
                                border: `1px solid ${colorMap[opt.value]}44`,
                            }}
                        />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

function PhoneCell({ number, type, onNumberChange, onTypeChange }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <TextField
                size="small"
                value={number}
                onChange={(e) => onNumberChange(e.target.value)}
                placeholder="Phone..."
                variant="standard"
                sx={{ '& .MuiInput-root': { fontSize: '0.85rem' } }}
            />
            <Select
                size="small"
                value={type}
                onChange={(e) => onTypeChange(e.target.value)}
                variant="standard"
                sx={{ fontSize: '0.7rem', color: '#9AA0B4' }}
            >
                {CONTACT_TYPE_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.8rem' }}>
                        {opt.label}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
}

function EditableCell({ value, onChange, placeholder, multiline = false }) {
    return (
        <TextField
            size="small"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            variant="standard"
            multiline={multiline}
            maxRows={3}
            fullWidth
            sx={{
                '& .MuiInput-root': { fontSize: '0.85rem' },
                '& .MuiInput-underline:before': { borderBottom: '1px solid rgba(255,255,255,0.05)' },
                '& .MuiInput-underline:hover:before': { borderBottom: '1px solid rgba(108,99,255,0.3)' },
            }}
        />
    );
}

function DateTimeCell({ value, onChange }) {
    const rawVal = value || '';
    const datePart = rawVal.includes('T') ? rawVal.split('T')[0] : rawVal;
    const timePart = rawVal.includes('T') ? rawVal.split('T')[1]?.substring(0, 5) : '';
    const hh = timePart ? timePart.split(':')[0] : '';
    const mm = timePart ? timePart.split(':')[1] : '';

    const handleDateChange = (newDate) => {
        onChange(`${newDate}T${timePart || '00:00'}`);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <TextField
                type="date"
                size="small"
                variant="standard"
                value={datePart}
                onChange={(e) => handleDateChange(e.target.value)}
                sx={{ '& .MuiInput-root': { fontSize: '0.8rem' }, '& input::-webkit-calendar-picker-indicator': { filter: 'invert(1)' } }}
            />
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <Select
                    size="small"
                    variant="standard"
                    value={hh}
                    displayEmpty
                    onChange={(e) => onChange(`${datePart || new Date().toISOString().split('T')[0]}T${e.target.value}:${mm || '00'}`)}
                    sx={{ fontSize: '0.8rem', color: '#9AA0B4', minWidth: 40 }}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                >
                    <MenuItem value="" disabled>HH</MenuItem>
                    {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => (
                        <MenuItem key={h} value={h} sx={{ fontSize: '0.8rem' }}>{h}</MenuItem>
                    ))}
                </Select>
                <Typography sx={{ fontSize: '0.8rem', color: '#9AA0B4' }}>:</Typography>
                <Select
                    size="small"
                    variant="standard"
                    value={mm}
                    displayEmpty
                    onChange={(e) => onChange(`${datePart || new Date().toISOString().split('T')[0]}T${hh || '00'}:${e.target.value}`)}
                    sx={{ fontSize: '0.8rem', color: '#9AA0B4', minWidth: 40 }}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                >
                    <MenuItem value="" disabled>MM</MenuItem>
                    {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(m => (
                        <MenuItem key={m} value={m} sx={{ fontSize: '0.8rem' }}>{m}</MenuItem>
                    ))}
                </Select>
            </Box>
        </Box>
    );
}

function DateTimeInput24({ value, onChange }) {
    const rawVal = value || '';
    const datePart = rawVal.includes('T') ? rawVal.split('T')[0] : rawVal;
    const timePart = rawVal.includes('T') ? rawVal.split('T')[1]?.substring(0, 5) : '';
    const hh = timePart ? timePart.split(':')[0] : '';
    const mm = timePart ? timePart.split(':')[1] : '';

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 1, p: 1 }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#9AA0B4', position: 'absolute', mt: -5, ml: 0.5, bgcolor: 'rgba(18, 24, 41, 1)', px: 0.5 }}>At</Typography>
            <TextField
                type="date"
                size="small"
                value={datePart}
                onChange={(e) => onChange(`${e.target.value}T${timePart || '00:00'}`)}
                sx={{ flex: 1, '& input::-webkit-calendar-picker-indicator': { filter: 'invert(1)' } }}
            />
            <TextField
                select
                size="small"
                value={hh}
                onChange={(e) => onChange(`${datePart || new Date().toISOString().split('T')[0]}T${e.target.value}:${mm || '00'}`)}
                sx={{ minWidth: 60 }}
                SelectProps={{ displayEmpty: true, MenuProps: { PaperProps: { sx: { maxHeight: 250 } } } }}
            >
                <MenuItem value="" disabled>HH</MenuItem>
                {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => (
                    <MenuItem key={h} value={h}>{h}</MenuItem>
                ))}
            </TextField>
            <Typography sx={{ color: '#9AA0B4', fontWeight: 'bold' }}>:</Typography>
            <TextField
                select
                size="small"
                value={mm}
                onChange={(e) => onChange(`${datePart || new Date().toISOString().split('T')[0]}T${hh || '00'}:${e.target.value}`)}
                sx={{ minWidth: 60 }}
                SelectProps={{ displayEmpty: true, MenuProps: { PaperProps: { sx: { maxHeight: 250 } } } }}
            >
                <MenuItem value="" disabled>MM</MenuItem>
                {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(m => (
                    <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
            </TextField>
        </Box>
    );
}

/* ===== Lead Preview Dialog (Desktop Read-Only) ===== */
function LeadPreviewDialog({ lead, open, onClose }) {
    if (!lead) return null;
    const infoSx = { mb: 2 };
    const labelSx = { fontSize: '0.75rem', color: '#9AA0B4', textTransform: 'uppercase', fontWeight: 700, mb: 0.5 };
    const valueSx = { fontSize: '1rem', fontWeight: 500, color: '#E8EAED' };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { background: 'rgba(18, 24, 41, 0.98)', backdropFilter: 'blur(30px)', border: '1px solid rgba(108, 99, 255, 0.2)' } }}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
                <BusinessIcon sx={{ color: '#6C63FF' }} />
                <Typography variant="h6">{lead.companyName || 'Lead Info'}</Typography>
                <IconButton onClick={onClose} sx={{ ml: 'auto' }}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                    <Chip label={STATUS_OPTIONS.find(s => s.value === lead.status)?.label} size="small" sx={{ backgroundColor: 'rgba(108,99,255,0.1)', color: '#6C63FF', fontWeight: 600, border: '1px solid rgba(108,99,255,0.2)' }} />
                    <Chip label={SERVICE_NEED_OPTIONS.find(s => s.value === lead.serviceNeed)?.label} size="small" sx={{ backgroundColor: 'rgba(0,229,255,0.1)', color: '#00E5FF', fontWeight: 600, border: '1px solid rgba(0,229,255,0.2)' }} />
                </Stack>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Box sx={infoSx}>
                            <Typography sx={labelSx}>At</Typography>
                            <Typography sx={valueSx}>
                                {lead.calledAt ? (
                                    <>
                                        {lead.calledAt.split('T')[0]}
                                        <br />
                                        <span style={{ fontSize: '0.85em', color: '#9AA0B4' }}>
                                            {new Date(lead.calledAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </>
                                ) : '-'}
                            </Typography>
                        </Box>
                        <Box sx={infoSx}><Typography sx={labelSx}>Industry</Typography><Typography sx={valueSx}>{INDUSTRY_OPTIONS.find(i => i.value === lead.industry)?.label || '-'}</Typography></Box>
                        <Box sx={infoSx}><Typography sx={labelSx}>Phone 1</Typography><Typography sx={valueSx}>{lead.phone1 || '-'} {lead.phone1Type !== 'idk' && <Typography component="span" sx={{ fontSize: '0.75rem', color: '#9AA0B4', ml: 0.5 }}>({CONTACT_TYPE_OPTIONS.find(c => c.value === lead.phone1Type)?.label})</Typography>}</Typography></Box>
                        <Box sx={infoSx}><Typography sx={labelSx}>Email</Typography><Typography sx={valueSx}>{lead.email || '-'}</Typography></Box>
                        <Box sx={infoSx}><Typography sx={labelSx}>WhatsApp</Typography><Typography sx={valueSx}>{lead.whatsappNumber || '-'}</Typography></Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={infoSx}><Typography sx={labelSx}>Products</Typography><Typography sx={valueSx}>{lead.mainProducts || '-'}</Typography></Box>
                        <Box sx={infoSx}><Typography sx={labelSx}>Phone 2</Typography><Typography sx={valueSx}>{lead.phone2 || '-'} {lead.phone2Type !== 'idk' && <Typography component="span" sx={{ fontSize: '0.75rem', color: '#9AA0B4', ml: 0.5 }}>({CONTACT_TYPE_OPTIONS.find(c => c.value === lead.phone2Type)?.label})</Typography>}</Typography></Box>
                        <Box sx={infoSx}><Typography sx={labelSx}>Location</Typography><Typography sx={valueSx}>{lead.location || '-'}</Typography></Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={infoSx}><Typography sx={labelSx}>Task</Typography><Typography sx={{ ...valueSx, fontSize: '0.9rem' }}>{lead.task || '-'}</Typography></Box>
                        <Box sx={infoSx}><Typography sx={labelSx}>Notes</Typography><Typography sx={{ ...valueSx, fontSize: '0.9rem' }}>{lead.notes || '-'}</Typography></Box>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2, display: 'flex', gap: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <Typography variant="body2" sx={{ color: '#9AA0B4', fontSize: '0.75rem' }}>Added: {new Date(lead.dateAdded).toLocaleString()}</Typography>
                    <Typography variant="body2" sx={{ color: '#9AA0B4', fontSize: '0.75rem' }}>Updated: {new Date(lead.lastUpdated).toLocaleString()}</Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

/* ===== Lead Form Dialog (Add / Edit) ===== */
function LeadFormDialog({ lead, open, onClose, onSave }) {
    const [formData, setFormData] = useState(lead || createEmptyLead());
    const isEdit = !!lead;

    useEffect(() => {
        if (open) setFormData(lead || createEmptyLead());
    }, [lead, open]);

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { background: 'rgba(18, 24, 41, 0.95)', backdropFilter: 'blur(30px)', border: '1px solid rgba(108, 99, 255, 0.2)' } }}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon sx={{ color: '#6C63FF' }} />
                <Typography variant="h6">{isEdit ? 'Edit Lead' : 'Add New Lead'}</Typography>
                <IconButton onClick={onClose} sx={{ ml: 'auto' }}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={3} sx={{ pt: 1 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField label="Company Name" value={formData.companyName} onChange={(e) => handleChange('companyName', e.target.value)} fullWidth />
                        <FormControl fullWidth>
                            <TextField select label="Industry" value={formData.industry} onChange={(e) => handleChange('industry', e.target.value)}>
                                {INDUSTRY_OPTIONS.map((opt) => (<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>))}
                            </TextField>
                        </FormControl>
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <FormControl fullWidth>
                            <TextField select label="Status" value={formData.status} onChange={(e) => handleChange('status', e.target.value)}>
                                {STATUS_OPTIONS.map((opt) => (<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>))}
                            </TextField>
                        </FormControl>
                        <Box sx={{ width: '100%', position: 'relative', pt: 0.5 }}>
                            <DateTimeInput24
                                value={formData.calledAt}
                                onChange={(val) => handleChange('calledAt', val)}
                            />
                        </Box>
                        <FormControl fullWidth>
                            <TextField select label="Service Need" value={formData.serviceNeed} onChange={(e) => handleChange('serviceNeed', e.target.value)}>
                                {SERVICE_NEED_OPTIONS.map((opt) => (<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>))}
                            </TextField>
                        </FormControl>
                    </Stack>

                    <TextField label="Main Products" value={formData.mainProducts} onChange={(e) => handleChange('mainProducts', e.target.value)} multiline rows={2} fullWidth />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Box sx={{ display: 'flex', flex: 1, gap: 1 }}>
                            <TextField label="Phone 1" value={formData.phone1} onChange={(e) => handleChange('phone1', e.target.value)} fullWidth />
                            <TextField select label="Type" value={formData.phone1Type} onChange={(e) => handleChange('phone1Type', e.target.value)} sx={{ width: 120 }}>
                                {CONTACT_TYPE_OPTIONS.map((opt) => (<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>))}
                            </TextField>
                        </Box>
                        <Box sx={{ display: 'flex', flex: 1, gap: 1 }}>
                            <TextField label="Phone 2" value={formData.phone2} onChange={(e) => handleChange('phone2', e.target.value)} fullWidth />
                            <TextField select label="Type" value={formData.phone2Type} onChange={(e) => handleChange('phone2Type', e.target.value)} sx={{ width: 120 }}>
                                {CONTACT_TYPE_OPTIONS.map((opt) => (<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>))}
                            </TextField>
                        </Box>
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField label="WhatsApp" value={formData.whatsappNumber} onChange={(e) => handleChange('whatsappNumber', e.target.value)} fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><WhatsAppIcon fontSize="small" sx={{ color: '#25D366' }} /></InputAdornment> }} />
                        <TextField label="Email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" /></InputAdornment> }} />
                    </Stack>

                    <TextField label="Location" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><LocationIcon fontSize="small" /></InputAdornment> }} />
                    <TextField label="Task" value={formData.task} onChange={(e) => handleChange('task', e.target.value)} multiline rows={2} fullWidth />
                    <TextField label="Notes" value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} multiline rows={3} fullWidth />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} sx={{ color: '#9AA0B4' }}>Cancel</Button>
                <Button onClick={() => onSave(formData)} variant="contained" startIcon={<SaveIcon />} sx={{ bgcolor: '#6C63FF', '&:hover': { bgcolor: '#514ADA' } }}>
                    Save Info
                </Button>
            </DialogActions>
        </Dialog>
    );
}

/* ===== Mobile Lead Card (Display Only) ===== */
function MobileLeadCard({ lead, index, onDelete, onEdit }) {
    const statusOpt = STATUS_OPTIONS.find((s) => s.value === lead.status);
    const serviceColorMap = { warranties: '#6C63FF', '2fa': '#00E5FF', both: '#FF9800' };
    const serviceOpt = SERVICE_NEED_OPTIONS.find((s) => s.value === lead.serviceNeed);
    const labelSx = { fontSize: '0.65rem', color: '#9AA0B4', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, mb: 0.3 };
    const textSx = { fontSize: '0.85rem' };

    return (
        <MotionCard
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            style={{ willChange: 'transform, opacity' }}
            sx={{ mb: 1.5, background: 'rgba(18, 24, 41, 0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2.5 }}
        >
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#9AA0B4', fontWeight: 700, fontSize: '0.75rem', mr: 0.5 }}>#{index + 1}</Typography>
                    <Chip label={statusOpt?.label} size="small" sx={{ backgroundColor: `${statusOpt?.color}22`, color: statusOpt?.color, borderRadius: '8px', fontWeight: 600, border: `1px solid ${statusOpt?.color}44`, fontSize: '0.7rem' }} />
                    <Chip label={serviceOpt?.label} size="small" sx={{ backgroundColor: `${serviceColorMap[lead.serviceNeed]}22`, color: serviceColorMap[lead.serviceNeed], borderRadius: '8px', fontWeight: 600, border: `1px solid ${serviceColorMap[lead.serviceNeed]}44`, fontSize: '0.7rem' }} />
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>{lead.companyName || 'Untitled'}</Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1 }}>
                    <Box>
                        <Typography sx={labelSx}>At</Typography>
                        <Typography sx={textSx}>
                            {lead.calledAt ? (
                                <>
                                    {lead.calledAt.split('T')[0]}
                                    <br />
                                    <span style={{ fontSize: '0.85em', color: '#9AA0B4' }}>
                                        {new Date(lead.calledAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </>
                            ) : '-'}
                        </Typography>
                    </Box>
                    <Box><Typography sx={labelSx}>Industry</Typography><Typography sx={textSx}>{INDUSTRY_OPTIONS.find(i => i.value === lead.industry)?.label || '-'}</Typography></Box>
                </Box>

                <Box sx={{ mb: 1 }}><Typography sx={labelSx}>Location</Typography><Typography sx={textSx}>{lead.location || '-'}</Typography></Box>

                {lead.mainProducts && (<Box sx={{ mb: 1 }}><Typography sx={labelSx}>Products</Typography><Typography sx={textSx}>{lead.mainProducts}</Typography></Box>)}

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1 }}>
                    <Box><Typography sx={labelSx}>Phone 1 {lead.phone1Type !== 'idk' ? `(${CONTACT_TYPE_OPTIONS.find(c => c.value === lead.phone1Type)?.label})` : ''}</Typography><Typography sx={textSx}>{lead.phone1 || '-'}</Typography></Box>
                    <Box><Typography sx={labelSx}>Phone 2 {lead.phone2Type !== 'idk' ? `(${CONTACT_TYPE_OPTIONS.find(c => c.value === lead.phone2Type)?.label})` : ''}</Typography><Typography sx={textSx}>{lead.phone2 || '-'}</Typography></Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1 }}>
                    <Box><Typography sx={labelSx}>WhatsApp</Typography><Typography sx={{ ...textSx, color: '#25D366' }}>{lead.whatsappNumber ? <><WhatsAppIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />{lead.whatsappNumber}</> : '-'}</Typography></Box>
                    <Box><Typography sx={labelSx}>Email</Typography><Typography sx={textSx}>{lead.email || '-'}</Typography></Box>
                </Box>

                {lead.task && (<Box sx={{ mb: 1 }}><Typography sx={labelSx}>Task</Typography><Box sx={{ p: 1, borderRadius: 1.5, background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.1)' }}><Typography sx={textSx}>{lead.task}</Typography></Box></Box>)}
                {lead.notes && (<Box sx={{ mb: 1 }}><Typography sx={labelSx}>Notes</Typography><Typography sx={textSx}>{lead.notes}</Typography></Box>)}

                <Divider sx={{ my: 0.8, borderColor: 'rgba(255,255,255,0.04)' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="body2" sx={{ fontSize: '0.65rem', color: '#9AA0B4' }}>Added: {new Date(lead.dateAdded).toLocaleDateString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit Lead">
                            <IconButton size="small" onClick={() => onEdit(lead)} sx={{ color: '#6C63FF' }}><EditIcon fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Lead">
                            <IconButton size="small" onClick={() => onDelete(lead.id)} sx={{ color: '#F44336' }}><DeleteIcon fontSize="small" /></IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </CardContent>
        </MotionCard>
    );
}

export default function LeadsTable({ leads, onAdd, onUpdate, onDelete, onReset }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [industryFilter, setIndustryFilter] = useState('all');
    const [serviceFilter, setServiceFilter] = useState('all');
    const [phoneTypeFilter, setPhoneTypeFilter] = useState('all');
    const [sortField, setSortField] = useState('dateAdded');
    const [sortDir, setSortDir] = useState('desc');
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [detailLead, setDetailLead] = useState(null);
    const [formLead, setFormLead] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const filteredLeads = useMemo(() => {
        let result = [...leads];

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (l) =>
                    l.companyName.toLowerCase().includes(q) ||
                    l.mainProducts.toLowerCase().includes(q) ||
                    l.location.toLowerCase().includes(q) ||
                    l.email.toLowerCase().includes(q)
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter((l) => l.status === statusFilter);
        }
        if (industryFilter !== 'all') {
            result = result.filter((l) => l.industry === industryFilter);
        }
        if (serviceFilter !== 'all') {
            result = result.filter((l) => l.serviceNeed === serviceFilter);
        }
        if (phoneTypeFilter !== 'all') {
            result = result.filter(
                (l) => l.phone1Type === phoneTypeFilter || l.phone2Type === phoneTypeFilter
            );
        }

        result.sort((a, b) => {
            let aVal = a[sortField] || '';
            let bVal = b[sortField] || '';
            if (typeof aVal === 'string') aVal = aVal.toLowerCase();
            if (typeof bVal === 'string') bVal = bVal.toLowerCase();
            if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [leads, search, statusFilter, industryFilter, serviceFilter, phoneTypeFilter, sortField, sortDir]);

    const paginatedLeads = filteredLeads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleConfirmDelete = () => {
        if (deleteDialog) {
            onDelete(deleteDialog);
            setDeleteDialog(null);
        }
    };

    return (
        <Box className="leads-table-container">
            {/* Toolbar */}
            <Paper
                className="leads-toolbar"
                sx={{ p: isMobile ? 1.5 : 2, mb: 2 }}
            >
                <TextField
                    size="small"
                    placeholder="Search leads..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                    className="leads-search"
                    sx={{ minWidth: isMobile ? '100%' : 220, flex: isMobile ? 'unset' : 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#9AA0B4' }} />
                            </InputAdornment>
                        ),
                    }}
                />

                <Box className="leads-filters">
                    <FormControl size="small" sx={{ minWidth: isMobile ? 0 : 130, flex: isMobile ? 1 : 'unset' }}>
                        <Select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                            displayEmpty
                            startAdornment={!isMobile ? <FilterIcon sx={{ mr: 1, color: '#9AA0B4', fontSize: '1rem' }} /> : undefined}
                        >
                            <MenuItem value="all">All Status</MenuItem>
                            {STATUS_OPTIONS.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: isMobile ? 0 : 130, flex: isMobile ? 1 : 'unset' }}>
                        <Select
                            value={industryFilter}
                            onChange={(e) => { setIndustryFilter(e.target.value); setPage(0); }}
                            displayEmpty
                        >
                            <MenuItem value="all">All Industries</MenuItem>
                            {INDUSTRY_OPTIONS.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: isMobile ? 0 : 130, flex: isMobile ? 1 : 'unset' }}>
                        <Select
                            value={serviceFilter}
                            onChange={(e) => { setServiceFilter(e.target.value); setPage(0); }}
                            displayEmpty
                        >
                            <MenuItem value="all">All Services</MenuItem>
                            {SERVICE_NEED_OPTIONS.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: isMobile ? 0 : 140, flex: isMobile ? 1 : 'unset' }}>
                        <Select
                            value={phoneTypeFilter}
                            onChange={(e) => { setPhoneTypeFilter(e.target.value); setPage(0); }}
                            displayEmpty
                            startAdornment={!isMobile ? <ContactPhoneIcon sx={{ mr: 1, color: '#9AA0B4', fontSize: '1rem' }} /> : undefined}
                        >
                            <MenuItem value="all">All Contacts</MenuItem>
                            {CONTACT_TYPE_OPTIONS.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box className="leads-actions">
                    <Tooltip title="Add New Lead">
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => { setFormLead(null); setIsFormOpen(true); }}
                            sx={{ whiteSpace: 'nowrap' }}
                            fullWidth={isMobile}
                        >
                            Add Lead
                        </Button>
                    </Tooltip>
                </Box>
            </Paper>

            {/* Count */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, px: 1 }}>
                <Typography variant="body2" sx={{ color: '#9AA0B4' }}>
                    Showing <strong style={{ color: '#E8EAED' }}>{filteredLeads.length}</strong> of{' '}
                    <strong style={{ color: '#E8EAED' }}>{leads.length}</strong> leads
                </Typography>
            </Box>

            {/* MOBILE: Card layout */}
            {isMobile ? (
                <Box>
                    <AnimatePresence>
                        {paginatedLeads.map((lead, index) => (
                            <MobileLeadCard
                                key={lead.id}
                                lead={lead}
                                index={index}
                                onDelete={(id) => setDeleteDialog(id)}
                                onEdit={(l) => { setFormLead(l); setIsFormOpen(true); }}
                            />
                        ))}
                    </AnimatePresence>
                </Box>
            ) : (
                /* DESKTOP: Table layout */
                <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 40 }}>#</TableCell>
                                <TableCell sx={{ minWidth: 130 }}>
                                    <TableSortLabel
                                        active={sortField === 'status'}
                                        direction={sortField === 'status' ? sortDir : 'asc'}
                                        onClick={() => handleSort('status')}
                                    >
                                        Status
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ minWidth: 110 }}>
                                    <TableSortLabel
                                        active={sortField === 'calledAt'}
                                        direction={sortField === 'calledAt' ? sortDir : 'asc'}
                                        onClick={() => handleSort('calledAt')}
                                    >
                                        At
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ minWidth: 120 }}>Service</TableCell>
                                <TableCell sx={{ minWidth: 170 }}>
                                    <TableSortLabel
                                        active={sortField === 'companyName'}
                                        direction={sortField === 'companyName' ? sortDir : 'asc'}
                                        onClick={() => handleSort('companyName')}
                                    >
                                        Company
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ minWidth: 120 }}>Industry</TableCell>
                                <TableCell sx={{ minWidth: 180 }}>Products</TableCell>
                                <TableCell sx={{ minWidth: 150 }}>Phone 1</TableCell>
                                <TableCell sx={{ minWidth: 150 }}>Phone 2</TableCell>
                                <TableCell sx={{ minWidth: 120 }}>WhatsApp</TableCell>
                                <TableCell sx={{ minWidth: 180 }}>Task</TableCell>
                                <TableCell sx={{ minWidth: 170 }}>Email</TableCell>
                                <TableCell sx={{ minWidth: 130 }}>Location</TableCell>
                                <TableCell sx={{ minWidth: 90 }}>
                                    <TableSortLabel
                                        active={sortField === 'dateAdded'}
                                        direction={sortField === 'dateAdded' ? sortDir : 'asc'}
                                        onClick={() => handleSort('dateAdded')}
                                    >
                                        Added
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sx={{ width: 90 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <AnimatePresence>
                                {paginatedLeads.map((lead, index) => (
                                    <MotionTableRow
                                        key={lead.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2, delay: index * 0.02 }}
                                        style={{ willChange: 'transform, opacity' }}
                                        sx={{ '&:last-child td': { border: 0 } }}
                                    >
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: '#9AA0B4', fontWeight: 600 }}>
                                                {page * rowsPerPage + index + 1}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <StatusChip
                                                value={lead.status}
                                                onChange={(val) => onUpdate(lead.id, 'status', val)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <DateTimeCell
                                                value={lead.calledAt}
                                                onChange={(val) => onUpdate(lead.id, 'calledAt', val)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <ServiceNeedChip
                                                value={lead.serviceNeed}
                                                onChange={(val) => onUpdate(lead.id, 'serviceNeed', val)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <EditableCell
                                                value={lead.companyName}
                                                onChange={(val) => onUpdate(lead.id, 'companyName', val)}
                                                placeholder="Company name..."
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormControl size="small" fullWidth>
                                                <Select
                                                    value={lead.industry}
                                                    onChange={(e) => onUpdate(lead.id, 'industry', e.target.value)}
                                                    variant="standard"
                                                    sx={{ fontSize: '0.85rem' }}
                                                >
                                                    {INDUSTRY_OPTIONS.map((opt) => (
                                                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>
                                            <EditableCell
                                                value={lead.mainProducts}
                                                onChange={(val) => onUpdate(lead.id, 'mainProducts', val)}
                                                placeholder="Products..."
                                                multiline
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <PhoneCell
                                                number={lead.phone1}
                                                type={lead.phone1Type}
                                                onNumberChange={(val) => onUpdate(lead.id, 'phone1', val)}
                                                onTypeChange={(val) => onUpdate(lead.id, 'phone1Type', val)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <PhoneCell
                                                number={lead.phone2}
                                                type={lead.phone2Type}
                                                onNumberChange={(val) => onUpdate(lead.id, 'phone2', val)}
                                                onTypeChange={(val) => onUpdate(lead.id, 'phone2Type', val)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <EditableCell
                                                value={lead.whatsappNumber}
                                                onChange={(val) => onUpdate(lead.id, 'whatsappNumber', val)}
                                                placeholder="WhatsApp..."
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <EditableCell
                                                value={lead.task}
                                                onChange={(val) => onUpdate(lead.id, 'task', val)}
                                                placeholder="Task..."
                                                multiline
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <EditableCell
                                                value={lead.email}
                                                onChange={(val) => onUpdate(lead.id, 'email', val)}
                                                placeholder="Email..."
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <EditableCell
                                                value={lead.location}
                                                onChange={(val) => onUpdate(lead.id, 'location', val)}
                                                placeholder="Location..."
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                                {new Date(lead.dateAdded).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                <Tooltip title="View Details">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setDetailLead(lead)}
                                                        sx={{ color: '#6C63FF' }}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Lead">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setDeleteDialog(lead.id)}
                                                        sx={{ color: '#F44336' }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </MotionTableRow>
                                ))}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <TablePagination
                component="div"
                count={filteredLeads.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{
                    color: '#9AA0B4',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    mt: 1,
                    '& .MuiTablePagination-toolbar': {
                        flexWrap: isMobile ? 'wrap' : 'nowrap',
                        justifyContent: isMobile ? 'center' : 'flex-end',
                    },
                }}
            />

            {/* Delete Confirmation */}
            <Dialog
                open={!!deleteDialog}
                onClose={() => setDeleteDialog(null)}
                PaperProps={{
                    sx: {
                        background: 'rgba(18, 24, 41, 0.95)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(244, 67, 54, 0.2)',
                    },
                }}
            >
                <DialogTitle>Delete Lead?</DialogTitle>
                <DialogContent>
                    <Typography>This action cannot be undone. Are you sure you want to delete this lead?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Preview Dialog */}
            <LeadPreviewDialog
                lead={detailLead}
                open={!!detailLead}
                onClose={() => setDetailLead(null)}
            />

            {/* Form Dialog */}
            <LeadFormDialog
                lead={formLead}
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={(data) => {
                    if (formLead) {
                        Object.keys(data).forEach(k => {
                            if (data[k] !== formLead[k]) onUpdate(formLead.id, k, data[k]);
                        });
                    } else {
                        onAdd(data);
                    }
                    setIsFormOpen(false);
                }}
            />
        </Box>
    );
}
