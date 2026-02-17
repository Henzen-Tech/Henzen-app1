
import React, { useState, useEffect } from 'react';
import { db, ref, onValue } from './services/firebase';
import { AppData, NestData, HistoryEvent } from './types';
import StatCard from './components/StatCard';
import ProductionChart from './components/ProductionChart';

// Mock Data for Demo/Fallback mode
const MOCK_DATA: NestData = {
  stato: "OCCUPATO",
  ospite: "A1. Bianca",
  statistiche: {
    uova_totali: 42
  },
  ambiente: {
    temperatura: 24.5,
    umidita: 60,
    pressione: 1013.5
  },
  storico: {
    "evt1": { "evento": "UOVO", "dettagli": "A1. Bianca", "ora": "08:30" },
    "evt2": { "evento": "UOVO", "dettagli": "B2. Nera", "ora": "09:15" },
    "evt3": { "evento": "Entrata", "dettagli": "A1. Bianca", "ora": "10:00" },
    "evt4": { "evento": "UOVO", "dettagli": "C3. Rossa", "ora": "11:20" },
    "evt5": { "evento": "Uscita", "dettagli": "A1. Bianca", "ora": "12:00" }
  }
};

const App: React.FC = () => {
  const [data, setData] = useState<NestData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const nestRef = ref(db, 'nido_01');
    const connectedRef = ref(db, '.info/connected');
    let dataReceived = false;

    // Timeout: If Firebase doesn't respond in 2.5 seconds, show Mock Data
    const timeoutId = setTimeout(() => {
      if (isMounted && !dataReceived) {
        console.warn("Firebase connection timeout. Switching to Demo Mode.");
        setData(MOCK_DATA);
        setIsDemoMode(true);
        setLoading(false);
      }
    }, 2500);

    const unsubscribeConn = onValue(connectedRef, (snap) => {
      if (isMounted) setIsConnected(snap.val() === true);
    });

    const unsubscribeData = onValue(nestRef, (snapshot) => {
      dataReceived = true;
      if (isMounted) {
        if (snapshot.exists()) {
          setData(snapshot.val());
          setIsDemoMode(false);
        } else {
          // If database is empty but connected, we can init with null or empty structure
          // Keeping null for now, or could set default empty state
        }
        setLoading(false);
      }
    }, (error) => {
      console.error("Firebase Error:", error);
      if (isMounted && !dataReceived) {
        setData(MOCK_DATA);
        setIsDemoMode(true);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      unsubscribeData();
      unsubscribeConn();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          <p className="mt-4 text-gray-400 font-medium">Caricamento Henzen Smart Coop...</p>
        </div>
      </div>
    );
  }

  const isOccupied = data?.stato === 'OCCUPATO';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen relative">
      {/* Demo Banner */}
      {isDemoMode && (
        <div className="fixed top-0 left-0 w-full bg-amber-500/90 text-black text-center text-xs font-bold py-1 z-50">
          MODALITÀ DEMO - Configura Firebase in services/firebase.ts per i dati reali
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 mt-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center">
            <i className="fas fa-egg text-amber-500 mr-3"></i>
            Henzen <span className="text-amber-500 ml-2">Dashboard</span>
          </h1>
          <p className="text-gray-400 mt-1">Gestione intelligente dell'allevamento</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-[#1e1e1e] px-4 py-2 rounded-full border border-gray-800">
            <div className={`w-3 h-3 rounded-full mr-3 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm font-semibold text-gray-300 uppercase">
              {isConnected ? 'Connesso' : 'Disconnesso'}
            </span>
          </div>
          <div className="text-gray-500 text-sm">
            v1.0.4
          </div>
        </div>
      </header>

      <main className="space-y-6">
        {/* Hero Card: Nest Status */}
        <div className={`relative overflow-hidden rounded-3xl p-8 transition-all duration-500 shadow-2xl ${
          isOccupied 
          ? 'bg-gradient-to-br from-red-900/40 to-red-950/60 border border-red-500/30' 
          : 'bg-gradient-to-br from-green-900/40 to-green-950/60 border border-green-500/30'
        }`}>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
            <div>
              <p className="text-gray-300 uppercase tracking-widest text-sm font-bold mb-1">Stato Attuale Nido</p>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-2">
                {isOccupied ? 'OCCUPATO' : 'LIBERO'}
              </h2>
              {isOccupied && (
                <div className="flex items-center justify-center md:justify-start">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-lg font-medium">
                    <i className="fas fa-feather-alt mr-2"></i>
                    {data?.ospite || 'Gallina ignota'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center md:items-end">
               <div className="text-gray-400 text-sm font-bold uppercase mb-1">Produzione Totale</div>
               <div className="text-6xl font-black text-white tabular-nums">
                 {data?.statistiche?.uova_totali || 0}
                 <span className="text-2xl text-amber-500 ml-2">uova</span>
               </div>
            </div>
          </div>
          {/* Abstract background decorative elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Environmental Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label="Temperatura" 
            value={data?.ambiente?.temperatura || 0} 
            unit="°C" 
            icon="fas fa-thermometer-half" 
            colorClass="#EF4444"
          />
          <StatCard 
            label="Umidità" 
            value={data?.ambiente?.umidita || 0} 
            unit="%" 
            icon="fas fa-droplet" 
            colorClass="#3B82F6"
          />
          <StatCard 
            label="Pressione" 
            value={data?.ambiente?.pressione || 0} 
            unit="hPa" 
            icon="fas fa-gauge-high" 
            colorClass="#10B981"
          />
        </div>

        {/* Chart Section */}
        <ProductionChart storico={data?.storico} />
        
        {/* Activity Feed (Optional extra) */}
        <div className="glass-card rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold mb-4 text-gray-200">Ultimi Eventi</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {data?.storico ? (
              // Fix: Explicitly cast the values to HistoryEvent[] to resolve TypeScript "unknown" type errors
              (Object.values(data.storico) as HistoryEvent[]).reverse().map((event, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      event.evento === 'UOVO' ? 'bg-amber-500/20 text-amber-500' : 'bg-gray-700 text-gray-400'
                    }`}>
                      <i className={`fas ${event.evento === 'UOVO' ? 'fa-egg' : 'fa-right-to-bracket'}`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-100">{event.evento}</p>
                      <p className="text-xs text-gray-400">{event.dettagli}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-gray-500">{event.ora}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-center py-4">Nessuna attività registrata</p>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-600 text-xs">
        <p>&copy; 2024 Henzen Smart Systems. Tutti i diritti riservati.</p>
        <p className="mt-1 italic">Real-time data powered by Firebase Technology</p>
      </footer>
    </div>
  );
};

export default App;
