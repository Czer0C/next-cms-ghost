import { GetStaticProps, GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router'
import fs from 'fs'

import { Layout } from '@components/Layout'
import { PostView } from '@components/PostView'
import { HeaderIndex } from '@components/HeaderIndex'
import { StickyNavContainer } from '@effects/StickyNavContainer'
import { SEO } from '@meta/seo'

import { processEnv } from '@lib/processEnv'
import { getAllPosts, getAllSettings, getAllTags, GhostPostOrPage, GhostPostsOrPages, GhostSettings, GhostTag, GhostTags } from '@lib/ghost'
import { seoImage, ISeoImage } from '@meta/seoImage'
import { generateRSSFeed } from '@utils/rss'

import { BodyClass } from '@helpers/BodyClass'


/**
 * Main index page (home page)
 *
 * Loads all posts from CMS
 *
 */

interface CmsData {
  posts: GhostPostsOrPages
  tags: GhostTags
  settings: GhostSettings
  seoImage: ISeoImage
  previewPosts?: GhostPostsOrPages
  prevPost?: GhostPostOrPage
  nextPost?: GhostPostOrPage
  bodyClass: string
}

interface IndexProps {
  cmsData: CmsData
}

export default function Tags({ cmsData }: IndexProps) {
  const router = useRouter()
  if (router.isFallback) return <div>Loading...</div>
  const { settings, posts, tags, seoImage, bodyClass } = cmsData
  return (
    <>
      <SEO {...{ settings, seoImage }} />
      <StickyNavContainer
        throttle={300}
        activeClass="fixed-nav-active"
        render={(sticky) => (
          <Layout {...{ bodyClass, sticky, settings }} header={<HeaderIndex {...{ settings }} />}>
            <div className="l-content">
                <div className="l-wrapper" data-aos="fade-up" data-aos-delay="300">
                <div className="l-tags-container">
                    {
                        tags.length > 0 ? tags.map(t => (
                            <div className="m-tag-card">
                        <a href={t.url} className={`m-tag-card__link ${!t.feature_image ? 'no-picture' : null}`} aria-label={t.name}>
                            {
                                t.feature_image ?
                                <img className="m-tag-card__picture" src={t.feature_image} loading="lazy" alt=""/> :
                                null
                            }
                            
                            <div className={`m-tag-card__info ${!t.feature_image ? 'no-picture' : null}`}>
                            <h4 className="m-tag-card__name">{t.name}</h4>
                            <span className="m-tag-card__counter">
                                {t.count.posts === 0 ? 'No posts' : t.count.post === 1 ? '1 post' : `${t.count.posts} posts`}
                            </span>
                            </div>
                        </a>
                        </div>)) :
                        <p className="m-not-found">
                            No tags found.
                        </p>
                        
                    }
                </div>
                </div></div>
          </Layout>
        )}
      />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  let settings
  let posts: GhostPostsOrPages | []
  let tags: GhostTags | []

  try {
    settings = await getAllSettings()
    posts = await getAllPosts()
    tags = await getAllTags()
  } catch (error) {
    throw new Error('Index creation failed.')
  }

  if (settings.processEnv.rssFeed) {
    const rss = generateRSSFeed({ posts, settings })
    fs.writeFileSync('./public/rss.xml', rss)
  }

  const cmsData = {
    settings,
    posts,
    tags,
    seoImage: await seoImage({ siteUrl: settings.processEnv.siteUrl }),
    bodyClass: BodyClass({ isHome: true })
  }

  return {
    props: {
      cmsData,
    },
    ...processEnv.isr.enable && { revalidate: 1 }, // re-generate at most once every second
  }
}
