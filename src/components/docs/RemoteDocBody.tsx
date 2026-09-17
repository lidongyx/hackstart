import React, {useEffect, useMemo, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {sub2ApiFetch} from '@site/src/lib/sub2api-auth';
import styles from './RemoteDocBody.module.css';

type Props = {course: string; path: string};
type ResponseBody = {content?: string};

export default function RemoteDocBody({course, path}: Props): React.JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const apiBase = String(siteConfig.customFields?.courseContentApiBaseUrl || '').replace(/\/$/, '');
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [content, setContent] = useState('');
  const encodedPath = useMemo(() => path.split('/').map((segment) => encodeURIComponent(segment)).join('/'), [path]);

  useEffect(() => {
    if (!apiBase) {
      setState('error');
      return undefined;
    }
    const controller = new AbortController();
    setState('loading');
    sub2ApiFetch(`${apiBase}/${encodeURIComponent(course)}/${encodedPath}`, {
      signal: controller.signal,
      headers: {Accept: 'application/json'},
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`content api failed: ${response.status}`);
        const body = await response.json() as ResponseBody;
        setContent(typeof body.content === 'string' ? body.content : '');
        setState('ready');
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setState('error');
      });
    return () => controller.abort();
  }, [apiBase, course, encodedPath]);

  if (state === 'loading') return <div className={styles.state}>正在加载课程正文...</div>;
  if (state === 'error') return <div className={styles.state}>正文暂时无法加载，请刷新页面重试。</div>;
  return (
    <div className={styles.body} data-remote-doc-body>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
