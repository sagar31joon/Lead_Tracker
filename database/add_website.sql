-- Migration: Add website column to leads table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS website TEXT NOT NULL DEFAULT '';
