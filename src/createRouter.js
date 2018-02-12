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
  match?: (RegExp, string) => mixed,
};

function regexExec(routeRegex, routeString) {
  return routeRegex.exec(routeString);
}

function renderByTypeof(component, props) {
  if (typeof component === 'function') {
    return createElement(component, props);
  }
  return component;
}

export default function createRouter(routes: Routes, options: Options = {}) {
  const { regexBuilder = RegExp, match = regexExec, notFound } = options;
  const regexRoutes = map(routes, (pageComponent, route) => ({ routeRegex: regexBuilder(route), pageComponent }));

  return ({ route }: { route: string }) => {
    for (let routeIndex = regexRoutes.length - 1; routeIndex >= 0; routeIndex--) {
      const { routeRegex, pageComponent } = regexRoutes[routeIndex];
      const routing = match(routeRegex, route);
      if (routing) {
        return renderByTypeof(pageComponent, { routing });
      }
    }

    return renderByTypeof(notFound, { route });
  };
}
