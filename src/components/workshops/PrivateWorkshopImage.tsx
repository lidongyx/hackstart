import {useEffect, useState} from 'react';

import {fetchWorkshopAsset} from '@site/src/lib/workshops';

export default function PrivateWorkshopImage({hackadminBase, src, alt, onOpen}: {hackadminBase: string; src: string; alt: string; onOpen?: (value: string) => void}): React.ReactNode {
  const [objectURL, setObjectURL] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    void fetchWorkshopAsset(hackadminBase, src, controller.signal).then((value) => active && setObjectURL(value)).catch(() => undefined);
    return () => {active = false; controller.abort();};
  }, [hackadminBase, src]);
  if (!objectURL) return <span className="hs-workshop-image-placeholder" aria-label="正在加载图片" />;
  return <button type="button" className="hs-workshop-image-button" onClick={() => onOpen?.(objectURL)}><img src={objectURL} alt={alt} /></button>;
}
