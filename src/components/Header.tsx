import Menu from './Menu'

export default function Header() {
  return (
    <header className="py-4 px-6 flex justify-between items-center border-b bg-white text-black">
      <div className="font-serif text-lg">chickzen™</div>
      <Menu menuName="Main Navigation" className="space-x-4 text-sm" />
    </header>
  )
}
