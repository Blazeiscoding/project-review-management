import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <SignIn 
      appearance={{
        elements: {
          formButtonPrimary: 
            'bg-purple-600 hover:bg-purple-700 text-sm normal-case',
          card: 'bg-slate-800/50 backdrop-blur-sm border border-slate-700',
          headerTitle: 'text-white',
          headerSubtitle: 'text-slate-300',
          socialButtonsBlockButton: 
            'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white',
          formFieldLabel: 'text-slate-300',
          formFieldInput: 
            'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400',
          footerActionLink: 'text-purple-400 hover:text-purple-300',
        },
      }}
    />
  )
}
