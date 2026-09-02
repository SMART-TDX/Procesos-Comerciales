(function () {
  'use strict';

  const config = window.TMK_CONFIG;
  const byId = (id) => document.getElementById(id);
  const safe = (value) => String(value == null ? '' : value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const number = (value, digits) => new Intl.NumberFormat('es-CO', { maximumFractionDigits: digits == null ? 0 : digits }).format(value);
  const ceil = (value) => Math.ceil(Number(value));

  const icon = (name) => {
    const paths = {
      target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v3M22 12h-3M12 22v-3M2 12h3"/>',
      phone: '<path d="M5 4h4l2 5-3 2a15 15 0 0 0 5 5l2-3 5 2v4c0 1-1 2-2 2A17 17 0 0 1 3 6c0-1 1-2 2-2Z"/>',
      chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
      award: '<circle cx="12" cy="8" r="5"/><path d="m8 12-2 9 6-3 6 3-2-9"/>',
      document: '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/>'
    };
    return '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (paths[name] || paths.target) + '</svg>';
  };

  function setView(view, preserveHash) {
    document.querySelectorAll('[data-view]').forEach((node) => {
      const active = node.dataset.view === view;
      node.hidden = !active;
      node.setAttribute('aria-hidden', String(!active));
    });
    document.body.dataset.activeView = view;
    document.querySelectorAll('[data-view-link]').forEach((link) => link.classList.toggle('active', link.dataset.viewLink === view));
    if (!preserveHash) window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function viewForHash(hash) {
    if (hash.startsWith('#tmk-')) return 'tmk';
    if (hash === '#inicio' || hash === '' || hash === '#') return 'home';
    return 'online';
  }

  function bindNavigation() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('[data-view-link]');
      if (!link) return;
      setView(link.dataset.viewLink, true);
    });
    window.addEventListener('hashchange', () => setView(viewForHash(window.location.hash), true));
    setView(viewForHash(window.location.hash), true);
  }

  function renderGoals() {
    byId('tmk-goals').innerHTML = '<article class="tmk-main-goal">' + icon('target') + '<span>META TELEMERCADEO · ' + safe(config.mes) + '</span><strong>' + number(config.meta.principal) + '</strong><small>MATRÍCULAS · META ASPIRACIONAL</small></article><div class="tmk-goal-facts">' + config.meta.niveles.map((item) => '<article><span>Meta ' + safe(item.nombre) + '</span><strong>' + number(item.valor) + '</strong></article>').join('') + '<article><span>Vigencia operacional</span><strong>' + safe(config.meta.vigencia) + '</strong></article></div>';
    byId('tmk-source-notes').innerHTML = '<strong>Fuente oficial</strong><span>' + safe(config.meta.fuente) + '</span>' + config.notasFuente.map((note) => '<p>' + safe(note) + '</p>').join('');
  }

  function renderCampaigns() {
    byId('tmk-campaigns').innerHTML = window.SMART_CAMPAIGN_COMPONENT.render(config.campanasDestacadas);
  }

  function productivityMarkup(skill) {
    return '<div class="tmk-daily-title">TU PRODUCTIVIDAD DIARIA</div><div class="tmk-daily-grid"><article><span>Lunes–Miércoles</span><b>' + number(skill.marcaciones.lunesMiercoles) + ' marcaciones</b><strong>' + number(skill.citasDiarias.lunesMiercoles) + ' citas</strong></article><article><span>Jueves–Viernes</span><b>' + number(skill.marcaciones.juevesViernes) + ' marcaciones</b><strong>' + number(skill.citasDiarias.juevesViernes) + ' citas</strong></article><article><span>Sábado</span><b>' + number(skill.marcaciones.sabado) + ' marcaciones</b><strong>' + number(skill.citasDiarias.sabado) + ' citas</strong></article><article><span>Domingo</span><b>Sin meta de marcaciones definida</b><strong>' + number(skill.citasDiarias.domingo) + ' citas</strong></article></div>';
  }

  function renderSkills() {
    const renderTeam = (skillName) => {
      const skill = config.skills.find((item) => item.nombre === skillName) || config.skills[0];
      const team = config.personas.filter((person) => person.skill === skill.nombre);
      byId('tmk-skills-grid').innerHTML = '<article class="tmk-objective-card"><header><span>TU OBJETIVO DE SEPTIEMBRE</span><h3>' + safe(skill.nombre) + '</h3></header><dl><div><dt>Meta individual</dt><dd>' + number(skill.metaIndividual, 3) + '</dd><small>matrículas</small></div><div><dt>Meta mensual citas</dt><dd>' + number(Math.round(skill.metaCitas)) + '</dd></div><div><dt>Meta presencial</dt><dd>' + number(Math.round(skill.citasPresenciales)) + '</dd></div><div><dt>Efectividad</dt><dd>' + safe(skill.efectividad) + '</dd></div></dl>' + productivityMarkup(skill) + '</article><div class="tmk-team-cards">' + team.map((person) => '<article class="tmk-person-summary"><span>' + safe(skill.nombre) + '</span><h3>' + safe(person.nombre) + '</h3><dl><div><dt>Meta individual</dt><dd>' + number(person.meta, 3) + '</dd></div><div><dt>Meta mensual citas</dt><dd>' + number(Math.round(skill.metaCitas)) + '</dd></div><div><dt>Efectividad</dt><dd>' + safe(skill.efectividad) + '</dd></div></dl><details><summary>Ver meta completa <i>＋</i></summary>' + productivityMarkup(skill) + '<p><b>Meta presencial:</b> ' + number(Math.round(skill.citasPresenciales)) + '</p><h4>Bonos aplicables</h4><ul>' + config.bonos.map((bonus) => '<li>' + safe(bonus.nombre) + ': ' + number(bonus.valores[skill.nombre], 3) + ' matrículas</li>').join('') + '</ul><h4>Aceleradores</h4><ul>' + config.aceleradores.map((item) => '<li>' + safe(item.periodo) + ' · ' + safe(item.objetivo) + '</li>').join('') + '</ul></details></article>').join('') + '</div>';
      document.querySelectorAll('[data-skill-tab]').forEach((tab) => { const selected = tab.dataset.skillTab === skill.nombre; tab.classList.toggle('active', selected); tab.setAttribute('aria-selected', String(selected)); });
    };
    byId('tmk-skill-tabs').innerHTML = config.skills.map((skill, index) => '<button type="button" role="tab" aria-selected="' + String(index === 0) + '" class="' + (index === 0 ? 'active' : '') + '" data-skill-tab="' + safe(skill.nombre) + '">' + safe(skill.nombre.replace('Correos Reingresos y Reingresos SF', 'Correos / Reingresos')) + '</button>').join('');
    byId('tmk-skill-tabs').addEventListener('click', (event) => { const tab = event.target.closest('[data-skill-tab]'); if (tab) renderTeam(tab.dataset.skillTab); });
    renderTeam(config.skills[0].nombre);
  }

  function renderPerformance() {
    byId('tmk-performance').innerHTML = '<article class="tmk-score-factor">' + icon('phone') + '<span>VARIABLE 01</span><h3>Productividad</h3><div class="tmk-score-bar"><i></i></div><strong>MISMA IMPORTANCIA</strong></article><div class="tmk-score-plus">＋</div><article class="tmk-score-factor">' + icon('target') + '<span>VARIABLE 02</span><h3>Efectividad</h3><div class="tmk-score-bar"><i></i></div><strong>MISMA IMPORTANCIA</strong></article><div class="tmk-score-equals">＝</div><article class="score-card">' + icon('chart') + '<span>RESULTADO</span><h3>SCORE TMK</h3><strong>NIVEL DE DESEMPEÑO</strong></article>';
    byId('tmk-score-scale').innerHTML = config.desempeno.escala.map((item, index) => '<span class="level-' + (index + 1) + '"><b>0' + (index + 1) + '</b>' + safe(item) + '</span>').join('');
    byId('tmk-cycle').innerHTML = config.desempeno.ciclo.map((item) => '<article><strong>' + safe(item.periodo) + '</strong><p>' + safe(item.texto) + '</p></article>').join('');
    byId('tmk-productivity-body').innerHTML = config.skills.map((item) => '<tr><th scope="row">' + safe(item.nombre.replace('Correos Reingresos y Reingresos SF', 'Correos / Reingresos')) + '</th><td>' + safe(item.efectividad) + '</td><td>' + number(item.marcaciones.lunesMiercoles) + '</td><td>' + number(item.marcaciones.juevesViernes) + '</td><td>' + number(item.marcaciones.sabado) + '</td><td>' + number(item.citasDiarias.lunesMiercoles) + '</td><td>' + number(item.citasDiarias.juevesViernes) + '</td><td>' + number(item.citasDiarias.sabado) + '</td><td>' + number(item.citasDiarias.domingo) + '</td><td>' + number(Math.round(item.metaCitas)) + '</td><td>' + number(Math.round(item.citasPresenciales)) + '</td></tr>').join('');
  }

  function bindGallery() {
    const dialog = byId('campaign-gallery');
    const grid = byId('gallery-grid');
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-gallery]');
      if (!trigger) return;
      const group = trigger.dataset.gallery;
      const count = Number(trigger.dataset.galleryCount);
      byId('gallery-title').textContent = trigger.dataset.galleryTitle;
      grid.innerHTML = Array.from({ length: count }, (_, index) => {
        const piece = String(index + 1).padStart(2, '0');
        const base = 'assets/campanas/septiembre/' + group;
        return '<article><img src="' + base + '/miniaturas/pieza-' + piece + '.webp" alt="Pieza oficial ' + safe(trigger.dataset.galleryTitle) + ' ' + piece + '" loading="lazy"><div><span>Pieza ' + piece + '</span><a href="' + base + '/descargas/pieza-' + piece + '.png" target="_blank" rel="noopener noreferrer">Ver</a><a href="' + base + '/descargas/pieza-' + piece + '.png" download>Descargar</a></div></article>';
      }).join('');
      dialog.showModal();
    });
    dialog.querySelector('[data-gallery-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  }

  function renderIncentives() {
    byId('tmk-bonuses').innerHTML = config.bonos.map((bonus) => '<article><span>' + safe(bonus.factor) + ' de la meta</span><h3>' + safe(bonus.nombre) + '</h3><details><summary>Ver metas por Skill <i>＋</i></summary><ul>' + Object.entries(bonus.valores).map(([skill, value]) => '<li><span>' + safe(skill) + '</span><strong>' + number(value, 2) + '</strong></li>').join('') + '</ul></details></article>').join('');
    byId('tmk-accelerators').innerHTML = config.aceleradores.map((item, index) => '<article><span>0' + (index + 1) + '</span><small>' + safe(item.periodo) + '</small><h3>' + safe(item.premio) + '</h3><p><b>Objetivo:</b> ' + safe(item.objetivo) + '</p><p>' + safe(item.condicion) + '</p></article>').join('');
  }

  function renderCulture() {
    byId('tmk-culture').innerHTML = config.cultura.map((item) => '<article><div><span>' + safe(item.semana) + '</span><strong>' + safe(item.objetivo) + '</strong><small>' + safe(item.periodo) + '</small></div><img src="' + safe(item.imagen) + '" alt="Pieza oficial Cultura Champions TMK ' + safe(item.semana) + '" loading="lazy"></article>').join('');
  }

  function renderOperation() {
    byId('tmk-route').innerHTML = config.rutaCita.map((item, index) => '<article><span>0' + (index + 1) + '</span><strong>' + safe(item) + '</strong></article>').join('');
    byId('tmk-whatsapp').innerHTML = config.whatsapp.map((item) => '<details><summary>' + safe(item.titulo) + '<i>＋</i></summary><p>' + safe(item.texto) + '</p></details>').join('');
    byId('tmk-data-management').innerHTML = config.gestionDatos.map((item) => '<details><summary>' + safe(item.titulo) + '<i>＋</i></summary><p>' + safe(item.texto) + '</p></details>').join('');
    byId('tmk-accompaniment-list').innerHTML = config.acompanamiento.map((item) => '<li>' + safe(item) + '</li>').join('');
  }

  function renderDocuments() {
    byId('tmk-documents').innerHTML = config.documentos.map((item) => '<article>' + icon('document') + '<span>' + safe(item.tipo) + '</span><h3>' + safe(item.nombre) + '</h3><a href="' + safe(item.url) + '" target="_blank" rel="noopener noreferrer">Abrir recurso ↗</a></article>').join('');
  }

  function init() {
    if (!config) return;
    byId('tmk-subtitle').textContent = config.subtitulo;
    byId('tmk-concept').textContent = '“' + config.concepto + '”';
    renderCampaigns();
    renderGoals();
    renderSkills();
    renderPerformance();
    renderIncentives();
    renderCulture();
    renderOperation();
    renderDocuments();
    bindGallery();
    bindNavigation();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
