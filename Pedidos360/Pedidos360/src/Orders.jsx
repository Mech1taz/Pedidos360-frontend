import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { getOrders } from './api';

function normalizeToArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && typeof data === 'object') return [data];
  return [];
}

function renderCelda(valor) {
  if (valor === null || valor === undefined) return '—';
  if (typeof valor === 'object') return JSON.stringify(valor);
  return String(valor);
}

export default function Orders() {
  const { instance, accounts } = useMsal();
  const account = accounts[0];

  const [orders, setOrders] = useState([]);
  const [columns, setColumns] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [cargado, setCargado] = useState(false);

  async function cargarPedidos() {
    if (!account) return;
    setCargando(true);
    setError('');
    try {
      const data = await getOrders(instance, account);
      const lista = normalizeToArray(data);
      const cols = Array.from(
        lista.reduce((set, item) => {
          Object.keys(item ?? {}).forEach((k) => set.add(k));
          return set;
        }, new Set()),
      );
      setOrders(lista);
      setColumns(cols);
      setCargado(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="orders-panel">
      <div className="orders-header">
        <h2>Pedidos</h2>
        <button className="entra-button" disabled={cargando} onClick={cargarPedidos}>
          {cargando ? 'Cargando...' : cargado ? 'Actualizar' : 'Ver pedidos'}
        </button>
      </div>

      {error && <p className="orders-error">{error}</p>}

      {cargado && orders.length === 0 && !error && (
        <p className="orders-empty">No hay pedidos para mostrar.</p>
      )}

      {orders.length > 0 && (
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((item, idx) => (
                <tr key={item.id ?? idx}>
                  {columns.map((col) => (
                    <td key={col}>{renderCelda(item[col])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}