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
    byId('tmk-goals').innerHTML = '<article class="tmk-main-goal">' + icon('target') + '<span>META TELEMERCADEO · AGOSTO 2026</span><strong>' + number(config.meta.principal) + '</strong><small>MATRÍCULAS</small></article><div class="tmk-goal-facts"><article><span>Vigencia operacional</span><strong>' + safe(config.meta.vigencia) + '</strong></article><article><span>Días hábiles</span><strong>' + safe(config.meta.diasHabiles) + '</strong></article></div>';
    byId('tmk-source-notes').innerHTML = '<strong>Fuente oficial</strong><span>' + safe(config.meta.fuente) + '</span>' + config.notasFuente.map((note) => '<p>' + safe(note) + '</p>').join('');
  }

  function renderSkills() {
    byId('tmk-skills-grid').innerHTML = config.skills.map((skill, index) => {
      const team = config.personas.filter((person) => person.skill === skill.nombre);
      const people = team.map((person) => '<article class="tmk-person"><strong>' + safe(person.nombre) + '</strong><dl><div><dt>Meta matrículas</dt><dd>' + number(ceil(person.meta)) + '</dd></div><div><dt>Meta citas</dt><dd>' + number(ceil(skill.citasIndividuales)) + '</dd></div><div><dt>Meta diaria</dt><dd>' + number(ceil(skill.citasIndividuales / config.meta.diasHabiles)) + '</dd></div></dl></article>').join('');
      return '<article class="tmk-skill-card"><header><span>' + String(index + 1).padStart(2, '0') + '</span><h3>' + safe(skill.nombre) + '</h3></header><dl class="tmk-skill-kpis"><div><dt>Meta Skill</dt><dd>' + number(ceil(skill.metaMatriculas)) + '</dd><small>matrículas</small></div><div><dt>Meta individual</dt><dd>' + number(ceil(skill.metaIndividual)) + '</dd><small>matrículas</small></div><div><dt>Citas mensuales</dt><dd>' + number(ceil(skill.metaCitas)) + '</dd><small>requeridas</small></div></dl><details class="tmk-team"><summary>Ver equipo <i>＋</i></summary><div class="tmk-team-grid">' + people + '</div></details>' + (skill.nota ? '<small class="source-flag">' + safe(skill.nota) + '</small>' : '') + '</article>';
    }).join('');
  }

  function renderPerformance() {
    byId('tmk-performance').innerHTML = '<article class="tmk-score-factor">' + icon('phone') + '<span>VARIABLE 01</span><h3>Productividad</h3><div class="tmk-score-bar"><i></i></div><strong>MISMA IMPORTANCIA</strong></article><div class="tmk-score-plus">＋</div><article class="tmk-score-factor">' + icon('target') + '<span>VARIABLE 02</span><h3>Efectividad</h3><div class="tmk-score-bar"><i></i></div><strong>MISMA IMPORTANCIA</strong></article><div class="tmk-score-equals">＝</div><article class="score-card">' + icon('chart') + '<span>RESULTADO</span><h3>SCORE TMK</h3><strong>NIVEL DE DESEMPEÑO</strong></article>';
    byId('tmk-score-scale').innerHTML = config.desempeno.escala.map((item, index) => '<span class="level-' + (index + 1) + '"><b>0' + (index + 1) + '</b>' + safe(item) + '</span>').join('');
    byId('tmk-cycle').innerHTML = config.desempeno.ciclo.map((item) => '<article><strong>' + safe(item.periodo) + '</strong><p>' + safe(item.texto) + '</p></article>').join('');
    byId('tmk-productivity-body').innerHTML = config.productividad.map((item) => '<tr><td>' + safe(item.skill) + '</td><td>' + number(item.lunesViernes) + ' marcaciones</td><td>' + number(item.sabado) + ' marcaciones</td></tr>').join('');
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
    renderGoals();
    renderSkills();
    renderPerformance();
    renderIncentives();
    renderCulture();
    renderOperation();
    renderDocuments();
    bindNavigation();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
