// CustomDrawer/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { style } from './styles';
import { temas } from '../../global/themes';
import { useNavigationState } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';

const MENU_ITEMS = [
    { name: 'Menu', label: 'Menu', icon: 'home-outline', section: 'home' },
    { name: 'Perfil', label: 'Perfil', icon: 'person-outline', isScreen: true }, // ← tela separada
    { name: 'Notificacoes', label: 'Notificações', icon: 'notifications-outline', section: 'notificacoes' },
    { name: 'Preferencias', label: 'Preferências', icon: 'settings-outline', section: 'preferencias' },
    { name: 'Sobre', label: 'Sobre o App', icon: 'information-circle-outline', section: 'sobre' },
];

export default function CustomDrawer(props: any) {
    const currentRoute = useNavigationState((state: any) => {
        let route = state.routes[state.index];
        while (route.state && route.state.index !== undefined) {
            route = route.state.routes[route.state.index];
        }
        return route.name;
    });

    const { usuario, setUsuario, setToken } = useUser();
    
    // Pega a seção ativa (se existir)
    const activeSection = props.state?.routes[0]?.params?.section || 'home';

    function handlePress(item: any) {
    if (item.isScreen) {
        props.navigation.navigate(item.name);
    } else {
        props.navigation.navigate('Menu', {
        section: item.section,
        });
    }
    }

    function sair() {                       // função pra sair
        setUsuario(null);
        setToken(null);

        props.navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
        });
    }

    return (
        <View style={style.container}>
            {/* Header */}
            <View style={style.header}>
                <View style={style.avatar}>
                    <Ionicons name="person" size={40} color="#FFFFFF" />
                </View>
                <Text style={style.userName}>{usuario?.nome || 'Usuário'}</Text>
                <Text style={style.userEmail}>{usuario?.email || 'email@email.com'}</Text>
            </View>

            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 10 }}>
                
                {MENU_ITEMS.map((item, index) => {
                    // Verifica se está ativo
                    const isActive = item.isScreen 
                        ? currentRoute === item.name 
                        : activeSection === item.section;

                    return (
                        <View key={item.name}>
                            <TouchableOpacity 
                                style={[
                                    style.menuItem,
                                    isActive && { backgroundColor: '#E3F2FD' }
                                ]}
                                onPress={() => handlePress(item)}
                            >
                                <Ionicons 
                                    name={item.icon as any} 
                                    size={22} 
                                    color={isActive ? '#2E7D32' : '#333333'} 
                                />
                                <Text style={[
                                    style.menuItemText,
                                    isActive && { color: '#2E7D32', fontFamily: temas.fonts.bold }
                                ]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                            
                            {index < MENU_ITEMS.length - 1 && (
                                <View style={style.itemDivider} />
                            )}
                        </View>
                    );
                })}
                {/* linha pra separar */}
                <View style={style.divider} />
                {/* botão pra sair */}
                <TouchableOpacity style={style.menuItem} onPress={sair}>
                    <Ionicons name="exit-outline" size={22} color="#E53935" />
                    <Text style={[style.menuItemText, { color: '#E53935' }]}>Sair</Text>
                </TouchableOpacity>

            </DrawerContentScrollView>
        </View>
    );
}