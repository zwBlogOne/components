
import React, { useRef, useReducer, useEffect } from 'react';
import cs from 'classnames';

import { getFixedBottom, getFixedTop, getTargetRect, wrapperRaf } from './utils';

import './index.less';

export default function Sticky({ zIndex, container, offsetTop = 0, children, scroll, offsetBottom = 0 }) {
  const placeholderNode = useRef(null);
  const fixedNode = useRef(null);
  const con = useRef(container);
  con.current = container

  const [state, setState] = useReducer(
    (store, action) => ({ ...store, ...action }),
    {
      affixStyle: {},
      transform: 0,
    }
  );
  const Scroll = () => {
    const { current } = placeholderNode;
    if (!current) {
      return;
    }

    const targetRect = getTargetRect(window);
    const placeholderReact = getTargetRect(placeholderNode.current);
    const fixedTop = getFixedTop(placeholderReact, targetRect, offsetTop);
    const fixedBottom = getFixedBottom(placeholderReact, targetRect, offsetBottom);

    let aStyle = {};

    if (fixedTop !== undefined) {
      aStyle = {
        position: 'fixed',
        top: fixedTop,
        width: placeholderReact.width,
        height: placeholderReact.height,
        zIndex: zIndex || 999,
      };
    } else if (fixedBottom !== undefined) {
      aStyle = {
        position: 'fixed',
        bottom: fixedBottom,
        width: placeholderReact.width,
        height: placeholderReact.height,
      };
    }

    if (con.current) {
      const containerRect = getTargetRect(con.current);
      if (containerRect.bottom <= 0) {
        aStyle = {}
      }
    }
    setState({ affixStyle: aStyle });
  };

  const func = () => {
    wrapperRaf(Scroll)
  }

  useEffect(() => {
    window.addEventListener('scroll', func);

    const { current } = placeholderNode;
    setState({ height: current.offsetHeight + 'px' });

    return () => {
      wrapperRaf.cancel();
    }
  },
    []
  );


  return (
    <div ref={placeholderNode} style={{ height: state.height }}>
      <div className={cs('affix')} ref={fixedNode} style={state.affixStyle}>
        {children}
      </div>
    </div>
  );
}
