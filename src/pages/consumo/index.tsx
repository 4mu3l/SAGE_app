import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Modal, Platform, Dimensions } from 'react-native';
import { style } from "./styles";
import { temas } from "../../global/themes";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { apiFetch } from '../../services/api';
import { useUser } from '../../context/UserContext';
import { useLoading } from '../../context/LoadingContext'; // ⬅️ IMPORTA
import DateTimePicker from '@react-native-community/datetimepicker';
import { BarChart } from 'react-native-chart-kit';

type ConsumoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Consumo'>;
type TipoConsumo = 'elétrico' | 'hídrico' | 'residual';

type ConsumoItem = {
  id: number;
  quantidade: number;
  preco: number;
  tipo_consumo: string;
  unidade: string;
  data: string;
  usuario_id: number;
};

type ConsumoRouteParams = {
  tipoInicial?: TipoConsumo;
};

export default function Consumo() {
    const navigation = useNavigation<ConsumoScreenNavigationProp>();
    const route = useRoute();
    const params = route.params as ConsumoRouteParams | undefined;
    const { usuario, token } = useUser();
    const { mostrarLoading, esconderLoading } = useLoading(); // ⬅️ USA
    
    const [tipoAtivo, setTipoAtivo] = useState<TipoConsumo>(
        params?.tipoInicial || 'elétrico'
    );
    const [consumos, setConsumos] = useState<ConsumoItem[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [quantidade, setQuantidade] = useState('');
    const [preco, setPreco] = useState('');
    const [dataConsumo, setDataConsumo] = useState(new Date());
    const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        if (params?.tipoInicial) {
            setTipoAtivo(params.tipoInicial);
        }
    }, [params?.tipoInicial]);

    async function carregarConsumos() {
        mostrarLoading('Carregando consumos...', 'screen'); // ⬅️ TELA CHEIA

        try {
            const response = await apiFetch('/consumo/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const lista = Array.isArray(response) ? response : response.dados;
            const meusConsumos = lista.filter(
                (item: ConsumoItem) => item.usuario_id === usuario?.id
            );
            setConsumos(meusConsumos);
        } catch (error: any) {
            Alert.alert('Erro', 'Não foi possível carregar os consumos.');
        } finally {
            esconderLoading(); // ⬅️ ESCONDE
        }
    }

    async function removerConsumo(id: number) {
        mostrarLoading('Removendo...', 'overlay'); // ⬅️ POP-UP

        try {
            await apiFetch(`/consumo/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert('Sucesso', 'Consumo removido!');
            carregarConsumos();
        } catch (error: any) {
            Alert.alert('Erro', 'Não foi possível remover o consumo.');
        } finally {
            esconderLoading();
        }
    }

    useEffect(() => {
        if (usuario?.id) {
            carregarConsumos();
        }
    }, [usuario]);

    async function registrarConsumo() {
        if (!quantidade.trim()) {
            Alert.alert('Atenção', 'Digite a quantidade.');
            return;
        }
        if (!preco.trim()) {
            Alert.alert('Atenção', 'Digite o preço.');
            return;
        }
        if (!dataConsumo) {
            Alert.alert('Atenção', 'Digite a data.');
            return;
        }

        mostrarLoading('Salvando...', 'overlay'); // ⬅️ POP-UP

        const unidade = tipoAtivo === 'elétrico' ? 'kWh' : tipoAtivo === 'hídrico' ? 'L' : 'kg';
        const tipoApi = tipoAtivo === 'elétrico' ? 'energia' : tipoAtivo === 'hídrico' ? 'agua' : 'residuo';
        
        try {
            await apiFetch('/consumo/', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    tipo_consumo: tipoApi,
                    quantidade: Number(quantidade),
                    unidade,
                    preco: Number(preco),
                    data: dataConsumo.toISOString().split('T')[0],
                    simulacao: false,
                }),
            });
            Alert.alert('Sucesso', 'Consumo registrado!');
            setQuantidade('');
            setPreco('');
            setModalVisible(false);
            carregarConsumos();
        } catch (error: any) {
            Alert.alert('Erro', 'Não foi possível registrar o consumo.');
        } finally {
            esconderLoading();
        }
    }

    // ... resto do código (dados, chartData, formatarData, return) permanece igual
    const tipoApiAtual = tipoAtivo === 'elétrico' ? 'energia' : tipoAtivo === 'hídrico' ? 'agua' : 'residuo';
    const consumosFiltrados = consumos.filter(item => item.tipo_consumo === tipoApiAtual);
    const totalReais = consumosFiltrados.reduce((total, item) => total + (item.preco || 0), 0);

    function formatarReais(valor: number) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }

    const chartData = {
        labels: consumosFiltrados.slice(-6).map(item =>
            new Date(item.data).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
            })
        ),
        datasets: [
            {
                data: consumosFiltrados.slice(-6).map(item => item.quantidade),
            },
        ],
    };

    const dados = {
        elétrico: {
            titulo: 'Consumo de Energia',
            unidade: 'kWh',
            cor: '#66BB6A',
        },
        hídrico: {
            titulo: 'Consumo de Água',
            unidade: 'L',
            cor: '#00ACC1',
        },
        residual: {
            titulo: 'Emissão de CO2',
            unidade: 'kg',
            cor: '#43A047',
        }
    };
    const dadoAtual = dados[tipoAtivo];

    function formatarData(data: string) {
        const partes = data.split('-');
        if (partes.length !== 3) return data;
        return `${partes[2]}/${partes[1]}`;
    }


    return (
        <View style={style.container}>
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
                <Text style={style.título}>Histórico de{'\n'}Consumo</Text>
            </LinearGradient>
            <ScrollView style={style.content} showsVerticalScrollIndicator={false}>
                
                {/* BOTÕES DE TIPO ORIGINAIS (funcionam!) */}
                <View style={style.tipoContainer}>
                    <TouchableOpacity 
                        style={[
                            style.tipoButton, 
                            tipoAtivo === 'elétrico' && { backgroundColor: '#FFEB3B' }
                        ]}
                        onPress={() => setTipoAtivo('elétrico')}
                    >
                        <Text style={[
                            style.tipoText,
                            tipoAtivo === 'elétrico' && { color: '#333333', fontFamily: temas.fonts.bold }
                        ]}>Elétrico</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            style.tipoButton, 
                            tipoAtivo === 'hídrico' && { backgroundColor: '#00ACC1' }
                        ]}
                        onPress={() => setTipoAtivo('hídrico')}
                    >
                        <Text style={[
                            style.tipoText,
                            tipoAtivo === 'hídrico' && { color: '#333333', fontFamily: temas.fonts.bold }
                        ]}>Hídrico</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            style.tipoButton, 
                            tipoAtivo === 'residual' && { backgroundColor: '#66BB6A' }
                        ]}
                        onPress={() => setTipoAtivo('residual')}
                    >
                        <Text style={[
                            style.tipoText,
                            tipoAtivo === 'residual' && { color: '#333333', fontFamily: temas.fonts.bold }
                        ]}>Residual</Text>
                    </TouchableOpacity>
                </View>

                <Text style={style.graficoTitulo}>{dadoAtual.titulo}</Text>
                <BarChart
                    data={chartData}
                    width={screenWidth - 32}
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix={` ${dadoAtual.unidade}`}
                    chartConfig={{
                        backgroundColor: '#fff',
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        decimalPlaces: 0,
                        color: () => dadoAtual.cor,
                        labelColor: () => '#666',
                    }}
                    style={{
                        marginVertical: 16,
                        borderRadius: 16,
                    }}
                />
                
                <Text style={style.resumoTitulo}>Resumo Mensal</Text>
                <TouchableOpacity
                    style={style.botão_adicionar}
                    onPress={() => setModalVisible(true)}
                >
                    <View>
                        <Text style={style.adicionar_consumo}>
                            Adicionar novo Consumo
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* TOTAL EM REAIS */}
                {consumosFiltrados.length > 0 && (
                    <View style={style.resumoTotalContainer}>
                        <Text style={style.resumoTotalLabel}>Total em Reais:</Text>
                        <Text style={[style.resumoTotalValor, { color: dadoAtual.cor }]}>
                            {formatarReais(totalReais)}
                        </Text>
                    </View>
                )}

                {consumosFiltrados.map((item) => (
                    <View key={item.id} style={style.resumoItem}>
                        <View style={style.resumoEsquerda}>
                            <Text style={style.resumoMes}>{formatarData(item.data)}</Text>
                            <Text style={style.resumoPreco}>
                                {formatarReais(item.preco || 0)}
                            </Text>
                        </View>
                        <View style={style.resumoDireita}>
                            <Text style={[style.resumoValor, { color: dadoAtual.cor }]}>
                                {item.quantidade} {item.unidade}
                            </Text>
                            <TouchableOpacity onPress={() => removerConsumo(item.id)}>
                                <Ionicons name="trash-outline" size={22} color="#E53935" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <View style={{ height: 30 }} />
                <Modal visible={modalVisible} transparent animationType="fade">
                    <View style={style.modalOverlay}>
                        <View style={style.modalContent}>
                            <Text style={style.modalTitle}>Adicionar Consumo</Text>
                            <TextInput
                                style={style.modalInput}
                                placeholder="Quantidade"
                                keyboardType="numeric"
                                value={quantidade}
                                onChangeText={setQuantidade}
                            />
                            <TextInput
                                style={style.modalInput}
                                placeholder="Preço (R$)"
                                keyboardType="numeric"
                                value={preco}
                                onChangeText={setPreco}
                            />
                            <TouchableOpacity
                                style={style.modalInput}
                                onPress={() => setMostrarDatePicker(true)}
                            >
                                <Text>
                                    Data: {dataConsumo.toLocaleDateString('pt-BR')}
                                </Text>
                            </TouchableOpacity>
                            {mostrarDatePicker && (
                                <DateTimePicker
                                    value={dataConsumo}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setMostrarDatePicker(Platform.OS === 'ios');
                                        if (selectedDate) {
                                            setDataConsumo(selectedDate);
                                        }
                                    }}
                                />
                            )}
                            <TouchableOpacity style={style.modalButton} onPress={registrarConsumo}>
                                <Text style={style.modalButtonText}>Salvar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={style.modalCancel}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={style.modalCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
}