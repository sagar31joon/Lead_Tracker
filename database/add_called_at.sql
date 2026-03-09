-- Migration: Add called_at column to leads table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS called_at TIMESTAMPTZ;
