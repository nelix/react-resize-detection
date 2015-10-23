import React, {Component, PropTypes} from 'react';

export default class ResizeDetector extends Component {
  static defaultProps = {
    onResize: () => console.error('ResizeDetector:onResize'),
  };

  static propTypes = {
    onResize: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.reset();
  }

  state = {
    expandChildHeight: 0,
    expandChildWidth: 0,
    expandScrollLeft: 0,
    expandScrollTop: 0,
    shrinkScrollTop: 0,
    shrinkScrollLeft: 0,
    lastWidth: 0,
    lastHeight: 0,
  };

  reset = () => {
    const {
      expand,
      shrink,
      container,
    } = this;

    this.setState({
      expandChildHeight: expand.offsetHeight + 10,
      expandChildWidth: expand.offsetWidth + 10,
      lastWidth: container.parentElement.offsetWidth,
      lastHeight: container.parentElement.offsetHeight,
    });

    expand.scrollLeft = expand.scrollWidth;
    expand.scrollTop = expand.scrollHeight;

    shrink.scrollLeft = shrink.scrollWidth;
    shrink.scrollTop = shrink.scrollHeight;
  };

  handleScroll = (evt) => {
    const {container, state} = this;

    if (
      container.parentElement.offsetWidth != state.lastWidth ||
      container.parentElement.offsetHeight != state.lastHeight
    ) {
      this.props.onResize();
    }

    this.reset();
  };

  render() {
    const {state} = this;

    const parentStyle = {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      overflow: 'scroll',
      zIndex: -1,
      visibility: 'hidden',
    };


    const childStyle = {
      position: 'absolute',
      left: 0,
      top: 0,
    };

    const expandChildStyle = {
      ...childStyle,
      width: state.expandChildWidth,
      height: state.expandChildHeight,
    };

    const shrinkChildStyle = {
      ...childStyle,
      width: '200%',
      height: '200%',
    };

    return (
      <resize-sensor
        style={parentStyle}
        ref={(ref) => this.container = React.findDOMNode(ref)}
      >
        <expand
          style={parentStyle}
          ref={(ref) => this.expand = React.findDOMNode(ref)}
          onScroll={this.handleScroll}
        >
          <expand-child style={expandChildStyle}/>
        </expand>
        <shrink
          style={parentStyle}
          onScroll={this.handleScroll}
          ref={(ref) => this.shrink = React.findDOMNode(ref)}
        >
          <shrink-child style={shrinkChildStyle}/>
        </shrink>
      </resize-sensor>
    );
  }
}
