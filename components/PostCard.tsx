import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'
import Tippy from '@tippyjs/react'
import 'tippy.js/animations/scale-subtle.css';
import 'tippy.js/themes/material.css';


import { readingTime as readingTimeHelper } from '@lib/readingTime'
import { resolveUrl } from '@utils/routing'
import { useLang, get } from '@utils/use-lang'

import { AuthorList } from '@components/AuthorList'
import { PostClass } from '@helpers/PostClass'
import { collections } from '@lib/collections'
import { GhostPostOrPage, GhostSettings } from '@lib/ghost'
import { HoverOnAvatar } from './effects/HoverOnAvatar';
import { RenderContent } from './RenderContent';

interface PostCardProps {
  settings: GhostSettings
  post: GhostPostOrPage
  num?: number
  isHome?: boolean
}

export const PostCard = ({ settings, post, num, isHome }: PostCardProps) => {
  const { nextImages } = settings.processEnv
  const text = get(useLang())
  const collectionPath = collections.getCollectionByNode(post)
  const url = resolveUrl({ collectionPath, slug: post.slug, url: post.url })
  const featImg = post.featureImage
  const readingTime = readingTimeHelper(post).replace(`min read`, text(`MIN_READ`))
  const postClass = PostClass({ tags: post.tags, isFeatured: post.featured, isImage: !!featImg })
  const large = (featImg && isHome && num !== undefined && 0 === num % 6 && `post-card-large`) || ``
  const authors = post?.authors?.filter((_, i) => (i < 2 ? true : false))

  return (
    <article className={`post-card shrink ${postClass} ${large}`}>
      { featImg && (
        <Link href={url}>
          <a className="post-card-image-link" aria-label={post.title}>
            {nextImages.feature ? (
              <div className="post-card-image">
                <Image
                  src={featImg.url}
                  alt={post.title}
                  sizes="(max-width: 640px) 320px, (max-width: 1000px) 500px, 680px"
                  layout="fill"
                  objectFit="cover"
                  quality={nextImages.quality}
                />
                
             
              </div>
            ) : (post.feature_image && (
              <img className="post-card-image" src={post.feature_image} alt={post.title} />
            ))}
            
            <Tippy content={<div className="featured-post-tooltip">Featured</div>}  animation="scale-subtle">
              <span className="icon-star m-article-card__featured" aria-hidden="true">              
              </span>
            </Tippy>
          </a>

        </Link>
      )}

      <div className="post-card-content">
        <Link href={url}>
          <a className="post-card-content-link">
            <header className="post-card-header">
              {post.primary_tag && <div className="post-card-primary-tag">{post.primary_tag.name}{post.featured && !post.featureImage ? ' ⭐' : ''}</div>}
              <h2 className="post-card-title">{post.title}</h2>
            </header>
            <section className="post-card-excerpt">
              {/* post.excerpt *is* an excerpt and does not need to be truncated any further */}
              <p>{post.excerpt}</p>

              
            </section>
          </a>
        </Link>

        <footer className="post-card-meta">
          <div className="post-card-byline-content">
            
            <span className="post-card-byline-date">
              <time dateTime={post.published_at || ''}>{dayjs(post.published_at || '').format('D MMM YYYY')}&nbsp;</time>
              <span className="bull">&bull; </span> {readingTime}
            </span>
          </div>
        </footer>
      </div>
    </article >
  )
}
