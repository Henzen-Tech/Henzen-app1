
export interface EnvironmentData {
  temperatura: number;
  umidita: number;
  pressione: number;
}

export interface HistoryEvent {
  evento: 'UOVO' | 'Entrata' | 'Uscita' | string;
  dettagli: string;
  ora: string;
}

export interface NestData {
  stato: 'LIBERO' | 'OCCUPATO';
  ospite: string;
  statistiche: {
    uova_totali: number;
  };
  ambiente: EnvironmentData;
  storico?: Record<string, HistoryEvent>;
}

export interface AppData {
  nido_01: NestData;
}
