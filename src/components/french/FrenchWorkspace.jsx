import React, { useState, useRef, useEffect } from 'react'
import Tabs from '../shared/Tabs'
import { Card, Hl, SLabel, Note, PBar, Tag, Btn, Grid, StatCard, TaskItem } from '../shared/UI'
import { FRENCH_MODES, FRENCH_TASKS, SYSTEM_PROMPTS } from '../../data/french'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'coach',     label: '🇫🇷 AI Coach' },
  { id: 'tasks',     label: 'Tasks' },
  { id: 'log',       label: 'Session Log' },
  { id: 'plan',      label: '90-Day Plan' },
]

export default function FrenchWorkspace({ state, actions }) {
  const [tab, setTab] = useState('dashboard')
  const fr = state.french || {}
  const doneTasks    = FRENCH_TASKS.filter(t => (fr.tasks||{})[t.id]).length
  const sessionCount = (fr.sessions||[]).length
  const vocabCount   = fr.vocabCount || 0
  const mockScores   = (fr.sessions||[]).filter(s=>s.mode==='mock'&&s.score).map(s=>s.score)
  const avgMock      = mockScores.length ? Math.round(mockScores.reduce((a,b)=>a+b,0)/mockScores.length) : 0

  return (
    <div>
      <Tabs tabs={TABS} active={tab} onSelect={setTab} accentColor="var(--blue)" />
      <div style={{ padding:24, background:'var(--surface)', minHeight:'calc(100vh - 120px)' }}>
        {tab==='dashboard' && <Dashboard fr={fr} doneTasks={doneTasks} sessionCount={sessionCount} vocabCount={vocabCount} avgMock={avgMock} />}
        {tab==='coach'     && <Coach fr={fr} actions={actions} />}
        {tab==='tasks'     && <Tasks fr={fr} actions={actions} doneTasks={doneTasks} />}
        {tab==='log'       && <SessionLog fr={fr} />}
        {tab==='plan'      && <Plan fr={fr} actions={actions} />}
      </div>
    </div>
  )
}

function Dashboard({ fr, doneTasks, sessionCount, vocabCount, avgMock }) {
  const pct      = Math.round((doneTasks/FRENCH_TASKS.length)*100)
  const planDays = fr.planDays || []
  const phases   = [
    { label:'Phase 1 — Foundation',    range:[1,28],  done: planDays.filter(d=>d<=28).length,        total:28, color:'blue'   },
    { label:'Phase 2 — Consolidation', range:[29,63], done: planDays.filter(d=>d>28&&d<=63).length,  total:35, color:'purple' },
    { label:'Phase 3 — PR Readiness',  range:[64,90], done: planDays.filter(d=>d>63).length,         total:27, color:'gold'   },
  ]
  return (
    <>
      <Hl color="blue">
        <strong style={{color:'var(--blue)'}}>Target:</strong> TEF Canada CLB 7 for Express Entry French points.
        La Forêt batch starts <strong style={{color:'var(--white)'}}>16 Jul 2026</strong> · 6:30–7:30 AM IST · Mon–Fri.
        Course ~₹83,000 INR · Exam ~₹25,000 INR (Alliance Française). Register now — seats are limited.
      </Hl>
      <Grid cols={4}>
        <StatCard label="Days Completed" value={planDays.length}  sub="of 90 total"       color="var(--blue)"  />
        <StatCard label="Vocab Cards"    value={vocabCount}       sub="target: 900+"                            />
        <StatCard label="AI Sessions"    value={sessionCount}     sub="coach sessions"                          />
        <StatCard label="Avg Mock /20"   value={avgMock||'—'}     sub="TEF mock score"    color="var(--amber)"  />
      </Grid>

      <SLabel>90-Day Phase Progress</SLabel>
      {phases.map((p,i)=>(
        <div key={i} style={{marginBottom:14}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}>
            <span style={{color:'var(--text)',fontWeight:500}}>{p.label}</span>
            <span style={{fontFamily:'"JetBrains Mono",monospace',fontSize:11,color:`var(--${p.color})`}}>{p.done}/{p.total} days</span>
          </div>
          <PBar pct={Math.round((p.done/p.total)*100)} color={p.color} />
        </div>
      ))}

      <SLabel>TEF Canada — 4 Skills Tested</SLabel>
      <Grid cols={2}>
        {[
          {skill:'Listening',desc:'40 questions · 40 min · Multiple choice from audio'},
          {skill:'Reading',  desc:'50 questions · 60 min · Multiple choice from text'},
          {skill:'Writing',  desc:'2 tasks · 60 min · Graph description + letter/email'},
          {skill:'Speaking', desc:'3 tasks · 35 min · Monologue + dialogue with examiner'},
        ].map((s,i)=>(
          <Card key={i}>
            <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--blue)',marginBottom:6}}>{s.skill}</div>
            <div style={{fontSize:12,color:'var(--muted)',lineHeight:1.6}}>{s.desc}</div>
          </Card>
        ))}
      </Grid>

      <SLabel>Key Dates</SLabel>
      <Card>
        {[
          {date:'16 Jul 2026', event:'La Forêt batch starts — register NOW, seats limited',                    urgent:true },
          {date:'Sep 2026',    event:'Book TEF Canada exam at Alliance Française (India) — fills up fast',      urgent:false},
          {date:'End Wk 4',    event:'Record Phase 1 voice benchmark — save as "Phase1_Benchmark"',            urgent:false},
          {date:'End Wk 9',    event:'Record Phase 2 voice benchmark — save as "Phase2_Benchmark"',            urgent:false},
          {date:'Apr 2027',    event:'TEF Canada exam at Alliance Française · Target: CLB 7 all 4 skills',     urgent:false},
        ].map((d,i,arr)=>(
          <div key={i} style={{display:'flex',gap:14,padding:'10px 0',borderBottom:i<arr.length-1?'1px solid var(--border)':'none',alignItems:'center'}}>
            <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:11,color:d.urgent?'var(--red)':'var(--muted)',width:90,flexShrink:0}}>{d.date}</div>
            <div style={{fontSize:13,color:d.urgent?'var(--white)':'var(--text)',fontWeight:d.urgent?600:400,flex:1}}>{d.event}</div>
            {d.urgent&&<Tag type="high">NOW</Tag>}
          </div>
        ))}
      </Card>

      <SLabel>Task Completion</SLabel>
      <Card>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <div style={{fontFamily:'"DM Serif Display",serif',fontSize:28,color:'var(--blue)'}}>{pct}%</div>
          <div style={{fontSize:12,color:'var(--muted)'}}>{doneTasks} of {FRENCH_TASKS.length} tasks</div>
        </div>
        <PBar pct={pct} color="blue" />
      </Card>
    </>
  )
}

function Coach({ fr, actions }) {
  const [modeId,  setModeId]  = useState('vocab')
  const [convos,  setConvos]  = useState({})
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)
  const mode = FRENCH_MODES.find(m=>m.id===modeId)
  const msgs = convos[modeId] || []

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[msgs,loading])

  async function send(text) {
    const content = (text||input).trim()
    if (!content||loading) return
    setInput('')
    const userMsg = {role:'user', content, time:new Date().toLocaleTimeString('en-CA',{hour:'2-digit',minute:'2-digit'})}
    const current = convos[modeId]||[]
    const updated = [...current, userMsg]
    setConvos(p=>({...p,[modeId]:updated}))
    setLoading(true)
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:800,system:SYSTEM_PROMPTS[modeId],messages:updated.map(({role,content})=>({role,content}))}),
      })
      const data  = await resp.json()
      const reply = data.content?.[0]?.text||'Error: no response'
      const coach = {role:'assistant',content:reply,time:new Date().toLocaleTimeString('en-CA',{hour:'2-digit',minute:'2-digit'})}
      const final = [...updated,coach]
      setConvos(p=>({...p,[modeId]:final}))
      actions.logFrenchSession({mode:modeId,messages:final.length,ts:new Date().toISOString()})
    } catch {
      setConvos(p=>({...p,[modeId]:[...updated,{role:'assistant',content:'Connection error — try again.',time:''}]}))
    }
    setLoading(false)
    inputRef.current?.focus()
  }

  const STARTERS = {vocab:'Start my vocabulary drill',grammar:'Start my grammar drill — you choose the tense',speaking:"Give me today's speaking question",listening:'Give me my first listening passage',mock:'Start my TEF Canada mock exam'}
  const QUICK = {
    vocab:    ['Next word →','Repeat this word','Use it in a sentence','Harder words please'],
    grammar:  ['Next exercise →','Explain the rule again','Another example','Next tense'],
    speaking: ['Next question →','Score my answer','Show model answer','Harder question'],
    listening:['Next passage →','Repeat the passage','Explain a word','Harder passage'],
    mock:     ['Next prompt →','Score my response','Model answer please','What CLB am I at?'],
  }

  return (
    <div style={{display:'flex',gap:16,height:'calc(100vh - 195px)',minHeight:480}}>
      <div style={{width:155,flexShrink:0,display:'flex',flexDirection:'column',gap:8}}>
        <div style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--muted)',marginBottom:4}}>Practice Mode</div>
        {FRENCH_MODES.map(m=>(
          <button key={m.id} onClick={()=>setModeId(m.id)} style={{
            background:modeId===m.id?'var(--surface2)':'transparent',
            border:`1px solid ${modeId===m.id?'var(--blue)':'var(--border)'}`,
            borderRadius:8,padding:'9px 11px',cursor:'pointer',textAlign:'left',
            color:modeId===m.id?'var(--white)':'var(--muted)',transition:'all 0.15s',fontFamily:'Inter,sans-serif',
          }}>
            <div style={{fontSize:15,marginBottom:3}}>{m.icon}</div>
            <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em'}}>{m.label}</div>
          </button>
        ))}
        <div style={{marginTop:'auto',paddingTop:12,borderTop:'1px solid var(--border)'}}>
          <div style={{fontSize:10,color:'var(--muted)',lineHeight:1.7}}>
            <strong style={{color:'var(--text)'}}>La Forêt:</strong><br/>6:30–7:30 AM IST<br/>Mon–Fri from 16 Jul<br/>
            <span style={{color:'var(--blue)'}}>Practice here between classes</span>
          </div>
        </div>
      </div>

      <div style={{flex:1,display:'flex',flexDirection:'column',border:'1px solid var(--border)',borderRadius:12,overflow:'hidden',background:'var(--surface2)'}}>
        <div style={{padding:'11px 16px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'var(--surface3)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:17}}>{mode.icon}</span>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:'var(--white)'}}>{mode.label}</div>
              <div style={{fontSize:11,color:'var(--muted)'}}>TEF Canada · A0 → CLB 7</div>
            </div>
          </div>
          {msgs.length===0
            ? <Btn onClick={()=>send(STARTERS[modeId])} variant="outline" style={{fontSize:12,padding:'6px 14px'}}>Start →</Btn>
            : <Btn onClick={()=>setConvos(p=>({...p,[modeId]:[]}))} variant="outline" style={{fontSize:11,padding:'5px 11px',color:'var(--muted)'}}>New session</Btn>
          }
        </div>

        <div style={{flex:1,overflowY:'auto',padding:'12px 14px'}}>
          {msgs.length===0?(
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',gap:10,textAlign:'center'}}>
              <div style={{fontSize:42}}>{mode.icon}</div>
              <div style={{fontSize:15,fontWeight:600,color:'var(--white)'}}>{mode.label}</div>
              <div style={{fontSize:12,color:'var(--muted)',maxWidth:330,lineHeight:1.7}}>
                {modeId==='vocab'    &&'One word at a time. Type it back. Build to 900+ over 90 days.'}
                {modeId==='grammar'  &&'One grammar rule per session, drilled with fill-in-the-blank.'}
                {modeId==='speaking' &&'8 core TEF Canada PR questions. Scored and corrected each time.'}
                {modeId==='listening'&&'Short French passages + comprehension questions. Train your ear.'}
                {modeId==='mock'     &&'Full TEF simulation. Scored on 4 official criteria. No soft marking.'}
              </div>
            </div>
          ):(
            msgs.map((m,i)=>(
              <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start',marginBottom:10}}>
                {m.role==='assistant'&&<div style={{width:24,height:24,borderRadius:'50%',background:'var(--blue)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,flexShrink:0,marginRight:7,marginTop:2}}>C</div>}
                <div style={{maxWidth:'78%',padding:'9px 13px',borderRadius:m.role==='user'?'11px 11px 2px 11px':'11px 11px 11px 2px',background:m.role==='user'?'var(--surface3)':'var(--surface)',border:'1px solid var(--border)',fontSize:13,lineHeight:1.65,color:'var(--text)',whiteSpace:'pre-wrap',wordBreak:'break-word'}}>
                  {m.content}
                  <div style={{fontSize:10,color:'var(--muted)',marginTop:3,textAlign:'right'}}>{m.time}</div>
                </div>
                {m.role==='user'&&<div style={{width:24,height:24,borderRadius:'50%',background:'var(--gold-dim)',color:'#000',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,flexShrink:0,marginLeft:7,marginTop:2}}>S</div>}
              </div>
            ))
          )}
          {loading&&(
            <div style={{display:'flex',alignItems:'center',gap:7}}>
              <div style={{width:24,height:24,borderRadius:'50%',background:'var(--blue)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700}}>C</div>
              <div style={{display:'flex',gap:3}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:'var(--muted)',opacity:0.5}}/>)}</div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {msgs.length>0&&(
          <div style={{padding:'7px 11px',borderTop:'1px solid var(--border)',display:'flex',gap:5,flexWrap:'wrap',background:'var(--surface3)'}}>
            {(QUICK[modeId]||[]).map(a=>(
              <button key={a} onClick={()=>send(a)} style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:14,padding:'3px 10px',fontSize:11,color:'var(--muted)',cursor:'pointer',fontFamily:'Inter,sans-serif'}}>{a}</button>
            ))}
          </div>
        )}

        <div style={{padding:'9px 13px 11px',borderTop:'1px solid var(--border)',display:'flex',gap:8,background:'var(--surface3)'}}>
          <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()} disabled={loading}
            placeholder={modeId==='vocab'?'Type the French word back...':modeId==='grammar'?'Fill in the blank...':modeId==='listening'?'Answer in English...':'Type in French...'}
            style={{flex:1,padding:'8px 12px',borderRadius:8,border:'1px solid var(--border)',fontSize:13,fontFamily:'Inter,sans-serif',background:'var(--surface2)',color:'var(--text)',outline:'none'}}
          />
          <Btn onClick={()=>send()} variant="outline" style={{fontSize:13,padding:'8px 16px',opacity:(!input.trim()||loading)?0.4:1}}>{loading?'…':'→'}</Btn>
        </div>
      </div>
    </div>
  )
}

function Tasks({ fr, actions, doneTasks }) {
  return (
    <>
      <Hl color="blue"><strong style={{color:'var(--blue)'}}>Setup first, then learn.</strong> Complete the setup tasks before 16 July. PR question tasks run through Week 10.</Hl>
      <Grid cols={2}>
        <StatCard label="Tasks Done"   value={doneTasks}                                        sub={`of ${FRENCH_TASKS.length} total`} color="var(--blue)" />
        <StatCard label="Completion"   value={Math.round((doneTasks/FRENCH_TASKS.length)*100)+'%'} sub="to exam ready" />
      </Grid>
      <SLabel>All Tasks</SLabel>
      <Card>{FRENCH_TASKS.map(t=><TaskItem key={t.id} title={t.title} done={!!(fr.tasks||{})[t.id]} onToggle={()=>actions.toggleFrenchTask(t.id)} tags={t.tags}/>)}</Card>
    </>
  )
}

function SessionLog({ fr }) {
  const sessions = fr.sessions||[]
  return (
    <>
      <SLabel mt={0}>Sessions by Mode</SLabel>
      <Grid cols={5}>
        {FRENCH_MODES.map(m=>{
          const count = sessions.filter(s=>s.mode===m.id).length
          const last  = sessions.filter(s=>s.mode==='mock'&&s.score).slice(-1)[0]?.score
          return <StatCard key={m.id} label={m.label} value={count} sub={m.id==='mock'&&last?`Last: ${last}/20`:'sessions'} color={m.color}/>
        })}
      </Grid>
      <SLabel>Recent Sessions</SLabel>
      <Card>
        {sessions.length===0
          ?<Note>No sessions yet — go to AI Coach tab and start your first session.</Note>
          :sessions.slice().reverse().slice(0,20).map((s,i)=>(
            <div key={i} style={{display:'flex',gap:12,padding:'9px 0',borderBottom:i<19?'1px solid var(--border)':'none',alignItems:'center'}}>
              <div style={{fontSize:15,flexShrink:0}}>{FRENCH_MODES.find(m=>m.id===s.mode)?.icon||'📚'}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:'var(--text)',textTransform:'uppercase',letterSpacing:'0.06em'}}>{s.mode}</div>
                <div style={{fontSize:11,color:'var(--muted)'}}>{s.messages} messages · {s.ts?new Date(s.ts).toLocaleDateString('en-CA'):''}</div>
              </div>
              {s.score&&<Tag type="gold">{s.score}/20</Tag>}
            </div>
          ))
        }
      </Card>
    </>
  )
}

function Plan({ fr, actions }) {
  const planDays = fr.planDays||[]
  const phases = [
    {label:'Phase 1 — Foundation',    range:[1,28],  color:'var(--blue)',   ccolor:'blue',   desc:'Présent + passé composé + imparfait'},
    {label:'Phase 2 — Consolidation', range:[29,63], color:'var(--purple)', ccolor:'purple', desc:'Futur + conditionnel + PR questions'},
    {label:'Phase 3 — PR Readiness',  range:[64,90], color:'var(--amber)',  ccolor:'gold',   desc:'Daily mock interviews + TEF simulation'},
  ]
  return (
    <>
      <Hl color="blue"><strong style={{color:'var(--blue)'}}>Mark each day</strong> after completing your La Forêt class + at least one AI Coach session. Never leave two consecutive days empty.</Hl>
      <Grid cols={3}>
        <StatCard label="Days Done"    value={planDays.length}                          sub="of 90 total"   color="var(--blue)" />
        <StatCard label="Remaining"    value={90-planDays.length}                       sub="days to go"                        />
        <StatCard label="Completion"   value={Math.round((planDays.length/90)*100)+'%'} sub="of 90 days"                        />
      </Grid>
      {phases.map((ph,pi)=>{
        const [s,e] = ph.range
        const days  = Array.from({length:e-s+1},(_,i)=>s+i)
        const done  = days.filter(d=>planDays.includes(d)).length
        return (
          <div key={pi} style={{marginBottom:22}}>
            <SLabel>{ph.label}</SLabel>
            <div style={{fontSize:11,color:'var(--muted)',marginBottom:8}}>{ph.desc} · {done}/{days.length} days</div>
            <PBar pct={Math.round((done/days.length)*100)} color={ph.ccolor}/>
            <div style={{display:'flex',flexWrap:'wrap',gap:5,marginTop:10}}>
              {days.map(d=>{
                const isDone = planDays.includes(d)
                return (
                  <button key={d} onClick={()=>actions.toggleFrenchDay(d)} title={`Day ${d}`} style={{
                    width:28,height:28,borderRadius:5,fontSize:9,fontWeight:700,cursor:'pointer',transition:'all 0.15s',fontFamily:'inherit',
                    border:`1.5px solid ${isDone?ph.color:'var(--border)'}`,
                    background:isDone?ph.color:'var(--surface2)',
                    color:isDone?(ph.color==='var(--amber)'?'#000':'#fff'):'var(--muted)',
                  }}>{d}</button>
                )
              })}
            </div>
          </div>
        )
      })}
      <SLabel>Fallback Protocol — Bad Days</SLabel>
      <Card>
        <div style={{fontSize:12,color:'var(--muted)',lineHeight:1.8}}>
          <strong style={{color:'var(--amber)'}}>15 minutes, then mark the day done:</strong><br/>
          <span style={{color:'var(--text)'}}>1. Anki reviews only [5 min] &nbsp;·&nbsp; 2. French podcast passively [5 min] &nbsp;·&nbsp; 3. Say 5 French sentences out loud [5 min]</span>
        </div>
      </Card>
    </>
  )
}
