import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'

import { readingTime as readingTimeHelper } from '@lib/readingTime'

import { resolveUrl } from '@utils/routing'
import { useLang, get } from '@utils/use-lang'

import { Layout } from '@components/Layout'
import { HeaderPost } from '@components/HeaderPost'
import { AuthorList } from '@components/AuthorList'
import { PreviewPosts } from '@components/PreviewPosts'
import { RenderContent } from '@components/RenderContent'
import { Comments } from '@components/Comments'
import { Subscribe } from '@components/Subscribe'
import { TableOfContents } from '@components/toc/TableOfContents'

import { StickyNavContainer } from '@effects/StickyNavContainer'
import { SEO } from '@meta/seo'

import { PostClass } from '@helpers/PostClass'
import { GhostPostOrPage, GhostPostsOrPages, GhostSettings } from '@lib/ghost'
import { collections } from '@lib/collections'

import { ISeoImage } from '@meta/seoImage'


interface PostProps {
  cmsData: {
    post: GhostPostOrPage
    settings: GhostSettings
    seoImage: ISeoImage
    previewPosts?: GhostPostsOrPages
    prevPost?: GhostPostOrPage
    nextPost?: GhostPostOrPage
    bodyClass: string
  }
}

export const Post = ({ cmsData }: PostProps) => {
  const { post, settings, seoImage, previewPosts, prevPost, nextPost, bodyClass } = cmsData
  const { slug, url, meta_description, excerpt } = post
  const description = meta_description || excerpt

  const tags = post.tags?.map(t => t);

  const { processEnv } = settings
  const { nextImages, toc, memberSubscriptions, commento } = processEnv

  const text = get(useLang())
  const readingTime = readingTimeHelper(post).replace(`min read`, text(`MIN_READ`))
  const featImg = post.featureImage
  const postClass = PostClass({ tags: post.tags, isFeatured: !!featImg, isImage: !!featImg })

  const htmlAst = post.htmlAst
  if (htmlAst === undefined) throw Error('Post.tsx: htmlAst must be defined.')

  const collectionPath = collections.getCollectionByNode(post)

  return (
    <>
      <SEO {...{ description, settings, seoImage, article: post }} />
      <StickyNavContainer
        throttle={300}
        isPost={true}
        activeClass="nav-post-title-active"
        render={(sticky) => (
          <Layout {...{ bodyClass, settings, sticky }}
            header={<HeaderPost {...{ settings, sticky, title: post.title, featImg }} />}
            previewPosts={<PreviewPosts {...{ settings, primaryTag: post.primary_tag, posts: previewPosts, prev: prevPost, next: nextPost }} />}
          >
            <div className="inner">
              <article className={`post-full ${postClass}`}>
                <header className="post-full-header">

                  <h1 ref={sticky && sticky.anchorRef} className="post-full-title">
                    {post.title}
                  </h1>

                  {post.primary_tag && (
                    <section className="post-full-tags">
                      <Link href={resolveUrl({ slug: post.primary_tag.slug, url: post.primary_tag.url })}>
                        <a>{post.primary_tag.name}</a>
                      </Link>
                      <span className="post-full-tags-date-divider">

                      </span>
                      <span>
                        <time className="byline-meta-date" dateTime={post.published_at || ''}>
                          {dayjs(post.published_at || '').format('D MMMM, YYYY')}&nbsp;
                              </time>
                      </span>
                    </section>
                  )}




                  {post.custom_excerpt && <p className="post-full-custom-excerpt">{post.custom_excerpt}</p>}


                </header>


                <section className="post-full-content">
                  {toc.enable && !!post.toc && (
                    <TableOfContents {...{ toc: post.toc, url: resolveUrl({ collectionPath, slug, url }), maxDepth: toc.maxDepth, readingTime: readingTime }} />
                  )}
                  <div className="post-content load-external-scripts">
                    <RenderContent htmlAst={htmlAst} />
                  </div>
                </section>


                <section className="m-tags in-post">
                  <h3 className="m-submenu-title">Tags</h3>
                  <ul>
                    {
                      tags?.map(t => (
                        <li key={`tags-${t.id}`}>
                          <a href={`/tag/${t.slug}`} title={t.name}>{t.name}</a>
                        </li>
                      ))
                    }
                  </ul>
                </section>

                <div className="post-full-byline">
                  <section className="post-full-byline-content">
                    <AuthorList {...{ settings, authors: post.authors, isPost: true }} />

                    <section className="post-full-byline-meta">
                      <h4 className="author-name">
                        {post.authors?.map((author, i) => (
                          <div key={i}>
                            {i > 0 ? `, ` : ``}
                            <Link href={resolveUrl({ slug: author.slug, url: author.url || undefined })}>
                              <a>{author.name}</a>

                            </Link>
                            <p>{author.bio}</p>
                          </div>
                        ))}
                      </h4>
                    </section>
                  </section>
                </div>

                {commento.enable && (
                  <Comments {...{ id: post.id, url: commento.url }} />
                )}
              </article>
            </div>
          </Layout>
        )}
      />
    </>
  )
}
