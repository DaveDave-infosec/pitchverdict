import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import type { PitchResult } from '../../types';
import { ShareCard } from './ShareCard';
import './ShareButton.css';

interface ShareButtonProps {
  result: PitchResult;
}

export function ShareButton({ result }: ShareButtonProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      await new Promise((r) => setTimeout(r, 120));

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#07070B',
        useCORS: true,
        allowTaint: false,
        logging: false,
        imageTimeout: 5000,
      });

      const link = document.createElement('a');
      const safeName = result.startup_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      link.download = `pitchverdict-${safeName || 'result'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Share card export failed', e);
      alert('Could not export the share card. Try again, or screenshot the page.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="share-button"
        onClick={handleExport}
        disabled={exporting}
      >
        {exporting ? 'Generating image...' : 'Share as image \u2197'}
      </button>

      <div className="share-card-portal" aria-hidden="true">
        <ShareCard ref={cardRef} result={result} />
      </div>
    </>
  );
}