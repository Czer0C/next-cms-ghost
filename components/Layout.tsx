import { ReactFragment } from 'react'
import Link from 'next/link'
import { FaFacebookF } from "react-icons/fa";

import { DocumentHead } from '@components/DocumentHead'
import { StickyNav } from '@components/StickyNav'
import { SubscribeOverlay } from '@components/SubscribeOverlay'
import { SubscribeSuccess } from '@components/SubscribeSuccess'

import { useLang, get } from '@utils/use-lang'
import { GhostSettings } from '@lib/ghost'

import { StickyNavContainer } from '@effects/StickyNavContainer'
import { resolve } from 'url'

import smoothscroll from 'smoothscroll-polyfill';

/**
 * Main layout component
 *
 * The Layout component wraps around each page and template.
 * It also provides the header, footer as well as the main
 * styles, and meta data for each page.
 *
 */

interface LayoutProps {
  settings: GhostSettings
  header: ReactFragment
  children: ReactFragment
  isHome?: boolean
  sticky?: StickyNavContainer
  previewPosts?: ReactFragment
  bodyClass: string
  errorClass?: string
}

export const Layout = ({ settings, header, children, isHome, sticky, previewPosts, bodyClass, errorClass }: LayoutProps) => {
  const text = get(useLang())
  const site = settings
  const title = text(`SITE_TITLE`, site.title)
  const { siteUrl, memberSubscriptions } = settings.processEnv

  const twitterUrl = site.twitter && `https://twitter.com/${site.twitter.replace(/^@/, ``)}`
  const facebookUrl = site.facebook && `https://www.facebook.com/${site.facebook.replace(/^\//, ``)}`

  errorClass = errorClass || ``

  return (
    <>
      <DocumentHead className={bodyClass} />

      <div className="site-wrapper">
        {/* The main header section on top of the screen */}
        {header}
        {/* The main content area */}
        <main ref={isHome && sticky && sticky.anchorRef || null} id="site-main" className={`site-main outer ${errorClass}`}>
          {/* All the main content gets inserted here, index.js, post.js */}
          {children}
          <a className="top-link hide grow" href="#" id="js-top"
            onClick={(e) => {
              e.preventDefault();
              smoothscroll.polyfill();


              

              document.body.scrollTo({
                top: 0,
                behavior: "smooth"
              })
              document.documentElement.scrollTo({
                top: 0,
                behavior: "smooth"
              })
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="topSvg" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M4.854 1.146a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L4 2.707V12.5A2.5 2.5 0 0 0 6.5 15h8a.5.5 0 0 0 0-1h-8A1.5 1.5 0 0 1 5 12.5V2.707l3.146 3.147a.5.5 0 1 0 .708-.708l-4-4z" />
            </svg>
          </a>

          
        </main>
        {/* For sticky nav bar */}
        {isHome && <StickyNav className={`site-nav ${sticky && sticky.state.currentClass}`}  {...{ siteUrl, settings }} />}
        {/* Links to Previous/Next posts */}
        {previewPosts}


        {/* The footer at the very bottom of the screen */}
        <footer className="site-footer outer">
          <div className="site-footer-content inner">
            <section className="copyright">
              <a href={resolve(siteUrl, '')}>{title}</a> &copy; {new Date().getFullYear()}
            </section>

            <nav className="site-footer-nav">
              <Link href="/">
                <a>{text(`LATEST_POSTS`)}</a>
              </Link>
              {site.facebook && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              )}
              {site.twitter && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              )}
              <a href="https://www.jamify.org" target="_blank" rel="noopener noreferrer">
                Jamify
              </a>
            </nav>
          </div>
        </footer>
      </div>

      {memberSubscriptions && (
        <SubscribeSuccess {...{ title }} />
      )}

      {/* The big email subscribe modal content */}
      {memberSubscriptions && (
        <SubscribeOverlay {...{ settings }} />
      )}
    </>
  )
}
