import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    Alert,
    Platform,
} from 'react-native';
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

interface MetaItem {
    id: number;
    titulo: string;
    tipo: TipoMeta;
    tipo_consumo: string;
    quantidade_alvo: number;
    quantidade_atual: number;
    unidade: string;
    prazo: string;
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
    const [metas, setMetas] = useState<MetaItem[]>([]);
    const [metaSelecionada, setMetaSelecionada] = useState<MetaItem | null>(null);

    const getCorPorTipo = (tipo: string) => {
        switch (tipo?.toLowerCase()) {
            case 'energia': return '#C8B800';
            case 'agua': return '#00BCD4';
            case 'água': return '#00BCD4';
            case 'residuo': return '#2E7D32';
            default: return '#66BB6A';
        }
    };

    const getIconePorTipo = (tipo: string) => {
        switch (tipo?.toLowerCase()) {
            case 'energia': return 'flash';
            case 'agua': return 'water';
            case 'água': return 'water';
            case 'residuo': return 'leaf';
            default: return 'flag';
        }
    };

    const getUnidadePorTipo = (tipo: string) => {
        switch (tipo?.toLowerCase()) {
            case 'energia': return 'kWh';
            case 'agua': return 'L';
            case 'água': return 'L';
            case 'residuo': return 'kg';
            default: return 'un';
        }
    };

    const getTituloPorTipo = (tipo: string) => {
        switch (tipo?.toLowerCase()) {
            case 'energia': return 'Meta de Energia';
            case 'agua': return 'Meta de Água';
            case 'água': return 'Meta de Água';
            case 'residuo': return 'Meta de Resíduos';
            default: return 'Meta';
        }
    };

    function formatarReais(valor: number) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }

    function formatarData(data?: string) {
        if (!data) return 'Sem prazo';
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    async function buscarPrecoTotal(tipo: string) {
        try {
            const response = await apiFetch('/consumo/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const lista = Array.isArray(response) ? response : response.dados || [];
            const meusConsumos = lista.filter(
                (item: any) => item.usuario_id === usuario?.id && item.tipo_consumo === tipo
            );
            return meusConsumos.reduce((sum: number, item: any) => sum + (item.preco || 0), 0);
        } catch (error) {
            return 0;
        }
    }

    async function carregarMetas() {
        mostrarLoading('Carregando metas...', 'screen');

        try {
            // Busca lista de metas
            const response = await apiFetch('/metas/', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const listaMetas = Array.isArray(response) ? response : response.dados || [];
            console.log('Metas da API:', listaMetas);

            // Busca progresso para cada tipo (só precisa uma vez por tipo)
            const progressos: Record<string, { atual: number; meta: number }> = {};

            for (const tipo of ['energia', 'agua', 'residuo']) {
                try {
                    const prog = await apiFetch(`/metas/progresso/${tipo}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    progressos[tipo] = {
                        atual: prog.progresso?.quantidade_atual ?? 0,
                        meta: prog.progresso?.limite_meta ?? 0,
                    };
                } catch (e) {
                    progressos[tipo] = { atual: 0, meta: 0 };
                }
            }

            // Busca preços
            const precos: Record<string, number> = {};
            for (const tipo of ['energia', 'agua', 'residuo']) {
                precos[tipo] = await buscarPrecoTotal(tipo);
            }

            // Mapeia cada meta individualmente
            const metasMapeadas: MetaItem[] = listaMetas
                .filter((m: any) => m.usuario_id === usuario?.id)
                .map((m: any) => {
                    const tipoNormalizado = m.tipo_consumo?.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') || 'energia';
                    const tipoBase = tipoNormalizado === 'agua' || tipoNormalizado === 'água' ? 'agua' : 
                                     tipoNormalizado === 'residuo' ? 'residuo' : 'energia';

                    return {
                        id: m.id,
                        titulo: getTituloPorTipo(tipoBase),
                        tipo: tipoBase as TipoMeta,
                        tipo_consumo: m.tipo_consumo,
                        quantidade_alvo: m.quantidade_alvo || 0,
                        quantidade_atual: progressos[tipoBase]?.atual || 0,
                        unidade: getUnidadePorTipo(tipoBase),
                        prazo: m.prazo,
                        cor: getCorPorTipo(tipoBase),
                        corBarra: getCorPorTipo(tipoBase),
                        icone: getIconePorTipo(tipoBase),
                        precoTotal: precos[tipoBase] || 0,
                    };
                });

            console.log('Metas mapeadas:', metasMapeadas);
            setMetas(metasMapeadas);

            // Seleciona a primeira meta do tipo ativo (ou a primeira geral)
            const metaDoTipo = metasMapeadas.find(m => m.tipo === tipoAtivo);
            setMetaSelecionada(metaDoTipo || metasMapeadas[0] || null);

        } catch (error) {
            console.log('Erro ao carregar metas:', error);
            Alert.alert('Erro', 'Não foi possível carregar as metas.');
        } finally {
            esconderLoading();
        }
    }

    useEffect(() => {
        if (usuario?.id && token) {
            carregarMetas();
        }
    }, [usuario, token]);

    // Quando troca o tipo ativo, seleciona a primeira meta desse tipo
    useEffect(() => {
        const metaDoTipo = metas.find(m => m.tipo === tipoAtivo);
        setMetaSelecionada(metaDoTipo || null);
    }, [tipoAtivo, metas]);

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
                carregarMetas();
            }, 500);
        } catch (error: any) {
            Alert.alert('Erro', error?.message || 'Erro ao salvar meta');
        } finally {
            esconderLoading();
        }
    }

    async function removerMeta(meta: MetaItem) {
        if (!meta.id) {
            Alert.alert('Erro', 'ID da meta não encontrado.');
            return;
        }

        Alert.alert(
            'Remover meta',
            `Deseja remover ${meta.titulo}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            mostrarLoading('Removendo meta...', 'overlay');

                            await apiFetch(`/metas/${meta.id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` },
                            });

                            Alert.alert('Sucesso', 'Meta removida!');
                            carregarMetas();
                        } catch (error: any) {
                            Alert.alert('Erro', error?.message || 'Erro ao remover meta');
                        } finally {
                            esconderLoading();
                        }
                    },
                },
            ]
        );
    }

    // Calcula progresso
    function calcularProgresso(atual: number, meta: number) {
        if (meta <= 0) return 0;
        return Math.min((atual / meta) * 100, 100);
    }

    // Agrupa metas por tipo para os botões de filtro
    const tiposDisponiveis = Array.from(new Set(metas.map(m => m.tipo)));

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
                {/* BOTÃO DEFINIR NOVA META */}
                <TouchableOpacity
                    style={style.botaoNovaMeta}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={style.botaoNovaMetaText}>Definir Nova Meta</Text>
                </TouchableOpacity>

                {/* FILTROS POR TIPO (só aparece se tiver metas) */}
                {metas.length > 0 && (
                    <View style={style.filtrosContainer}>
                        {(['energia', 'agua', 'residuo'] as TipoMeta[]).map((tipo) => {
                            const temMeta = metas.some(m => m.tipo === tipo);
                            if (!temMeta) return null;

                            const cor = getCorPorTipo(tipo);
                            return (
                                <TouchableOpacity
                                    key={tipo}
                                    style={[
                                        style.filtroButton,
                                        tipoAtivo === tipo && { 
                                            backgroundColor: cor,
                                            borderColor: cor,
                                        }
                                    ]}
                                    onPress={() => setTipoAtivo(tipo)}
                                >
                                    <Ionicons
                                        name={getIconePorTipo(tipo) as any}
                                        size={16}
                                        color={tipoAtivo === tipo ? '#FFFFFF' : cor}
                                    />
                                    <Text style={[
                                        style.filtroText,
                                        tipoAtivo === tipo && { color: '#FFFFFF' }
                                    ]}>
                                        {tipo === 'energia' ? 'Energia' : tipo === 'agua' ? 'Água' : 'Resíduos'}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {/* LISTA DE METAS DO TIPO ATIVO */}
                {metas.length === 0 ? (
                    <View style={style.emptyState}>
                        <Ionicons name="flag-outline" size={64} color="#E0E0E0" />
                        <Text style={style.emptyTitle}>Nenhuma meta definida</Text>
                        <Text style={style.emptyText}>
                            Crie sua primeira meta para começar a acompanhar seu progresso.
                        </Text>
                    </View>
                ) : (
                    <View style={style.cardsContainer}>
                        {metas
                            .filter(m => m.tipo === tipoAtivo)
                            .map((meta) => {
                                const prog = calcularProgresso(meta.quantidade_atual, meta.quantidade_alvo);

                                return (
                                    <View key={meta.id} style={style.cardMetaWrapper}>
                                        {/* CARD PRINCIPAL */}
                                        <TouchableOpacity
                                            style={[
                                                style.cardMeta,
                                                metaSelecionada?.id === meta.id && { 
                                                    borderWidth: 2, 
                                                    borderColor: meta.cor 
                                                }
                                            ]}
                                            onPress={() => setMetaSelecionada(meta)}
                                            activeOpacity={0.9}
                                        >
                                            {/* HEADER: TÍTULO + PRAZO */}
                                            <View style={style.cardHeaderRow}>
                                                <View style={style.cardHeaderLeft}>
                                                    <Ionicons name={meta.icone} size={20} color={meta.cor} />
                                                    <Text style={style.cardTitulo}>{meta.titulo}</Text>
                                                </View>
                                                <View style={style.cardPrazoContainer}>
                                                    <Ionicons name="calendar-outline" size={12} color="#888888" />
                                                    <Text style={style.cardPrazoTexto}>
                                                        {formatarData(meta.prazo)}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* BARRA DE PROGRESSO */}
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

                                            {/* VALORES */}
                                            <Text style={style.cardValor}>
                                                {meta.quantidade_atual.toLocaleString('pt-BR')} {meta.unidade} / {meta.quantidade_alvo.toLocaleString('pt-BR')} {meta.unidade}
                                            </Text>
                                            <Text style={[style.cardPreco, { color: meta.cor }]}>
                                                {formatarReais(meta.precoTotal)}
                                            </Text>
                                        </TouchableOpacity>

                                        {/* BOTÃO REMOVER */}
                                        <TouchableOpacity
                                            style={style.botaoRemoverMeta}
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                removerMeta(meta);
                                            }}
                                            activeOpacity={0.7}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            <Ionicons name="trash-outline" size={18} color="#E53935" />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                    </View>
                )}

                {/* DETALHES DA META SELECIONADA */}
                {metaSelecionada && (
                    <View style={style.detalheContainer}>
                        <Text style={style.detalheTitulo}>Detalhes</Text>
                        <View style={style.detalheCard}>
                            <View style={style.detalheHeader}>
                                <Ionicons name={metaSelecionada.icone} size={28} color={metaSelecionada.cor} />
                                <Text style={style.detalheNome}>{metaSelecionada.titulo}</Text>
                            </View>
                            <View style={style.progressoCircularContainer}>
                                <View style={style.progressoInfo}>
                                    <Text style={[style.progressoPercentual, { color: metaSelecionada.cor }]}>
                                        {Math.round(calcularProgresso(metaSelecionada.quantidade_atual, metaSelecionada.quantidade_alvo))}%
                                    </Text>
                                    <Text style={style.progressoLabel}>atingido</Text>
                                    <Text style={[style.precoTotalDetalhe, { color: metaSelecionada.cor }]}>
                                        {formatarReais(metaSelecionada.precoTotal)}
                                    </Text>
                                </View>
                            </View>
                            <View style={style.detalheValores}>
                                <View style={style.valorBox}>
                                    <Text style={style.valorLabel}>Atual</Text>
                                    <Text style={[style.valorNumero, { color: metaSelecionada.cor }]}>
                                        {metaSelecionada.quantidade_atual.toLocaleString('pt-BR')}
                                    </Text>
                                    <Text style={style.valorUnidade}>{metaSelecionada.unidade}</Text>
                                </View>
                                <Ionicons name="arrow-forward" size={24} color="#CCCCCC" />
                                <View style={style.valorBox}>
                                    <Text style={style.valorLabel}>Meta</Text>
                                    <Text style={[style.valorNumero, { color: metaSelecionada.cor }]}>
                                        {metaSelecionada.quantidade_alvo.toLocaleString('pt-BR')}
                                    </Text>
                                    <Text style={style.valorUnidade}>{metaSelecionada.unidade}</Text>
                                </View>
                            </View>
                            <View style={style.barraDetalheContainer}>
                                <View style={style.barraDetalheFundo}>
                                    <View
                                        style={[
                                            style.barraDetalhePreenchimento,
                                            {
                                                width: `${calcularProgresso(metaSelecionada.quantidade_atual, metaSelecionada.quantidade_alvo)}%`,
                                                backgroundColor: metaSelecionada.corBarra
                                            }
                                        ]}
                                    />
                                </View>
                            </View>
                            <Text style={style.detalheStatus}>
                                {calcularProgresso(metaSelecionada.quantidade_atual, metaSelecionada.quantidade_alvo) >= 100
                                    ? '✅ Meta atingida!'
                                    : `Faltam ${(metaSelecionada.quantidade_alvo - metaSelecionada.quantidade_atual).toLocaleString('pt-BR')} ${metaSelecionada.unidade} para atingir a meta`}
                            </Text>
                        </View>
                    </View>
                )}
                <View style={{ height: 30 }} />
            </ScrollView>

            {/* MODAL */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={style.modalOverlay}>
                    <View style={style.modalContent}>
                        <Text style={style.modalTitle}>Definir Nova Meta</Text>
                        <Text style={style.modalTipo}>
                            {tipoAtivo === 'energia' ? 'Meta de Energia' : tipoAtivo === 'agua' ? 'Meta de Água' : 'Meta de Resíduos'}
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
                                        backgroundColor: tipoAtivo === tipo ? getCorPorTipo(tipo) : '#EEEEEE',
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
                            placeholder={`Valor da meta em ${getUnidadePorTipo(tipoAtivo)}`}
                            keyboardType="numeric"
                            value={valorMeta}
                            onChangeText={setValorMeta}
                        />
                        <TouchableOpacity
                            style={style.modalInput}
                            onPress={() => setMostrarDatePicker(true)}
                        >
                            <Text>Prazo: {prazo.toISOString().split('T')[0]}</Text>
                        </TouchableOpacity>
                        {mostrarDatePicker && (
                            <DateTimePicker
                                value={prazo}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setMostrarDatePicker(Platform.OS === 'ios');
                                    if (selectedDate) setPrazo(selectedDate);
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