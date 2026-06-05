import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import OrvianeConversionSection from '../components/common/OrvianeConversionSection';
import PageMeta from '../components/common/PageMeta';
import { ORVIANE_CONTACT } from '../data/contactChannels';
import '../styles/_appointmentpage.scss';

const appointmentSignals = [
  { label: 'Registro', value: 'Google Sheets + Trello via Make' },
  { label: 'Respuesta', value: 'Confirmacion por WhatsApp' },
  { label: 'Lugar', value: ORVIANE_CONTACT.address, href: ORVIANE_CONTACT.mapsUrl },
];

function readStateValue(state, keys, fallback = '') {
  const foundKey = keys.find((key) => typeof state?.[key] === 'string' && state[key].trim());
  return foundKey ? state[foundKey].trim() : fallback;
}

function AppointmentPage() {
  const location = useLocation();
  const defaultReason = readStateValue(
    location.state,
    ['defaultReason', 'appointmentReason', 'reason'],
    'Asesoria para elegir una joya Orviane',
  );
  const defaultNotes = readStateValue(location.state, ['defaultNotes', 'notes'], '');
  const source = readStateValue(location.state, ['source'], 'appointment-page');

  return (
    <div className="appointment-page fade-in-section">
      <PageMeta
        title="Agendar cita | Orviane"
        description="Agenda una asesoria corta con Orviane. El formulario queda registrado automaticamente para seguimiento comercial."
        path="/agendar-cita"
        image="/orviane-story-atelier.png"
      />

      <section className="appointment-hero">
        <img
          src="/orviane-story-atelier.png"
          alt="Atencion de joyeria Orviane"
          className="appointment-hero-image"
        />
        <div className="appointment-hero-copy">
          <span className="appointment-kicker">Cita Orviane</span>
          <h1>Agenda una asesoria corta.</h1>
          <p>
            Completa el formulario y la solicitud entra automaticamente al sistema que conectamos con Make,
            Google Sheets y Trello para hacerle seguimiento.
          </p>
          <div className="appointment-hero-actions">
            <a href="#formulario-cita" className="appointment-primary-link">
              Completar formulario
            </a>
            <Link to="/colecciones" className="appointment-secondary-link">
              Ver colecciones
            </Link>
          </div>
        </div>
        <div className="appointment-hero-panel" aria-label="Ruta de seguimiento">
          <span>01 Formulario</span>
          <span>02 Base en Sheets</span>
          <span>03 Tarjeta en Trello</span>
        </div>
      </section>

      <div id="formulario-cita" className="appointment-form-anchor">
        <OrvianeConversionSection
          className="appointment-conversion"
          kicker="Formulario conectado"
          title="Deja tus datos y el equipo retoma la solicitud con contexto"
          copy="Este formulario es el punto oficial para citas desde la pagina. Al enviarlo, queda registrado como solicitud nueva y listo para seguimiento comercial."
          highlights={['Cita previa', 'Registro automatico', 'Seguimiento en Trello']}
          signals={appointmentSignals}
          primaryAction={{
            label: 'Ver colecciones primero',
            to: '/colecciones',
          }}
          secondaryAction={{
            label: 'WhatsApp directo',
            href: ORVIANE_CONTACT.whatsappUrl,
            external: true,
          }}
          formTitle="Formulario de cita Orviane"
          formCopy="Cuéntanos quien eres, cuando prefieres hablar y que quieres resolver. Si vienes desde el asistente, el motivo puede venir prellenado."
          defaultReason={defaultReason}
          defaultNotes={defaultNotes}
          source={source}
        />
      </div>
    </div>
  );
}

export default AppointmentPage;
