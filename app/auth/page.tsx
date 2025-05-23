import { AuthForm } from "@/components/auth-form"

export default function AuthPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-center">BoxRec API Authentication</h1>
      <p className="text-center mb-8 text-muted-foreground">Authenticate with your BoxRec credentials to use the API</p>

      <AuthForm />

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          This authentication is required to access BoxRec data through the API. Your credentials are only used to
          establish a session with BoxRec.com.
        </p>
      </div>
    </div>
  )
}
