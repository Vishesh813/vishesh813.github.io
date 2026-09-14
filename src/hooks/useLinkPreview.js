import { useState, useRef } from 'react';

const previewCache = new Map();

const buildPreviewPayload = (payload = {}) => {
  if (!payload) return null;

  const { title, description, publisher, url, image, screenshot, icon } = payload;
  const screenshotUrl = screenshot?.url || image?.url || null;
  const iconUrl = icon?.url || null;

  return {
    title: title || publisher || null,
    description: description || null,
    url: url || null,
    screenshot: screenshotUrl,
    icon: iconUrl,
  };
};

export const useLinkPreview = (href) => {
  const [status, setStatus] = useState(() => (href && previewCache.has(href) ? 'success' : 'idle'));
  const [data, setData] = useState(() => (href ? previewCache.get(href) || null : null));
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const fetchPreview = async () => {
    if (!href) return;

    if (previewCache.has(href)) {
      setStatus('success');
      setData(previewCache.get(href));
      setError(null);
      return;
    }

    controllerRef.current?.abort?.();
    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus('loading');
    setError(null);

    try {
      const response = await fetch(
        `https://api.microlink.io/?url=${encodeURIComponent(href)}&screenshot=true&meta=true`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error(`Preview request failed with status ${response.status}`);
      }

      const payload = await response.json();

      if (payload.status !== 'success' || !payload.data) {
        throw new Error('Preview service returned an unexpected response');
      }

      const parsed = buildPreviewPayload(payload.data);
      previewCache.set(href, parsed);
      setData(parsed);
      setStatus('success');
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      setError(err);
      setStatus('error');
    }
  };

  const cancel = () => {
    controllerRef.current?.abort?.();
  };

  return {
    status,
    data,
    error,
    fetchPreview,
    cancel,
  };
};

export default useLinkPreview;
