import { useState, useEffect, useCallback, useRef } from 'react'
import { loadState, saveState, configured } from '../lib/supabase'

// ── DB row → app state ───────────────────────────────────────────
function fromRemote(row) {
  return {
    workspace: row.workspace || 'eb1a',
    eb1a: {
      tasks: row.eb1a_tasks || {},
      evidence: row.eb1a_evidence || [],
    },
    dm: {
      tasks: row.dm_tasks || {},
      modProg: row.dm_mod_prog || {},
      metrics: row.dm_metrics || [],
    },
    plan: {
      doneDays: row.plan_done_days || {},
    },
    french: {
      tasks: row.french_tasks || {},
      sessions: row.french_sessions || [],
      planDays: row.french_plan_days || [],
      vocabCount: row.french_vocab_count || 0,
    },
    streak: row.streak || 0,
    lastVisit: row.last_visit || null,
  }
}

// ── Bump streak if this is a new day ────────────────────────────
function withStreak(s) {
  const today = new Date().toISOString().slice(0, 10)
  if (s.lastVisit === today) return s
  const diff = s.lastVisit
    ? Math.round((new Date(today) - new Date(s.lastVisit)) / 86400000)
    : 1
  return { ...s, streak: diff === 1 ? (s.streak || 0) + 1 : 1, lastVisit: today }
}

// ── Connection status values ─────────────────────────────────────
// 'loading' | 'connected' | 'not_configured' | 'unreachable'
// ────────────────────────────────────────────────────────────────

const EMPTY = {
  workspace: 'eb1a',
  eb1a: { tasks: {}, evidence: [] },
  dm: { tasks: {}, modProg: {}, metrics: [] },
  plan: { doneDays: {} },
  french: { tasks: {}, sessions: [], planDays: [], vocabCount: 0 },
  streak: 0,
  lastVisit: null,
}

export function useStore() {
  const [state, setState_] = useState(EMPTY)
  const [dbStatus, setDbStatus] = useState('loading')   // drives the UI banner
  const [dbMessage, setDbMessage] = useState('')
  const debounceRef = useRef(null)
  const latestState = useRef(EMPTY)

  // Keep ref in sync so the debounced save always uses the latest state
  useEffect(() => { latestState.current = state }, [state])

  // ── Boot: load from Supabase, nothing else ───────────────────
  useEffect(() => {
    async function boot() {
      const result = await loadState()

      if (!result.ok) {
        setDbStatus(result.reason)           // 'not_configured' | 'unreachable'
        setDbMessage(result.message || '')
        // Leave state as EMPTY — user sees the banner and knows why
        return
      }

      const loaded = withStreak(fromRemote(result.data))
      setState_(loaded)
      latestState.current = loaded
      setDbStatus('connected')

      // Persist the streak bump back immediately
      await saveState(loaded)
    }
    boot()
  }, [])

  // ── Debounced save — Supabase only ───────────────────────────
  const persist = useCallback((newState) => {
    setDbStatus('saving')
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const result = await saveState(newState)
      if (result.ok) {
        setDbStatus('connected')
        setDbMessage('')
      } else {
        setDbStatus(result.reason)
        setDbMessage(result.message || '')
      }
    }, 800)
  }, [])

  // ── Wrapped setState that always persists ────────────────────
  const update = useCallback((updater) => {
    setState_(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      persist(next)
      return next
    })
  }, [persist])

  // ── Actions ─────────────────────────────────────────────────
  // ── French actions ───────────────────────────────────────────
  const toggleFrenchTask = (id) => update(s => ({ ...s, french: { ...s.french, tasks: { ...(s.french?.tasks || {}), [id]: !(s.french?.tasks || {})[id] } } }))
  const toggleFrenchDay = (day) => update(s => {
    const days = s.french?.planDays || []
    const next = days.includes(day) ? days.filter(d => d !== day) : [...days, day]
    return { ...s, french: { ...s.french, planDays: next } }
  })
  const logFrenchSession = (entry) => update(s => ({
    ...s,
    french: {
      ...s.french,
      sessions: [entry, ...(s.french?.sessions || [])].slice(0, 100),
      vocabCount: entry.mode === 'vocab'
        ? Math.min((s.french?.vocabCount || 0) + 10, 999)
        : (s.french?.vocabCount || 0),
    }
  }))
  const saveMockScore = (score) => update(s => {
    const sessions = s.french?.sessions || []
    if (sessions.length === 0) return s
    const updated = [...sessions]
    updated[0] = { ...updated[0], score }
    return { ...s, french: { ...s.french, sessions: updated } }
  })

  const toggleEB1ATask = (id) => update(s => ({ ...s, eb1a: { ...s.eb1a, tasks: { ...s.eb1a.tasks, [id]: !s.eb1a.tasks[id] } } }))
  const addEvidence = (item) => update(s => ({ ...s, eb1a: { ...s.eb1a, evidence: [item, ...(s.eb1a.evidence || [])] } }))
  const deleteEvidence = (i) => update(s => { const ev = [...(s.eb1a.evidence || [])]; ev.splice(i, 1); return { ...s, eb1a: { ...s.eb1a, evidence: ev } } })
  const toggleDMTask = (id) => update(s => ({ ...s, dm: { ...s.dm, tasks: { ...s.dm.tasks, [id]: !s.dm.tasks[id] } } }))
  const startModule = (id) => update(s => ({ ...s, dm: { ...s.dm, modProg: { ...s.dm.modProg, [id]: s.dm.modProg[id] || 10 } } }))
  const saveDMMetrics = (entry) => update(s => ({ ...s, dm: { ...s.dm, metrics: [entry, ...(s.dm.metrics || [])].slice(0, 12) } }))
  const setWorkspace = (ws) => update(s => ({ ...s, workspace: ws }))
  const markReturn = () => update(s => ({ ...s, streak: (s.streak || 0) + 1 }))
  const resetEB1ATasks = () => update(s => ({ ...s, eb1a: { ...s.eb1a, tasks: {} } }))
  const resetDMTasks = () => update(s => ({ ...s, dm: { ...s.dm, tasks: {} } }))
  const togglePlanDay = (n) => update(s => ({ ...s, plan: { doneDays: { ...(s.plan?.doneDays || {}), [n]: !(s.plan?.doneDays || {})[n] } } }))

  return {
    state, dbStatus, dbMessage,
    toggleEB1ATask, addEvidence, deleteEvidence,
    toggleDMTask, startModule, saveDMMetrics,
    setWorkspace, markReturn,
    resetEB1ATasks, resetDMTasks,
    togglePlanDay,
    toggleFrenchTask, toggleFrenchDay, logFrenchSession, saveMockScore,
  }
}