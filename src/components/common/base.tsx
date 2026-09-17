import React from 'react';
import Link from '@docusaurus/Link';

type HighlightProps = {
  children: React.ReactNode;
  color?: string;
};

export function H({children, color = '#14b8a6'}: HighlightProps) {
  return (
    <span
      style={{
        backgroundColor: color,
        borderRadius: '2px',
        color: '#fff',
        padding: '0.15rem 0.35rem',
      }}>
      {children}
    </span>
  );
}

type ContentItem = {
  title: string;
  desc: string;
  footer?: string;
};

export function ContentList({items}: {items: ContentItem[]}) {
  return (
    <div className="hs-content-list">
      {items.map((item) => (
        <Link className="hs-content-item" to={item.footer || '#'} key={item.title}>
          <strong>{item.title}</strong>
          <span>{item.desc}</span>
          {item.footer ? <small>{item.footer}</small> : null}
        </Link>
      ))}
    </div>
  );
}

type BookProps = {
  url: string;
  img: string;
  title: string;
  desc?: string;
};

export function Book({url, img, title, desc}: BookProps) {
  return (
    <a className="book-content" href={url} target="_blank" rel="noreferrer">
      <div className="book-img">
        <img src={img} alt="" />
      </div>
      <div className="book-detail">
        <div className="book-title">{title}</div>
        {desc ? <div className="book-desc">{desc}</div> : null}
      </div>
    </a>
  );
}
