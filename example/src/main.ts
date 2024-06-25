import App from './App.svelte';

import 'tippy.js/dist/tippy.css';
import './styles/leaflet.css';
import './styles/visitorBlock.css';
import './styles/main.css';

const app = new App({
  target: document.getElementById('app')!,
});

export default app;
