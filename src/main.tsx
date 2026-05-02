/**
 * Preview app entry — what `npm run dev` boots.
 *
 * This is the in-repo showcase, NOT the publishable library entry. The
 * library entry is `src/index.ts` (consumed by `vite.lib.config.ts`).
 *
 * The showcase imports actual library components by their real path and
 * renders preview pages from `src/preview/`. Touching this file does not
 * affect what consumers see.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
