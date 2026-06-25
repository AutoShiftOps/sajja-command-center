import React, { useState } from 'react'
import Tabs from '../shared/Tabs'
import { Card, Hl, SLabel, Formula, Note, PBar, Tag, Btn, Grid, StatCard, TaskItem } from '../shared/UI'
import { DM_MODULES, DM_TASKS, DM_CONCEPTS, DM_WEEKLY, DM_METRICS_FIELDS } from '../../data/dm'
import Plan365 from './Plan365'

const TABS = [
  {id:'overview',label:'Overview'},{id:'plan',label:'365-Day Plan'},{id:'modules',label:'6 Modules'},{id:'weekly',label:'This Week'},
  {id:'tasks',label:'Tasks'},{id:'concepts',label:'Concepts'},{id:'metrics',label:'My Metrics'},{id:'return',label:'↩ Return'},
]

export default function DMWorkspace({ state, actions }) {
  const [tab, setTab] = useState('overview')
  const doneTasks = DM_TASKS.filter(t=>state.dm.tasks[t.id]).length
  const pct = Math.round((doneTasks/DM_TASKS.length)*100)

  return (
    <div>
      <Tabs tabs={TABS} active={tab} onSelect={setTab} accentColor="var(--gold)"/>
      <div style={{padding:24,background:'var(--surface)',minHeight:'calc(100vh - 120px)'}}>
        {tab==='overview' && <DMOverview pct={pct} doneTasks={doneTasks} state={state}/>}
        {tab==='plan' && <Plan365 doneDays={state.plan?.doneDays||{}} onToggleDay={actions.togglePlanDay}/>}
        {tab==='modules' && <DMModules state={state} actions={actions}/>}
        {tab==='weekly' && <DMWeekly/>}
        {tab==='tasks' && <DMTasks state={state} actions={actions} doneTasks={doneTasks}/>}
        {tab==='concepts' && <DMConcepts/>}
        {tab==='metrics' && <DMMetrics state={state} actions={actions}/>}
        {tab==='return' && <DMReturn actions={actions}/>}
      </div>
    </div>
  )
}

function DMOverview({pct,doneTasks,state}) {
  const activeMods = DM_MODULES.filter(m=>state.dm.modProg&&state.dm.modProg[m.id]>0).length
  const phase = pct<30?'Fix Store':pct<65?'Build Engine':'Test & Scale'
  return (
    <>
      <Hl><strong>Your formula is correct:</strong> Product first → Content → Traffic → Sales. You are in Phase 0 — fixing the store. No marketing starts until the store is ready.</Hl>
      <Grid cols={4}>
        <StatCard label="Overall Progress" value={pct+'%'} sub="of 90-day program"/>
        <StatCard label="Modules Active" value={activeMods} sub="of 6 modules"/>
        <StatCard label="Tasks Done" value={doneTasks} sub="this phase"/>
        <StatCard label="Current Phase" value={phase} sub="Phase 0 of 3" color="var(--gold)"/>
      </Grid>
      <SLabel>The Core Equation — Always Return to This</SLabel>
      <Formula>Digital Marketing = Right Message + Right Person + Right Time + Right Channel</Formula>
      <Note>Every tactic solves one part. SEO = right time. Social = right person. Email = right message. When lost — come back to this equation.</Note>
      <SLabel>3-Phase Journey</SLabel>
      <Grid cols={3}>
        <Card style={{borderColor:'var(--gold-dim)'}}>
          <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--gold)',marginBottom:8}}>Phase 0 — NOW</div>
          <div style={{fontSize:13,fontWeight:600,color:'var(--white)',marginBottom:6}}>Fix the Store</div>
          <div style={{fontSize:12,color:'var(--muted)',lineHeight:1.6}}>Remove clothing. Rename products. Write About Us. Add 20 jewelry SKUs. Set up GA4. No marketing until done.</div>
          <div style={{marginTop:10,fontFamily:'"JetBrains Mono",monospace',fontSize:10,color:'var(--gold)'}}>Target: 2 weeks</div>
        </Card>
        <Card>
          <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--muted)',marginBottom:8}}>Phase 1 — Month 1–2</div>
          <div style={{fontSize:13,fontWeight:600,color:'var(--white)',marginBottom:6}}>Build Organic Engine</div>
          <div style={{fontSize:12,color:'var(--muted)',lineHeight:1.6}}>SEO content, Pinterest, Instagram, email flows. Build what works while you sleep.</div>
        </Card>
        <Card>
          <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--muted)',marginBottom:8}}>Phase 2 — Month 3</div>
          <div style={{fontSize:13,fontWeight:600,color:'var(--white)',marginBottom:6}}>Test & Amplify</div>
          <div style={{fontSize:12,color:'var(--muted)',lineHeight:1.6}}>$50 Meta Ads test. Google Shopping. Analyze data. Document your case study for MBA.</div>
        </Card>
      </Grid>
    </>
  )
}

function DMModules({state,actions}) {
  return (
    <>
      <SLabel mt={0}>Your 6-Module Curriculum</SLabel>
      <Grid cols={2}>
        {DM_MODULES.map(m=>{
          const prog=(state.dm.modProg&&state.dm.modProg[m.id])||0
          const statusLabel=!m.active?'Locked':prog>=100?'Completed':prog>0?'In Progress':'Not Started'
          const statusColor=prog>=100?'var(--green)':prog>0?'var(--gold)':'var(--muted)'
          return (
            <div key={m.id} onClick={()=>m.active&&actions.startModule(m.id)} style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:12,padding:18,cursor:m.active?'pointer':'default',opacity:m.active?1:0.5,position:'relative',overflow:'hidden',transition:'border-color 0.2s'}}>
              <div style={{position:'absolute',left:0,top:0,bottom:0,width:3,background:prog>=100?'var(--green)':prog>0?'var(--gold)':'var(--border)'}}></div>
              <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:10,color:'var(--muted)',marginBottom:5}}>Module {m.num}</div>
              <div style={{fontSize:14,fontWeight:600,color:'var(--white)',marginBottom:4}}>{m.name}</div>
              <div style={{fontSize:12,color:'var(--muted)',lineHeight:1.5,marginBottom:10}}>{m.desc}</div>
              <div style={{fontSize:10,color:'var(--muted)',fontFamily:'"JetBrains Mono",monospace',marginBottom:10}}>{m.theory}</div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{fontSize:10,fontFamily:'"JetBrains Mono",monospace',padding:'3px 9px',borderRadius:10,background:'var(--surface3)',color:statusColor}}>{statusLabel}</span>
                <span style={{fontFamily:'"JetBrains Mono",monospace',fontSize:11,color:'var(--muted)'}}>{prog}%</span>
              </div>
              <PBar pct={prog} color="gold"/>
            </div>
          )
        })}
      </Grid>
    </>
  )
}

function DMWeekly() {
  return (
    <>
      <Hl><strong>One week at a time.</strong> Each day has one primary task. 30–45 minutes maximum. Consistency beats intensity every time.</Hl>
      {DM_WEEKLY.map((d,i)=>(
        <div key={i} style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:10,padding:14,marginBottom:10}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
            <div style={{fontWeight:600,color:'var(--white)',fontSize:13}}>{d.day}</div>
            <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:10,color:d.color}}>{d.time}</div>
          </div>
          {d.tasks.map((t,j)=>(
            <div key={j} style={{display:'flex',alignItems:'center',gap:8,fontSize:12,color:'var(--text)',padding:'7px 9px',background:'var(--surface3)',borderRadius:6,marginBottom:j<d.tasks.length-1?6:0}}>
              <div style={{width:5,height:5,borderRadius:'50%',background:d.color,flexShrink:0}}></div>{t}
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

function DMTasks({state,actions,doneTasks}) {
  return (
    <>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <SLabel mt={0}>Task Board — Phase 0 ({doneTasks}/{DM_TASKS.length})</SLabel>
        <Btn variant="outline" onClick={actions.resetDMTasks} style={{fontSize:11,padding:'5px 10px'}}>Reset</Btn>
      </div>
      <Card>
        {DM_TASKS.map(t=>(
          <TaskItem key={t.id} title={t.title} done={!!state.dm.tasks[t.id]} onToggle={()=>actions.toggleDMTask(t.id)}
            tags={[{label:t.mod,type:'gold'},{label:t.priority==='high'?'🔴 High':'🟡 Med',type:t.priority==='high'?'high':'med'}]}/>
        ))}
      </Card>
    </>
  )
}

function DMConcepts() {
  const [open,setOpen] = useState(null)
  return (
    <>
      <Hl><strong>MBA frameworks mapped to real Seoul & Glow actions.</strong> Tap any concept after a break — one card reactivates your thinking in 5 minutes.</Hl>
      {DM_CONCEPTS.map((c,i)=>(
        <div key={i} onClick={()=>setOpen(open===i?null:i)} style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:10,padding:15,marginBottom:10,cursor:'pointer',transition:'border-color 0.2s'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{fontWeight:600,color:'var(--white)',fontSize:13}}>{c.title}</div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <Tag type="gold">{c.mod}</Tag>
              <span style={{color:'var(--muted)',fontSize:11,display:'inline-block',transition:'transform 0.2s',transform:open===i?'rotate(180deg)':'rotate(0deg)'}}>▼</span>
            </div>
          </div>
          {open===i&&(
            <div style={{marginTop:10}}>
              <p style={{fontSize:12,color:'var(--muted)',lineHeight:1.6}}>{c.body}</p>
              <Formula>{c.formula}</Formula>
              <div style={{marginTop:8,padding:'8px 10px',background:'rgba(201,168,76,0.05)',border:'1px solid rgba(201,168,76,0.15)',borderRadius:6,fontSize:11,color:'var(--text)'}}>
                <strong style={{color:'var(--gold)'}}>Apply on Seoul & Glow: </strong>{c.action}
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  )
}

function DMMetrics({state,actions}) {
  const [vals,setVals] = useState({})
  const handleSave = () => {
    const entry = { week: new Date().toISOString().slice(0,10), data: {...vals} }
    actions.saveDMMetrics(entry)
    setVals({})
  }
  return (
    <>
      <Hl><strong>Enter your numbers every Monday.</strong> Even zeros are data. Numbers tell you what is working before you can feel it.</Hl>
      <SLabel mt={0}>Weekly Dashboard — seoulandglow.com</SLabel>
      <Card>
        {DM_METRICS_FIELDS.map(f=>(
          <div key={f.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 0',borderBottom:'1px solid var(--border)'}}>
            <div>
              <div style={{fontSize:13,color:'var(--text)'}}>{f.name}</div>
              <div style={{fontSize:10,color:'var(--muted)'}}>{f.tool}</div>
            </div>
            <input type="number" value={vals[f.id]||''} onChange={e=>setVals(v=>({...v,[f.id]:e.target.value}))} placeholder="0" step="any"
              style={{background:'var(--surface3)',border:'1px solid var(--border)',borderRadius:6,padding:'5px 9px',color:'var(--white)',fontFamily:'"JetBrains Mono",monospace',fontSize:12,width:110,textAlign:'right',outline:'none'}}/>
          </div>
        ))}
      </Card>
      <Btn onClick={handleSave} style={{width:'100%',marginTop:14,padding:13,fontSize:14}}>Save This Week's Numbers</Btn>
      {state.dm.metrics&&state.dm.metrics.length>0&&(
        <>
          <SLabel>History ({state.dm.metrics.length} weeks)</SLabel>
          {state.dm.metrics.map((e,i)=>(
            <Card key={i} style={{marginBottom:10}}>
              <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:10,color:'var(--gold)',marginBottom:10}}>Week of {e.week}</div>
              <Grid cols={4}>
                {DM_METRICS_FIELDS.slice(0,4).map(f=>(
                  <div key={f.id}>
                    <div style={{fontSize:10,color:'var(--muted)',marginBottom:2}}>{f.name}</div>
                    <div style={{fontSize:15,fontWeight:600,color:'var(--white)',fontFamily:'"JetBrains Mono",monospace'}}>{e.data[f.id]||'—'}</div>
                  </div>
                ))}
              </Grid>
            </Card>
          ))}
        </>
      )}
    </>
  )
}

function DMReturn({actions}) {
  const [returned,setReturned] = useState(false)
  const steps = [
    {n:1,t:'Read the Core Equation',d:'Go to Overview tab. Read the golden formula. Resets your brain to marketing thinking in 30 seconds.'},
    {n:2,t:'Check Your Current Phase',d:'Phase 0, 1, or 2? The Overview tab shows exactly where you are. Pick up from the same phase — do not skip ahead.'},
    {n:3,t:'Open Task Board',d:'Find the first unchecked task. That is your only job today. Do one thing. Check it off. Stop overthinking what you missed.'},
    {n:4,t:'Enter Any Metrics You Have',d:'Go to My Metrics. Enter whatever numbers you have — even zeros. Data beats assumptions.'},
    {n:5,t:'Open One Concept Card',d:'Concepts tab. Read one concept. 5 minutes maximum. Theory refreshed. Now go execute.'},
  ]
  return (
    <>
      <Hl><strong>You took a break. That is fine.</strong> Follow these 5 steps and you will be back on track in under 10 minutes.</Hl>
      <Card style={{marginBottom:16}}>
        {steps.map(s=>(
          <div key={s.n} style={{display:'flex',gap:14,padding:'14px 0',borderBottom:s.n<5?'1px solid var(--border)':'none',alignItems:'flex-start'}}>
            <div style={{width:30,height:30,background:'var(--surface3)',border:'1px solid var(--border)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'"JetBrains Mono",monospace',fontSize:12,color:'var(--gold)',flexShrink:0}}>{s.n}</div>
            <div><div style={{fontWeight:600,color:'var(--white)',fontSize:13,marginBottom:3}}>{s.t}</div><div style={{fontSize:12,color:'var(--muted)',lineHeight:1.5}}>{s.d}</div></div>
          </div>
        ))}
      </Card>
      <Formula>Never restart. Never skip ahead. Find your last checkpoint and take one step forward.</Formula>
      <Note style={{marginTop:10}}>Progress in marketing compounds. A week off does not erase your blog posts, email flows, or social content. The work still compounds. You paused. Resume.</Note>
      <Btn onClick={()=>{actions.markReturn();setReturned(true)}} style={{width:'100%',marginTop:16,fontSize:14,padding:13}}>
        {returned ? '✓ Streak Updated — Go Complete One Task' : '✓ I\'m Back — Resume Streak'}
      </Btn>
    </>
  )
}
