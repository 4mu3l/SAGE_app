import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { style } from "./styles";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions, useFocusEffect } from '@react-navigation/native';
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerParamList } from "../../../App";
import { useUser } from '../../context/UserContext';
import { useLoading } from '../../context/LoadingContext';
import { apiFetch } from '../../services/api';

type Section = 'home' | 'notificacoes' | 'preferencias' | 'sobre';
type MenuNavigationProp = DrawerNavigationProp<DrawerParamList, 'Menu'>;

type ConsumoItem = {
    id: number;
    quantidade: number;
    preco: number;
    tipo_consumo: string;
    unidade: string;
    data: string;
    usuario_id: number;
};

type DicaResponse = {
    status: string;
    dica_id: number;
    titulo: string;
    dica: string;
    tipo: string;
    data: string;
    analise?: {
        consumo_total: number;
        gasto_total: string;
        media_diaria: number;
        tipos_consumo: string[];
    };
};

export default function Menu() {
    const [activeSection, setActiveSection] = useState<Section>('home');
    const navigation = useNavigation<MenuNavigationProp>();
    const { usuario, token } = useUser();
    const { mostrarLoading, esconderLoading } = useLoading();
    const [dica, setDica] = useState<DicaResponse | null>(null);
    const [consumos, setConsumos] = useState<ConsumoItem[]>([]);
    const [carregando, setCarregando] = useState(true);

    async function carregarConsumos() {
        mostrarLoading('Carregando dados...', 'screen');

        try {
            const response = await apiFetch('/consumo/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const lista = Array.isArray(response) ? response : response.dados;

            const meusConsumos = lista.filter(
                (item: ConsumoItem) => item.usuario_id === usuario?.id
            );

            const dicaResponse = await apiFetch('/dicas/personalizada', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setDica(dicaResponse);

            setConsumos(meusConsumos);
        } catch (error) {
            console.log('Erro ao carregar consumos no menu:', error);
        } finally {
            esconderLoading();
            setCarregando(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (usuario?.id && token) {
                carregarConsumos();
            }
        }, [usuario, token])
    );

    function getEstatisticas(tipo: 'energia' | 'agua' | 'residuo') {
        const itens = consumos.filter(item => item.tipo_consumo === tipo);

        const totalQuantidade = itens.reduce(
            (sum, item) => sum + item.quantidade,
            0
        );

        const totalPreco = itens.reduce(
            (sum, item) => sum + (item.preco || 0),
            0
        );

        return { totalQuantidade, totalPreco };
    }

    const estatisticas = {
        energia: getEstatisticas('energia'),
        agua: getEstatisticas('agua'),
        residuo: getEstatisticas('residuo'),
    };

    function formatarReais(valor: number) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }

    function renderContent() {
        switch (activeSection) {
            case 'home':
                return (
                    <HomeContent
                        estatisticas={estatisticas}
                        formatarReais={formatarReais}
                        carregando={carregando}
                        dica={dica}
                    />
                );
            case 'notificacoes':
                return <NotificacoesContent />;
            case 'preferencias':
                return <PreferenciasContent />;
            case 'sobre':
                return <SobreContent />;
            default:
                return (
                    <HomeContent
                        estatisticas={estatisticas}
                        formatarReais={formatarReais}
                        carregando={carregando}
                        dica={dica}
                    />
                );
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
                    style={style.botão_menu}
                    onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                >
                    <View style={style.menuIcon}>
                        <View style={style.menuLine} />
                        <View style={style.menuLine} />
                        <View style={style.menuLine} />
                    </View>
                </TouchableOpacity>

                <View style={style.headerText}>
                    <Text style={style.título}>Olá, {usuario?.nome || 'Usuário'}</Text>
                    <Text style={style.subtítulo}>Bem-vindo ao EcoConsumo</Text>
                </View>
            </LinearGradient>

            <ScrollView style={style.content} showsVerticalScrollIndicator={false}>
                {renderContent()}
            </ScrollView>
        </View>
    );
}

type HomeContentProps = {
    estatisticas: {
        energia: { totalQuantidade: number; totalPreco: number };
        agua: { totalQuantidade: number; totalPreco: number };
        residuo: { totalQuantidade: number; totalPreco: number };
    };
    formatarReais: (valor: number) => string;
    carregando: boolean;
    dica: DicaResponse | null;
};

function HomeContent({ estatisticas, formatarReais, carregando, dica }: HomeContentProps) {
    const navigation = useNavigation<any>();

    const cards = [
        {
            tipo: 'elétrico' as const,
            cor: '#9E9D24',
            icone: 'flash',
            unidade: 'kWh',
            dados: estatisticas.energia,
        },
        {
            tipo: 'hídrico' as const,
            cor: '#00ACC1',
            icone: 'water',
            unidade: 'L',
            dados: estatisticas.agua,
        },
        {
            tipo: 'residual' as const,
            cor: '#43A047',
            icone: 'leaf',
            unidade: 'kg',
            dados: estatisticas.residuo,
        },
    ];

    return (
        <View>
            <View style={style.cardsContainer}>
                {cards.map((card) => (
                    <TouchableOpacity
                        key={card.tipo}
                        style={[style.card, { backgroundColor: card.cor }]}
                        onPress={() => navigation.navigate('Consumo', { tipoInicial: card.tipo })}
                    >
                        <View style={style.cardHeader}>
                            <Ionicons name={card.icone as any} size={12} color="#FFFFFF" />
                            <Text style={style.cardHeaderText}>Consumido</Text>
                        </View>

                        {carregando ? (
                            <Text style={style.cardValue}>...</Text>
                        ) : (
                            <Text style={style.cardValue}>
                                {card.dados.totalQuantidade.toLocaleString('pt-BR')} {card.unidade}
                            </Text>
                        )}

                        {!carregando && (
                            <Text style={style.cardPrecoMenu}>
                                {formatarReais(card.dados.totalPreco)}
                            </Text>
                        )}

                        <Text style={style.cardLabel}>Este mês</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={style.divisório} />

            <Text style={style.sectionTitle}>Progresso das metas</Text>

            <View style={style.progressContainer}>
                <View style={style.progressBar}>
                    <View style={[style.progressFill, { width: '60%' }]} />
                </View>
            </View>

            <View style={style.divisório} />

            <View style={style.menuCardsContainer}>
                <TouchableOpacity
                    style={style.menuCard}
                    onPress={() => navigation.navigate('Consumo')}
                >
                    <View style={style.menuCardLeft}>
                        <View style={[style.menuIconBox, { backgroundColor: '#43A047' }]}>
                            <Ionicons name="bar-chart-outline" size={24} color="#FFFFFF" />
                        </View>

                        <View>
                            <Text style={style.menuCardTitle}>Consumo</Text>
                            <Text style={style.menuCardSubtitle}>Histórico e gráficos</Text>
                        </View>
                    </View>

                    <Ionicons name="chevron-forward" size={22} color="#999999" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={style.menuCard}
                    onPress={() => navigation.navigate('Metas')}
                >
                    <View style={style.menuCardLeft}>
                        <View style={[style.menuIconBox, { backgroundColor: '#00ACC1' }]}>
                            <Ionicons name="flag-outline" size={24} color="#FFFFFF" />
                        </View>

                        <View>
                            <Text style={style.menuCardTitle}>Metas</Text>
                            <Text style={style.menuCardSubtitle}>Acompanhar progresso</Text>
                        </View>
                    </View>

                    <Ionicons name="chevron-forward" size={22} color="#999999" />
                </TouchableOpacity>
            </View>

            <DicaCard dica={dica} carregando={carregando} />
        </View>
    );
}

function DicaCard({ dica, carregando }: { dica: DicaResponse | null; carregando: boolean }) {
    if (carregando) {
        return (
            <View style={style.tipsCard}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <View style={style.tipsContent}>
                    <Text style={style.tipsTitle}>Analisando seus dados...</Text>
                    <Text style={style.tipsText}>
                        A IA está gerando uma dica personalizada baseada no seu histórico de consumo.
                    </Text>
                </View>
            </View>
        );
    }

    if (!dica || !dica.dica) {
        return (
            <View style={style.tipsCard}>
                <Ionicons name="bulb-outline" size={40} color="#FFFFFF" />
                <View style={style.tipsContent}>
                    <Text style={style.tipsTitle}>Dicas Sustentáveis</Text>
                    <Text style={style.tipsText}>
                        Adicione seus consumos para receber dicas personalizadas baseadas no seu perfil de uso.
                    </Text>
                </View>
            </View>
        );
    }

    const getIconePorTipo = (tipo: string) => {
        switch (tipo?.toLowerCase()) {
            case 'energia': return 'flash';
            case 'agua': return 'water';
            case 'residuo': return 'leaf';
            default: return 'bulb';
        }
    };

    const icone = getIconePorTipo(dica.tipo);

    return (
        <View style={style.tipsCard}>
            <Ionicons name={icone as any} size={40} color="#FFFFFF" />
            
            <View style={style.tipsContent}>
                <View style={style.tipsHeader}>
                    <Text style={style.tipsTitle}>{dica.titulo || 'Dica Personalizada'}</Text>
                    {dica.analise && (
                        <View style={style.badgeAnalise}>
                            <Text style={style.badgeText}>IA</Text>
                        </View>
                    )}
                </View>
                
                <Text style={style.tipsText}>{dica.dica}</Text>
                
                {dica.analise && (
                    <View style={style.analiseContainer}>
                        <View style={style.analiseRow}>
                            <Text style={style.analiseLabel}>Consumo total:</Text>
                            <Text style={style.analiseValue}>
                                {dica.analise.consumo_total?.toLocaleString('pt-BR')} un
                            </Text>
                        </View>
                        <View style={style.analiseRow}>
                            <Text style={style.analiseLabel}>Gasto total:</Text>
                            <Text style={style.analiseValue}>{dica.analise.gasto_total}</Text>
                        </View>
                        <View style={style.analiseRow}>
                            <Text style={style.analiseLabel}>Média diária:</Text>
                            <Text style={style.analiseValue}>
                                {dica.analise.media_diaria?.toFixed(1)} un/dia
                            </Text>
                        </View>
                    </View>
                )}
                
                <Text style={style.tipsDate}>
                    Atualizado em {new Date(dica.data).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Text>
            </View>
        </View>
    );
}

function NotificacoesContent() {
    return (
        <View style={style.sectionContainer}>
            <Text style={style.sectionTitle}>Notificações</Text>

            <View style={style.emptyState}>
                <Ionicons name="notifications-off" size={48} color="#CCCCCC" />
                <Text style={style.emptyText}>Nenhuma notificação no momento</Text>
            </View>
        </View>
    );
}

function PreferenciasContent() {
    return (
        <View style={style.sectionContainer}>
            <Text style={style.sectionTitle}>Preferências</Text>

            <View style={style.preferenceItem}>
                <Text style={style.preferenceText}>Notificações push</Text>
                <View style={style.toggle} />
            </View>

            <View style={style.preferenceItem}>
                <Text style={style.preferenceText}>Modo escuro</Text>
                <View style={style.toggle} />
            </View>

            <View style={style.preferenceItem}>
                <Text style={style.preferenceText}>Lembretes diários</Text>
                <View style={style.toggle} />
            </View>
        </View>
    );
}

function SobreContent() {
    return (
        <View style={style.sectionContainer}>
            <Text style={style.sectionTitle}>Sobre o App</Text>

            <View style={style.aboutCard}>
                <Ionicons name="leaf" size={48} color="#2E7D32" />
                <Text style={style.aboutTitle}>EcoConsumo</Text>
                <Text style={style.aboutVersion}>Versão 1.0.0</Text>
                <Text style={style.aboutText}>
                    Aplicativo para monitoramento sustentável de consumo de energia, água e emissão de CO2.
                </Text>
            </View>
        </View>
    );
}