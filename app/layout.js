import './globals.css'

export const metadata = {
  title: 'Dandi - API Key Management',
  description: 'Manage and validate your API keys',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
