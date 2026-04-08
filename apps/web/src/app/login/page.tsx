import { Suspense } from 'react'
import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  )
}

function LoginSkeleton() {
  return (
    <div className="mx-auto max-w-sm px-6 py-28">
      <div className="h-8 w-32 mx-auto bg-bg-elevated mb-10" />
      <div className="space-y-5">
        <div className="h-11 bg-bg-elevated border border-border" />
        <div className="h-11 bg-bg-elevated border border-border" />
        <div className="h-11 bg-bg-elevated border border-border" />
      </div>
    </div>
  )
}
