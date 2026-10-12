import { renderToString } from 'react-dom/server';
import { App, routes } from './App';

export { routes };
export function render(pathname: string) {
  return renderToString(<App pathname={pathname} />);
}
