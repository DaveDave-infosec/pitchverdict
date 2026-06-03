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

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

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

  useEffect(() => {
    const provider = window.ethereum;
    if (!provider) return;

    const manuallyDisconnected = localStorage.getItem(DISCONNECT_FLAG) === 'true';
    if (manuallyDisconnected) return;

    provider
      .request({ method: 'eth_accounts' })
      .then((accs: string[]) => {
        if (Array.isArray(accs) && accs.length > 0) {
          setAccount(accs[0]);
        }
      })
      .catch(() => {});

    const onAccountsChanged = (accs: string[]) => {
      if (!Array.isArray(accs) || accs.length === 0) {
        setAccount(null);
      } else if (localStorage.getItem(DISCONNECT_FLAG) !== 'true') {
        setAccount(accs[0]);
      }
    };
    const onChainChanged = () => window.location.reload();

    provider.on?.('accountsChanged', onAccountsChanged);
    provider.on?.('chainChanged', onChainChanged);

    return () => {
      provider.removeListener?.('accountsChanged', onAccountsChanged);
      provider.removeListener?.('chainChanged', onChainChanged);
    };
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
        setAccount(accs[0]);
      }
    } catch (err) {
      console.error('Wallet connect failed', err);
    } finally {
      setIsConnecting(false);
    }
  }, [ensureStudioNetwork]);

  const disconnect = useCallback(() => {
    localStorage.setItem(DISCONNECT_FLAG, 'true');
    setAccount(null);
  }, []);

  return { account, isConnecting, connect, disconnect, ensureStudioNetwork };
}