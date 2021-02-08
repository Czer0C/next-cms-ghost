import { TwitterIcon } from '@icons/TwitterIcon'
import { FacebookIcon } from '@icons/FacebookIcon'

import { SocialRss } from '@components/SocialRss'
import { GhostSettings } from '@lib/ghost'
import { Search } from './Search'

interface SocialLinkProps {
  siteUrl: string
  site: GhostSettings
}

export const SocialLinks = ({ siteUrl, site }: SocialLinkProps) => {
  const twitterUrl = site.twitter && `https://twitter.com/${site.twitter.replace(/^@/, ``)}`
  const facebookUrl = site.facebook && `https://www.facebook.com/${site.facebook.replace(/^\//, ``)}`

  const { processEnv } = site
  const { memberSubscriptions } = processEnv

  return (
    <>
      {site.twitter && (
        <a href={twitterUrl} className="social-link social-link-tw" target="_blank" rel="noopener noreferrer" title="Twitter">
          <TwitterIcon />
        </a>
      )}
      {!memberSubscriptions && <SocialRss {...{ siteUrl }} />}
    </>
  )
}
