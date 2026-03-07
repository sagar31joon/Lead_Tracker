import { useMemo, useState } from 'react';
import {
    Box, Paper, Typography, Grid, FormControl, Select, MenuItem,
    Stack, Chip, Divider,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    CheckCircle as CheckCircleIcon,
    PhoneCallback as PhoneIcon,
    Schedule as ScheduleIcon,
    DoNotDisturb as LostIcon,
    FilterList as FilterIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { STATUS_OPTIONS, INDUSTRY_OPTIONS, SERVICE_NEED_OPTIONS } from '../../data/leadSchema';
import './Analytics.css';

const MotionPaper = motion.create(Paper);

const statusColorMap = Object.fromEntries(STATUS_OPTIONS.map((s) => [s.value, s.color]));
const serviceColorMap = { warranties: '#6C63FF', '2fa': '#00E5FF', both: '#FF9800' };

function StatCard({ icon, title, value, subtitle, color, delay = 0 }) {
    return (
        <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            style={{ willChange: 'transform, opacity' }}
            className="stat-card"
            sx={{ p: 2.5, position: 'relative', overflow: 'hidden' }}
        >
            <Box
                className="stat-card-glow"
                sx={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${color}22, transparent)`,
                }}
            />
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="body2" sx={{ color: '#9AA0B4', mb: 0.5, fontSize: '0.8rem', fontWeight: 500 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#E8EAED', lineHeight: 1.2 }}>
                        {value}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body2" sx={{ color: '#9AA0B4', mt: 0.5, fontSize: '0.75rem' }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <Box
                    sx={{
                        p: 1.2,
                        borderRadius: 2.5,
                        background: `${color}18`,
                        border: `1px solid ${color}33`,
                        display: 'flex',
                    }}
                >
                    {icon}
                </Box>
            </Box>
        </MotionPaper>
    );
}

export default function Analytics({ leads }) {
    const [industryFilter, setIndustryFilter] = useState('all');

    const stats = useMemo(() => {
        const filtered = industryFilter === 'all'
            ? leads
            : leads.filter((l) => l.industry === industryFilter);

        const total = filtered.length;
        const statusCounts = {};
        STATUS_OPTIONS.forEach((s) => { statusCounts[s.value] = 0; });
        filtered.forEach((l) => { statusCounts[l.status] = (statusCounts[l.status] || 0) + 1; });

        const converted = statusCounts['converted'] || 0;
        const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : 0;

        const industryCounts = {};
        INDUSTRY_OPTIONS.forEach((ind) => { industryCounts[ind.value] = 0; });
        filtered.forEach((l) => { industryCounts[l.industry] = (industryCounts[l.industry] || 0) + 1; });

        const serviceCounts = {};
        SERVICE_NEED_OPTIONS.forEach((s) => { serviceCounts[s.value] = 0; });
        filtered.forEach((l) => { serviceCounts[l.serviceNeed] = (serviceCounts[l.serviceNeed] || 0) + 1; });

        // Monthly trend
        const monthMap = {};
        filtered.forEach((l) => {
            const d = new Date(l.dateAdded);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            monthMap[key] = (monthMap[key] || 0) + 1;
        });
        const sortedMonths = Object.keys(monthMap).sort();
        const monthLabels = sortedMonths.map((m) => {
            const [y, mo] = m.split('-');
            const date = new Date(y, parseInt(mo) - 1);
            return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        });
        const monthValues = sortedMonths.map((m) => monthMap[m]);

        return {
            total,
            converted,
            conversionRate,
            statusCounts,
            industryCounts,
            serviceCounts,
            monthLabels,
            monthValues,
            activeLeads: total - (statusCounts['converted'] || 0) - (statusCounts['lost'] || 0) - (statusCounts['not-interested'] || 0),
        };
    }, [leads, industryFilter]);

    // Chart configs
    const statusChartOptions = {
        chart: {
            type: 'donut',
            background: 'transparent',
            animations: { enabled: true, easing: 'easeinout', speed: 800 },
        },
        labels: STATUS_OPTIONS.map((s) => s.label),
        colors: STATUS_OPTIONS.map((s) => s.color),
        stroke: { show: false },
        dataLabels: {
            enabled: true,
            style: { fontSize: '11px', fontWeight: 600, colors: ['#E8EAED'] },
            dropShadow: { enabled: false },
        },
        legend: {
            position: 'bottom',
            labels: { colors: '#9AA0B4' },
            fontSize: '12px',
            markers: { radius: 4 },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '55%',
                    labels: {
                        show: true,
                        name: { color: '#E8EAED' },
                        value: { color: '#E8EAED', fontWeight: 700, fontSize: '22px' },
                        total: {
                            show: true,
                            label: 'Total',
                            color: '#9AA0B4',
                            fontWeight: 600,
                            formatter: () => stats.total,
                        },
                    },
                },
            },
        },
        tooltip: { theme: 'dark' },
    };
    const statusChartSeries = STATUS_OPTIONS.map((s) => stats.statusCounts[s.value] || 0);

    const industryChartOptions = {
        chart: {
            type: 'bar',
            background: 'transparent',
            toolbar: { show: false },
            animations: { enabled: true, easing: 'easeinout', speed: 800 },
        },
        xaxis: {
            categories: INDUSTRY_OPTIONS.map((i) => i.label),
            labels: { style: { colors: '#9AA0B4', fontSize: '11px' }, rotate: -45 },
            axisBorder: { color: 'rgba(255,255,255,0.06)' },
            axisTicks: { color: 'rgba(255,255,255,0.06)' },
        },
        yaxis: {
            labels: { style: { colors: '#9AA0B4' } },
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: '55%',
                distributed: true,
            },
        },
        colors: ['#6C63FF', '#00E5FF', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#00BCD4', '#FF5722', '#607D8B', '#795548'],
        dataLabels: { enabled: false },
        legend: { show: false },
        grid: {
            borderColor: 'rgba(255,255,255,0.04)',
            strokeDashArray: 4,
        },
        tooltip: { theme: 'dark' },
    };
    const industryChartSeries = [
        { name: 'Leads', data: INDUSTRY_OPTIONS.map((i) => stats.industryCounts[i.value] || 0) },
    ];

    const serviceChartOptions = {
        chart: {
            type: 'pie',
            background: 'transparent',
            animations: { enabled: true, easing: 'easeinout', speed: 800 },
        },
        labels: SERVICE_NEED_OPTIONS.map((s) => s.label),
        colors: SERVICE_NEED_OPTIONS.map((s) => serviceColorMap[s.value]),
        stroke: { show: false },
        dataLabels: {
            enabled: true,
            style: { fontSize: '12px', fontWeight: 600, colors: ['#E8EAED'] },
            dropShadow: { enabled: false },
        },
        legend: {
            position: 'bottom',
            labels: { colors: '#9AA0B4' },
            fontSize: '13px',
            markers: { radius: 4 },
        },
        tooltip: { theme: 'dark' },
    };
    const serviceChartSeries = SERVICE_NEED_OPTIONS.map((s) => stats.serviceCounts[s.value] || 0);

    const trendChartOptions = {
        chart: {
            type: 'area',
            background: 'transparent',
            toolbar: { show: false },
            animations: { enabled: true, easing: 'easeinout', speed: 800 },
        },
        xaxis: {
            categories: stats.monthLabels,
            labels: { style: { colors: '#9AA0B4', fontSize: '11px' } },
            axisBorder: { color: 'rgba(255,255,255,0.06)' },
        },
        yaxis: {
            labels: { style: { colors: '#9AA0B4' } },
        },
        stroke: { curve: 'smooth', width: 3 },
        colors: ['#6C63FF'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [0, 100],
            },
        },
        dataLabels: { enabled: false },
        grid: {
            borderColor: 'rgba(255,255,255,0.04)',
            strokeDashArray: 4,
        },
        tooltip: { theme: 'dark' },
    };
    const trendChartSeries = [{ name: 'Leads Added', data: stats.monthValues }];

    return (
        <Box className="analytics-container">
            {/* Industry Filter */}
            <MotionPaper
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ willChange: 'transform, opacity' }}
                sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}
            >
                <FilterIcon sx={{ color: '#6C63FF' }} />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Filter Analytics by Industry
                </Typography>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <Select
                        value={industryFilter}
                        onChange={(e) => setIndustryFilter(e.target.value)}
                    >
                        <MenuItem value="all">All Industries</MenuItem>
                        {INDUSTRY_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {industryFilter !== 'all' && (
                    <Chip
                        label={INDUSTRY_OPTIONS.find((i) => i.value === industryFilter)?.label}
                        onDelete={() => setIndustryFilter('all')}
                        size="small"
                        sx={{
                            backgroundColor: 'rgba(108, 99, 255, 0.15)',
                            color: '#6C63FF',
                            fontWeight: 600,
                        }}
                    />
                )}
            </MotionPaper>

            {/* Summary Cards */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<PeopleIcon sx={{ color: '#6C63FF', fontSize: 28 }} />}
                        title="Total Leads"
                        value={stats.total}
                        subtitle={`${stats.activeLeads} active`}
                        color="#6C63FF"
                        delay={0}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 28 }} />}
                        title="Converted"
                        value={stats.converted}
                        subtitle={`${stats.conversionRate}% rate`}
                        color="#4CAF50"
                        delay={0.1}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<ScheduleIcon sx={{ color: '#FF9800', fontSize: 28 }} />}
                        title="Follow-Up"
                        value={stats.statusCounts['follow-up'] || 0}
                        subtitle="Pending action"
                        color="#FF9800"
                        delay={0.2}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<LostIcon sx={{ color: '#F44336', fontSize: 28 }} />}
                        title="Lost"
                        value={stats.statusCounts['lost'] || 0}
                        subtitle={`+ ${stats.statusCounts['not-interested'] || 0} not interested`}
                        color="#F44336"
                        delay={0.3}
                    />
                </Grid>
            </Grid>

            {/* Charts Row 1 */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <MotionPaper
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ willChange: 'transform, opacity' }}
                        sx={{ p: 3, height: '100%' }}
                    >
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Status Distribution
                        </Typography>
                        <Chart
                            options={statusChartOptions}
                            series={statusChartSeries}
                            type="donut"
                            height={320}
                        />
                    </MotionPaper>
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                    <MotionPaper
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ willChange: 'transform, opacity' }}
                        sx={{ p: 3, height: '100%' }}
                    >
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Leads by Industry
                        </Typography>
                        <Chart
                            options={industryChartOptions}
                            series={industryChartSeries}
                            type="bar"
                            height={320}
                        />
                    </MotionPaper>
                </Grid>
            </Grid>

            {/* Charts Row 2 */}
            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <MotionPaper
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{ willChange: 'transform, opacity' }}
                        sx={{ p: 3, height: '100%' }}
                    >
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Service Demand
                        </Typography>
                        <Chart
                            options={serviceChartOptions}
                            series={serviceChartSeries}
                            type="pie"
                            height={300}
                        />
                    </MotionPaper>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                    <MotionPaper
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{ willChange: 'transform, opacity' }}
                        sx={{ p: 3, height: '100%' }}
                    >
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Lead Acquisition Trend
                        </Typography>
                        <Chart
                            options={trendChartOptions}
                            series={trendChartSeries}
                            type="area"
                            height={300}
                        />
                    </MotionPaper>
                </Grid>
            </Grid>
        </Box>
    );
}
