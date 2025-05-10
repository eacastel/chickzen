'use client'

const navLinks = [
  { name: 'What We Do', href: '#what-we-do' },
  { name: 'Tell Us More', href: '#tell-us-more' },
  { name: 'You’re Intrigued', href: '#youre-intrigued' },
]

export default function Header() {
  return (
    <header className="w-full py-2 px-4 border-b border-gray-200 flex justify-between items-center text-sm">
      <div className="font-serif text-lg tracking-tight">chickzen™</div>
      <nav className="space-x-4">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="hover:underline">
            {link.name}
          </a>
        ))}
      </nav>
    </header>
  )
}
