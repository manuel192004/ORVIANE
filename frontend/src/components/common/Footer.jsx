import React from 'react';
import { Link } from 'react-router-dom';
import { ORVIANE_CONTACT, socialChannels } from '../../data/contactChannels';
import ContactIcon from './ContactIcon';
import './../../styles/_footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-brand">
          <h3 className="footer-title">Orviane</h3>
          <p>Alta joyeria personalizada hecha a mano en el corazon de Sucre.</p>

          <div className="footer-socials">
            {socialChannels.map((channel) => (
              <a key={channel.label} href={channel.href} target="_blank" rel="noopener noreferrer" title={channel.label} aria-label={channel.label}>
                <ContactIcon name={channel.icon} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-section footer-links">
          <h3 className="footer-title">Navegacion</h3>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/orviane">La Casa</Link></li>
            <li><Link to="/colecciones">Colecciones</Link></li>
            <li><Link to="/configurador">Disena tu Joya</Link></li>
            <li><Link to="/cuenta">Mi Cuenta</Link></li>
          </ul>
        </div>

        <div className="footer-section footer-contact">
          <h3 className="footer-title">Contacto</h3>
          <p>Listo para crear tu pieza unica?</p>
          <p>
            <strong>Email:</strong>{' '}
            <a className="footer-contact-link" href={ORVIANE_CONTACT.emailHref}>
              {ORVIANE_CONTACT.email}
            </a>
          </p>
          <p>
            <strong>Direccion:</strong>{' '}
            <a className="footer-contact-link" href={ORVIANE_CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer">
              {ORVIANE_CONTACT.address}
            </a>
          </p>
          <p><strong>Horario:</strong> Lunes a sabado, 9:00 a.m. a 6:00 p.m.</p>
          <div className="footer-cta-group">
            <Link to="/agendar-cita" className="footer-cta-link">
              Agendar cita
            </Link>
            <a href={ORVIANE_CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" className="footer-cta-link footer-cta-link-secondary">
              WhatsApp directo
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Orviane. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
