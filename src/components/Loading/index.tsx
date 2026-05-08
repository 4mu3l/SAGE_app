import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LoadingProps {
    mensagem?: string;
}

export default function Loading({ mensagem = 'Carregando...' }: LoadingProps) {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#2E7D32', '#66BB6A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.texto}>{mensagem}</Text>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    texto: {
        marginTop: 16,
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
});