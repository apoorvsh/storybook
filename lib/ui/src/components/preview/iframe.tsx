import window from 'global';
import React, { Component, CSSProperties, FC } from 'react';

import { styled } from '@storybook/theming';

interface IFrameProps {
  id: string;
  isActive: boolean;
  title: string;
  src: string;
  allowFullScreen: boolean;
  scale: number;
}

interface StyledIFrameProps {
  scrolling: string;
  id: string;
  title: string;
  src: string;
  startedActive: boolean;
  allowFullScreen: boolean;
}

const FIREFOX_BROWSER = 'Firefox';

const StyledIframe = styled.iframe(
  {
    position: 'absolute',
    display: 'block',
    boxSizing: 'content-box',
    height: '100%',
    width: '100%',
    border: '0 none',
    transition: 'all .3s, background-position 0s',
    backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px',
  },
  ({ startedActive }: StyledIFrameProps) => ({
    visibility: startedActive ? 'visible' : 'hidden',
  })
);

export class IFrame extends Component<IFrameProps, {}> {
  iframe: { contentDocument: { body: { style: any } }; style: CSSProperties } = null;

  componentDidMount() {
    const { id } = this.props;
    this.iframe = window.document.getElementById(id);
  }

  shouldComponentUpdate(nextProps: IFrameProps) {
    const { scale, isActive } = this.props;

    if (scale !== nextProps.scale) {
      if (window.navigator.userAgent.indexOf(FIREFOX_BROWSER) !== -1) {
        this.setIframeBodyStyle({
          width: `${nextProps.scale * 100}%`,
          height: `${nextProps.scale * 100}%`,
          transform: `scale(${1 / nextProps.scale})`,
          transformOrigin: 'top left',
        });
      } else {
        this.setIframeBodyStyle({
          zoom: 1 / nextProps.scale,
        });
      }
    }

    if (isActive !== nextProps.isActive) {
      this.setIframeStyle({
        visibility: nextProps.isActive ? 'visible' : 'hidden',
      });
    }

    // this component renders an iframe, which gets updates via post-messages
    // never update this component, it will cause the iframe to refresh
    return false;
  }

  setIframeBodyStyle(style: CSSProperties) {
    try {
      return this.iframe !== null && Object.assign(this.iframe.contentDocument.body.style, style);
    } catch (e) {
      return false;
    }
  }

  setIframeStyle(style: CSSProperties) {
    try {
      return Object.assign(this.iframe.style, style);
    } catch (e) {
      return false;
    }
  }

  render() {
    const { id, title, src, allowFullScreen, scale, isActive, ...rest } = this.props;
    return (
      <StyledIframe
        scrolling="yes"
        id={id}
        title={title}
        src={src}
        startedActive={isActive}
        allowFullScreen={allowFullScreen}
        {...rest}
      />
    );
  }
}
