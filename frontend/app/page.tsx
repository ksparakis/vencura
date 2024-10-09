
'use client';

import { DynamicWidget } from "@/lib/dynamic";
import { useState, useEffect } from 'react';
import DynamicMethods from "@/app/components/MainComponent";
import './page.css';

const checkIsDarkSchemePreferred = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia?.('(prefers-color-scheme:dark)')?.matches ?? false;
  }
  return false;
};

export default function Main() {
  const [isDarkMode, setIsDarkMode] = useState(checkIsDarkSchemePreferred);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setIsDarkMode(checkIsDarkSchemePreferred());

    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className={`container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="header">
        <img className="logo" src={isDarkMode ? "/vencura-dark.png" : "/vencura-light.png"} alt="vencura" />
          <DynamicWidget/>
          <div className="header-buttons">
          <button className="docs-button" onClick={() => window.open('https://github.com/ksparakis/vencura', '_blank', 'noopener,noreferrer')}>Github</button>
        </div>
      </div>
        <div className="modal">

            <DynamicMethods isDarkMode={isDarkMode}/>
        </div>
        <div className="footer">
            <div className="footer-text">Made by Konstantino Sparakis️</div>
      </div>
    </div>
  );
}
