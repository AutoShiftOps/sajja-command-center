import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const configured =
  !!SUPABASE_URL &&
  !!SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('placeholder')

export const supabase = configured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

export async function loadState() {
  if (!configured) return { ok: false, reason: 'not_configured' }
  try {
    const { data, error } = await supabase
      .from('command_center')
      .select('*')
      .eq('id', 'sajja_singleton')
      .single()
    if (error) throw error
    return { ok: true, data }
  } catch (err) {
    return { ok: false, reason: 'unreachable', message: err.message }
  }
}

export async function saveState(state) {
  if (!configured) return { ok: false, reason: 'not_configured' }
  try {
    const { error } = await supabase
      .from('command_center')
      .upsert({
        id: 'sajja_singleton',
        eb1a_tasks: state.eb1a?.tasks || {},
        eb1a_evidence: state.eb1a?.evidence || [],
        dm_tasks: state.dm?.tasks || {},
        dm_mod_prog: state.dm?.modProg || {},
        dm_metrics: state.dm?.metrics || [],
        plan_done_days: state.plan?.doneDays || {},
        french_tasks: state.french?.tasks || {},
        french_sessions: state.french?.sessions || [],
        french_plan_days: state.french?.planDays || [],
        french_vocab_count: state.french?.vocabCount || 0,
        streak: state.streak || 0,
        last_visit: state.lastVisit || null,
        workspace: state.workspace || 'eb1a',
        updated_at: new Date().toISOString(),
      })
    if (error) throw error
    return { ok: true }
  } catch (err) {
    return { ok: false, reason: 'unreachable', message: err.message }
  }
}