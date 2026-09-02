(function () {
  'use strict';

  const config = window.SMART_CONFIG;
  const byId = (id) => document.getElementById(id);
  const safe = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const currency = (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

  function renderCampaignLaunchCards(items) {
    return items.map((item) => '<article class="tmk-campaign-card tmk-campaign-card--' + safe(item.color) + '"><span>SEPTIEMBRE 2026</span><h3>' + safe(item.titulo) + '</h3><strong>' + safe(item.cifra) + '</strong><p class="tmk-campaign-benefit">' + safe(item.beneficio) + '</p><p>' + safe(item.descripcion) + '</p><div class="tmk-campaign-actions"><a href="' + safe(item.campana) + '" target="_blank" rel="noopener noreferrer">Ver campaña ↗</a><a href="' + safe(item.condiciones) + '" target="_blank" rel="noopener noreferrer">Ver condiciones ↗</a><button type="button" data-gallery="' + safe(item.id) + '" data-gallery-count="' + safe(item.piezas) + '" data-gallery-title="' + safe(item.titulo) + '">Ver piezas</button></div></article>').join('');
  }

  window.SMART_CAMPAIGN_COMPONENT = Object.freeze({ render: renderCampaignLaunchCards });

  function renderGoals() {
    byId('goals-grid').innerHTML = '<article class="goal goal-main"><span>' + safe(config.objetivoMes.nombre) + '</span><strong>' + safe(currency(config.objetivoMes.valor)) + '</strong><small>Objetivo principal del equipo Smart Online</small></article>';
  }

  function renderFeaturedCampaigns() {
    const catalog = window.TMK_CONFIG ? window.TMK_CONFIG.campanasDestacadas : [];
    const campaigns = config.campanasDestacadasIds.map((id) => catalog.find((item) => item.id === id)).filter(Boolean);
    byId('featured-campaigns-online').innerHTML = window.SMART_CAMPAIGN_COMPONENT.render(campaigns);
  }

  function renderIndividualGoals() {
    byId('individual-goals-body').innerHTML = config.metasIndividuales.map((item) => '<tr class="category-' + safe(item.categoria.toLowerCase()) + '"><td><b>' + safe(item.categoria) + '</b></td><td>' + safe(item.ejecutivo) + '</td><td>' + safe(Math.round(item.matriculasAproximadas)) + '</td><td><strong>' + safe(currency(item.metaRecaudo)) + '</strong></td></tr>').join('');
  }

  function renderIncentives() {
    byId('bonus-grid').innerHTML = config.bonos.map((item) => '<article><strong>' + safe(item.cumplimiento) + '</strong><div><span>Nuevos</span><b>' + safe(item.nuevos) + '</b></div><div><span>Antiguos</span><b>' + safe(item.antiguos) + '</b></div></article>').join('');
    byId('group-bonus-grid').innerHTML = config.bonoGrupal.map((item) => '<article><span>Meta ' + safe(item.meta) + '</span><strong>' + safe(currency(item.valor)) + '</strong><p>' + safe(item.condicion) + '</p></article>').join('');
  }

  function renderAccelerators() {
    byId('accelerators-grid').innerHTML = config.aceleradores.map((item) => '<article><span>' + safe(item.nombre) + '</span><strong>' + safe(item.beneficio) + '</strong><small>' + safe(item.condicion) + '</small></article>').join('');
    byId('culture-grid').innerHTML = config.culturaChampions.map((item) => '<article><header><span>' + safe(item.semana) + '</span><strong>' + safe(item.periodo) + '</strong><b>Objetivo ' + safe(item.objetivo) + '</b></header><div>' + item.premios.map((premio) => '<p class="category-' + safe(premio.categoria.toLowerCase()) + '"><span>Categoría ' + safe(premio.categoria) + '</span><strong>' + safe(currency(premio.valor)) + '</strong></p>').join('') + '</div><figure><img src="' + safe(item.pieza) + '" alt="Pieza oficial ' + safe(item.semana) + ' con establecimientos autorizados" loading="lazy"><figcaption>Establecimientos oficiales definidos en la pieza de la semana.</figcaption></figure></article>').join('');
  }

  function renderCommissions() {
    byId('commissions-grid').innerHTML = config.comisiones.map((item) => '<article><strong>' + safe(item.cumplimiento) + '</strong><div><span>Contado</span><b>' + safe(item.contado) + '</b></div><div><span>COFAE</span><b>' + safe(item.cofae) + '</b></div></article>').join('');
    byId('commission-pending').textContent = config.rangoComisionPendiente;
    byId('compliance-list').innerHTML = config.condicionesCumplimiento.resumen.map((item) => '<li>' + safe(item) + '</li>').join('');
  }

  function renderChanges() {
    byId('changes-grid').innerHTML = config.cambios.map((change) => '<article class="change change-' + safe(change.tipo.toLowerCase().replace('ó', 'o')) + '"><span>' + safe(change.tipo) + '</span><h3>' + safe(change.titulo) + '</h3><p>' + safe(change.texto) + '</p></article>').join('');
  }

  function campaignCards(campaigns) {
    return campaigns.map((campaign, index) => '<article class="campaign-card campaign-' + safe(campaign.color) + '"><header><div><span>' + safe(campaign.linea) + '</span><h3>' + safe(campaign.nombre) + '</h3></div><b>' + safe(campaign.estado) + '</b></header><dl><div><dt>OBJETIVO</dt><dd>' + safe(campaign.objetivo) + '</dd></div><div><dt>BENEFICIO PRINCIPAL</dt><dd>' + safe(campaign.beneficio) + '</dd></div></dl><details><summary>Ver condiciones <i>＋</i></summary><ul>' + campaign.condiciones.map((condition) => '<li>' + safe(condition) + '</li>').join('') + '</ul>' + (campaign.documento ? '<a class="doc-button" href="' + safe(campaign.documento) + '" target="_blank" rel="noopener noreferrer">Documento oficial ↗</a>' : '') + '</details><em>' + String(index + 1).padStart(2, '0') + '</em></article>').join('');
  }

  function renderCampaigns() {
    byId('online-campaigns-grid').innerHTML = campaignCards(config.campanas.filter((campaign) => campaign.linea === 'SMART ONLINE'));
    byId('flex-campaigns-grid').innerHTML = campaignCards(config.campanas.filter((campaign) => campaign.linea === 'SMART FLEX'));
  }

  function renderMeasurement() {
    byId('measurement-grid').innerHTML = config.medicion.map((item) => '<article><span>' + safe(item.icono) + '</span><h3>' + safe(item.nombre) + '</h3><p>' + safe(item.texto) + '</p></article>').join('');
  }

  function renderNorth() {
    byId('north-grid').innerHTML = config.norte.map((item, index) => '<article><span>' + safe(item.icono) + '</span><strong>' + safe(item.nombre) + '</strong><small>' + String(index + 1).padStart(2, '0') + '</small></article>').join('');
  }

  function renderSales() {
    byId('sales-grid').innerHTML = config.argumentos.map((argument) => '<article><header><span>CAMPAÑA</span><h3>' + safe(argument.campana) + '</h3></header><p class="pitch"><small>CÓMO PRESENTARLA</small>' + safe(argument.presentar) + '</p><details><summary>Preparar conversación <i>＋</i></summary><dl><div><dt>Qué decir</dt><dd>' + safe(argument.decir) + '</dd></div><div><dt>Qué evitar</dt><dd>' + safe(argument.evitar) + '</dd></div><div><dt>Objeción principal</dt><dd>' + safe(argument.objecion) + '</dd></div><div><dt>Respuesta recomendada</dt><dd>' + safe(argument.respuesta) + '</dd></div><div><dt>Mensaje de cierre</dt><dd>' + safe(argument.cierre) + '</dd></div></dl></details></article>').join('');
  }

  function renderMistakes() {
    byId('mistakes-grid').innerHTML = config.errores.map((mistake, index) => '<article><span>0' + (index + 1) + '</span><h3>' + safe(mistake.titulo) + '</h3><p>' + safe(mistake.texto) + '</p></article>').join('');
  }

  function renderDocuments() {
    const documents = [{ icono: 'META', nombre: config.presentacionMeta.nombre, descripcion: 'Presentación oficial de la meta del equipo Smart Online.', url: config.presentacionMeta.url }].concat(config.recursos);
    byId('documents-grid').innerHTML = documents.map((document) => {
      const isPending = document.url === 'PENDIENTE_ENLACE' || document.descripcion.includes('PENDIENTE_VALIDACION');
      const action = isPending
        ? '<span class="doc-button pending" aria-disabled="true">Próximamente</span>'
        : '<a class="doc-button" href="' + safe(document.url) + '" target="_blank" rel="noopener noreferrer">Abrir documento ↗</a>';
      return '<article><span class="doc-icon">' + safe(document.icono) + '</span><h3>' + safe(document.nombre) + '</h3><p>' + safe(document.descripcion) + '</p>' + action + '</article>';
    }).join('');
  }

  function renderDirector() {
    byId('director-short').textContent = '“' + config.director.mensajeCorto + '”';
    byId('director-name').textContent = config.director.nombre;
    byId('director-role').textContent = config.director.cargo;
    byId('director-final').textContent = '“' + config.director.mensajeFinal + '”';
    byId('director-signature').textContent = config.director.nombre;
    if (config.director.foto !== 'PENDIENTE_IMAGEN') {
      const photo = byId('director-photo');
      photo.style.backgroundImage = 'url("' + config.director.foto.replace(/["'\\]/g, '') + '")';
      photo.classList.add('has-photo');
      photo.innerHTML = '';
    }
  }

  function enableReveals() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((item) => item.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
  }

  function initSliders() {
    document.querySelectorAll('[data-slider]').forEach((track) => {
      const previous = document.querySelector('[data-slider-prev="' + track.id + '"]');
      const next = document.querySelector('[data-slider-next="' + track.id + '"]');
      const move = (direction) => track.scrollBy({ left: direction * track.clientWidth * 0.82, behavior: 'smooth' });
      previous.addEventListener('click', () => move(-1));
      next.addEventListener('click', () => move(1));
    });
  }

  function init() {
    byId('nav-month').textContent = config.mes;
    byId('hero-plan').textContent = config.plan;
    byId('hero-subtitle').textContent = config.subtitulo;
    byId('hero-validity').textContent = config.vigencia;
    byId('hero-business-days').textContent = config.diasHabiles + ' DÍAS HÁBILES';
    byId('phrase-cover').textContent = config.frasesChampions.portada;
    byId('phrase-meta').textContent = config.frasesChampions.meta;
    byId('phrase-bonus').textContent = config.frasesChampions.bonos;
    byId('phrase-accelerators').textContent = config.frasesChampions.aceleradores;
    byId('phrase-culture').textContent = config.frasesChampions.cultura;
    renderDirector(); renderFeaturedCampaigns(); renderGoals(); renderIndividualGoals(); renderIncentives(); renderAccelerators(); renderCommissions(); renderChanges(); renderCampaigns(); renderMeasurement(); renderNorth(); renderSales(); renderMistakes(); renderDocuments(); initSliders(); enableReveals();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
