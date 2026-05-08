import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { style } from './styles';
import { temas } from '../../global/themes';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useNavigation } from '@react-navigation/native';
import { apiFetch } from '../../services/api';
import { useUser } from '../../context/UserContext';
import { useLoading } from '../../context/LoadingContext'; // ⬅️ IMPORTA

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Login() {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { setUsuario, setToken } = useUser();
    const { mostrarLoading, esconderLoading } = useLoading(); // ⬅️ USA
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    async function fazerLogin() {
        console.log('CLICOU NO ENTRAR');

        if (!emailRegex.test(email)) {
            alert('Digite um e-mail válido.');
            return;
        }

        if (!password.trim()) {
            alert('Digite sua senha.');
            return;
        }

        mostrarLoading('Entrando...', 'screen'); // ⬅️ TELA CHEIA

        try {
            const data = await apiFetch('/usuarios/login', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    senha: password,
                }),
            });

            console.log('LOGIN DATA:', JSON.stringify(data, null, 2));

            if (data.status === 'Erro' || !data.token_acesso) {
                esconderLoading();
                alert(data.mensagem || 'E-mail ou senha incorretos.');
                return;
            }

            if (!data.usuario) {
                esconderLoading();
                alert('Erro: a API não retornou os dados do usuário.');
                return;
            }

            setToken(data.token_acesso);
            setUsuario({
                id: data.usuario.id,
                nome: data.usuario.nome,
                email: data.usuario.email,
            });

            // Navega sem esconder (a tela de splash do Menu já cuida)
            navigation.reset({
                index: 0,
                routes: [{ name: 'App' }],
            });

        } catch (error: any) {
            esconderLoading();
            alert('E-mail ou senha incorretos.');
        }
    }

    return(
        <View style={style.container}>
            <View style={style.header}>
                <LinearGradient                                                 // efeito da cor do topo do aplicativo
                    colors={['#2E7D32', '#66BB6A']}
                    start={{ x: 0, y: 0 }}                                      //
                    end={{ x: 1, y: 0 }}                                        
                    style={style.gradient}                                      // transformei em style pra deixar o título e o subtítulo dentro do efeito gradiente
                >                                                               //
                    <Text style={style.título}>EcoConsumo</Text>                //
                    <View style={style.linha_do_título} />                     {/* linha que está entre o EcoConsumo e Monitoramento sustentável */} 
                    <Text style={style.subtítulo}>Monitoramento Sustentável</Text>
                    <Svg                                                        //
                        width="100%"                                            //
                        height="60"
                        //viewBox="0 0 400 60"                                  // parte para ver onde a curva está
                        style={style.curvaSvg}                                  //
                    >                                                           //
                        <Path                                                   // curva branca pra fazer o efeito do topo do aplicativo
                            d="M0,20 Q200,35 400,20 L400,60 L0,60 Z"            // medidas da curva
                            fill="#FFFFFF"
                        />
                    </Svg>
                </LinearGradient>
            </View>
            <Text style={style.minitítulo_email}>E-mail</Text>
            <View style={style.caixa}>
                <TextInput style={style.input_do_email}                         // onde o usuário vai digitar o próprio email
                    placeholder="Digite o seu email"                            // aquele texto temporário que some quando digitamos alguma coisa
                    placeholderTextColor={temas.colors.dentrodacaixa}           // cor do texto temporário
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'                                // transforma o tipo do teclado em tipo de email
                />                                                              //
            </View>
            <Text style={style.minitítulo_senha}>Senha</Text>                   //    
            <View style={style.caixa}>
                <TextInput                                                      //
                    style={style.input_da_senha}
                    placeholder="Digite a sua senha"                            // texto que aparece antes do usuário digitar alguma coisa no input
                    placeholderTextColor={temas.colors.dentrodacaixa}           // cor do texto texto que aparece antes do usuário digitar alguma coisa no input
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}                                  //
                />
            </View>
                <TouchableOpacity                                               //
                    style={style.botãoEsqueceuSenha}
                    onPress={() => navigation.navigate('ForgotPassword' as never)}      //
                    activeOpacity={0.7}
                >
                    <Text style={style.textoEsqueceuSenha}>Esqueceu a senha?</Text>
                    <View style={style.linha_do_esqueceu} />
                </TouchableOpacity>

                <View style={{ height: 108 }} />                               {/* view vazia só pra eu poder fazer esse espaçamento sem aumentar o tamanho da hitbox do botão de entrar */}

                {/* botão de entrar*/}                   
                <TouchableOpacity style={{ width: 353, alignSelf: 'center' }}  // tive que colocar as características dele aqui por causa do gradiente que torna tudo um
                onPress={fazerLogin}>
                    <LinearGradient
                        colors={['#43A047', '#66BB6A']}                    // essas informações ficam aqui e não no styles porque são propriedades do componente gradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={style.botão_entrar}>
                        <Text style={style.texto_botão_entrar}>Entrar</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={style.sóprochavão}>
                    <View style={style.linha_cinza}/>
                    <TouchableOpacity style={style.botão_criar_conta}           // botão pra criar conta
                    onPress={() => navigation.navigate('Register' as never)}
                    >
                        <Text style={style.criar_conta}>Criar Conta</Text>
                        <View style={style.linha_criar}/>
                    </TouchableOpacity>
                </View>
        </View>
        
    )
}