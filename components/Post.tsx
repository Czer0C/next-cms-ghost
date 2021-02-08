import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'
import { FaArrowUp, FaFacebookSquare, FaTwitterSquare } from "react-icons/fa";

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
import Tippy from '@tippyjs/react';
import { Search } from './Search';

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

                <div className="share-post-link">

                  <Tippy content={<div className="tweet-tooltip">Tweet this post</div>} placement="bottom" animation="scale-subtle">
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURI(post.title || '')}&url=${process.env.SITE_URL}/${post.slug}/`}
                      className="share-post-link social-link social-link-tw"
                      target="_blank" rel="noopener noreferrer" title="Twitter">
                      <svg viewBox="0 0 32 32" className="svg-share-link">
                        <path d="M30.063 7.313c-.813 1.125-1.75 2.125-2.875 2.938v.75c0 1.563-.188 3.125-.688 4.625a15.088 15.088 0 0 1-2.063 4.438c-.875 1.438-2 2.688-3.25 3.813a15.015 15.015 0 0 1-4.625 2.563c-1.813.688-3.75 1-5.75 1-3.25 0-6.188-.875-8.875-2.625.438.063.875.125 1.375.125 2.688 0 5.063-.875 7.188-2.5-1.25 0-2.375-.375-3.375-1.125s-1.688-1.688-2.063-2.875c.438.063.813.125 1.125.125.5 0 1-.063 1.5-.25-1.313-.25-2.438-.938-3.313-1.938a5.673 5.673 0 0 1-1.313-3.688v-.063c.813.438 1.688.688 2.625.688a5.228 5.228 0 0 1-1.875-2c-.5-.875-.688-1.813-.688-2.75 0-1.063.25-2.063.75-2.938 1.438 1.75 3.188 3.188 5.25 4.25s4.313 1.688 6.688 1.813a5.579 5.579 0 0 1 1.5-5.438c1.125-1.125 2.5-1.688 4.125-1.688s3.063.625 4.188 1.813a11.48 11.48 0 0 0 3.688-1.375c-.438 1.375-1.313 2.438-2.563 3.188 1.125-.125 2.188-.438 3.313-.875z">
                        </path>
                      </svg>
                    </a>
                  </Tippy>

                  <Tippy content={<div className="tweet-tooltip">Share on Facebook</div>} placement="bottom" animation="scale-subtle">
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${process.env.SITE_URL}/${post.slug}/`}
                      className="share-post-link social-link social-link-tw"
                      target="_blank" rel="noopener noreferrer" title="Twitter">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="svg-share-link">
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                      </svg>
                    </a>
                  </Tippy>


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
