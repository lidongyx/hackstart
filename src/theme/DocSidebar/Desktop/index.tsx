import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useColorMode} from '@docusaurus/theme-common';
import {useThemeConfig} from '@docusaurus/theme-common';
import Logo from '@theme/Logo';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import type {Props} from '@theme/DocSidebar/Desktop';
import ResourceSidebar from '@site/src/components/resources/ResourceSidebar';
import {getDocLibrarySection} from '@site/src/lib/docLibrary';

export default function DocSidebarDesktop({path, sidebar, onCollapse, isHidden}: Props): ReactNode {
  if (getDocLibrarySection(path)) {
    return <ResourceSidebar embedded />;
  }

  const {
    navbar: {hideOnScroll},
    docs: {sidebar: {hideable}},
  } = useThemeConfig();
  const {colorMode, setColorMode} = useColorMode();
  const nextColorMode = colorMode === 'dark' ? 'light' : 'dark';

  return (
    <div className={clsx('hs-doc-sidebar', isHidden && 'hs-doc-sidebar--hidden')}>
      {hideOnScroll && <Logo tabIndex={-1} className="hs-doc-sidebar-logo" />}
      <Link className="hs-doc-sidebar-brand" to="/" aria-label="HackStart 首页">
        <img src="/img/hackstart.jpeg" alt="" />
        <span>HackStart<small>文档与接入</small></span>
      </Link>
      <Content path={path} sidebar={sidebar} className="hs-doc-sidebar-content" />
      <div className="hs-doc-sidebar-footer">
        <button type="button" onClick={() => setColorMode(nextColorMode)}>
          <span aria-hidden="true">{colorMode === 'dark' ? '☼' : '◐'}</span>
          {colorMode === 'dark' ? '切换亮色主题' : '切换暗色主题'}
        </button>
        <Link to="/login/">登录 / 注册 <span aria-hidden="true">↗</span></Link>
      </div>
      {hideable && <CollapseButton onClick={onCollapse} />}
    </div>
  );
}
