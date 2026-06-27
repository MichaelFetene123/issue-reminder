import { Suspense } from 'react'
import IssueForm from '@/components/issue-form'

export default async function NewIssuePage() {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Create New Issue</h1>

      <div className="bg-white dark:bg-dark-elevated border border-gray-200 dark:border-dark-border-default rounded-lg shadow-sm p-6">
        <Suspense fallback={<div>Loading...</div>}>
          <IssueForm />
        </Suspense>
      </div>
    </div>
  )
}