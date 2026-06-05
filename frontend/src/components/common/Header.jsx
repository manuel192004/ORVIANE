import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ORVIANE_CONTACT } from '../../data/contactChannels';
import '../../styles/_header.scss';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => {
    logout();
    closeMenu();
  };
  const accountLabel = 'Mi Cuenta';

  return (
    <header className="header">
      <div className="header-topline">
        <div className="header-topline-inner">
          <p>Sincelejo, Sucre | Citas previas y asesoria por WhatsApp</p>
          <div className="header-topline-actions">
            <a href={ORVIANE_CONTACT.whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <Link to="/cuenta" onClick={closeMenu}>
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>

      <div className="header-container">
        <Link to="/" className="header-logo" onClick={closeMenu}>
          <img src="/logo-orviane.png" alt="Orviane logo" />
        </Link>

        <nav className="header-nav desktop-nav" aria-label="Navegacion principal">
          <ul>
            <li><Link to="/" className="nav-link">Inicio</Link></li>
            <li><Link to="/orviane" className="nav-link">La Casa</Link></li>
            <li><Link to="/colecciones" className="nav-link">Colecciones</Link></li>
          </ul>
        </nav>

        <div className="header-actions desktop-nav">
          <Link to="/cuenta" className="header-account-link" title={accountLabel}>
            {accountLabel}
          </Link>
          <Link to="/agendar-cita" className="header-ghost-cta">
            Agenda Cita
          </Link>
          <Link to="/configurador" className="header-cta">
            Disena Tu Joya
          </Link>
          {isAuthenticated ? (
            <button type="button" className="header-account-button" onClick={handleLogout}>
              Salir
            </button>
          ) : null}
        </div>

        <button
          type="button"
          className="hamburger-button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
        >
          {menuOpen ? 'X' : 'Menu'}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav-links" aria-label="Navegacion movil">
            <Link to="/" className="nav-link" onClick={closeMenu}>Inicio</Link>
            <Link to="/orviane" className="nav-link" onClick={closeMenu}>La Casa</Link>
            <Link to="/colecciones" className="nav-link" onClick={closeMenu}>Colecciones</Link>
            <Link to="/cuenta" className="nav-link special-link" onClick={closeMenu}>{accountLabel}</Link>
            <Link to="/agendar-cita" className="nav-link special-link" onClick={closeMenu}>
              Agenda Cita
            </Link>
            <Link to="/configurador" className="nav-link special-link" onClick={closeMenu}>
              Disena Tu Joya
            </Link>
            {isAuthenticated ? (
              <button type="button" className="mobile-logout-button" onClick={handleLogout}>
                Cerrar sesion
              </button>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
