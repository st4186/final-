export interface Resource {
  id: string;
  name: string;
  building: string;
  status: 'available' | 'in-use' | 'in-queue';
  schedule: string;
}

export const mockResources: Resource[] = [
  { 
    id: '1', 
    name: 'Laboratorio Mac', 
    building: 'Edificio D', 
    status: 'in-use',
    schedule: '10AM - 12PM'
  },
  { 
    id: '2', 
    name: 'Impresora Láser', 
    building: 'Edificio D', 
    status: 'available',
    schedule: '-'
  },
  { 
    id: '3', 
    name: 'Taller Industrial', 
    building: 'Edificio B', 
    status: 'in-queue',
    schedule: '9AM - 10AM'
  },
  { 
    id: '4', 
    name: 'Cubículo Biblioteca', 
    building: 'Learning Commons', 
    status: 'available',
    schedule: '-'
  }
];