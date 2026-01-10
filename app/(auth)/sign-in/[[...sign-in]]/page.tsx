import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <SignIn 
      appearance={{
        elements: {
          formButtonPrimary: 
            'bg-primary hover:bg-primary/90 text-primary-foreground text-sm normal-case',
          card: 'bg-card backdrop-blur-sm border border-border',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton: 
            'bg-muted hover:bg-muted/80 border-border text-foreground',
          formFieldLabel: 'text-foreground',
          formFieldInput: 
            'bg-muted border-border text-foreground placeholder:text-muted-foreground',
          footerActionLink: 'text-primary hover:text-primary/90',
        },
      }}
    />
  )
}
