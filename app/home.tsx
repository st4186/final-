/**
 * Home Route - Wrapper para Expo Router
 * Solo importa la vista, sin lógica de negocio
 */

import HomeView from './src/views/HomeView';

export default function Home() {
  return <HomeView />;
}