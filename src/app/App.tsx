import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider, type createBrowserRouter } from 'react-router';

export interface AppProps {
  router: ReturnType<typeof createBrowserRouter>;
}

export function App({ router }: AppProps) {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}
