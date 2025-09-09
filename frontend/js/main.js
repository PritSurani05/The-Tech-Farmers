// Main helpers: year, language toggle (simple), i18n binding
document.addEventListener('DOMContentLoaded', async () => {
  // year fill
  document.querySelectorAll('#year,#year2,#year3,#year4,#year5').forEach(el => { if(el) el.textContent = new Date().getFullYear(); });

  // load translations JSON (script tag approach fallback)
  let translations = null;
  try {
    const res = await fetch('/js/translations.json');
    translations = await res.json();
  } catch (e) {
    console.warn('Translations load failed', e);
  }

  const langBtn = document.getElementById('lang-toggle');
  let current = localStorage.getItem('sa_lang') || 'en';
  const applyLang = (lang) => {
    if (!translations) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) el.innerText = translations[lang][key];
    });
    if (langBtn) langBtn.innerText = (lang === 'en') ? 'हिंदी' : 'EN';
    localStorage.setItem('sa_lang', lang);
  };
  if (langBtn && translations) {
    langBtn.addEventListener('click', () => {
      current = (current === 'en') ? 'hi' : 'en';
      applyLang(current);
    });
    applyLang(current);
  }
});
