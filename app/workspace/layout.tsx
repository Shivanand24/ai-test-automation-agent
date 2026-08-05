import React from 'react'
import WorkspaceHeader from '@/components/custom/WorkspaceHeader'

function WorkspaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ minHeight: '100vh', background: '#09090b' }}>
            <WorkspaceHeader />
            {children}
        </div>
    )
}

export default WorkspaceLayout
