import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Modal } from 'react-native';

interface LoadingOverlayProps {
    visivel: boolean;
    mensagem?: string;
}

export default function LoadingOverlay({ visivel, mensagem = 'Carregando...' }: LoadingOverlayProps) {
    return (
        <Modal
            transparent
            visible={visivel}
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <ActivityIndicator size="large" color="#2E7D32" />
                    <Text style={styles.mensagem}>{mensagem}</Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 30,
        paddingHorizontal: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    mensagem: {
        marginTop: 16,
        fontSize: 16,
        color: '#333333',
        fontWeight: '600',
    },
});