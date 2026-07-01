import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { UploadCloud, Printer, Settings, ShieldCheck } from 'lucide-react';
import { useSpreadsheetReader } from './hooks/useSpreadsheetReader';
import './App.css'; // Emptied out
import './index.css';

function App() {
  const { data, error, handleFileUpload } = useSpreadsheetReader();
  const [customText, setCustomText] = useState<string>('');
  const [titleText, setTitleText] = useState<string>('');
  const [useIncrementalCode, setUseIncrementalCode] = useState<boolean>(false);
  const [incrementalPrefix, setIncrementalPrefix] = useState<string>('');
  const [useInstagram, setUseInstagram] = useState<boolean>(false);
  const [instagramHandle, setInstagramHandle] = useState<string>('');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app-container">
      <header className="header no-print" style={{ textAlign: 'center' }}>
        <h1>CampoFogo Codes</h1>
        <p>Crie cartões de resgate a partir de uma planilha e imprima em PDF.</p>
        <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'flex-start', gap: '0.75rem', backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'left', maxWidth: '600px', border: '1px solid var(--border-color)' }}>
          <ShieldCheck size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <p style={{ margin: 0, lineHeight: 1.5 }}>
            <strong>100% Seguro e Privado:</strong> Todo o processamento acontece diretamente no seu navegador! A Planilha utilizada não é salva ou processada externamente.
          </p>
        </div>
      </header>

      {/* Control Panel - Hidden when printing */}
      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

        {/* Upload Section */}
        <div className="card-panel">
          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <UploadCloud size={20} className="upload-icon" style={{ width: 24, height: 24 }} />
              Importar Planilha
            </h2>
            <label className="upload-zone">
              <UploadCloud className="upload-icon" />
              <span>Clique ou arraste sua planilha (.xlsx, .csv)</span>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
            {error && <p style={{ color: 'var(--danger)', marginTop: '1rem', fontSize: '0.9rem' }}>{error}</p>}
            {data.length > 0 && (
              <p style={{ color: 'var(--primary)', marginTop: '1rem', fontWeight: 500 }}>
                ✅ {data.length} códigos carregados!
              </p>
            )}
          </div>
        </div>

        {/* Configuration Section */}
        <div className="card-panel">
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Settings size={20} /> Configuração do Cartão
          </h2>

          <div className="input-group">
            <label>Título do Cartão</label>
            <input
              type="text"
              className="input-field"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              placeholder="Ex: Escaneie para resgatar"
            />
          </div>

          <div className="input-group">
            <label>Subtítulo / Descrição</label>
            <input
              type="text"
              className="input-field"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Ex: Prêmio de Resgate!"
            />
          </div>

          <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
            <input
              type="checkbox"
              id="useIncremental"
              checked={useIncrementalCode}
              onChange={(e) => setUseIncrementalCode(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="useIncremental" style={{ margin: 0, cursor: 'pointer' }}>Numeração incremental no cartão</label>
          </div>

          {useIncrementalCode && (
            <div className="input-group">
              <label>Prefixo Numeração</label>
              <input
                type="text"
                className="input-field"
                value={incrementalPrefix}
                onChange={(e) => setIncrementalPrefix(e.target.value)}
                placeholder="Ex: CARD-"
              />
            </div>
          )}

          <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
            <input
              type="checkbox"
              id="useInstagram"
              checked={useInstagram}
              onChange={(e) => setUseInstagram(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="useInstagram" style={{ margin: 0, cursor: 'pointer' }}>Exibir @ do Instagram no cartão</label>
          </div>

          {useInstagram && (
            <div className="input-group">
              <label>Seu @ no Instagram</label>
              <input
                type="text"
                className="input-field"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="Ex: @meuinstagram"
              />
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <button
              className="btn"
              onClick={handlePrint}
              disabled={data.length === 0}
              style={{ width: '100%', opacity: data.length === 0 ? 0.5 : 1, cursor: data.length === 0 ? 'not-allowed' : 'pointer' }}
            >
              <Printer size={20} />
              Imprimir / Salvar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid - Visible when printing */}
      {data.length > 0 && (
        <div className="cards-grid">
          {data.map((item, index) => {
            const formattedIncremental = useIncrementalCode
              ? `${incrementalPrefix}${String(index + 1).padStart(3, '0')} - `
              : '';
            const bottomText = `${formattedIncremental}${item.code}`;

            return (
              <div key={index} className="qr-card">
                <div className="qr-card-top">
                  <div className="qr-card-info">
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{titleText}</h3>

                    {useInstagram && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '0.3rem', marginTop: '0.2rem', color: '#db2777', fontWeight: 600, fontSize: '0.75rem' }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                        </svg>
                        <span>{instagramHandle}</span>
                      </div>
                    )}

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, marginTop: '0.2rem' }}>{customText}</p>
                  </div>

                  <div className="qr-wrapper">
                    <QRCodeSVG
                      value={`https://store.pokemongo.com/pt-BR/offer-redemption?passcode=${item.code}`}
                      size={80}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '0.3rem', borderTop: '1px dashed #e2e8f0', paddingTop: '0.5rem' }}>
                  <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0, fontWeight: 600 }}>
                    {bottomText}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer - Hidden when printing */}
      <footer className="no-print" style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', paddingBottom: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <p style={{ margin: 0 }}>Desenvolvido para facilitar a criação de cartões de resgate.</p>
        <a href="https://github.com/igorlopes/qr-cards-generator" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
          </svg>
          <span>Código fonte no GitHub</span>
        </a>
      </footer>
    </div>
  );
}

export default App;
