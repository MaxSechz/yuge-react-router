// @flow
import { Component } from 'react';

const parser = document.createElement('a');
function pathToHref(path) {
  parser.href = path;
  return parser.href;
}

export type Props = {
  href: string,
  title: string,
  stateObj: Object,
  onPopState: Event => mixed
}

export default class AddressBar extends Component<Props> {
  static defaultProps = {
    title: '',
    stateObj: {},
    onPopState: () => {},
  }

  componentWillMount() {
    if (this.props.onPopState) {
      window.addEventListener('popstate', this.props.onPopState);
    }
    if (pathToHref(this.props.href) !== location.href) {
      history.pushState(this.props.stateObj, this.props.title, this.props.href);
    }
  }

  componentWillReceiveProps({ href, title, stateObj, onPopState }: Props) {
    if (this.props.onPopState !== onPopState) {
      window.removeEventListener('popstate', this.props.onPopState);
      window.addEventListener('popstate', onPopState);
    }
    if (pathToHref(href) !== location.href) {
      history.pushState(stateObj, title, href);
    }
  }

  componentWillUnmount() {
    if (this.props.onPopState) {
      window.removeEventListener('popstate', this.props.onPopState);
    }
  }

  render() { return null; }
}
