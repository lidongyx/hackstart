import React, {type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import {configureSub2ApiAuth, consumeAuthTokenFromFragment} from '@site/src/lib/sub2api-auth';
import {configureMemberApi} from '@site/src/lib/api';

type Props = {children: ReactNode};

export default function Root({children}: Props): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  configureSub2ApiAuth(String(siteConfig.customFields?.authApiUrl || ''), String(siteConfig.customFields?.sub2ApiBaseUrl || ''));
  configureMemberApi(String(siteConfig.customFields?.hackadminApiBaseUrl || ''), String(siteConfig.customFields?.sub2ApiBaseUrl || ''));
  consumeAuthTokenFromFragment();
  return <>{children}</>;
}
