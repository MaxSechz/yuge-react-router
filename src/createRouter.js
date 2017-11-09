// @flow
import { forOwn } from 'lodash';
import { createElement } from 'react';

export default function createRouter(routes, { regexBuilder = RegExp } = {}) {
  const regexRoutes = new Map();
  forOwn(routes, (page, route) => regexRoutes.set(regexBuilder(route), page));

  return ({ route }) => {
    const entries = regexRoutes.entries();
    let routeRegex;
    let page;
    let routing;
    let currentEntry = entries.next();

    while (!currentEntry.done) {
      ({ value: [routeRegex, page] } = currentEntry);
      routing = routeRegex.exec(route);
      if (routing) { break; }
      currentEntry = entries.next();
    }

    return createElement(page, { routing });
  };
}
