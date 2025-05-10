'use client'

import Image from 'next/image'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import type { Document } from '@contentful/rich-text-types'

type Props = {
  section: any
}

export default function SectionRenderer({ section }: Props) {
  const { title, byline, body, image } = section.fields

  // Generate ID for anchor links
  const anchorId = title?.toLowerCase().replace(/\s+/g, '-')

  return (
    <section
      id={anchorId}
      className="py-20 px-4 bg-background text-foreground text-center scroll-mt-16"
    >
      <div className="max-w-3xl mx-auto">
        {title && (
          <h2 className="text-[2rem] font-serif tracking-tight mb-1">{title}</h2>
        )}
        {byline && (
          <p className="text-sm text-gray-600 italic font-serif mb-6">
            {byline}
          </p>
        )}
        {body && (
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto text-justify">
            {documentToReactComponents(body as Document)}
          </div>
        )}
        {image?.fields?.file?.url && (
          <div className="relative w-full h-64 mt-10 rounded overflow-hidden">
            <Image
              src={`https:${image.fields.file.url}`}
              alt={image.fields.title || 'Section image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}
      </div>
    </section>
  )
}
