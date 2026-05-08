import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LoadingScreenProps {
    mensagem?: string;
}

export default function LoadingScreen({ mensagem = 'Carregando...' }: LoadingScreenProps) {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#2E7D32', '#66BB6A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <Text style={styles.logo}>🌿</Text>
                <Text style={styles.titulo}>EcoConsumo</Text>
                <ActivityIndicator size="large" color="#FFFFFF" style={styles.spinner} />
                <Text style={styles.mensagem}>{mensagem}</Text>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        fontSize: 48,
        marginBottom: 8,
    },
    titulo: {
        fontSize: 28,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginBottom: 40,
    },
    spinner: {
        marginBottom: 16,
    },
    mensagem: {
        fontSize: 16,
        color: '#FFFFFF',
        opacity: 0.9,
    },
});