import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './ResumePreviewDrawer.css';

const extractDriveFileId = (url) => {
  if (!url) return null;
  const match = url.match(/https:\/\/drive\.google\.com\/file\/d\/([^/]+)\//);
  return match && match[1] ? match[1] : null;
};

const buildResumeSources = (url) => {
  if (!url) {
    return {
      previewUrl: '',
      downloadUrl: '',
    };
  }

  const driveFileId = extractDriveFileId(url);

  if (driveFileId) {
    return {
      previewUrl: `https://drive.google.com/file/d/${driveFileId}/preview`,
      downloadUrl: `https://drive.usercontent.google.com/download?id=${driveFileId}&export=download`,
    };
  }

  return {
    previewUrl: url,
    downloadUrl: url,
  };
};

const ResumePreviewDrawer = ({ isOpen, onClose, resumeUrl }) => {
  const { previewUrl, downloadUrl } = useMemo(() => buildResumeSources(resumeUrl), [resumeUrl]);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsDownloading(false);
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      setIsDownloading(false);
    };
  }, [isOpen, onClose]);

  const handleDownload = (event) => {
    if (!downloadUrl || isDownloading) {
      return;
    }

    event.preventDefault();
    setIsDownloading(true);

    const popup = window.open(downloadUrl, '_blank', 'noopener');

    if (!popup) {
      setIsDownloading(false);
      return;
    }

    window.setTimeout(() => {
      setIsDownloading(false);
      try {
        popup.close();
      } catch (error) {
        /* Ignore close restrictions */
      }
    }, 500);
  };

  return (
    <div className={`resume-drawer ${isOpen ? 'resume-drawer--open' : ''}`} aria-hidden={!isOpen}>
      <div className="resume-drawer__overlay" onClick={onClose} />
      <aside
        className="resume-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-drawer-title"
      >
        <header className="resume-drawer__header">
          <div>
            <h2 id="resume-drawer-title">Resume Preview</h2>
            <p>Review the latest resume before downloading.</p>
          </div>
          <div className="resume-drawer__actions">
            <button
              type="button"
              className="resume-drawer__download"
              onClick={handleDownload}
              disabled={isDownloading || !downloadUrl}
            >
              {isDownloading && <span className="resume-drawer__button-spinner" aria-hidden="true"></span>}
              <span>{isDownloading ? 'Preparing…' : 'Download'}</span>
            </button>
            <button type="button" className="resume-drawer__close" onClick={onClose} aria-label="Close resume preview">
              ×
            </button>
          </div>
        </header>
        <div className="resume-drawer__content">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              title="Resume preview"
              className="resume-drawer__frame"
              allow="autoplay"
            />
          ) : (
            <div className="resume-drawer__fallback">
              <p>Preview unavailable. You can still download the resume using the button above.</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

ResumePreviewDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  resumeUrl: PropTypes.string.isRequired,
};

export default ResumePreviewDrawer;
