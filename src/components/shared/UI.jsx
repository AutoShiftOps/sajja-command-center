import React from 'react'
export const Card = ({children,style={}})=><div style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:12,padding:18,...style}}>{children}</div>
export const Hl = ({children,color='gold'})=>{
  const bg=color==='purple'?'rgba(155,127,232,0.07)':'rgba(201,168,76,0.07)'
  const bc=color==='purple'?'rgba(155,127,232,0.2)':'rgba(201,168,76,0.2)'
  return <div style={{borderRadius:10,padding:'14px 18px',marginBottom:18,fontSize:13,lineHeight:1.6,background:bg,border:`1px solid ${bc}`,color:'var(--text)'}}>{children}</div>
}
export const SLabel = ({children,mt=22})=><div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--muted)',margin:`${mt}px 0 10px`}}>{children}</div>
export const Formula = ({children,color='gold'})=><div style={{background:'var(--surface3)',borderLeft:`3px solid ${color==='purple'?'var(--purple)':'var(--gold)'}`,padding:'12px 16px',borderRadius:'0 8px 8px 0',fontFamily:'"JetBrains Mono",monospace',fontSize:12,color:color==='purple'?'#c8b8f5':'var(--gold-light)',margin:'10px 0'}}>{children}</div>
export const Note = ({children})=><div style={{fontSize:12,color:'var(--muted)',padding:'8px 12px',background:'var(--surface3)',borderRadius:6,marginTop:8,lineHeight:1.5}}>{children}</div>
export const PBar = ({pct,color='gold'})=><div style={{height:3,background:'var(--surface3)',borderRadius:2,marginTop:10,overflow:'hidden'}}><div style={{width:`${pct}%`,height:'100%',background:color==='purple'?'linear-gradient(90deg,#6b50b8,var(--purple))':'linear-gradient(90deg,var(--gold-dim),var(--gold))',borderRadius:2,transition:'width 0.5s'}}></div></div>
export const Tag = ({children,type='default'})=>{
  const styles={default:{background:'var(--surface3)',color:'var(--muted)'},high:{background:'rgba(224,90,90,0.1)',color:'var(--red)'},med:{background:'rgba(232,160,32,0.1)',color:'var(--amber)'},gold:{background:'rgba(201,168,76,0.1)',color:'var(--gold)'},purple:{background:'rgba(155,127,232,0.1)',color:'var(--purple)'}}
  return <span style={{fontSize:10,fontFamily:'"JetBrains Mono",monospace',padding:'2px 7px',borderRadius:10,...(styles[type]||styles.default)}}>{children}</span>
}
export const Btn = ({children,onClick,variant='gold',style={}})=>{
  const base={padding:'10px 18px',borderRadius:8,fontSize:13,fontWeight:500,cursor:'pointer',border:'none',transition:'all 0.2s',...style}
  const variants={gold:{background:'linear-gradient(135deg,var(--gold-dim),var(--gold))',color:'#000'},purple:{background:'linear-gradient(135deg,#5b3fb0,var(--purple))',color:'#fff'},outline:{background:'transparent',border:'1px solid var(--border)',color:'var(--text)'}}
  return <button onClick={onClick} style={{...base,...(variants[variant]||variants.gold)}}>{children}</button>
}
export const Grid = ({cols=2,children})=><div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:14}}>{children}</div>
export const StatCard = ({label,value,sub,color})=>(
  <div style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:12,padding:18}}>
    <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.09em',color:'var(--muted)',marginBottom:10}}>{label}</div>
    <div style={{fontFamily:'"DM Serif Display",serif',fontSize:28,color:color||'var(--white)',lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:'var(--muted)',marginTop:3}}>{sub}</div>}
  </div>
)
export const TaskItem = ({title,done,onToggle,tags=[]})=>(
  <div onClick={onToggle} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'13px 0',borderBottom:'1px solid var(--border)',cursor:'pointer'}}>
    <div style={{width:20,height:20,border:`2px solid ${done?'var(--green)':'var(--border)'}`,borderRadius:5,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1,background:done?'var(--green)':'transparent',transition:'all 0.2s'}}>
      {done&&<span style={{fontSize:11,color:'#fff',fontWeight:700}}>✓</span>}
    </div>
    <div style={{flex:1}}>
      <div style={{fontSize:13,color:done?'var(--muted)':'var(--text)',fontWeight:500,textDecoration:done?'line-through':'none'}}>{title}</div>
      {tags.length>0&&<div style={{display:'flex',gap:6,marginTop:4,flexWrap:'wrap'}}>{tags.map((t,i)=><Tag key={i} type={t.type}>{t.label}</Tag>)}</div>}
    </div>
  </div>
)
