/**
 * Profile Route - Wrapper para Expo Router
 * Solo importa la vista, sin lógica de negocio
 */

import ProfileView from './src/views/ProfileView';

export default function Profile() {
  return <ProfileView />;
}