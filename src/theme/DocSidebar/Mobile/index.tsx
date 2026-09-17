import React from 'react';
import OriginalDocSidebarMobile from '@theme-original/DocSidebar/Mobile';
import {getDocLibrarySection} from '@site/src/lib/docLibrary';
import type {Props} from '@theme/DocSidebar/Mobile';

function DocSidebarMobile(props: Props) {
  if (getDocLibrarySection(props.path)) {
    return null;
  }
  return <OriginalDocSidebarMobile {...props} />;
}

export default React.memo(DocSidebarMobile);
