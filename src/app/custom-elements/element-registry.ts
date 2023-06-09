import { InjectionToken, Type } from '@angular/core';
import { LoadChildrenCallback } from '@angular/router';

// Modules containing custom elements must be set up as lazy-loaded routes (loadChildren)
// TODO(andrewjs): This is a hack, Angular should have first-class support for preparing a module
// that contains custom elements.
export const ELEMENT_MODULE_LOAD_CALLBACKS_AS_ROUTES = [
  {
    selector: 'aio-api-list',
    loadChildren: () => import('./api/api-list.module').then(m => m.ApiListModule)
  },
  {
    selector: 'aio-file-not-found-search',
    loadChildren: () => import('./search/file-not-found-search.module').then(m => m.FileNotFoundSearchModule)
  },
  {
    selector: 'aio-resource-list',
    loadChildren: () => import('./resource/resource-list.module').then(m => m.ResourceListModule)
  },
  {
    selector: 'aio-toc',
    loadChildren: () => import('./toc/toc.module').then(m => m.TocModule)
  },
  {
    selector: 'code-example',
    loadChildren: () => import('./code/code-example.module').then(m => m.CodeExampleModule)
  },
  {
    selector: 'code-tabs',
    loadChildren: () => import('./code/code-tabs.module').then(m => m.CodeTabsModule)
  },
  {
    selector: 'current-location',
    loadChildren: () => import('./current-location/current-location.module').then(m => m.CurrentLocationModule)
  },
  {
    selector: 'expandable-section',
    loadChildren: () => import('./expandable-section/expandable-section.module').then(m => m.ExpandableSectionModule)
  },
];

/**
 * Interface expected to be implemented by all modules that declare a component that can be used as
 * a custom element.
 */
export interface WithCustomElementComponent {
  customElementComponent: Type<any>;
}

/** Injection token to provide the element path modules. */
// export const ELEMENT_MODULE_PATHS_TOKEN = new InjectionToken('aio/elements-map');

/** Map of possible custom element selectors to their lazy-loadable module paths. */
// export const ELEMENT_MODULE_PATHS = new Map<string, () => Promise<any>>();
// ELEMENT_MODULE_PATHS_AS_ROUTES.forEach(route => {
//   ELEMENT_MODULE_PATHS.set(route.selector, route.loadChildren);
// });

/** Injection token to provide the element path modules. */
export const ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN = new InjectionToken<Map<string, LoadChildrenCallback>>('aio/elements-map');

/** Map of possible custom element selectors to their lazy-loadable module paths. */
export const ELEMENT_MODULE_LOAD_CALLBACKS = new Map<string, LoadChildrenCallback>();
ELEMENT_MODULE_LOAD_CALLBACKS_AS_ROUTES.forEach(route => {
  ELEMENT_MODULE_LOAD_CALLBACKS.set(route.selector, route.loadChildren);
});
