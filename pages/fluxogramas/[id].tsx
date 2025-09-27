import React from 'react'
import { useRouter } from 'next/router'
import { FlowchartProvider } from '@/contexts/FlowchartContext'
import FlowchartEditor from '@/components/flowchart/Editor/FlowchartEditor'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function FlowchartEditorPage() {
  const router = useRouter()
  const { id } = router.query

  return (
    <ProtectedRoute>
      <FlowchartProvider>
        <div className="h-screen w-full">
          <FlowchartEditor />
        </div>
      </FlowchartProvider>
    </ProtectedRoute>
  )
}
