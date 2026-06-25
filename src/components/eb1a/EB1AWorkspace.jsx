import React, { useState } from 'react'
import Tabs from '../shared/Tabs'
import { Card, Hl, SLabel, Formula, Note, PBar, Tag, Btn, Grid, StatCard, TaskItem } from '../shared/UI'
import { EB1A_CRITERIA, EB1A_TASKS } from '../../data/eb1a'

const TABS = [
  {id:'overview',label:'Overview'},{id:'criteria',label:'5 Criteria'},
  {id:'tasks',label:'Tasks'},{id:'evidence',label:'Evidence Log'},{id:'deploy',label:'Deploy Guide'},
]

export default function EB1AWorkspace({ state, actions }) {
  const [tab, setTab] = useState('overview')
  const doneTasks = EB1A_TASKS.filter(t=>state.eb1a.tasks[t.id]).length
  const pct = Math.round((doneTasks/EB1A_TASKS.length)*100)
  const evCount = (state.eb1a.evidence||[]).length

  return (
    <div>
      <Tabs tabs={TABS} active={tab} onSelect={setTab} accentColor="var(--purple)"/>
      <div style={{padding:24,background:'var(--surface)',minHeight:'calc(100vh - 120px)'}}>
        {tab==='overview' && <Overview pct={pct} doneTasks={doneTasks} evCount={evCount}/>}
        {tab==='criteria' && <Criteria/>}
        {tab==='tasks' && <Tasks state={state} actions={actions} doneTasks={doneTasks}/>}
        {tab==='evidence' && <Evidence state={state} actions={actions} evCount={evCount}/>}
        {tab==='deploy' && <Deploy/>}
      </div>
    </div>
  )
}

function Overview({pct,doneTasks,evCount}) {
  return (
    <>
      <Hl color="purple"><strong style={{color:'var(--purple)'}}>Target:</strong> EB-1A Extraordinary Ability visa — 5 criteria strategy. You need 3 of 10. You are targeting 5 to build an unassailable case.</Hl>
      <Grid cols={4}>
        <StatCard label="Criteria Targeted" value="5" sub="of 10 total" color="var(--purple)"/>
        <StatCard label="Evidence Logged" value={evCount} sub="items documented"/>
        <StatCard label="Tasks Done" value={doneTasks} sub={`of ${EB1A_TASKS.length} total`}/>
        <StatCard label="Progress" value={pct+'%'} sub="to submission ready" color="var(--purple)"/>
      </Grid>
      <SLabel>5 Criteria at a Glance</SLabel>
      <Card>
        {EB1A_CRITERIA.map((c,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:i<EB1A_CRITERIA.length-1?'1px solid var(--border)':'none'}}>
            <div style={{flex:1,fontSize:13,fontWeight:500,color:'var(--white)'}}>{c.name}</div>
            <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:11,color:'var(--purple)',width:36,textAlign:'right'}}>{c.progress}%</div>
            <div style={{width:100,height:4,background:'var(--surface3)',borderRadius:2,overflow:'hidden'}}>
              <div style={{width:`${c.progress}%`,height:'100%',background:'linear-gradient(90deg,#6b50b8,var(--purple))',borderRadius:2}}></div>
            </div>
          </div>
        ))}
      </Card>
      <SLabel>Your EB-1A Assets</SLabel>
      <Grid cols={3}>
        {[
          {label:'autoshiftops.com',desc:'60+ technical articles on AI-powered DevOps',crit:'Original Contribution'},
          {label:'querytuner.com',desc:'AI-powered SQL diagnostics — Python, HuggingFace, React',crit:'Critical Role + Original Contribution'},
          {label:'incopilot CLI',desc:'Open-source CLI on GitHub',crit:'Original Contribution'},
          {label:'LinkedIn Authority',desc:'1,700+ impressions — repositioned headline and About',crit:'Judging + Published Material'},
          {label:'CFP Submissions',desc:'DevOpsDays Rockies 2026, Conf42',crit:'Published Material'},
          {label:'Hackathon Judge Apps',desc:'Hackonomics 2026, DeveloperWeek NY',crit:'Judging'},
        ].map((a,i)=>(
          <Card key={i}>
            <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--muted)',marginBottom:8}}>{a.label}</div>
            <div style={{fontSize:13,color:'var(--text)',marginBottom:6}}>{a.desc}</div>
            <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:10,color:'var(--purple)'}}>{a.crit}</div>
          </Card>
        ))}
      </Grid>
    </>
  )
}

function Criteria() {
  const [open,setOpen] = useState(null)
  return (
    <>
      <SLabel mt={0}>Your 5 Targeted Criteria</SLabel>
      {EB1A_CRITERIA.map((c,i)=>(
        <div key={i} onClick={()=>setOpen(open===i?null:i)} style={{background:'var(--surface2)',border:`1px solid ${open===i?'var(--purple)':'var(--border)'}`,borderRadius:12,padding:18,marginBottom:12,cursor:'pointer',transition:'border-color 0.2s'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{fontWeight:600,color:'var(--white)',fontSize:14}}>{c.name}</div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontFamily:'"JetBrains Mono",monospace',fontSize:12,color:'var(--purple)'}}>{c.progress}%</span>
              <span style={{color:'var(--muted)',fontSize:11,transition:'transform 0.2s',display:'inline-block',transform:open===i?'rotate(180deg)':'rotate(0deg)'}}>▼</span>
            </div>
          </div>
          <PBar pct={c.progress} color="purple"/>
          {open===i&&(
            <div style={{marginTop:14}}>
              <p style={{fontSize:12,color:'var(--muted)',marginBottom:10,lineHeight:1.6}}>{c.desc}</p>
              <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--muted)',marginBottom:6}}>Evidence to Gather</div>
              <Note>{c.evidenceHint}</Note>
              <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'var(--muted)',margin:'10px 0 6px'}}>Next Action</div>
              <Formula color="purple">{c.next}</Formula>
            </div>
          )}
        </div>
      ))}
    </>
  )
}

function Tasks({state,actions,doneTasks}) {
  return (
    <>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <SLabel mt={0}>EB-1A Action Tasks ({doneTasks}/{EB1A_TASKS.length})</SLabel>
        <Btn variant="outline" onClick={actions.resetEB1ATasks} style={{fontSize:11,padding:'5px 10px'}}>Reset</Btn>
      </div>
      <Card>
        {EB1A_TASKS.map(t=>(
          <TaskItem key={t.id} title={t.title} done={!!state.eb1a.tasks[t.id]} onToggle={()=>actions.toggleEB1ATask(t.id)}
            tags={[{label:t.crit,type:'purple'},{label:t.priority==='high'?'🔴 High':'🟡 Med',type:t.priority==='high'?'high':'med'}]}/>
        ))}
      </Card>
    </>
  )
}

function Evidence({state,actions,evCount}) {
  const [title,setTitle] = useState('')
  const [crit,setCrit] = useState('')
  const handleAdd = () => {
    if(!title.trim()||!crit){alert('Fill in both fields.');return}
    actions.addEvidence({title:title.trim(),crit,date:new Date().toISOString().slice(0,10)})
    setTitle('');setCrit('')
  }
  return (
    <>
      <Hl color="purple"><strong style={{color:'var(--purple)'}}>Every piece of evidence needs to be logged here.</strong> USCIS wants documented proof. Log it as you create it — don't try to reconstruct later.</Hl>
      <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Evidence title / description" style={{flex:1,background:'var(--surface3)',border:'1px solid var(--border)',borderRadius:8,padding:'9px 12px',color:'var(--white)',fontSize:13,outline:'none',minWidth:200}}/>
        <select value={crit} onChange={e=>setCrit(e.target.value)} style={{background:'var(--surface3)',border:'1px solid var(--border)',borderRadius:8,padding:'9px 12px',color:crit?'var(--white)':'var(--muted)',fontSize:13,outline:'none',cursor:'pointer'}}>
          <option value="">Select Criterion</option>
          <option value="judging">Judging</option>
          <option value="original">Original Contribution</option>
          <option value="published">Published Material</option>
          <option value="critical">Critical Role</option>
          <option value="salary">High Salary</option>
        </select>
        <Btn variant="purple" onClick={handleAdd}>+ Add Evidence</Btn>
      </div>
      {evCount===0
        ? <div style={{textAlign:'center',padding:'40px 20px',color:'var(--muted)'}}>📁<br/>No evidence logged yet. Add your first item above.</div>
        : (state.eb1a.evidence||[]).map((e,i)=>(
          <Card key={i} style={{marginBottom:10,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:'var(--white)',fontWeight:500,marginBottom:4}}>{e.title}</div>
              <div style={{display:'flex',gap:6}}><Tag type="purple">{e.crit}</Tag><Tag>{e.date}</Tag></div>
            </div>
            <button onClick={()=>actions.deleteEvidence(i)} style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:18,padding:4}}>×</button>
          </Card>
        ))
      }
    </>
  )
}

function Deploy() {
  const [copied,setCopied] = useState(false)
  const copy = () => { navigator.clipboard.writeText('https://autoshiftops.com/tracker'); setCopied(true); setTimeout(()=>setCopied(false),2000) }
  return (
    <>
      <Hl color="purple"><strong style={{color:'var(--purple)'}}>Deployment Guide</strong> — this React app deploys to Vercel in under 5 minutes. Once live, link it from autoshiftops.com as a hidden portfolio page.</Hl>
      <SLabel mt={0}>Step-by-step: GitHub → Vercel</SLabel>
      {[
        {n:1,t:'Create Supabase table',d:'Go to your new Supabase project → SQL Editor → paste the SQL from src/lib/supabase.js comments → Run'},
        {n:2,t:'Add environment variables',d:'Copy .env.example to .env → paste your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from Supabase Settings → API'},
        {n:3,t:'Push to GitHub',d:'git init → git add . → git commit -m "init" → create repo on GitHub → git remote add origin [url] → git push'},
        {n:4,t:'Connect to Vercel',d:'vercel.com → New Project → Import from GitHub → select sajja-command-center repo → Deploy'},
        {n:5,t:'Add env vars to Vercel',d:'Vercel project → Settings → Environment Variables → add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'},
        {n:6,t:'Add hidden link on autoshiftops.com',d:'Add a subtle footer link or /tracker page. Only you need to know it exists.'},
      ].map(s=>(
        <Card key={s.n} style={{marginBottom:12,display:'flex',gap:14,alignItems:'flex-start'}}>
          <div style={{width:30,height:30,background:'var(--surface3)',border:'1px solid var(--border)',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'"JetBrains Mono",monospace',fontSize:12,color:'var(--purple)',flexShrink:0}}>{s.n}</div>
          <div><div style={{fontWeight:600,color:'var(--white)',fontSize:13,marginBottom:3}}>{s.t}</div><div style={{fontSize:12,color:'var(--muted)',lineHeight:1.5}}>{s.d}</div></div>
        </Card>
      ))}
      <SLabel>Your Tracker URL (once deployed)</SLabel>
      <div style={{background:'var(--surface3)',border:'1px solid var(--border)',borderRadius:8,padding:'12px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
        <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:12,color:'var(--gold)'}}>https://autoshiftops.com/tracker</div>
        <button onClick={copy} style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:6,padding:'5px 10px',color:copied?'var(--green)':'var(--text)',fontSize:11,cursor:'pointer'}}>{copied?'Copied!':'Copy URL'}</button>
      </div>
      <SLabel>Supabase Table SQL</SLabel>
      <div style={{background:'var(--surface3)',borderLeft:'3px solid var(--purple)',padding:'14px 16px',borderRadius:'0 8px 8px 0',fontFamily:'"JetBrains Mono",monospace',fontSize:11,color:'#c8b8f5',lineHeight:1.8,overflowX:'auto'}}>
        {`CREATE TABLE command_center (
  id TEXT PRIMARY KEY DEFAULT 'sajja_singleton',
  eb1a_tasks JSONB DEFAULT '{}'::jsonb,
  eb1a_evidence JSONB DEFAULT '[]'::jsonb,
  dm_tasks JSONB DEFAULT '{}'::jsonb,
  dm_mod_prog JSONB DEFAULT '{}'::jsonb,
  dm_metrics JSONB DEFAULT '[]'::jsonb,
  streak INTEGER DEFAULT 0,
  last_visit TEXT,
  workspace TEXT DEFAULT 'eb1a',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO command_center (id)
VALUES ('sajja_singleton')
ON CONFLICT (id) DO NOTHING;`}
      </div>
    </>
  )
}
