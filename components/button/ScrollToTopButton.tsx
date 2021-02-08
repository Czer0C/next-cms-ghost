
import smoothscroll from 'smoothscroll-polyfill';
import React from 'react';
import { ScrollTopIcon } from '../icons/ScrollTopIcon';

export const ScrollToTopButton = () => {
    React.useEffect(() =>{
        let btn = document.getElementById('button');
        document.addEventListener('scroll', () => {
          if (document.documentElement.scrollTop > 300) {
            btn?.classList.add('show');
          } else {
            btn?.classList.remove('show');
          }
        })  
      })

    const handleScrollToTop = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
        event.preventDefault();

        smoothscroll.polyfill();

        document.body.scrollTo({
            top: 0,
            behavior: "smooth"
        })
        document.documentElement.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    return (
        <button id="button" onClick={(event) => handleScrollToTop(event)}>
            <ScrollTopIcon/>
        </button>
    )
}