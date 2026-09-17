import React from 'react';

import {cn} from '@site/src/lib/utils';

type CardProps = React.HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'button';
  type?: 'button' | 'submit' | 'reset';
};

const Card = ({as: Component = 'div', className, ...props}: CardProps) => (
  <Component className={cn('ui-card', className)} {...props} />
);

export {Card};
