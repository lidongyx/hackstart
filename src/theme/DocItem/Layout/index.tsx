import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useWindowSize} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import type {Props} from '@theme/DocItem/Layout';

import {docLibrarySections, getDocLibrarySection, isDocLibraryIntro} from '@site/src/lib/docLibrary';
import CourseAccessGate from '@site/src/components/docs/CourseAccessGate';
import {useHackstartCoursesState} from '@site/src/lib/courses';
import styles from './styles.module.css';

function useDocTOC() {
  const {frontMatter, toc = []} = useDoc();
  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;
  return {
    hidden,
    mobile: canRender ? <DocItemTOCMobile /> : undefined,
    desktop: canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? <DocItemTOCDesktop /> : undefined,
  };
}

export default function DocItemLayout({children}: Props): ReactNode {
  const docTOC = useDocTOC();
  const {metadata} = useDoc();
  const section = getDocLibrarySection(metadata.id);
  const {courses, status: courseStatus} = useHackstartCoursesState();
  const course = section ? courses.find((item) => item.docs_path === section) : undefined;

  if (section) {
    const config = docLibrarySections[section] || {label: course?.title || section, introPath: `/docs/${section}/intro/`};
    const article = isDocLibraryIntro(metadata.id) ? (
      <div className={styles.libraryIndex}>
        <ContentVisibility metadata={metadata} />
        <DocItemContent>{children}</DocItemContent>
      </div>
    ) : (
      <>
        <div className={styles.libraryTopbar}>
          <Link to={config.introPath}>← 返回{config.label}</Link>
          <span>{config.label}</span>
        </div>
        <article className={styles.libraryArticle}>
          <ContentVisibility metadata={metadata} />
          <DocVersionBanner />
          <DocVersionBadge />
          <DocItemContent>{children}</DocItemContent>
          <DocItemFooter />
        </article>
        <DocItemPaginator />
      </>
    );
    const isCourseIndex = isDocLibraryIntro(metadata.id);
    return <div className={styles.libraryDetail}>{isCourseIndex ? article : <CourseAccessGate course={course} courseStatus={courseStatus}>{article}</CourseAccessGate>}</div>;
  }

  return (
    <div className="row">
      <div className={clsx('col', !docTOC.hidden && styles.docItemCol)}>
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      {docTOC.desktop && <div className="col col--3">{docTOC.desktop}</div>}
    </div>
  );
}
