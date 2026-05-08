import { useState, useCallback } from 'react';

export function useLoading() {
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState('Carregando...');

    const iniciar = useCallback((msg?: string) => {
        setMensagem(msg || 'Carregando...');
        setCarregando(true);
    }, []);

    const parar = useCallback(() => {
        setCarregando(false);
    }, []);

    return { carregando, mensagem, iniciar, parar };
}