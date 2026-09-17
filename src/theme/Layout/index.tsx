import React, {type ReactNode} from 'react';
import OriginalLayout from '@theme-original/Layout';
import type {Props} from '@theme/Layout';
import MobileBottomNav from '@site/src/components/common/MobileBottomNav';

export default function Layout(props: Props): ReactNode {
  return (
    <>
      <OriginalLayout {...props} />
      <MobileBottomNav />
    </>
  );
}
