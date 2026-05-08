import React, { createContext, useContext, useState, useCallback } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';
import LoadingScreen from '../components/LoadingScreen';

interface LoadingContextData {
    mostrarLoading: (mensagem?: string, tipo?: 'overlay' | 'screen') => void;
    esconderLoading: () => void;
}

const LoadingContext = createContext<LoadingContextData>({} as LoadingContextData);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [visivel, setVisivel] = useState(false);
    const [mensagem, setMensagem] = useState('Carregando...');
    const [tipo, setTipo] = useState<'overlay' | 'screen'>('overlay');

    const mostrarLoading = useCallback((msg?: string, t: 'overlay' | 'screen' = 'overlay') => {
        setMensagem(msg || 'Carregando...');
        setTipo(t);
        setVisivel(true);
    }, []);

    const esconderLoading = useCallback(() => {
        setVisivel(false);
    }, []);

    return (
        <LoadingContext.Provider value={{ mostrarLoading, esconderLoading }}>
            {children}
            {visivel && tipo === 'overlay' && (
                <LoadingOverlay visivel={visivel} mensagem={mensagem} />
            )}
            {visivel && tipo === 'screen' && (
                <LoadingScreen mensagem={mensagem} />
            )}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading deve ser usado dentro de LoadingProvider');
    }
    return context;
}