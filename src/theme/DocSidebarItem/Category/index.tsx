import React, {
  type ComponentProps,
  type ReactNode,
  useEffect,
} from 'react';
import clsx from 'clsx';
import {
  ThemeClassNames,
  useThemeConfig,
  usePrevious,
  Collapsible,
  useCollapsible,
} from '@docusaurus/theme-common';
import {
  isActiveSidebarItem,
  useDocSidebarItemsExpandedState,
  useVisibleSidebarItems,
} from '@docusaurus/plugin-content-docs/client';
import {translate} from '@docusaurus/Translate';
import DocSidebarItems from '@theme/DocSidebarItems';
import type {Props} from '@theme/DocSidebarItem/Category';
import styles from './styles.module.css';

function useAutoExpandActiveCategory({
  isActive,
  collapsed,
  updateCollapsed,
  activePath,
}: {
  isActive: boolean;
  collapsed: boolean;
  updateCollapsed: (collapsed: boolean) => void;
  activePath: string;
}) {
  const wasActive = usePrevious(isActive);
  const previousActivePath = usePrevious(activePath);

  useEffect(() => {
    const justBecameActive = isActive && !wasActive;
    const stillActiveButPathChanged =
      isActive && wasActive && activePath !== previousActivePath;

    if ((justBecameActive || stillActiveButPathChanged) && collapsed) {
      updateCollapsed(false);
    }
  }, [
    isActive,
    wasActive,
    collapsed,
    updateCollapsed,
    activePath,
    previousActivePath,
  ]);
}

function CategoryLabel({label}: {label: string}) {
  return (
    <span title={label} className={styles.categoryButtonLabel}>
      {label}
    </span>
  );
}

export default function DocSidebarItemCategory(props: Props): ReactNode {
  const visibleChildren = useVisibleSidebarItems(
    props.item.items,
    props.activePath,
  );

  if (visibleChildren.length === 0) {
    return null;
  }

  return <DocSidebarItemCategoryCollapsible {...props} />;
}

function DocSidebarItemCategoryCollapsible({
  item,
  onItemClick,
  activePath,
  level,
  index,
}: Props): ReactNode {
  const {items, label, collapsible, className} = item;
  const {
    docs: {
      sidebar: {autoCollapseCategories},
    },
  } = useThemeConfig();

  const isActive = isActiveSidebarItem(item, activePath);
  const {collapsed, setCollapsed} = useCollapsible({
    initialState: () => {
      if (!collapsible) {
        return false;
      }
      return isActive ? false : item.collapsed;
    },
  });

  const {expandedItem, setExpandedItem} = useDocSidebarItemsExpandedState();
  const updateCollapsed = (toCollapsed: boolean = !collapsed) => {
    setExpandedItem(toCollapsed ? null : index);
    setCollapsed(toCollapsed);
  };

  useAutoExpandActiveCategory({
    isActive,
    collapsed,
    updateCollapsed,
    activePath,
  });

  useEffect(() => {
    if (
      collapsible &&
      expandedItem != null &&
      expandedItem !== index &&
      autoCollapseCategories
    ) {
      setCollapsed(true);
    }
  }, [collapsible, expandedItem, index, setCollapsed, autoCollapseCategories]);

  const handleCategoryClick: ComponentProps<'button'>['onClick'] = () => {
    onItemClick?.(item);
    if (collapsible) {
      updateCollapsed();
    }
  };

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemCategory,
        ThemeClassNames.docs.docSidebarItemCategoryLevel(level),
        'menu__list-item',
        {
          'menu__list-item--collapsed': collapsed,
        },
        className,
      )}>
      <div
        className={clsx('menu__list-item-collapsible', {
          'menu__list-item-collapsible--active': isActive,
        })}>
        <button
          type="button"
          className={clsx(
            styles.categoryButton,
            'clean-btn',
            'menu__link',
            {
              'menu__link--sublist': collapsible,
              'menu__link--sublist-caret': collapsible,
              'menu__link--active': isActive,
            },
          )}
          aria-label={
            collapsed
              ? translate(
                  {
                    id: 'theme.DocSidebarItem.expandCategoryAriaLabel',
                    message: "Expand sidebar category '{label}'",
                    description:
                      'The ARIA label to expand the sidebar category',
                  },
                  {label},
                )
              : translate(
                  {
                    id: 'theme.DocSidebarItem.collapseCategoryAriaLabel',
                    message: "Collapse sidebar category '{label}'",
                    description:
                      'The ARIA label to collapse the sidebar category',
                  },
                  {label},
                )
          }
          aria-expanded={collapsible ? !collapsed : undefined}
          onClick={handleCategoryClick}>
          <CategoryLabel label={label} />
        </button>
      </div>

      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        <DocSidebarItems
          items={items}
          tabIndex={collapsed ? -1 : 0}
          onItemClick={onItemClick}
          activePath={activePath}
          level={level + 1}
        />
      </Collapsible>
    </li>
  );
}
