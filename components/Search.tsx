
import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { CloseIcon } from './icons/CloseIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ghostAPIKey, processEnv } from '@lib/processEnv';

const postsAPI = `https://gaftoblog.digitalpress.blog/ghost/api/v3/content/posts/?key=${ghostAPIKey}`;

export const Search = () => {
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

        function handlekeydownEvent(event: any) {            
            const { key, keyCode } = event;
            if (keyCode === 27) {
                handleOpenSearch(event, false);
            }
        }

        document.addEventListener('keydown', handlekeydownEvent)
        return () => {
            document.removeEventListener('keydown', handlekeydownEvent)
        }

    }, []);

    const handleOpenSearch = (event: any, openSearch: boolean) => {
        event.preventDefault();

        let searchModal = document.getElementsByClassName('m-search js-search')[0];

        if (openSearch === true) {
            searchModal?.classList.add('opened');   
            document.getElementById('search-input')?.focus();
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
            <a href="#" id="open-search-icon" className="nav-search grow" target="_blank" rel="noopener noreferrer" title="Search" onClick={(event) => handleOpenSearch(event, true)}>
                <SearchIcon />
            </a>

            <div className="m-search js-search" role="dialog" aria-modal="true" aria-label="Search">
                <button className="m-icon-button outlined as-close-search js-close-search" onClick={(event) => handleOpenSearch(event, false)} aria-label="Close search">
                    <CloseIcon />
                </button>
                <div className="m-search__content">
                    <form className="m-search__form">
                        <div className="pos-relative">
                            <span className="icon-search m-search-icon" aria-hidden="true">
                                <SearchIcon />
                            </span>
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
                                    <a href={`${process.env.SITE_URL}/${s.slug}`} className="m-result__link">
                                        <h3 className="m-result__title">{s.title}</h3>
                                        <span className="m-result__date">{new Date(s.created_at).toISOString().slice(0, 10)}</span>
                                    </a>
                                </article>
                            ))
                        }

                    </div>

                </div>
            </div>
        </>

    )
}