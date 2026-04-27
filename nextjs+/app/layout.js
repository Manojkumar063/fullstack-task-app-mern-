import './globals.css'

export const metadata = {
  title: 'Auth App',
  description: 'Authentication with Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
