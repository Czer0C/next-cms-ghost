import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

import { Layout } from '@components/Layout'
import { PostView } from '@components/PostView'
import { HeaderAuthor } from '@components/HeaderAuthor'

import { resolveUrl } from '@utils/routing'
import { SEO, authorSameAs } from '@meta/seo'

import { getAuthorBySlug, getAllAuthors, getAllSettings, getPostsByAuthor, GhostSettings, GhostPostOrPage, GhostPostsOrPages, GhostAuthor } from '@lib/ghost'
import { ISeoImage, seoImage } from '@meta/seoImage'
import { processEnv } from '@lib/processEnv'

import { BodyClass } from '@helpers/BodyClass'
import { HeaderIndex } from '../components/HeaderIndex';

/**
 * Author page (/author/:slug)
 *
 * Loads all posts for the requested author incl. pagination.
 *
 */
interface CmsData {
  author: GhostAuthor
  posts: GhostPostsOrPages
  seoImage: ISeoImage
  previewPosts?: GhostPostsOrPages
  prevPost?: GhostPostOrPage
  nextPost?: GhostPostOrPage
  settings: GhostSettings
  bodyClass: string
}

interface AuthorIndexProps {
  cmsData: CmsData
}

const AuthorIndex = ({ cmsData }: AuthorIndexProps) => {
  const router = useRouter()
  if (router.isFallback) return <div>Loading...</div>

  const { author, posts, settings, seoImage, bodyClass } = cmsData
  const { name, bio } = author
  const description = bio || undefined
  const sameAs = authorSameAs(author)

  return (
    <>
      <SEO {...{ settings, description, seoImage, sameAs, title: name }} />
      <Layout  {...{ settings, bodyClass }} header={<HeaderIndex {...{ settings }} />}>
      <div className="l-content">
                <div className="l-wrapper" data-aos="fade-up" data-aos-delay="300">
                <div className="l-tags-container">
                <>
          <p>I must admit that I have not quite decided on a clear direction ahead of me. Given the whimsical nature of this proffession that is constantly evolving I actually find myself being overwhelmed by so many choices or courses of actions. That being said I think it's better to start somewhere than just stand there doing nothing so welp, here I am.</p>
                <p>
                  Anyway, this blog is more or less a place for me to keep track of my progress in my career, it might involve some random rants or rambling whatsoever but the main theme is still about technology especially software engineering stuff.
              </p> 
                    
                        
              <h3 className="text-center">My Current Tech Stacks</h3>
              <hr/>
              <div className="l-about-container-image">
              <div className="x">
                  <img className="z" height="60px"  src="https://cdn.discordapp.com/attachments/504496908346195999/803498543800254494/svgxmlbase64PHN2ZyB3aWR0aD0iMjUwMCIgaGVpZ2h0PSIyNTAwIiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgeG1sbnM9Imh0dHA6.png" alt=""/>
                  </div>
              <div className="x">
                  <img className="z" height="60px"  src="https://cdn.discordapp.com/attachments/504496908346195999/803498472480440340/svgxmlbase64PHN2ZyB3aWR0aD0iMjUwMCIgaGVpZ2h0PSIyMjQ2IiB2aWV3Qm94PSIwIDAgMjU2IDIzMCIgeG1sbnM9Imh0dHA6.png" alt=""/>
                  </div>

                  

                  <div className="x">
                  <img className="z" height="60px"  src="https://cdn.discordapp.com/attachments/504496908346195999/803498558048698368/svgxmlbase64PHN2ZyB3aWR0aD0iMjUwMCIgaGVpZ2h0PSIxNTMzIiB2aWV3Qm94PSIwIDAgNTEyIDMxNCIgeG1sbnM9Imh0dHA6.png" alt=""/>
                  </div>

                  <div className="x">
                  <img className="z" height="60px"  src="https://cdn.discordapp.com/attachments/504496908346195999/803498573152387092/svgxmlbase64PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTAwIiBoZWlnaHQ9IjE3MzMi.png" alt=""/>
                  </div>
                </div>     
                    
          </>
                  </div></div></div>
          
      </Layout>
    </>
  )
}

export default AuthorIndex

export const getStaticProps: GetStaticProps = async ({ params }) => {


  const author = await getAuthorBySlug('gaftonosh')
  
  const settings = await getAllSettings()

  const { cover_image, profile_image } = author
  const siteUrl = settings.processEnv.siteUrl
  const imageUrl = cover_image || profile_image || undefined
  const authorImage = await seoImage({ siteUrl, imageUrl })

  return {
    props: {
      cmsData: {
        author,
        settings,
        seoImage: authorImage,
        bodyClass: BodyClass({ author })
      },
    },
    ...processEnv.isr.enable && { revalidate: 1 }, // re-generate at most once every second
  }
}