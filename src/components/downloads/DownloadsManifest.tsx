import React, {useEffect, useMemo, useState} from 'react';

const MANIFEST_URL = 'https://downloads.hackstart.org/downloads/manifest.json';

type LocalText = string | {zh?: string; en?: string};

type DownloadItem = {
  id: string;
  system: string;
  chip: string;
  arch: string;
  fileName: string;
  sourceUrl: string;
  downloadUrl?: string;
  mirrored?: boolean;
  size?: number | null;
  lastModified?: string | null;
  notes?: LocalText;
  syncError?: string;
};

type DownloadApp = {
  id: string;
  name: string;
  officialPage: string;
  description?: LocalText;
  items: DownloadItem[];
};

type DownloadManifest = {
  generatedAt?: string;
  apps: DownloadApp[];
};

type LoadState =
  | {status: 'loading'}
  | {status: 'ready'; manifest: DownloadManifest}
  | {status: 'error'; message: string};

function localText(value?: LocalText) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.zh || value.en || '';
}

function formatBytes(value?: number | null) {
  if (!value) return '-';
  const mb = value / 1024 / 1024;
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
  return `${mb.toFixed(1)} MB`;
}

function formatDate(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toISOString().slice(0, 10);
}

function uniqueValues(items: DownloadItem[], key: 'system' | 'arch') {
  return Array.from(new Set(items.map((item) => item[key]).filter(Boolean)));
}

function displayArch(value: string) {
  if (value === 'x64') return 'x64 / Intel';
  if (value === 'arm64') return 'ARM64';
  if (value === 'universal') return '通用';
  return value;
}

export default function DownloadsManifest() {
  const [loadState, setLoadState] = useState<LoadState>({status: 'loading'});
  const [activeAppId, setActiveAppId] = useState<string>('');
  const [activeSystem, setActiveSystem] = useState('all');
  const [activeArch, setActiveArch] = useState('all');

  useEffect(() => {
    let mounted = true;

    fetch(MANIFEST_URL, {cache: 'no-store'})
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json() as Promise<DownloadManifest>;
      })
      .then((manifest) => {
        if (!mounted) return;
        setLoadState({status: 'ready', manifest});
        setActiveAppId((current) => current || manifest.apps[0]?.id || '');
      })
      .catch((error: unknown) => {
        if (!mounted) return;
        const message = error instanceof Error ? error.message : 'unknown error';
        setLoadState({status: 'error', message});
      });

    return () => {
      mounted = false;
    };
  }, []);

  const activeApp = useMemo(() => {
    if (loadState.status !== 'ready') return undefined;
    return (
      loadState.manifest.apps.find((app) => app.id === activeAppId) ||
      loadState.manifest.apps[0]
    );
  }, [activeAppId, loadState]);

  const visibleItems = useMemo(() => {
    const items = activeApp?.items || [];
    return items.filter((item) => {
      if (activeSystem !== 'all' && item.system !== activeSystem) return false;
      if (activeArch !== 'all' && item.arch !== activeArch) return false;
      return true;
    });
  }, [activeApp, activeArch, activeSystem]);

  if (loadState.status === 'loading') {
    return (
      <div className="hs-downloads-status">
        <strong>下载清单加载中</strong>
        <span>正在读取 HackStart 镜像 manifest。</span>
      </div>
    );
  }

  if (loadState.status === 'error') {
    return (
      <div className="hs-downloads-status hs-downloads-status--error">
        <strong>下载清单加载失败</strong>
        <span>请刷新页面，或检查 manifest 是否已经生成：{loadState.message}</span>
      </div>
    );
  }

  if (!activeApp) {
    return (
      <div className="hs-downloads-status">
        <strong>暂无下载项</strong>
        <span>manifest 中还没有可展示的软件。</span>
      </div>
    );
  }

  const systems = uniqueValues(activeApp.items, 'system');
  const archs = uniqueValues(activeApp.items, 'arch');

  return (
    <section className="hs-downloads">
      <div className="hs-downloads-tabs" aria-label="软件列表">
        {loadState.manifest.apps.map((app) => (
          <button
            className={app.id === activeApp.id ? 'active' : ''}
            key={app.id}
            onClick={() => {
              setActiveAppId(app.id);
              setActiveSystem('all');
              setActiveArch('all');
            }}
            type="button">
            {app.name}
          </button>
        ))}
      </div>

      <div className="hs-downloads-panel">
        <div className="hs-downloads-summary">
          <div>
            <h2>{activeApp.name}</h2>
            <p>{localText(activeApp.description)}</p>
          </div>
          <a href={activeApp.officialPage} rel="noreferrer" target="_blank">
            官方页面
          </a>
        </div>

        <div className="hs-downloads-filters">
          <Filter
            active={activeSystem}
            label="系统"
            onChange={setActiveSystem}
            values={systems}
          />
          <Filter
            active={activeArch}
            format={displayArch}
            label="芯片"
            onChange={setActiveArch}
            values={archs}
          />
        </div>

        <div className="hs-downloads-grid">
          {visibleItems.map((item) => (
            <DownloadCard item={item} key={item.id} />
          ))}
        </div>

        <p className="hs-downloads-note">
          当前清单生成时间：{formatDate(loadState.manifest.generatedAt)}。安装包由
          Lambda 定时从官方来源同步到 AWS S3，若某个官方源临时不可访问，页面会继续保留已有镜像或官方备用链接。
        </p>
      </div>
    </section>
  );
}

function Filter({
  active,
  format = (value: string) => value,
  label,
  onChange,
  values,
}: {
  active: string;
  format?: (value: string) => string;
  label: string;
  onChange: (value: string) => void;
  values: string[];
}) {
  return (
    <div className="hs-downloads-filter">
      <span>{label}</span>
      <div>
        <button
          className={active === 'all' ? 'active' : ''}
          onClick={() => onChange('all')}
          type="button">
          全部
        </button>
        {values.map((value) => (
          <button
            className={active === value ? 'active' : ''}
            key={value}
            onClick={() => onChange(value)}
            type="button">
            {format(value)}
          </button>
        ))}
      </div>
    </div>
  );
}

function DownloadCard({item}: {item: DownloadItem}) {
  const mirrored = item.mirrored !== false && Boolean(item.downloadUrl);
  const downloadUrl = mirrored ? item.downloadUrl : item.sourceUrl;

  return (
    <article className={`hs-downloads-card ${mirrored ? '' : 'pending'}`}>
      <div className="hs-downloads-badges">
        <span>{item.system}</span>
        <span>{item.chip}</span>
      </div>
      <h3>{item.fileName}</h3>
      <p>{localText(item.notes)}</p>
      <dl>
        <div>
          <dt>文件大小</dt>
          <dd>{formatBytes(item.size)}</dd>
        </div>
        <div>
          <dt>同步时间</dt>
          <dd>{formatDate(item.lastModified)}</dd>
        </div>
      </dl>
      <a href={downloadUrl} rel="noreferrer" target="_blank">
        {mirrored ? 'HackStart 镜像下载' : '打开官方备用链接'}
      </a>
      <small>官方来源：{item.sourceUrl}</small>
      {item.syncError ? <small>最近同步提示：{item.syncError}</small> : null}
    </article>
  );
}
