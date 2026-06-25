import React from 'react'

export default function Layout({ workspace, setWorkspace, streak, saveStatus, children }) {
  const statusColor = saveStatus==='saved'?'var(--green)':saveStatus==='saving'?'var(--amber)':'var(--red)'
  const statusLabel = saveStatus==='saved'?'● synced':saveStatus==='saving'?'◌ saving…':'○ offline'
  return (
    <>
      <div style={{background:'var(--black)',borderBottom:'1px solid var(--border)',padding:'0 24px',position:'sticky',top:0,zIndex:200}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 0 0'}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:38,height:38,background:'linear-gradient(135deg,var(--gold-dim),var(--gold))',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'"DM Serif Display",serif',fontSize:20,color:'#000',fontWeight:900}}>S</div>
            <div>
              <div style={{fontFamily:'"DM Serif Display",serif',fontSize:18,color:'var(--white)'}}>Sajja — Command Center</div>
              <div style={{fontSize:11,color:'var(--muted)',fontFamily:'"JetBrains Mono",monospace'}}>autoshiftops.com · seoulandglow.com · MBA</div>
            </div>
          </div>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <Bdg color="var(--gold)">🔥 {streak}d streak</Bdg>
            <Bdg color={statusColor}>{statusLabel}</Bdg>
          </div>
        </div>
        <div style={{display:'flex',gap:4,paddingTop:12}}>
          <SwBtn label="⚡ EB-1A Tracker" active={workspace==='eb1a'} color="var(--purple)" onClick={()=>setWorkspace('eb1a')}/>
          <SwBtn label="✦ DM Mastery" active={workspace==='dm'} color="var(--gold)" onClick={()=>setWorkspace('dm')}/>
        </div>
      </div>
      {children}
    </>
  )
}

const Bdg = ({color,children})=><div style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:20,padding:'5px 12px',fontSize:11,fontFamily:'"JetBrains Mono",monospace',color,display:'flex',alignItems:'center',gap:5}}>{children}</div>
const SwBtn = ({label,active,color,onClick})=><button onClick={onClick} style={{padding:'8px 18px',borderRadius:'8px 8px 0 0',fontSize:12,fontWeight:600,cursor:'pointer',color:active?color:'var(--muted)',background:active?'var(--surface)':'transparent',border:active?'1px solid var(--border)':'1px solid transparent',borderBottom:active?'1px solid var(--surface)':'none',letterSpacing:'0.04em',textTransform:'uppercase',position:'relative',bottom:-1}}>{label}</button>
