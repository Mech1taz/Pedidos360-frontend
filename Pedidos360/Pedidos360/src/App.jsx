import React, { useState } from 'react';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { tokenRequest } from './authConfig';
import { obtenerToken } from './token';
import './App.css';

function App() {
  const { instance, accounts, inProgress } = useMsal();
  const account = accounts[0];

  const [salida, setSalida] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const bloqueado = ocupado || inProgress !== InteractionStatus.None;

  async function ejecutar(action) {
    setOcupado(true);
    setSalida('');
    try {
      await action();
    } catch (error) {
      setSalida(error instanceof Error ? error.message : String(error));
    } finally {
      setOcupado(false);
    }
  }

  const handleLogin = () =>
    ejecutar(async () => {
      await instance.loginPopup({
        ...tokenRequest,
        prompt: 'select_account',
      });
    });

  const handleLogout = () =>
    ejecutar(async () => {
      if (account) {
        await instance.logoutPopup({ account });
      }
    });

  const handleObtenerToken = () =>
    ejecutar(async () => {
      if (!account) return;
      const token = await obtenerToken(instance, account);
      console.log('ACCESS TOKEN:', token.accessToken);
      if (!token.accessToken) {
        throw new Error('No se obtuvo access token');
      }
      setSalida(
        'Token de API obtenido. Vence: ' +
          (token.expiresOn?.toLocaleString() ?? 'Consultar metadatos'),
      );
    });

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
            <button className="entra-button" disabled={bloqueado} onClick={handleLogin}>
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

            <button
              className="entra-button"
              disabled={bloqueado}
              onClick={handleObtenerToken}
              style={{ marginBottom: '0.75rem' }}
            >
              Obtener token API
            </button>

            <button className="logout-button" disabled={bloqueado} onClick={handleLogout}>
              Cerrar sesión
            </button>
          </AuthenticatedTemplate>

          {salida && (
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '0.82rem',
                color: '#345959',
                background: '#EFF2EB',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                marginTop: '1.25rem',
                maxWidth: '300px',
                textAlign: 'left',
              }}
            >
              {salida}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;