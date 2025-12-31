import { useState } from "react";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";

function App() {
  // Estado para saber en qué vista estamos (null = portada)
  const [selectedProfile, setSelectedProfile] = useState<'Joha' | 'Princesa' | null>(null);

  // Si no hemos seleccionado a nadie, mostramos la LandingPage
  // AQUI estaba el error: antes llamabas a <LandingPage /> sin nada.
  // Ahora le pasamos la función onSelection.
  if (!selectedProfile) {
    return (
      <LandingPage 
        onSelection={(profile) => setSelectedProfile(profile)} 
      />
    );
  }

  // Si ya seleccionamos a alguien, mostramos el Dashboard
  return (
    <Dashboard 
      user={selectedProfile} 
      onBack={() => setSelectedProfile(null)} 
    />
  );
}

export default App;