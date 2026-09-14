import React, { useState, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './LinkPreview.css';
import useLinkPreview from '@hooks/useLinkPreview';

const stripProtocol = (value) => {
  if (!value) return '';

  try {
    const parsed = new URL(value);
    return parsed.host + parsed.pathname.replace(/\/$/, '');
  } catch (error) {
    // Fallback for mailto or invalid URLs
    return value.replace(/^mailto:/, '').replace(/^https?:\/\//, '');
  }
};

const getChildText = (children) =>
  typeof children === 'string' ? children : undefined;

const HOST_PREVIEW_MAP = [
  {
    test: (url) => url.protocol === 'mailto:',
    resolve: (url) => {
      const email = url.href.replace(/^mailto:/i, '');
      return {
        title: email,
        description: `Send an email to ${email}`,
        icon: '✉️',
        displayUrl: email,
      };
    },
  },
  {
    test: (url) => url.hostname.includes('linkedin.com'),
    resolve: (url) => ({
      title: 'LinkedIn',
      description: 'Open LinkedIn profile',
      icon: '🔗',
      displayUrl: `${url.hostname.replace(/^www\./, '')}${url.pathname.replace(/\/$/, '')}`,
    }),
  },
  {
    test: (url) => url.hostname.includes('github.com'),
    resolve: (url) => ({
      title: 'GitHub',
      description: 'Browse code on GitHub',
      icon: '💻',
      displayUrl: `${url.hostname.replace(/^www\./, '')}${url.pathname.replace(/\/$/, '')}`,
    }),
  },
  {
    test: (url) => url.hostname.includes('twitter.com') || url.hostname.includes('x.com'),
    resolve: (url) => ({
      title: 'Twitter',
      description: 'View profile on Twitter',
      icon: '🐦',
      displayUrl: `${url.hostname.replace(/^www\./, '')}${url.pathname.replace(/\/$/, '')}`,
    }),
  },
];

const getDefaultPreview = (href, children) => {
  if (!href) {
    return {};
  }

  try {
    const url = new URL(href);
    const match = HOST_PREVIEW_MAP.find(({ test }) => test(url));

    if (match) {
      return match.resolve(url);
    }

    const hostname = url.hostname.replace(/^www\./, '');
    const pathname = url.pathname && url.pathname !== '/' ? url.pathname.replace(/\/$/, '') : '';

    return {
      title: hostname,
      description: `Open ${hostname}`,
      icon: '🔗',
      displayUrl: `${hostname}${pathname}`,
    };
  } catch (error) {
    const childText = getChildText(children);
    const fallback = childText || stripProtocol(href);
    return {
      title: fallback,
      description: 'Open link',
      icon: '🔗',
      displayUrl: stripProtocol(href),
    };
  }
};

const LINKEDIN_PREVIEW_IMAGE = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="680" height="360" viewBox="0 0 680 360" role="img" aria-label="LinkedIn preview">
    <defs>
      <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stop-color="#0a66c2" />
        <stop offset="100%" stop-color="#004182" />
      </linearGradient>
    </defs>
    <rect width="680" height="360" fill="url(#bg)" rx="28"/>
    <circle cx="100" cy="100" r="52" fill="#ffffff" opacity="0.12" />
    <circle cx="180" cy="80" r="32" fill="#ffffff" opacity="0.08" />
    <text x="56" y="196" font-family="'Segoe UI', Arial, sans-serif" font-size="56" font-weight="700" fill="#ffffff">LinkedIn Profile</text>
    <text x="56" y="252" font-family="'Segoe UI', Arial, sans-serif" font-size="28" fill="#dce9f9">Stay connected with Vishesh</text>
    <rect x="52" y="274" width="220" height="6" rx="3" fill="#2e86da" />
    <rect x="52" y="294" width="320" height="6" rx="3" fill="#2e86da" opacity="0.6" />
  </svg>
`)}
`;

const FALLBACK_PREVIEWS = [
  {
    test: (url) => url.hostname.includes('linkedin.com'),
    data: {
      title: 'LinkedIn Profile',
      description: 'Connect with Vishesh on LinkedIn',
      icon: '🔗',
      displayUrl: 'linkedin.com/vishesh-tiwari-448222146',
      url: 'https://www.linkedin.com/in/vishesh-tiwari-448222146/',
      screenshot: LINKEDIN_PREVIEW_IMAGE,
    },
  },
];

const getFallbackPreview = (href) => {
  if (!href) return null;

  try {
    const url = new URL(href);
    const fallback = FALLBACK_PREVIEWS.find(({ test }) => test(url));
    return fallback ? fallback.data : null;
  } catch (error) {
    return null;
  }
};

const LinkPreview = ({
  href,
  children,
  className = '',
  previewTitle,
  previewDescription,
  previewUrl,
  previewIcon,
  placement = 'top',
  target,
  rel = 'noopener noreferrer',
  ...anchorProps
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const visibilityTimeoutRef = useRef(null);
  const isMailLink = href?.toLowerCase().startsWith('mailto:');
  const previewEndpoint = previewUrl || href;
  const fallbackPreview = useMemo(() => getFallbackPreview(previewEndpoint), [previewEndpoint]);
  const shouldSkipFetch = isMailLink || Boolean(fallbackPreview);
  const { status, data, fetchPreview } = useLinkPreview(shouldSkipFetch ? null : previewEndpoint);
  const previewData = useMemo(() => getDefaultPreview(previewEndpoint || href, children), [href, children, previewEndpoint]);
  const previewSource = data || fallbackPreview || {};
  const derivedTitle =
    previewTitle ||
    previewSource.title ||
    previewData.title ||
    getChildText(children) ||
    stripProtocol(previewEndpoint || href);
  const derivedDescription = previewDescription || previewSource.description || previewData.description;
  const derivedUrl = previewSource.url || previewUrl || href;
  const displayUrl = stripProtocol(previewSource.displayUrl || previewData.displayUrl || derivedUrl);
  const derivedIcon = previewIcon || previewSource.icon || previewData.icon;
  const screenshotSrc = previewSource.screenshot;
  const effectiveStatus = shouldSkipFetch ? 'success' : status;
  const resolvedTarget = target ?? (isMailLink ? '_self' : '_blank');
  const effectiveRel = resolvedTarget === '_blank' ? rel : undefined;

  const clearTimers = () => {
    clearTimeout(showTimeoutRef.current);
    clearTimeout(hideTimeoutRef.current);
    clearTimeout(visibilityTimeoutRef.current);
  };

  useEffect(() => () => clearTimers(), []);

  const handleShow = () => {
    clearTimers();
    if (!isVisible) {
      setIsVisible(true);
    }
    showTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
      if (!shouldSkipFetch && href) {
        fetchPreview();
      }
    }, 120);
  };

  const handleHide = () => {
    clearTimeout(showTimeoutRef.current);
    clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      visibilityTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 420);
    }, 160);
  };

  return (
    <span
      className={`link-preview-wrapper link-preview-${placement}`}
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
      onFocus={handleShow}
      onBlur={handleHide}
    >
      <a
        href={href}
        className={className}
        target={resolvedTarget}
        rel={effectiveRel}
        {...anchorProps}
      >
        {children}
      </a>
      {isVisible && (
        <div
          className={`link-preview-popover${isHovered ? ' link-preview-popover--visible' : ''}`}
          role="tooltip"
          onMouseEnter={handleShow}
          onMouseLeave={handleHide}
        >
          {effectiveStatus === 'loading' && (
            <div className="link-preview-loading">
              <span className="link-preview-spinner" aria-hidden="true"></span>
              <span className="link-preview-loading-text">Loading preview…</span>
            </div>
          )}

          {effectiveStatus !== 'loading' && screenshotSrc && (
            <div className="link-preview-media">
              <img
                src={screenshotSrc}
                alt={`Preview of ${displayUrl}`}
                className="link-preview-image"
                loading="lazy"
              />
            </div>
          )}

          <div className="link-preview-content">
            {(derivedIcon || previewSource.icon) && (
              <span className="link-preview-icon">
                {previewSource.icon && typeof previewSource.icon === 'string' && previewSource.icon.startsWith('http') ? (
                  <img src={previewSource.icon} alt="" aria-hidden="true" />
                ) : derivedIcon}
              </span>
            )}
            <span className="link-preview-title">{previewSource.title || derivedTitle}</span>
            {(previewSource.description || derivedDescription) && (
              <span className="link-preview-description">{previewSource.description || derivedDescription}</span>
            )}
            {(previewSource.url || displayUrl) && (
              <span className="link-preview-url">{stripProtocol(previewSource.url || displayUrl)}</span>
            )}

            {status === 'error' && !shouldSkipFetch && (
              <span className="link-preview-error">Unable to load preview</span>
            )}
          </div>
        </div>
      )}
    </span>
  );
};

LinkPreview.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  previewTitle: PropTypes.string,
  previewDescription: PropTypes.string,
  previewUrl: PropTypes.string,
  previewIcon: PropTypes.node,
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  target: PropTypes.string,
  rel: PropTypes.string,
};

export default LinkPreview;
