import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder'
)

export async function loadState() {
  try {
    const { data, error } = await supabase
      .from('command_center')
      .select('*')
      .eq('id', 'sajja_singleton')
      .single()
    if (error) throw error
    return data
  } catch (err) {
    console.warn('Supabase load failed, using localStorage:', err.message)
    return null
  }
}

export async function saveState(state) {
  try {
    const { error } = await supabase
      .from('command_center')
      .upsert({
        id: 'sajja_singleton',
        eb1a_tasks: state.eb1a.tasks,
        eb1a_evidence: state.eb1a.evidence,
        dm_tasks: state.dm.tasks,
        dm_mod_prog: state.dm.modProg,
        dm_metrics: state.dm.metrics,
        plan_done_days: state.plan?.doneDays || {},
        streak: state.streak,
        last_visit: state.lastVisit,
        workspace: state.workspace,
        updated_at: new Date().toISOString()
      })
    if (error) throw error
    return true
  } catch (err) {
    console.warn('Supabase save failed, localStorage backup:', err.message)
    localStorage.setItem('sajja_cmd_backup', JSON.stringify(state))
    return false
  }
}
