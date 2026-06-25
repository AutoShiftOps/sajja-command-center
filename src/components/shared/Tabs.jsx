import React from 'react'
export default function Tabs({ tabs, active, onSelect, accentColor }) {
  return (
    <div style={{display:'flex',borderBottom:'1px solid var(--border)',padding:'0 24px',background:'var(--surface)',overflowX:'auto'}}>
      {tabs.map((t,i)=>(
        <button key={i} onClick={()=>onSelect(t.id)} style={{padding:'13px 18px',fontSize:11,fontWeight:600,color:active===t.id?accentColor:'var(--muted)',background:'transparent',border:'none',borderBottom:active===t.id?`2px solid ${accentColor}`:'2px solid transparent',whiteSpace:'nowrap',cursor:'pointer',letterSpacing:'0.06em',textTransform:'uppercase',transition:'all 0.2s'}}>
          {t.label}
        </button>
      ))}
    </div>
  )
}
