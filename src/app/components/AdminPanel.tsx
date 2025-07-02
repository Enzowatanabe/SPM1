'use client';

import React, { useState } from 'react';
import { exportarDados, importarDados } from '@/lib/database';

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = async () => {
    try {
      await exportarDados();
      alert('Backup exportado com sucesso!');
    } catch (error) {
      alert('Erro ao exportar backup');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importarDados(file);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#3182ce',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}
        title="Administração"
      >
        ⚙️
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        minWidth: '300px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>Administração</h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onClick={handleExport}
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📤 Exportar Backup
        </button>

        <div style={{ position: 'relative' }}>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{
              position: 'absolute',
              opacity: 0,
              width: '100%',
              height: '100%',
              cursor: 'pointer'
            }}
            id="import-file"
          />
          <label
            htmlFor="import-file"
            style={{
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'block',
              textAlign: 'center'
            }}
          >
            📥 Importar Backup
          </label>
        </div>

        <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          <p><strong>Backup:</strong> Salva todos os dados em um arquivo JSON</p>
          <p><strong>Restore:</strong> Carrega dados de um arquivo de backup</p>
          <p><strong>⚠️ Atenção:</strong> O restore substitui todos os dados atuais</p>
        </div>
      </div>
    </div>
  );
} 