import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';
import type {Props} from '@theme/DocRoot/Layout/Main';

import {getDocLibrarySection} from '@site/src/lib/docLibrary';
import styles from './styles.module.css';

export default function DocRootLayoutMain({hiddenSidebarContainer, children}: Props): ReactNode {
  const sidebar = useDocsSidebar();
  const {pathname} = useLocation();
  const isLibrary = Boolean(getDocLibrarySection(pathname));

  return (
    <main
      className={clsx(
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced,
      )}>
      <div
        className={clsx(
          isLibrary ? styles.libraryWrapper : 'container padding-top--md padding-bottom--lg',
          !isLibrary && styles.docItemWrapper,
          !isLibrary && hiddenSidebarContainer && styles.docItemWrapperEnhanced,
        )}>
        {children}
      </div>
    </main>
  );
}
