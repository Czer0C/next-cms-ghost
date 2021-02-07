import { TwitterIcon } from '@icons/TwitterIcon'
import { FacebookIcon } from '@icons/FacebookIcon'

import { SocialRss } from '@components/SocialRss'
import { GhostSettings } from '@lib/ghost'

import React, { useState, useEffect } from 'react';

import axios from 'axios';
interface SocialLinkProps {
  siteUrl: string
  site: GhostSettings
}

const postsAPI = `https://gaftoblog.digitalpress.blog/ghost/api/v3/content/posts/?key=2a4cfcc3d2ee9943aef20991b9`;

export const SocialLinks = ({ siteUrl, site }: SocialLinkProps) => {

  const [openSearch, setOpenSearch] = React.useState(false);
  const [posts, setPosts] = React.useState([]);
  const [searchResults, setSearchResults] = React.useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(postsAPI);
      setPosts(result.data.posts);
    };

    fetchData();
  }, []);


  const twitterUrl = site.twitter && `https://twitter.com/${site.twitter.replace(/^@/, ``)}`
  const facebookUrl = site.facebook && `https://www.facebook.com/${site.facebook.replace(/^\//, ``)}`

  const { processEnv } = site
  const { memberSubscriptions } = processEnv

  const handleOpenSearch = (event: any, openSearch: boolean) => {
    event.preventDefault();

    let searchModal = document.getElementsByClassName('m-search js-search')[0];

    if (openSearch === true) {
      searchModal?.classList.add('opened');
    } else {
      searchModal?.classList.remove('opened');
    }
    setOpenSearch(!openSearch);
  }

  const handleSearch = (event: any) => {
    event.preventDefault();
    let search = event.target.value;
    setKeyword(search);

    setSearchResults(
      posts.filter(
        (p: any) =>
          p.html.includes(search) ||
          p.title.toLowerCase().includes(search))
    );
  }

  return (
    <>
      <a href="#" className="social-link social-link-tw" target="_blank" rel="noopener noreferrer" title="Search" onClick={(event) => handleOpenSearch(event, true)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
      </a>
      {site.facebook && (
        <a href={facebookUrl} className="social-link social-link-fb" target="_blank" rel="noopener noreferrer" title="Facebook">
          <FacebookIcon />
        </a>
      )}
      {site.twitter && (
        <a href={twitterUrl} className="social-link social-link-tw" target="_blank" rel="noopener noreferrer" title="Twitter">
          <TwitterIcon />
        </a>
      )}



      <div className="m-search js-search" role="dialog" aria-modal="true" aria-label="Search">
        <button className="m-icon-button outlined as-close-search js-close-search" onClick={(event) => handleOpenSearch(event, false)} aria-label="Close search">

          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="search-icon" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>

        </button>
        <div className="m-search__content">
          <form className="m-search__form">
            <div className="pos-relative">
              <span className="icon-search m-search-icon" aria-hidden="true"></span>
              <label htmlFor="search-input" className="sr-only">
                Type to search
        </label>
              <input
                id="search-input"
                type="text"
                className="m-input in-search js-input-search"
                placeholder="Type to search"
                value={keyword}
                onChange={(event) => handleSearch(event)}
              />
            </div>
          </form>
          <div className="js-search-results">
            {
              searchResults.map((s: any) => (
                <article className="m-result">
                  <a href={`${processEnv.siteUrl}/${s.slug}`} className="m-result__link">
                    <h3 className="m-result__title">{s.title}</h3>
                    <span className="m-result__date">{new Date(s.created_at).toISOString().slice(0, 10)}</span>
                  </a>
                </article>
              ))
            }

          </div>

        </div>
      </div>
      {!memberSubscriptions && <SocialRss {...{ siteUrl }} />}
    </>
  )
}
