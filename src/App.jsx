import React from 'react'
import Layout from './components/shared/Layout'
import EB1AWorkspace from './components/eb1a/EB1AWorkspace'
import DMWorkspace from './components/dm/DMWorkspace'
import { useStore } from './hooks/useStore'

export default function App() {
  const store = useStore()
  const { state, saveStatus, setWorkspace, ...actions } = store

  return (
    <Layout workspace={state.workspace} setWorkspace={setWorkspace} streak={state.streak} saveStatus={saveStatus}>
      {state.workspace === 'eb1a'
        ? <EB1AWorkspace state={state} actions={actions}/>
        : <DMWorkspace state={state} actions={actions}/>
      }
    </Layout>
  )
}
