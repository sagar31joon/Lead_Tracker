import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toSnakeCase, toCamelCase } from '../lib/caseUtils';
import { mockLeads } from '../data/mockLeads';

export function useLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ─── Fetch all leads ───
    const fetchLeads = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchErr } = await supabase
                .from('leads')
                .select('*')
                .order('date_added', { ascending: false });

            if (fetchErr) throw fetchErr;
            setLeads((data || []).map(toCamelCase));
        } catch (e) {
            console.error('Failed to fetch leads:', e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    // ─── Add a lead ───
    const addLead = useCallback(async (leadData = {}) => {
        const now = new Date().toISOString();
        const newLead = {
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
            task: '',
            email: '',
            location: '',
            website: '',
            notes: '',
            dateAdded: now,
            lastUpdated: now,
            ...leadData,
        };

        // Optimistic update
        setLeads((prev) => [newLead, ...prev]);

        try {
            const snakeData = toSnakeCase(newLead);
            // Clean up empty strings for datetime fields
            if (snakeData.called_at === '') {
                snakeData.called_at = null;
            }

            const { error: insertErr } = await supabase.from('leads').insert([snakeData]);
            if (insertErr) throw insertErr;
        } catch (e) {
            console.error('Failed to add lead:', e);
            setError(e.message);
            // Roll back
            setLeads((prev) => prev.filter((l) => l.id !== newLead.id));
        }
        return newLead.id;
    }, []);

    // ─── Update a single field ───
    const updateLead = useCallback(async (id, field, value) => {
        const now = new Date().toISOString();

        // Optimistic update
        setLeads((prev) =>
            prev.map((lead) =>
                lead.id === id
                    ? { ...lead, [field]: value, lastUpdated: now }
                    : lead
            )
        );
        try {
            const snakeField = field.replace(/([A-Z])/g, '_$1').toLowerCase();
            let updateValue = value;
            if (snakeField === 'called_at' && updateValue === '') {
                updateValue = null;
            }

            const { error: updateErr } = await supabase
                .from('leads')
                .update({ [snakeField]: updateValue, last_updated: now })
                .eq('id', id);

            if (updateErr) throw updateErr;
        } catch (e) {
            console.error('Failed to update lead:', e);
            setError(e.message);
            fetchLeads(); // Refetch to restore correct state
        }
    }, [fetchLeads]);

    // ─── Delete a lead ───
    const deleteLead = useCallback(async (id) => {
        const backup = leads;
        setLeads((prev) => prev.filter((lead) => lead.id !== id));

        try {
            const { error: deleteErr } = await supabase
                .from('leads')
                .delete()
                .eq('id', id);

            if (deleteErr) throw deleteErr;
        } catch (e) {
            console.error('Failed to delete lead:', e);
            setError(e.message);
            setLeads(backup); // Roll back
        }
    }, [leads]);

    // ─── Reset to mock data ───
    const resetToMock = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Delete all existing leads
            const { error: delErr } = await supabase
                .from('leads')
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000'); // deletes all rows

            if (delErr) throw delErr;

            // Insert mock data
            const snakeMocks = mockLeads.map(toSnakeCase);
            const { error: insertErr } = await supabase.from('leads').insert(snakeMocks);
            if (insertErr) throw insertErr;

            setLeads(mockLeads);
        } catch (e) {
            console.error('Failed to reset to mock data:', e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { leads, loading, error, addLead, updateLead, deleteLead, resetToMock };
}
