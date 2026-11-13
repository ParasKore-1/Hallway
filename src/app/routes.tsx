import type { ComponentType } from 'react';
import type { RouteObject } from 'react-router';
import { RootLayout } from '@/components/layout/RootLayout';

interface RouteModule {
  default: ComponentType;
}

/** Adapts a default-exporting route module to React Router's `lazy` contract. */
function lazyRoute(load: () => Promise<RouteModule>): NonNullable<RouteObject['lazy']> {
  return async () => {
    const module = await load();
    return { Component: module.default };
  };
}

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: RootLayout,
    // Pages are prerendered, so there is never anything to show while lazy modules resolve.
    HydrateFallback: () => null,
    children: [
      { index: true, lazy: lazyRoute(() => import('@/routes/Home')) },
      { path: 'product', lazy: lazyRoute(() => import('@/routes/Product')) },
      { path: 'pricing', lazy: lazyRoute(() => import('@/routes/Pricing')) },
      { path: 'about', lazy: lazyRoute(() => import('@/routes/About')) },
      { path: 'playground', lazy: lazyRoute(() => import('@/routes/Playground')) },
      { path: '*', lazy: lazyRoute(() => import('@/routes/NotFound')) },
    ],
  },
];
