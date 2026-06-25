import React, { useState, useMemo, useRef, useEffect } from 'react'
import { PLAN_365 } from '../../data/plan365'
import { Card, Hl, SLabel, Tag, Btn } from '../shared/UI'

const PHASE_META = {
  P0: { label:'Phase 0 — Fix Store', color:'#e8a020', desc:'Weeks 1–2: Get the store right before any marketing.' },
  P1: { label:'Phase 1 — Build Foundation', color:'#5a9de8', desc:'Months 1–3: Analytics, SEO, social, email.' },
  P2: { label:'Phase 2 — Scale & Test', color:'#c9a84c', desc:'Months 3–5: Pillar page, paid ads, SAMakeovers.' },
  P3: { label:'Phase 3 — First Client', color:'#9b7fe8', desc:'Months 5–6: Case studies, outreach, venture starts.' },
  P4: { label:'Phase 4 — Mastery', color:'#4caf7d', desc:'Months 6–9: Deepen all channels, second client.' },
  P5: { label:'Phase 5 — Venture Launch', color:'#e05a5a', desc:'Months 9–11: Consulting page, Q4 campaigns, MRR.' },
  P6: { label:'Phase 6 — Year End', color:'#9b7fe8', desc:'Month 11–12: MBA dissertation, year-end review.' },
  P7: { label:'Ongoing Mastery', color:'#4caf7d', desc:'Rotation: content, clients, metrics, growth.' },
}

const MODULE_COLOR = {
  'Store Fix':'#e8a020','Analytics':'#5a9de8','M1 Intelligence':'#9b7fe8',
  'M2 SEO':'#c9a84c','M3 Social':'#e05a5a','M4 Email':'#4caf7d',
  'M5 Paid':'#f06292','M6 Analytics':'#26c6da','Client':'#9b7fe8',
  'MBA':'#ab47bc','Venture':'#ff7043','Mastery':'#4caf7d',
  'Ongoing':'#5a9de8','Suppliers':'#e8a020','SAMakeovers':'#e05a5a',
}

export default function Plan365({ doneDays, onToggleDay }) {
  const today = new Date().toISOString().slice(0,10)
  const [view, setView] = useState('today') // today | week | phase | all
  const [filterPhase, setFilterPhase] = useState('all')
  const [search, setSearch] = useState('')
  const todayRef = useRef(null)

  const todayIdx = PLAN_365.findIndex(d => d.date === today)
  const currentDay = todayIdx >= 0 ? todayIdx : PLAN_365.findIndex(d => !doneDays[d.day])
  const doneCount = Object.values(doneDays).filter(Boolean).length
  const totalDays = PLAN_365.length
  const pct = Math.round((doneCount/totalDays)*100)
  const currentPhase = PLAN_365[currentDay]?.phase || 'P0'

  // Streak of consecutive done days
  let streak = 0
  for (let i = currentDay - 1; i >= 0; i--) {
    if (doneDays[PLAN_365[i].day]) streak++
    else break
  }

  const filtered = useMemo(() => {
    let days = PLAN_365
    if (view === 'today') {
      const start = Math.max(0, currentDay - 1)
      const end = Math.min(totalDays, currentDay + 6)
      days = days.slice(start, end)
    } else if (view === 'week') {
      const start = Math.floor(currentDay / 7) * 7
      days = days.slice(start, start + 7)
    } else if (view === 'phase') {
      days = days.filter(d => d.phase === currentPhase)
    } else if (view === 'all') {
      if (filterPhase !== 'all') days = days.filter(d => d.phase === filterPhase)
    }
    if (search) {
      const q = search.toLowerCase()
      days = days.filter(d => d.task.toLowerCase().includes(q) || d.module.toLowerCase().includes(q) || d.activity.toLowerCase().includes(q))
    }
    return days
  }, [view, filterPhase, search, currentDay, currentPhase, doneDays])

  useEffect(() => {
    if (todayRef.current) todayRef.current.scrollIntoView({ behavior:'smooth', block:'center' })
  }, [view])

  const nextTask = PLAN_365.find(d => !doneDays[d.day])

  return (
    <div>
      {/* HEADER STATS */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
        <StatMini label="Overall" value={pct+'%'} sub={`${doneCount}/${totalDays} days`} color="var(--gold)"/>
        <StatMini label="Current Streak" value={streak+'d'} sub="consecutive days" color="var(--green)"/>
        <StatMini label="Current Phase" value={PHASE_META[currentPhase]?.label.split('—')[0].trim()} sub={PHASE_META[currentPhase]?.desc.split(':')[0]} color={PHASE_META[currentPhase]?.color}/>
        <StatMini label="Day" value={`#${currentDay+1}`} sub={PLAN_365[currentDay]?.date} color="var(--blue)"/>
      </div>

      {/* NEXT ACTION BOX */}
      {nextTask && (
        <div style={{background:'rgba(201,168,76,0.08)',border:'1px solid rgba(201,168,76,0.25)',borderRadius:10,padding:'14px 18px',marginBottom:20,display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
          <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--gold)',whiteSpace:'nowrap'}}>▶ Next Up — Day {nextTask.day}</div>
          <div style={{flex:1,fontSize:13,color:'var(--white)',fontWeight:500}}>{nextTask.task}</div>
          <div style={{fontSize:10,fontFamily:'"JetBrains Mono",monospace',color:'var(--muted)',whiteSpace:'nowrap'}}>{nextTask.tool}</div>
          <button onClick={()=>onToggleDay(nextTask.day)} style={{background:'var(--green)',border:'none',borderRadius:6,padding:'6px 14px',color:'#000',fontSize:12,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap'}}>Mark Done ✓</button>
        </div>
      )}

      {/* PHASE PROGRESS BAR */}
      <div style={{marginBottom:20}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:11,color:'var(--muted)'}}>
          {Object.entries(PHASE_META).map(([k,v])=>{
            const phaseDays = PLAN_365.filter(d=>d.phase===k)
            const phaseDone = phaseDays.filter(d=>doneDays[d.day]).length
            const isActive = k===currentPhase
            return (
              <div key={k} onClick={()=>{setView('all');setFilterPhase(k)}} style={{cursor:'pointer',textAlign:'center',opacity:isActive?1:0.4,transition:'opacity 0.2s'}}>
                <div style={{fontSize:9,color:isActive?v.color:'var(--muted)',fontWeight:isActive?700:400}}>{k}</div>
                <div style={{fontSize:10,color:'var(--muted)'}}>{phaseDone}/{phaseDays.length}</div>
              </div>
            )
          })}
        </div>
        <div style={{height:4,background:'var(--surface3)',borderRadius:2,overflow:'hidden',position:'relative'}}>
          <div style={{width:`${pct}%`,height:'100%',background:'linear-gradient(90deg,var(--gold-dim),var(--gold))',borderRadius:2,transition:'width 0.5s'}}></div>
        </div>
      </div>

      {/* VIEW SWITCHER + SEARCH */}
      <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
        {['today','week','phase','all'].map(v=>(
          <button key={v} onClick={()=>{setView(v);setFilterPhase('all')}} style={{padding:'6px 14px',borderRadius:6,fontSize:11,fontWeight:600,cursor:'pointer',background:view===v?'rgba(201,168,76,0.15)':'var(--surface3)',border:view===v?'1px solid rgba(201,168,76,0.4)':'1px solid var(--border)',color:view===v?'var(--gold)':'var(--muted)',textTransform:'uppercase',letterSpacing:'0.06em'}}>
            {v==='today'?'Next 7 Days':v==='week'?'This Week':v==='phase'?'Current Phase':'All Days'}
          </button>
        ))}
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks…" style={{flex:1,minWidth:160,background:'var(--surface3)',border:'1px solid var(--border)',borderRadius:6,padding:'6px 10px',color:'var(--white)',fontSize:12,outline:'none'}}/>
        {search && <button onClick={()=>setSearch('')} style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:14}}>×</button>}
      </div>

      {/* PHASE FILTER when view=all */}
      {view==='all' && !search && (
        <div style={{display:'flex',gap:6,marginBottom:14,flexWrap:'wrap'}}>
          <button onClick={()=>setFilterPhase('all')} style={{padding:'4px 10px',borderRadius:10,fontSize:10,fontWeight:600,cursor:'pointer',background:filterPhase==='all'?'var(--gold)':'var(--surface3)',border:'none',color:filterPhase==='all'?'#000':'var(--muted)'}}>All</button>
          {Object.entries(PHASE_META).map(([k,v])=>(
            <button key={k} onClick={()=>setFilterPhase(k)} style={{padding:'4px 10px',borderRadius:10,fontSize:10,fontWeight:600,cursor:'pointer',background:filterPhase===k?v.color:'var(--surface3)',border:'none',color:filterPhase===k?'#000':'var(--muted)'}}>
              {k}
            </button>
          ))}
        </div>
      )}

      {/* DAYS LIST */}
      <div>
        {filtered.map((day, i) => {
          const isDone = !!doneDays[day.day]
          const isToday = day.date === today
          const isCurrent = day.day === (currentDay + 1)
          const isRest = day.activity === 'REST' || day.task.startsWith('Rest')
          const phaseColor = PHASE_META[day.phase]?.color || 'var(--gold)'
          const modColor = MODULE_COLOR[day.module] || 'var(--muted)'

          return (
            <div key={day.day} ref={isToday ? todayRef : null}
              style={{background:isDone?'var(--surface2)':isToday||isCurrent?'rgba(201,168,76,0.06)':'var(--surface2)',border:`1px solid ${isToday||isCurrent?'rgba(201,168,76,0.3)':isDone?'var(--border)':'var(--border)'}`,borderRadius:10,padding:'12px 14px',marginBottom:8,display:'flex',alignItems:'flex-start',gap:12,cursor:'pointer',transition:'all 0.15s',opacity:isDone?0.6:1}}
              onClick={()=>onToggleDay(day.day)}>

              {/* Day number + check */}
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,flexShrink:0,width:36}}>
                <div style={{width:24,height:24,border:`2px solid ${isDone?'var(--green)':isToday?'var(--gold)':'var(--border)'}`,borderRadius:5,display:'flex',alignItems:'center',justifyContent:'center',background:isDone?'var(--green)':'transparent',transition:'all 0.2s',flexShrink:0}}>
                  {isDone && <span style={{fontSize:11,color:'#fff',fontWeight:700}}>✓</span>}
                  {!isDone && isRest && <span style={{fontSize:10}}>💤</span>}
                </div>
                <div style={{fontSize:9,fontFamily:'"JetBrains Mono",monospace',color:'var(--muted)',textAlign:'center'}}>{day.weekday}<br/>D{day.day}</div>
              </div>

              {/* Content */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5,flexWrap:'wrap'}}>
                  <span style={{fontSize:9,fontFamily:'"JetBrains Mono",monospace',padding:'2px 7px',borderRadius:10,background:`${phaseColor}22`,color:phaseColor}}>{day.phase}</span>
                  <span style={{fontSize:9,fontFamily:'"JetBrains Mono",monospace',padding:'2px 7px',borderRadius:10,background:`${modColor}22`,color:modColor}}>{day.module}</span>
                  {(isToday||isCurrent) && !isDone && <span style={{fontSize:9,fontFamily:'"JetBrains Mono",monospace',padding:'2px 7px',borderRadius:10,background:'rgba(201,168,76,0.2)',color:'var(--gold)',fontWeight:700}}>TODAY</span>}
                  <span style={{fontSize:9,color:'var(--muted)',marginLeft:'auto'}}>{day.date}</span>
                </div>
                <div style={{fontSize:13,color:isDone?'var(--muted)':'var(--white)',fontWeight:500,textDecoration:isDone?'line-through':'none',marginBottom:4,lineHeight:1.4}}>{day.task}</div>
                <div style={{display:'flex',gap:12,fontSize:11,color:'var(--muted)',flexWrap:'wrap'}}>
                  <span>🛠 {day.tool}</span>
                  <span>✓ {day.deliverable}</span>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{textAlign:'center',padding:'40px 20px',color:'var(--muted)'}}>
            <div style={{fontSize:30,marginBottom:8}}>🔍</div>
            No days match your search.
          </div>
        )}
      </div>

      {/* BOTTOM SUMMARY */}
      <div style={{marginTop:24,padding:'14px 18px',background:'var(--surface3)',borderRadius:10,textAlign:'center'}}>
        <div style={{fontSize:12,color:'var(--muted)',lineHeight:1.8}}>
          <strong style={{color:'var(--gold)'}}>{doneCount} days completed</strong> · <strong style={{color:'var(--white)'}}>{totalDays - doneCount} days remaining</strong> · <strong style={{color:'var(--green)'}}>{pct}% through the year</strong>
          <br/>
          <span style={{fontSize:11}}>At 30–45 min/day you will have completed your digital marketing mastery by {PLAN_365[totalDays-1]?.date}</span>
        </div>
      </div>
    </div>
  )
}

const StatMini = ({label,value,sub,color}) => (
  <div style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:10,padding:'12px 14px'}}>
    <div style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--muted)',marginBottom:6}}>{label}</div>
    <div style={{fontFamily:'"DM Serif Display",serif',fontSize:22,color:color||'var(--white)',lineHeight:1}}>{value}</div>
    <div style={{fontSize:10,color:'var(--muted)',marginTop:3}}>{sub}</div>
  </div>
)
