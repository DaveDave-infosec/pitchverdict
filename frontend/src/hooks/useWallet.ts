import { useEffect, useState, useCallback } from 'react';
import { STUDIO_CHAIN_ID_HEX } from '../lib/constants';

const DISCONNECT_FLAG = 'pitchverdict_disconnected';

interface Eip1193Provider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

// Module-level shared state so every useWallet() call sees the same wallet.
type Listener = (account: string | null) => void;
let sharedAccount: string | null = null;
const listeners = new Set<Listener>();
let globalSetupDone = false;

function emitSharedAccount(next: string | null) {
  sharedAccount = next;
  listeners.forEach((fn) => fn(next));
}

function setupGlobalListeners() {
  if (globalSetupDone) return;
  globalSetupDone = true;

  const provider = window.ethereum;
  if (!provider) return;

  const onAccountsChanged = (accs: string[]) => {
    if (!Array.isArray(accs) || accs.length === 0) {
      emitSharedAccount(null);
    } else if (localStorage.getItem(DISCONNECT_FLAG) !== 'true') {
      emitSharedAccount(accs[0]);
    }
  };
  const onChainChanged = () => window.location.reload();

  provider.on?.('accountsChanged', onAccountsChanged);
  provider.on?.('chainChanged', onChainChanged);

  // Silent restore on first setup if user has not explicitly signed out.
  const manuallyDisconnected = localStorage.getItem(DISCONNECT_FLAG) === 'true';
  if (!manuallyDisconnected) {
    provider
      .request({ method: 'eth_accounts' })
      .then((accs: string[]) => {
        if (Array.isArray(accs) && accs.length > 0) {
          emitSharedAccount(accs[0]);
        }
      })
      .catch(() => {});
  }
}

export function useWallet() {
  // Initialize with the latest known sharedAccount so late-mounting hooks do not lag.
  const [account, setAccountLocal] = useState<string | null>(sharedAccount);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    setupGlobalListeners();
    listeners.add(setAccountLocal);
    // Sync to current shared value in case it changed before this effect ran.
    setAccountLocal(sharedAccount);
    return () => {
      listeners.delete(setAccountLocal);
    };
  }, []);

  const ensureStudioNetwork = useCallback(async () => {
    const provider = window.ethereum;
    if (!provider) return;
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: STUDIO_CHAIN_ID_HEX }],
      });
    } catch (err: any) {
      if (err?.code === 4902) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: STUDIO_CHAIN_ID_HEX,
              chainName: 'GenLayer Studio',
              rpcUrls: ['https://studio.genlayer.com/api'],
              nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
              blockExplorerUrls: ['https://explorer-studio.genlayer.com'],
            },
          ],
        });
      }
    }
  }, []);

  const connect = useCallback(async () => {
    const provider = window.ethereum;
    if (!provider) {
      alert('MetaMask not detected. Install it to continue.');
      return;
    }
    setIsConnecting(true);
    try {
      localStorage.removeItem(DISCONNECT_FLAG);
      const accs: string[] = await provider.request({ method: 'eth_requestAccounts' });
      if (Array.isArray(accs) && accs.length > 0) {
        await ensureStudioNetwork();
        emitSharedAccount(accs[0]);
      }
    } catch (err) {
      console.error('Wallet connect failed', err);
    } finally {
      setIsConnecting(false);
    }
  }, [ensureStudioNetwork]);

  const disconnect = useCallback(() => {
    localStorage.setItem(DISCONNECT_FLAG, 'true');
    emitSharedAccount(null);
  }, []);

  return { account, isConnecting, connect, disconnect, ensureStudioNetwork };
}