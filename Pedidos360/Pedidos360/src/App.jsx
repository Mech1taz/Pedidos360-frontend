import React from 'react';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { tokenRequest } from './authConfig';
import './App.css';

function App() {
  const { instance, accounts } = useMsal();
  const account = accounts[0];

  const handleLogin = () => {
    instance.loginPopup({
      ...tokenRequest,
      prompt: 'select_account',
    }).catch((e) => console.error(e));
  };

  const handleLogout = () => {
    instance.logoutPopup({ account }).catch((e) => console.error(e));
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-photo">
          <div className="caption">
            <p>Cada pedido, rastreado de punta a punta.</p>
          </div>
        </div>

        <div className="login-form">
          <div className="mark">P</div>

          <UnauthenticatedTemplate>
            <h1>Pedidos360</h1>
            <p className="lead">Ingresa con tu cuenta corporativa de Entra ID para continuar.</p>
            <button className="entra-button" onClick={handleLogin}>
              Continuar con Microsoft Entra ID
            </button>
          </UnauthenticatedTemplate>

          <AuthenticatedTemplate>
            <h1>Bienvenido</h1>
            {account && (
              <div className="session-card">
                <p className="label">Conectado como</p>
                <p className="value">{account.username}</p>
              </div>
            )}
            <button className="logout-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </AuthenticatedTemplate>
        </div>
      </div>
    </div>
  );
}

export default App;