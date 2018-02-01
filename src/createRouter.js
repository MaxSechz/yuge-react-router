// @flow
import map from 'lodash/map';
import { createElement } from 'react';
import type { ComponentType } from 'react';

type Routes = {
  [string]: ComponentType<*>,
};
type RegexBuilder = string => RegExp;
type Options = {
  regexBuilder?: RegexBuilder,
  notFound?: ComponentType<*>,
};

function renderByTypeof(component, props) {
  if (typeof component === 'function') {
    return createElement(component, props);
  }
  return component;
}

export default function createRouter(routes: Routes, { regexBuilder = RegExp, notFound }: Options = {}) {
  const regexRoutes = map(routes, (page, route) => ({ routeRegex: regexBuilder(route), page }));

  return ({ route }: { route: string }) => {
    for (let routeIndex = 0; routeIndex < regexRoutes.length; routeIndex++) {
      const { routeRegex, pageComponent } = regexRoutes[routeIndex];
      const routing = routeRegex.exec(route);
      if (routing) {
        return renderByTypeof(pageComponent, { routing });
      }
    }

    return renderByTypeof(notFound, { route });
  };
}
