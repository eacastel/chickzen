import Header from '@/components/Header'
import Hero from '@/components/Hero'
import SectionRenderer from '@/components/SectionRenderer'
import { getPage } from '@/lib/contentful'

export default async function HomePage() {
  const page = await getPage('home')
  const sections = page?.fields?.section
    ? Array.isArray(page.fields.section)
      ? page.fields.section
      : [page.fields.section]
    : []

  return (
    <>
      <Header />
      <Hero />
      <main>
        {sections.map((section: any, i: number) => (
          <SectionRenderer key={section.sys.id || i} section={section} />
        ))}
      </main>
    </>
  )
}
