import React from 'react';
import ReactDOM from 'react-dom/client';
import { OverlayApp } from './overlay/OverlayApp';
import { SettingsApp } from './settings/SettingsApp';
import './index.css';

const hash = window.location.hash.toLowerCase();
const isOverlay = hash === '#overlay';

if (isOverlay) {
  document.title = '';
  // Apply the 24px top padding that compensates for the DWM ghost bar
  // which win.setShape() clips away from the top of the overlay window
  document.getElementById('root')?.classList.add('overlay-root');
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {isOverlay ? <OverlayApp /> : <SettingsApp />}
  </React.StrictMode>
);
