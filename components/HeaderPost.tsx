import { GhostSettings, NextImage } from 'lib/ghost'
import { SiteNav } from '@components/SiteNav'
import { StickyNavContainer } from '@effects/StickyNavContainer'
import { HeaderBackground } from './HeaderBackground';


interface HeaderPostProps {
  settings: GhostSettings,
  title?: string,
  sticky: StickyNavContainer,
  featImg?: NextImage | null
}

export const HeaderPost = ({ settings, title, sticky, featImg }: HeaderPostProps) => (
  <header className="site-header" >
    <div className={`outer site-nav-main ${sticky && sticky.state.currentClass}`}>
      <div className="inner">
        <SiteNav {...{ settings }} className="site-nav" postTitle={title}/>
      </div>
    </div>
    {
      featImg ? 
      <HeaderBackground srcImg={featImg.url}>
        <div className="inner site-header-content">
          
          
        </div>
      </HeaderBackground> : 
      null
    }
  </header>
)
