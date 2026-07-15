import React from 'react'

const STATUS = {
  loading:        { color: 'var(--muted)',  icon: '◌', text: 'Connecting…'       },
  saving:         { color: 'var(--amber)',  icon: '◌', text: 'Saving…'            },
  connected:      { color: 'var(--green)',  icon: '●', text: 'Supabase connected' },
  not_configured: { color: 'var(--red)',    icon: '✕', text: 'Supabase not set up — add credentials' },
  unreachable:    { color: 'var(--red)',    icon: '✕', text: 'Supabase unreachable — check project'  },
}

export default function Layout({ workspace, setWorkspace, streak, dbStatus, dbMessage, children }) {
  const s    = STATUS[dbStatus] || STATUS.loading
  const isOk = dbStatus === 'connected' || dbStatus === 'saving' || dbStatus === 'loading'

  return (
    <>
      {/* ── Top bar ── */}
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
            <div style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:20,padding:'5px 12px',fontSize:11,fontFamily:'"JetBrains Mono",monospace',color:'var(--gold)',display:'flex',alignItems:'center',gap:5}}>
              🔥 {streak||0}d
            </div>
            <div
              title={dbMessage || s.text}
              style={{background:'var(--surface2)',border:`1px solid ${isOk?'var(--border)':'var(--red)'}`,borderRadius:20,padding:'5px 14px',fontSize:11,fontFamily:'"JetBrains Mono",monospace',color:s.color,display:'flex',alignItems:'center',gap:6,cursor:'help'}}>
              {s.icon} {s.text}
            </div>
          </div>
        </div>
        <div style={{display:'flex',gap:4,paddingTop:12}}>
          <SwBtn label="⚡ EB-1A Tracker" active={workspace==='eb1a'}   color="var(--purple)" onClick={()=>setWorkspace('eb1a')}/>
          <SwBtn label="✦ DM Mastery"     active={workspace==='dm'}     color="var(--gold)"   onClick={()=>setWorkspace('dm')}/>
          <SwBtn label="🇫🇷 French Coach"  active={workspace==='french'} color="var(--blue)"   onClick={()=>setWorkspace('french')}/>
        </div>
      </div>

      {/* ── Supabase error banner ── */}
      {!isOk && (
        <div style={{background:'rgba(224,90,90,0.08)',borderBottom:'1px solid rgba(224,90,90,0.3)',padding:'12px 24px',display:'flex',alignItems:'flex-start',gap:14}}>
          <span style={{fontSize:18,flexShrink:0}}>⚠️</span>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:'var(--red)',marginBottom:4}}>
              {dbStatus === 'not_configured'
                ? 'Supabase credentials not configured'
                : 'Supabase is unreachable'}
            </div>
            <div style={{fontSize:12,color:'var(--muted)',lineHeight:1.6}}>
              {dbStatus === 'not_configured'
                ? <>Add <code style={{color:'var(--gold)',background:'var(--surface3)',padding:'1px 6px',borderRadius:4}}>VITE_SUPABASE_URL</code> and <code style={{color:'var(--gold)',background:'var(--surface3)',padding:'1px 6px',borderRadius:4}}>VITE_SUPABASE_ANON_KEY</code> to your <code style={{color:'var(--gold)',background:'var(--surface3)',padding:'1px 6px',borderRadius:4}}>.env</code> file, then restart the dev server.</>
                : <>Could not reach your Supabase project. Check that the project is active at <strong style={{color:'var(--white)'}}>supabase.com/dashboard</strong> and that your credentials are correct. Your data is not being saved until this is resolved. {dbMessage && <span style={{color:'var(--muted)'}}>({dbMessage})</span>}</>
              }
            </div>
          </div>
        </div>
      )}

      {children}
    </>
  )
}

const SwBtn = ({label,active,color,onClick}) => (
  <button onClick={onClick} style={{padding:'8px 18px',borderRadius:'8px 8px 0 0',fontSize:12,fontWeight:600,cursor:'pointer',color:active?color:'var(--muted)',background:active?'var(--surface)':'transparent',border:active?'1px solid var(--border)':'1px solid transparent',borderBottom:active?'1px solid var(--surface)':'none',letterSpacing:'0.04em',textTransform:'uppercase',position:'relative',bottom:-1,transition:'all 0.15s'}}>
    {label}
  </button>
)
