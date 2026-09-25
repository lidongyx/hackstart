import React, {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';

import {getSub2ApiToken} from '@site/src/lib/sub2api-auth';
import {recordLearningProgress} from '@site/src/lib/api';

export default function LearningProgressTracker(): React.JSX.Element | null {
  const {pathname} = useLocation();

  useEffect(() => {
    if (!getSub2ApiToken() || !pathname.startsWith('/docs/')) return;
    const title = typeof document === 'undefined' ? '' : document.title.replace(/\s*[|｜].*$/, '').trim();
    const course = pathname.split('/').filter(Boolean)[1] || '';
    void recordLearningProgress({path: pathname, title, course}).catch(() => undefined);
  }, [pathname]);

  return null;
}
