import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { style } from "./styles";
import { temas } from "../../global/themes";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../App';

type ForgotPasswordScreenNavigationProp =
    NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPassword() {
    const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
    const [email, setEmail] = useState('');

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <View style={style.container}>
                <View style={style.header}>
                    <LinearGradient
                        colors={['#2E7D32', '#66BB6A']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={style.gradient}
                    >
                        <TouchableOpacity 
                            style={style.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <AntDesign name="left" size={24} color={temas.colors.goiabada} />
                        </TouchableOpacity>
                        <Text style={style.título}>Recuperação{'\n'}de senha</Text>
                        <Svg
                            width="100%"
                            height="60"
                            style={style.curvaSvg}
                        >
                            <Path
                                d="M0,20 Q200,35 400,20 L400,60 L0,60 Z"
                                fill="#FFFFFF"
                            />
                        </Svg>
                    </LinearGradient>
                </View>
                <View style={style.content}>
                    <Text style={style.descrição}>
                        Digite o seu e-mail para a recuperação da senha
                    </Text>
                    <View style={style.caixa}>
                        <TextInput
                            style={style.input}
                            placeholder="Digite o seu email"
                            placeholderTextColor={temas.colors.dentrodacaixa}
                            keyboardType="email-address"                                // faz com que o teclado mostre o símbolo @ e o . para facilitar digitação do email
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View style={{ height: 40 }} />
                    <TouchableOpacity style={{ width: 353, alignSelf: 'center' }}>
                        <LinearGradient
                            colors={['#43A047', '#66BB6A']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={style.botão_enviar}
                        >
                            <Text style={style.texto_botão_enviar}>Enviar link</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}