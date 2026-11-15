import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const ROLES = {
  ASTRONAUT: {
    id: 'astronaut',
    title: 'Astronaut (Crew)',
    name: 'Cmdr. Alex Vance',
    callsign: 'ARES-LEAD',
    avatar: '👨‍🚀',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    description: 'Direct onboard health monitoring, exercise logging, and symptom reports.'
  },
  SURGEON: {
    id: 'surgeon',
    title: 'Flight Surgeon',
    name: 'Dr. Evelyn Reed, MD',
    callsign: 'MED-FLIGHT-1',
    avatar: '🩺',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Clinical decision support, alert acknowledgement, countermeasure prescriptions.'
  },
  MISSION_CONTROL: {
    id: 'control',
    title: 'Mission Control',
    name: 'Director Marcus Cole',
    callsign: 'HOUSTON-DIR',
    avatar: '🛰️',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'System-wide telemetry, environmental hazards, space radiation alerts.'
  }
};

export function AuthProvider({ children }) {
  const [currentRole, setCurrentRole] = useState(ROLES.SURGEON);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const switchRole = (roleKey) => {
    if (ROLES[roleKey]) {
      setCurrentRole(ROLES[roleKey]);
    }
  };

  const loginAs = (roleId) => {
    const found = Object.values(ROLES).find(r => r.id === roleId);
    if (found) {
      setCurrentRole(found);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      currentRole,
      isAuthenticated,
      switchRole,
      loginAs,
      logout,
      ROLES
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
