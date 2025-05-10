import Link from 'next/link'
import { getMenuByName } from '@/lib/contentful'
import type { MenuEntry, MenuItemEntry } from '@/types/contentful'

type Props = {
  menuName: string
  className?: string
}

export default async function Menu({ menuName, className = '' }: Props) {
  const menu = (await getMenuByName(menuName)) as MenuEntry

  const items = Array.isArray(menu?.fields?.menuItems)
    ? (menu.fields.menuItems as MenuItemEntry[])
    : []

  return (
    <nav className={className}>
      {items.map((item) => (
        <Link
          key={item.sys.id}
          href={item.fields.href}
          className="hover:underline"
        >
          {String(item.fields.title)}
        </Link>
      ))}
    </nav>
  )
}
