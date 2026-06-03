import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import { CONTRACT_ADDRESS } from '../../lib/constants';
import './Header.css';

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function Header() {
  const { account, connect, isConnecting, disconnect } = useWallet();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!popoverOpen) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [popoverOpen]);

  const copyAddress = async () => {
    if (!account) return;
    try {
      await navigator.clipboard.writeText(account);
    } catch {}
  };

  const handleDisconnect = () => {
    disconnect();
    setPopoverOpen(false);
  };

  return (
    <>
      <div className="header-live-bar">
        <span className="header-live-bar__dot" />
        <span>LIVE ON GENLAYER STUDIO</span>
      </div>
      <header className="header">
        <Link to="/" className="header__logo">PitchVerdict</Link>

        <nav className="header__nav">
          <NavLink to="/pitch" className={({ isActive }) => `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`}>
            Pitch
          </NavLink>
          <NavLink to="/my" className={({ isActive }) => `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`}>
            My Pitches
          </NavLink>
        </nav>

        <div className="header__pills">
          <a
            href={`https://explorer-studio.genlayer.com/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="header__pill header__pill--contract"
            title="View contract on GenLayer Studio explorer"
          >
            <span className="header__pill-dot" />
            {shortAddr(CONTRACT_ADDRESS)}
          </a>

          {account ? (
            <div className="header__wallet-wrap" ref={popoverRef}>
              <button
                className="header__pill header__pill--wallet"
                onClick={() => setPopoverOpen((o) => !o)}
                aria-haspopup="true"
                aria-expanded={popoverOpen}
              >
                {shortAddr(account)}
              </button>
              {popoverOpen && (
                <div className="header__wallet-popover" role="menu">
                  <div className="header__wallet-popover-row">
                    <span className="header__wallet-popover-label">Connected wallet</span>
                    <span className="header__wallet-popover-addr">{account}</span>
                  </div>
                  <button className="header__wallet-popover-action" onClick={copyAddress}>
                    Copy address
                  </button>
                  <a
                    href={`https://explorer-studio.genlayer.com/address/${account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="header__wallet-popover-action"
                  >
                    View on explorer ↗
                  </a>
                  <button
                    className="header__wallet-popover-action header__wallet-popover-action--danger"
                    onClick={handleDisconnect}
                  >
                    Sign out
                  </button>
                  <div className="header__wallet-popover-note">
                    To revoke permissions fully, manage in MetaMask → Connected sites.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="header__pill header__pill--connect"
              onClick={connect}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting…' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </header>
    </>
  );
}