import { useEffect, useState } from 'react';
import ContactIcon from '../components/common/ContactIcon';
import PageMeta from '../components/common/PageMeta';
import { ORVIANE_CONTACT } from '../data/contactChannels';
import { apiFetch } from '../lib/api';
import '../styles/_operationspage.scss';

function LinktreePage() {
  const [links, setLinks] = useState([]);
  const [status, setStatus] = useState('Cargando enlaces...');

  useEffect(() => {
    let mounted = true;

    apiFetch('/api/public/linktree')
      .then((data) => {
        if (!mounted) return;
        setLinks(Array.isArray(data.links) ? data.links : []);
        setStatus('');
      })
      .catch((error) => {
        if (!mounted) return;
        setStatus(error.message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="linktree-page">
      <PageMeta
        title="Linktree | Orviane"
        description="Accesos rapidos de Orviane para WhatsApp, colecciones, cita y configurador."
        path="/linktree"
        image="/logo-orviane.png"
      />

      <section className="linktree-shell fade-in-section">
        <div className="linktree-card">
          <div className="linktree-avatar">
            <img src="/logo-orviane.png" alt="Orviane" />
          </div>
          <span className="linktree-eyebrow">Orviane</span>
          <h1>Accesos rapidos desde un solo lugar.</h1>
          <p>
            Si llegaste desde Instagram, WhatsApp o una recomendacion, aqui tienes el camino mas corto para hablar,
            ver la coleccion o pedir una cita.
          </p>

          <div className="linktree-actions">
            {links.length ? (
              links.map((link) => (
                <a
                  key={link.linkId}
                  href={link.url}
                  className="linktree-action"
                  target={link.url.startsWith('http') ? '_blank' : '_self'}
                  rel={link.url.startsWith('http') ? 'noreferrer' : undefined}
                >
                  <span className="linktree-action-icon">
                    <ContactIcon name={link.icon || link.linkKey} />
                  </span>
                  <span className="linktree-action-copy">
                    <strong>{link.label}</strong>
                    <span>{link.description || link.category || 'Acceso rapido'}</span>
                  </span>
                </a>
              ))
            ) : (
              <p className="linktree-status">{status || 'No hay enlaces activos por ahora.'}</p>
            )}
          </div>

          <div className="linktree-footer">
            <a href={ORVIANE_CONTACT.whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp directo
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LinktreePage;
