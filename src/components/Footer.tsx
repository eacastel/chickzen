import Menu from './Menu'

export default function Footer() {
  return (
    <footer className="bg-background text-foreground px-6 py-12 border-t">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-sm">
        {/* Left: Footer Menu */}
        <Menu menuName="Footer" className="space-y-2 text-left" />

        {/* Center: Logo */}
        <div className="flex justify-center font-serif text-xl">chickzen™</div>

        {/* Right: Contact Info */}
        <div className="text-right text-xs text-gray-600 space-y-1">
          <div>hello@chickzen.com</div>
          <div>Valencia, Spain</div>
          <div>© {new Date().getFullYear()} chickzen. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}
