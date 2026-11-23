import React from 'react';
import ReactDOM from 'react-dom/client';
import { OverlayApp } from './overlay/OverlayApp';
import { SettingsApp } from './settings/SettingsApp';
import './index.css';

const hash = window.location.hash.toLowerCase();
const isOverlay = hash === '#overlay';

if (isOverlay) {
  document.title = '';
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {isOverlay ? <OverlayApp /> : <SettingsApp />}
  </React.StrictMode>
);
