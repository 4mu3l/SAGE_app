import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { style } from "./styles";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';


export default function Perfil() {
    const navigation = useNavigation();
    
    const { usuario } = useUser();

    return (
        <View style={style.container}>
            {/* Header */}
            <LinearGradient
                colors={['#2E7D32', '#66BB6A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={style.header}
            >
                <TouchableOpacity 
                    style={style.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={style.título}>Meu Perfil</Text>
            </LinearGradient>

            {/* Info do usuário */}
            <View style={style.userInfo}>
                <View style={style.avatar}>
                    <Ionicons name="person" size={40} color="#2E7D32" />
                </View>
                <View>
                    <Text style={style.userName}>{usuario?.nome || 'Usuário'}</Text>
                    <Text style={style.userEmail}>{usuario?.email || 'email@email.com'}</Text>
                </View>
            </View>

            {/* Única opção: Editar Perfil */}
            <TouchableOpacity style={style.editar_foto}>
                <Ionicons name="create-outline" size={22} color="#333333" />
                <Text style={style.editText}>Editar Perfil</Text>
            </TouchableOpacity>
        </View>
    );
}