import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFonts } from './src/hooks/useFonts';
import Login from './src/pages/login';
import Register from './src/pages/registro';
import ForgotPassword from './src/pages/esqueceu';
import Menu from './src/pages/menu';
import Perfil from './src/pages/perfil';
import CustomDrawer from './src/components/CustomDrawer';
import Consumo  from './src/pages/consumo';
import { UserProvider } from './src/context/UserContext';
import Metas from './src/pages/metas';
import { LoadingProvider } from './src/context/LoadingContext';

export type RootStackParamList = {                            // defino os parâmetros
  Auth: undefined;
  App: undefined;
  Consumo: undefined;
  Metas: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type DrawerParamList = {
  Menu: undefined;
  Perfil: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

function AuthStack() {
  return (
    <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackNav.Screen name="Login" component={Login} />
      <AuthStackNav.Screen name="Register" component={Register} />
      <AuthStackNav.Screen name="ForgotPassword" component={ForgotPassword} />
    </AuthStackNav.Navigator>
  );
}

function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Menu"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 280 },
      }}
    >
      <Drawer.Screen name="Menu" component={Menu} />
      <Drawer.Screen name="Perfil" component={Perfil} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <UserProvider>
      <LoadingProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor="#2E7D32" />

          <RootStack.Navigator
            initialRouteName="Auth"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            <RootStack.Screen name="Auth" component={AuthStack} />
            <RootStack.Screen name="App" component={AppDrawer} />
            <RootStack.Screen name="Consumo" component={Consumo} />
            <RootStack.Screen name="Metas" component={Metas} />
          </RootStack.Navigator>
        </NavigationContainer>
      </LoadingProvider>
    </UserProvider>
  );
}