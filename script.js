(() => {
  'use strict';
  const data = window.CV_DATA;
  if (!data) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  function renderTable(target, headers, rows) {
    const el = $(target);
    if (!el) return;
    const keys = Object.keys(rows[0] || {});
    const displayHeaders = headers?.length ? headers : keys;
    el.innerHTML = `
      <table class="data-table">
        <thead><tr>${displayHeaders.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map(row => `<tr>${keys.map(k => `<td>${esc(row[k])}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>`;
  }

  function initHero() {
    const c = data.contact;
    $('#cvTitle').textContent = data.documentTitle;
    $('#heroRole').textContent = c.title;
    $('#heroInstitution').textContent = `${c.school}, ${c.institution}`;
    $('#heroObjective').textContent = data.careerObjective;
    $('#careerObjective').textContent = data.careerObjective;
    $('#specialization').textContent = data.specialization;
    $('#experienceHeading').textContent = data.experienceTitle;

    $('#contactStrip').innerHTML = `
      <a href="mailto:${esc(c.email)}">${esc(c.email)}</a>
      <a href="tel:${esc(c.mobile)}">Mobile: ${esc(c.mobile)}</a>
      <a href="tel:${esc(c.whatsapp)}">WhatsApp: ${esc(c.whatsapp)}</a>`;

    const tags = data.researchInterests.map(x => `<span class="tag">${esc(x)}</span>`).join('');
    $('#heroResearchTags').innerHTML = tags;

    const stats = [
      [data.experienceTitle.match(/\(([^)]+)\)/)?.[1] || '24.4 Years', 'Academic experience'],
      [data.sourceNotes.journalCount, 'Journal publications'],
      [data.sourceNotes.conferenceBookCount, 'Conferences / chapters'],
      [data.sourceNotes.patentCount, 'Patents'],
      [data.sourceNotes.phdScholarCount, 'Ph.D. scholars listed']
    ];
    $('#statGrid').innerHTML = stats.map(([value, label]) => `
      <div class="stat-card reveal"><strong data-count="${esc(value)}">${esc(value)}</strong><span>${esc(label)}</span></div>`).join('');
  }

  function initAcademic() {
    renderTable('#educationTable', data.educationHeaders, data.education);
    $('#experienceTimeline').innerHTML = data.experience.map((item, i) => {
      const vals = Object.values(item);
      const institution = vals[0], position = vals[1], from = vals[2], to = vals[3], exp = vals[4];
      return `<article class="timeline-item reveal">
        <div class="timeline-period">${esc(from)} — ${esc(to)}</div>
        <div class="timeline-rail" aria-hidden="true"></div>
        <div class="timeline-card">
          <h3>${esc(position)}</h3>
          <p>${esc(institution)}</p>
          <span class="experience-chip">${esc(exp)}</span>
        </div>
      </article>`;
    }).join('');

    $('#contributionGrid').innerHTML = data.professionalContributions.map((text, i) => `
      <article class="feature-card reveal">
        <span class="feature-number">${String(i + 1).padStart(2, '0')}</span>
        <p>${esc(text)}</p>
      </article>`).join('');
  }

  function initResearch() {
    $('#researchTags').innerHTML = data.researchInterests.map(x => `<span class="tag">${esc(x)}</span>`).join('');
    $('#softwareSkills').innerHTML = data.softwareSkills.map(x => `<li>${esc(x)}</li>`).join('');
    $('#subjectsGrid').innerHTML = data.subjectsTaught.map(x => `<div class="subject-item">${esc(x)}</div>`).join('');
    $('#mtechList').innerHTML = data.mtechDissertations.map(x => `<li>${esc(x)}</li>`).join('');
    $('#phdNarrative').textContent = data.phdSupervisionNarrative;
    renderTable('#phdTable', data.phdHeaders, data.phdScholars);
  }

  const publicationState = { type: 'all', year: 'all', query: '', expanded: false };
  const publications = [
    ...data.journalPublications.map((text, i) => ({ type: 'journal', typeLabel: 'Journal', originalIndex: i + 1, text })),
    ...data.conferenceBookPublications.map((text, i) => ({ type: 'conference', typeLabel: 'Conference / Chapter', originalIndex: i + 1, text }))
  ].map(p => {
    const years = [...p.text.matchAll(/\b(19|20)\d{2}\b/g)].map(m => m[0]);
    const year = years[0] || 'Not stated';
    let indexLabel = '';
    if (/SCIE/i.test(p.text)) indexLabel = 'SCIE';
    else if (/Scopus/i.test(p.text)) indexLabel = 'Scopus';
    return { ...p, year, indexLabel };
  });

  function markMatch(text, query) {
    if (!query) return esc(text);
    const safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return esc(text).replace(new RegExp(`(${safe})`, 'ig'), '<mark>$1</mark>');
  }

  function filteredPublications() {
    return publications.filter(p => {
      const typeOk = publicationState.type === 'all' || p.type === publicationState.type;
      const yearOk = publicationState.year === 'all' || p.year === publicationState.year;
      const q = publicationState.query.trim().toLowerCase();
      const queryOk = !q || p.text.toLowerCase().includes(q);
      return typeOk && yearOk && queryOk;
    });
  }

  function renderPublications() {
    const all = filteredPublications();
    const visible = publicationState.expanded ? all : all.slice(0, 12);
    $('#publicationSummary').textContent = `${all.length} of ${publications.length} publication entries match the current filters.`;
    $('#publicationList').innerHTML = visible.length ? visible.map((p) => `
      <article class="publication-item reveal visible">
        <div class="publication-number">${p.originalIndex}</div>
        <p class="publication-text">${markMatch(p.text, publicationState.query.trim())}</p>
        <div class="publication-meta">
          <span class="meta-chip brand">${esc(p.typeLabel)}</span>
          <span class="meta-chip">${esc(p.year)}</span>
          ${p.indexLabel ? `<span class="meta-chip">${esc(p.indexLabel)}</span>` : ''}
        </div>
      </article>`).join('') : '<div class="empty-state">No publication entries match your current filters.</div>';
    const btn = $('#publicationMore');
    btn.hidden = all.length <= 12;
    btn.textContent = publicationState.expanded ? 'Show fewer publications' : 'Show all publications';
  }

  function initPublicationControls() {
    const years = [...new Set(publications.map(p => p.year).filter(y => y !== 'Not stated'))].sort((a,b) => b.localeCompare(a));
    $('#publicationYear').insertAdjacentHTML('beforeend', years.map(y => `<option value="${esc(y)}">${esc(y)}</option>`).join('') + '<option value="Not stated">Year not stated</option>');

    $('#publicationSearch').addEventListener('input', e => {
      publicationState.query = e.target.value;
      publicationState.expanded = false;
      renderPublications();
    });
    $('#publicationYear').addEventListener('change', e => {
      publicationState.year = e.target.value;
      publicationState.expanded = false;
      renderPublications();
    });
    $$('[data-publication-filter]').forEach(btn => btn.addEventListener('click', () => {
      publicationState.type = btn.dataset.publicationFilter;
      publicationState.expanded = false;
      $$('[data-publication-filter]').forEach(x => x.classList.toggle('active', x === btn));
      renderPublications();
    }));
    $('#publicationMore').addEventListener('click', () => {
      publicationState.expanded = !publicationState.expanded;
      renderPublications();
      if (!publicationState.expanded) $('#publications').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    renderPublications();
  }

  function initPatents() {
    $('#patentGrid').innerHTML = data.patents.map((p, i) => {
      const vals = Object.values(p);
      return `<article class="patent-card reveal">
        <div class="patent-top">
          <span class="patent-index">Patent ${String(i + 1).padStart(2, '0')}</span>
          <span class="status-badge">${esc(vals[4])}</span>
        </div>
        <h3>${esc(vals[1])}</h3>
        <div class="patent-meta">
          <div><small>Role</small><strong>${esc(vals[2])}</strong></div>
          <div><small>Application No.</small><strong>${esc(vals[3])}</strong></div>
        </div>
      </article>`;
    }).join('');
  }

  function initActivities() {
    const render = (q = '') => {
      const query = q.trim().toLowerCase();
      const items = data.workshopsSeminars.filter(x => !query || x.toLowerCase().includes(query));
      $('#activityCount').textContent = `${items.length} of ${data.workshopsSeminars.length}`;
      $('#activityList').innerHTML = items.length ? items.map((x, i) => `
        <article class="activity-card reveal visible"><span>${String(i + 1).padStart(2,'0')}</span><p>${esc(x)}</p></article>`).join('')
        : '<div class="empty-state">No workshop or seminar entries match this filter.</div>';
    };
    $('#activitySearch').addEventListener('input', e => render(e.target.value));
    render();

    $('#membershipGrid').innerHTML = data.memberships.map((x, i) => `
      <article class="membership-card reveal">
        <div class="membership-icon">${i + 1}</div>
        <p>${esc(x)}</p>
      </article>`).join('');
  }

  function initPersonal() {
    renderTable('#personalTable', data.personalHeaders, data.personalDetails.map(row => {
      const vals = Object.values(row);
      return { Field: vals[0], Details: vals[1] };
    }));
    $('#declaration').textContent = data.declaration;
    $('#signatureLabel').textContent = data.signatureLabel;

    const c = data.contact;
    $('#contactInstitution').textContent = `${c.school}, ${c.institution}`;
    $('#contactActions').innerHTML = `
      <a href="mailto:${esc(c.email)}">Email</a>
      <a href="tel:${esc(c.mobile)}">Call</a>
      <a href="tel:${esc(c.whatsapp)}">WhatsApp No.</a>`;
  }

  function initTheme() {
    const saved = localStorage.getItem('academic-theme');
    if (saved === 'dark' || saved === 'light') document.documentElement.dataset.theme = saved;
    const sync = () => $('#themeToggle').textContent = document.documentElement.dataset.theme === 'dark' ? '☀' : '◐';
    sync();
    $('#themeToggle').addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('academic-theme', next);
      sync();
    });
  }

  function initNavigation() {
    const toggle = $('#navToggle');
    const nav = $('#navLinks');
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    });
    $$('#navLinks a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }));

    const sections = $$('main section[id]');
    const links = $$('#navLinks a');
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-30% 0px -60% 0px', threshold: [0, .1, .5] });
    sections.forEach(s => observer.observe(s));
  }

  function initReveal() {
    const reveal = () => {
      const els = $$('.reveal:not(.visible)');
      if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('visible'));
        return;
      }
      const ob = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            ob.unobserve(entry.target);
          }
        });
      }, { threshold: .08 });
      els.forEach(el => ob.observe(el));
    };
    reveal();
    const mo = new MutationObserver(reveal);
    mo.observe(document.body, { childList: true, subtree: true });
  }

  function initUtilities() {
    $('#printButton').addEventListener('click', () => window.print());
    const back = $('#backToTop');
    window.addEventListener('scroll', () => back.classList.toggle('visible', window.scrollY > 700), { passive: true });
    back.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  initHero();
  initAcademic();
  initResearch();
  initPublicationControls();
  initPatents();
  initActivities();
  initPersonal();
  initTheme();
  initNavigation();
  initReveal();
  initUtilities();
})();
