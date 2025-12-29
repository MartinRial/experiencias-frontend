export const DEPARTAMENTOS_COORDS = {
  "Artigas": { lat: -30.4000, lng: -56.4667 },
  "Canelones": { lat: -34.5228, lng: -56.0164 },
  "Cerro Largo": { lat: -32.3667, lng: -54.3167 },
  "Colonia": { lat: -34.4667, lng: -57.8333 },
  "Durazno": { lat: -33.3833, lng: -56.5167 },
  "Flores": { lat: -33.5167, lng: -56.8833 },
  "Florida": { lat: -34.0833, lng: -56.2167 },
  "Lavalleja": { lat: -34.3667, lng: -55.2333 },
  "Maldonado": { lat: -34.9000, lng: -54.9500 },
  "Montevideo": { lat: -34.9011, lng: -56.1645 },
  "Paysandú": { lat: -32.3167, lng: -58.0833 },
  "Río Negro": { lat: -32.7833, lng: -58.0833 },
  "Rivera": { lat: -30.9000, lng: -55.5500 },
  "Rocha": { lat: -34.4833, lng: -54.3333 },
  "Salto": { lat: -31.3833, lng: -57.9667 },
  "San José": { lat: -34.3333, lng: -56.7167 },
  "Soriano": { lat: -33.4333, lng: -58.3000 },
  "Tacuarembó": { lat: -31.7167, lng: -55.9833 },
  "Treinta y Tres": { lat: -33.2333, lng: -54.3833 }
};

// Función helper para obtener coordenadas por departamento
export const getCoordsFromDepartamento = (departamento) => {
  return DEPARTAMENTOS_COORDS[departamento] || { lat: -32.5228, lng: -55.7658 };
};