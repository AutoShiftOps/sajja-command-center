import { useState, useEffect, useCallback, useRef } from 'react'
import { loadState, saveState } from '../lib/supabase'

const DEFAULT_STATE = {
  workspace: 'eb1a',
  eb1a: { tasks: {}, evidence: [] },
  dm: { tasks: {}, modProg: {}, metrics: [] },
  plan: { doneDays: {} },
  streak: 0,
  lastVisit: null,
}

export function useStore() {
  const [state, setStateRaw] = useState(DEFAULT_STATE)
  const [saveStatus, setSaveStatus] = useState('loading')
  const debounceRef = useRef(null)

  useEffect(() => {
    async function init() {
      const remote = await loadState()
      if (remote) {
        setStateRaw({
          workspace: remote.workspace || 'eb1a',
          eb1a: { tasks: remote.eb1a_tasks||{}, evidence: remote.eb1a_evidence||[] },
          dm: { tasks: remote.dm_tasks||{}, modProg: remote.dm_mod_prog||{}, metrics: remote.dm_metrics||[] },
          plan: { doneDays: remote.plan_done_days||{} },
          streak: remote.streak||0,
          lastVisit: remote.last_visit||null,
        })
        setSaveStatus('saved')
      } else {
        try {
          const backup = localStorage.getItem('sajja_cmd_backup')
          if (backup) setStateRaw(JSON.parse(backup))
        } catch(e){}
        setSaveStatus('offline')
      }
      // Streak update
      setStateRaw(prev => {
        const today = new Date().toISOString().slice(0,10)
        if (prev.lastVisit === today) return prev
        const diff = prev.lastVisit ? Math.round((new Date(today)-new Date(prev.lastVisit))/86400000) : 1
        return { ...prev, streak: diff===1?(prev.streak||0)+1:1, lastVisit: today }
      })
    }
    init()
  }, [])

  const persist = useCallback((newState) => {
    setSaveStatus('saving')
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const ok = await saveState(newState)
      setSaveStatus(ok ? 'saved' : 'offline')
    }, 1500)
  }, [])

  const setState = useCallback((updater) => {
    setStateRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      persist(next)
      return next
    })
  }, [persist])

  const toggleEB1ATask = (id) => setState(s => ({ ...s, eb1a: { ...s.eb1a, tasks: { ...s.eb1a.tasks, [id]: !s.eb1a.tasks[id] } } }))
  const addEvidence = (item) => setState(s => ({ ...s, eb1a: { ...s.eb1a, evidence: [item,...(s.eb1a.evidence||[])] } }))
  const deleteEvidence = (i) => setState(s => { const ev=[...(s.eb1a.evidence||[])]; ev.splice(i,1); return {...s,eb1a:{...s.eb1a,evidence:ev}} })
  const toggleDMTask = (id) => setState(s => ({ ...s, dm: { ...s.dm, tasks: { ...s.dm.tasks, [id]: !s.dm.tasks[id] } } }))
  const startModule = (id) => setState(s => ({ ...s, dm: { ...s.dm, modProg: { ...s.dm.modProg, [id]: s.dm.modProg[id]||10 } } }))
  const saveDMMetrics = (entry) => setState(s => ({ ...s, dm: { ...s.dm, metrics: [entry,...(s.dm.metrics||[])].slice(0,12) } }))
  const setWorkspace = (ws) => setState(s => ({ ...s, workspace: ws }))
  const markReturn = () => setState(s => ({ ...s, streak: (s.streak||0)+1 }))
  const resetEB1ATasks = () => setState(s => ({ ...s, eb1a: { ...s.eb1a, tasks: {} } }))
  const resetDMTasks = () => setState(s => ({ ...s, dm: { ...s.dm, tasks: {} } }))
  const togglePlanDay = (dayNum) => setState(s => ({
    ...s,
    plan: { doneDays: { ...(s.plan?.doneDays||{}), [dayNum]: !(s.plan?.doneDays||{})[dayNum] } }
  }))

  return { state, saveStatus, toggleEB1ATask, addEvidence, deleteEvidence, toggleDMTask, startModule, saveDMMetrics, setWorkspace, markReturn, resetEB1ATasks, resetDMTasks, togglePlanDay }
}
