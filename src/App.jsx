import React from 'react'
import Layout from './components/shared/Layout'
import EB1AWorkspace from './components/eb1a/EB1AWorkspace'
import DMWorkspace from './components/dm/DMWorkspace'
import FrenchWorkspace from './components/french/FrenchWorkspace'
import { useStore } from './hooks/useStore'

export default function App() {
  const { state, dbStatus, dbMessage, setWorkspace, ...actions } = useStore()

  return (
    <Layout
      workspace={state.workspace}
      setWorkspace={setWorkspace}
      streak={state.streak}
      dbStatus={dbStatus}
      dbMessage={dbMessage}
    >
      {state.workspace === 'eb1a'   && <EB1AWorkspace   state={state} actions={actions} />}
      {state.workspace === 'dm'     && <DMWorkspace     state={state} actions={actions} />}
      {state.workspace === 'french' && <FrenchWorkspace state={state} actions={actions} />}
    </Layout>
  )
}
