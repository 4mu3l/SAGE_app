import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Alert, Platform } from 'react-native';
import { style } from "./styles";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { apiFetch } from '../../services/api';
import { useUser } from '../../context/UserContext';
import { useLoading } from '../../context/LoadingContext';
import DateTimePicker from '@react-native-community/datetimepicker';

type MetasScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Metas'>;
type TipoMeta = 'energia' | 'agua' | 'residuo';

interface MetaData {
    id?: number;
    titulo: string;
    atual: number;
    meta: number | null;
    unidade: string;
    cor: string;
    corBarra: string;
    icone: any;
    precoTotal: number;
}

export default function Metas() {
    const navigation = useNavigation<MetasScreenNavigationProp>();
    const [tipoAtivo, setTipoAtivo] = useState<TipoMeta>('energia');
    const { usuario, token } = useUser();
    const { mostrarLoading, esconderLoading } = useLoading();
    const [modalVisible, setModalVisible] = useState(false);
    const [valorMeta, setValorMeta] = useState('');
    const [prazo, setPrazo] = useState(new Date());
    const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
    const [metas, setMetas] = useState<Record<TipoMeta, MetaData>>({
        energia: {
            titulo: 'Meta de Energia',
            atual: 0,
            meta: null,
            unidade: 'kWh',
            cor: '#C8B800',
            corBarra: '#C8B800',
            icone: 'flash',
            precoTotal: 0,
        },
        agua: {
            titulo: 'Meta de Água',
            atual: 7500,
            meta: null,
            unidade: 'L',
            cor: '#00BCD4',
            corBarra: '#00BCD4',
            icone: 'water',
            precoTotal: 0,
        },
        residuo: {
            titulo: 'Meta de Resíduos',
            atual: 3.5,
            meta: null,
            unidade: 'kg',
            cor: '#2E7D32',
            corBarra: '#2E7D32',
            icone: 'leaf',
            precoTotal: 0,
        },
    });

    const metaAtual = metas[tipoAtivo];
    const progresso = metaAtual.meta
        ? Math.min((metaAtual.atual / metaAtual.meta) * 100, 100)
        : 0;

    function formatarReais(valor: number) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }

    async function buscarPrecoTotal(tipo: TipoMeta) {
        try {
            const tipoApi = tipo === 'energia' ? 'energia' : tipo === 'agua' ? 'agua' : 'residuo';
            const response = await apiFetch('/consumo/', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const lista = Array.isArray(response) ? response : response.dados;
            const meusConsumos = lista.filter(
                (item: any) => item.usuario_id === usuario?.id && item.tipo_consumo === tipoApi
            );

            const total = meusConsumos.reduce((sum: number, item: any) => sum + (item.preco || 0), 0);
            return total;
        } catch (error) {
            console.log(`Erro ao buscar preço ${tipo}:`, error);
            return 0;
        }
    }

    async function carregarProgresso() {
        mostrarLoading('Carregando metas...', 'screen');

        async function buscarMeta(tipo: TipoMeta) {
            try {
                const resposta = await apiFetch(`/metas/progresso/${tipo}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log(`META ${tipo}:`, resposta);

                return {
                    atual: resposta.progresso.quantidade_atual,
                    meta: resposta.progresso.limite_meta,
                };
            } catch (error) {
                console.log(`Erro ao carregar ${tipo}:`, error);
                return { atual: 0, meta: null };
            }
        }

        const energia = await buscarMeta('energia');
        const agua = await buscarMeta('agua');
        const residuo = await buscarMeta('residuo');

        const precoEnergia = await buscarPrecoTotal('energia');
        const precoAgua = await buscarPrecoTotal('agua');
        const precoResiduo = await buscarPrecoTotal('residuo');

        setMetas((prev) => ({
            energia: {
                ...prev.energia,
                atual: energia.atual,
                meta: energia.meta,
                precoTotal: precoEnergia,
            },
            agua: {
                ...prev.agua,
                atual: agua.atual,
                meta: agua.meta,
                precoTotal: precoAgua,
            },
            residuo: {
                ...prev.residuo,
                atual: residuo.atual,
                meta: residuo.meta,
                precoTotal: precoResiduo,
            },
        }));

        esconderLoading();
    }

    useEffect(() => {
        if (usuario?.id && token) {
            carregarProgresso();
        }
    }, [usuario, token]);

    async function salvarMeta() {
        if (!valorMeta.trim()) {
            Alert.alert('Atenção', 'Digite o valor da meta.');
            return;
        }

        mostrarLoading('Salvando meta...', 'overlay');

        const tipoApi = tipoAtivo === 'energia' ? 'energia' : tipoAtivo === 'agua' ? 'agua' : 'residuo';
        const unidade = tipoAtivo === 'energia' ? 'kWh' : tipoAtivo === 'agua' ? 'L' : 'kg';

        try {
            await apiFetch('/metas', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    tipo_consumo: tipoApi,
                    quantidade_alvo: Number(valorMeta),
                    unidade,
                    prazo: prazo.toISOString().split('T')[0],
                }),
            });
            Alert.alert('Sucesso', 'Meta definida!');
            setValorMeta('');
            setModalVisible(false);
            setTimeout(() => {
                carregarProgresso();
            }, 500);
        } catch (error: any) {
            console.log(error);
            Alert.alert('Erro', error?.message || 'Erro ao salvar meta');
        } finally {
            esconderLoading();
        }
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
                <Text style={style.título}>Minhas Metas</Text>
            </LinearGradient>
            <ScrollView style={style.content} showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                    style={style.botaoNovaMeta}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={style.botaoNovaMetaText}>Definir Nova Meta</Text>
                </TouchableOpacity>
                <View style={style.cardsContainer}>
                    {(Object.keys(metas) as TipoMeta[]).map((tipo) => {
                        const meta = metas[tipo];
                        if (meta.meta === null) return null;

                        const prog = Math.min((meta.atual / meta.meta) * 100, 100);
                        return (
                            <TouchableOpacity
                                key={tipo}
                                style={[
                                    style.cardMeta,
                                    tipoAtivo === tipo && { borderWidth: 2, borderColor: meta.cor }
                                ]}
                                onPress={() => setTipoAtivo(tipo)}
                            >
                                <View style={style.cardHeader}>
                                    <Ionicons name={meta.icone} size={20} color={meta.cor} />
                                    <Text style={style.cardTitulo}>{meta.titulo}</Text>
                                </View>
                                <View style={style.barraContainer}>
                                    <View style={style.barraFundo}>
                                        <View
                                            style={[
                                                style.barraPreenchimento,
                                                {
                                                    width: `${prog}%`,
                                                    backgroundColor: meta.corBarra
                                                }
                                            ]}
                                        />
                                    </View>
                                </View>
                                <Text style={style.cardValor}>
                                    {meta.atual.toLocaleString('pt-BR')} {meta.unidade} / {meta.meta.toLocaleString('pt-BR')} {meta.unidade}
                                </Text>
                                <Text style={[style.cardPreco, { color: meta.cor }]}>
                                    {formatarReais(meta.precoTotal)}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={style.detalheContainer}>
                    <Text style={style.detalheTitulo}>Detalhes</Text>

                    <View style={style.detalheCard}>
                        <View style={style.detalheHeader}>
                            <Ionicons name={metaAtual.icone} size={28} color={metaAtual.cor} />
                            <Text style={style.detalheNome}>{metaAtual.titulo}</Text>
                        </View>
                        <View style={style.progressoCircularContainer}>
                            <View style={style.progressoInfo}>
                                <Text style={[style.progressoPercentual, { color: metaAtual.cor }]}>
                                    {Math.round(progresso)}%
                                </Text>
                                <Text style={style.progressoLabel}>atingido</Text>
                                <Text style={[style.precoTotalDetalhe, { color: metaAtual.cor }]}>
                                    {formatarReais(metaAtual.precoTotal)}
                                </Text>
                            </View>
                        </View>
                        <View style={style.detalheValores}>
                            <View style={style.valorBox}>
                                <Text style={style.valorLabel}>Atual</Text>
                                <Text style={[style.valorNumero, { color: metaAtual.cor }]}>
                                    {metaAtual.atual.toLocaleString('pt-BR')}
                                </Text>
                                <Text style={style.valorUnidade}>{metaAtual.unidade}</Text>
                            </View>
                            <Ionicons name="arrow-forward" size={24} color="#CCCCCC" />
                            <View style={style.valorBox}>
                                <Text style={style.valorLabel}>Meta</Text>
                                <Text style={[style.valorNumero, { color: metaAtual.cor }]}>
                                    {metaAtual.meta?.toLocaleString('pt-BR')}
                                </Text>
                                <Text style={style.valorUnidade}>{metaAtual.unidade}</Text>
                            </View>
                        </View>
                        <View style={style.barraDetalheContainer}>
                            <View style={style.barraDetalheFundo}>
                                <View
                                    style={[
                                        style.barraDetalhePreenchimento,
                                        {
                                            width: `${progresso}%`,
                                            backgroundColor: metaAtual.corBarra
                                        }
                                    ]}
                                />
                            </View>
                        </View>
                        {metaAtual.meta !== null && (
                            <Text style={style.detalheStatus}>
                                {progresso >= 100
                                    ? '✅ Meta atingida!'
                                    : `Faltam ${(metaAtual.meta - metaAtual.atual).toLocaleString('pt-BR')} ${metaAtual.unidade} para atingir a meta`}
                            </Text>
                        )}
                    </View>
                </View>
                <View style={{ height: 30 }} />
            </ScrollView>
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={style.modalOverlay}>
                    <View style={style.modalContent}>
                        <Text style={style.modalTitle}>Definir Nova Meta</Text>
                        <Text style={style.modalTipo}>
                            {metaAtual.titulo}
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                            {(['energia', 'agua', 'residuo'] as TipoMeta[]).map((tipo) => (
                                <TouchableOpacity
                                    key={tipo}
                                    onPress={() => setTipoAtivo(tipo)}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 10,
                                        borderRadius: 16,
                                        backgroundColor: tipoAtivo === tipo ? metas[tipo].cor : '#EEEEEE',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: tipoAtivo === tipo ? '#FFFFFF' : '#333333' }}>
                                        {tipo === 'energia' ? 'Energia' : tipo === 'agua' ? 'Água' : 'Resíduos'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TextInput
                            style={style.modalInput}
                            placeholder={`Valor da meta em ${metaAtual.unidade}`}
                            keyboardType="numeric"
                            value={valorMeta}
                            onChangeText={setValorMeta}
                        />
                        <TouchableOpacity
                            style={style.modalInput}
                            onPress={() => setMostrarDatePicker(true)}
                        >
                            <Text>
                                Prazo: {prazo.toISOString().split('T')[0]}
                            </Text>
                        </TouchableOpacity>

                        {mostrarDatePicker && (
                            <DateTimePicker
                                value={prazo}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setMostrarDatePicker(Platform.OS === 'ios');

                                    if (selectedDate) {
                                        setPrazo(selectedDate);
                                    }
                                }}
                            />
                        )}
                        <TouchableOpacity style={style.modalButton} onPress={salvarMeta}>
                            <Text style={style.modalButtonText}>Salvar Meta</Text>
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
        </View>
    );
}