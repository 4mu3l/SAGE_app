import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { style } from "./styles";
import { temas } from "../../global/themes";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../App';
import { apiFetch } from '../../services/api';

type RegisterScreenNavigationProp =
    NativeStackNavigationProp<AuthStackParamList, 'Register'>;
  
export default function Register() {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    async function criarConta() {
    if (!name.trim()) {
        alert('Digite seu nome.');
        return;
    }

    if (!emailRegex.test(email)) {
        alert('Digite um e-mail válido. Ex: nome@email.com');
        return;
    }

    if (!password.trim()) {
        alert('Digite sua senha.');
        return;
    }

    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }

    try {
        const data = await apiFetch('/usuarios/', {
        method: 'POST',
        body: JSON.stringify({
            nome: name,
            email,
            senha: password,
            }),
        });

        console.log(data);
        alert('Conta criada com sucesso!');
        navigation.goBack();
    }   catch (error: any) {
        alert('Erro ao criar conta. Talvez esse e-mail já esteja cadastrado.');
    }
    }

    return (
        <KeyboardAvoidingView                                                           // SE o sistema for iOS ele usará padding
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}                     // padding adiciona espaço interno na parte inferior da tela, empurrando o conteúdo para cima. Enquanto o height Reduz a altura da tela para o teclado caber
            style={{ flex: 1 }}                                                         // faz o teclado ocupar toda a tela
        >
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"                                     //
            >
                <View style={style.container}>
                    <View style={style.header}>
                        <LinearGradient
                            colors={['#2E7D32', '#66BB6A']}
                            start={{ x: 0, y: 0 }}                                      //
                            end={{ x: 1, y: 0 }}
                            style={style.gradient}                                      //
                        >
                            <TouchableOpacity 
                                style={style.voltar}                                    //
                                onPress={() => navigation.goBack()}                     //
                            >                                                           //
                                <AntDesign name="left" size={24} color={temas.colors.goiabada} />
                            </TouchableOpacity>
                            <Text style={style.título}>Criar conta</Text>               //
                            <Svg
                                width="100%"                                            //
                                height="60"
                                style={style.curvaSvg}                                  //
                            >
                                <Path
                                    d="M0,20 Q200,35 400,20 L400,60 L0,60 Z"            //
                                    fill="#FFFFFF"
                                />                                                      //
                            </Svg>
                        </LinearGradient>                                               //
                    </View>
                    <View style={style.formContainer}>
                        <Text style={style.minitítulo}>Nome</Text>                      //
                        <View style={style.caixa}>                                      //
                            <TextInput
                                style={style.input}                                     //
                                placeholder="Digite seu nome"
                                placeholderTextColor={temas.colors.dentrodacaixa}       //
                                value={name}
                                onChangeText={setName}                                  //
                            />
                        </View>
                        <Text style={style.minitítulo}>E-mail</Text>                    //
                        <View style={style.caixa}>
                            <TextInput
                                style={style.input}                                     //
                                placeholder="Digite o seu email"
                                placeholderTextColor={temas.colors.dentrodacaixa}       //
                                keyboardType="email-address"                            // faz com que o teclado mostre o símbolo @ e o . para facilitar digitação do email
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}                                 //
                            />
                        </View>
                        <Text style={style.minitítulo}>Senha</Text>                     //
                        <View style={style.caixa}>
                            <TextInput
                                style={style.input}                                     //
                                placeholder="Digite a sua senha"
                                placeholderTextColor={temas.colors.dentrodacaixa}
                                secureTextEntry                                         // faz com que os caracteres da senha fiquem cobertos após digitá-los
                                value={password}                                        //
                                onChangeText={setPassword}
                            />                                                          //
                        </View>
                        <Text style={style.minitítulo}>Confirme a senha</Text>          //
                        <View style={style.caixa}>
                            <TextInput
                                style={style.input}                                     //
                                placeholder="Digite novamente a sua senha"              //
                                placeholderTextColor={temas.colors.dentrodacaixa}
                                secureTextEntry                                         // faz com que os caracteres da senha fiquem cobertos após digitá-los
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>
                        <View style={{ height: 30 }} />
                        <TouchableOpacity style={{ width: 353, alignSelf: 'center' }}
                        onPress={criarConta}>
                            <LinearGradient
                                colors={['#43A047', '#66BB6A']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={style.botão_criar}
                            >
                                <Text style={style.texto_botão_criar}>Criar conta</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}