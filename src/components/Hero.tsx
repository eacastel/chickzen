import { getHero } from '@/lib/contentful'
import type { HeroEntry } from '@/types/contentful'
import type { Asset } from 'contentful'
import Image from 'next/image'

export default async function Hero() {
  const hero = (await getHero()) as HeroEntry

  const title = String(hero.fields.title)
  const byline = String(hero.fields.byline)
  const image = hero.fields.image

  const isAsset = (img: unknown): img is Asset =>
    typeof img === 'object' &&
    img !== null &&
    'fields' in img &&
    'file' in (img as Asset).fields

  const imageUrl =
    isAsset(image) && image.fields.file?.url
      ? `https:${image.fields.file.url}`
      : ''

  const imageAlt: string = isAsset(image)
    ? String(image.fields.title ?? 'Hero image')
    : 'Hero image'

  return (
    <section className= "text-center py-20" >
    { imageUrl && (
      <div className="relative w-full h-64 md:h-96 mb-8" >
        <Image
            src={ imageUrl }
  alt = { imageAlt }
  fill
  className = "object-cover"
  priority
    />
    </div>
      )
}
<h1 className="text-5xl font-serif tracking-tight" > { title } </h1>
  < p className = "mt-4 text-lg font-serif italic" > { byline } </p>
    </section>
  )
}
