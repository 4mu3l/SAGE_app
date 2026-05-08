import React, { createContext, useContext, useState } from 'react';                 // pasta para guardar as informações do usuário para eu não ter que ficar passando manualmente com props, com o Provider, qualquer tela "pergunta" ao contexto e recebe o dado.
                                                                                    // props = propriedades (parâmetros) que você passa para um componente
type Usuario = {
  id: number;
  nome: string;
  email: string;
};

type UserContextType = {
  usuario: Usuario | null;
  setUsuario: React.Dispatch<React.SetStateAction<Usuario | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  return (
    <UserContext.Provider value={{ usuario, setUsuario, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}