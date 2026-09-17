import React from 'react';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { tokenRequest } from './authConfig';
import Orders from './Orders';
import './App.css';

function LoginScreen() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup({
      ...tokenRequest,
      prompt: 'select_account',
    }).catch((e) => console.error(e));
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
          <h1>Pedidos360</h1>
          <p className="lead">Ingresa con tu cuenta corporativa de Entra ID para continuar.</p>
          <button className="entra-button" onClick={handleLogin}>
            Continuar con Microsoft Entra ID
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { instance, accounts } = useMsal();
  const account = accounts[0];

  const handleLogout = () => {
    instance.logoutPopup({ account }).catch((e) => console.error(e));
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="brand">
          <div className="mark">P</div>
          <h1>Pedidos360</h1>
        </div>
        <div className="user-info">
          {account && <span>{account.username}</span>}
          <button className="logout-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <Orders />
    </div>
  );
}

function App() {
  return (
    <>
      <UnauthenticatedTemplate>
        <LoginScreen />
      </UnauthenticatedTemplate>

      <AuthenticatedTemplate>
        <Dashboard />
      </AuthenticatedTemplate>
    </>
  );
}

export default App;