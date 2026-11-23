const languageSelect = document.querySelector('#language-select');
if (languageSelect) {
  const currentLanguage = languageSelect.querySelector('option[selected]').value;
  languageSelect.addEventListener('change', () => {
    const destination = new URL(languageSelect.value, window.location.href);
    destination.hash = window.location.hash;
    window.location.assign(destination.href);
  });
  // Browsers may restore the previously chosen value when navigating back.
  window.addEventListener('pageshow', () => { languageSelect.value = currentLanguage; });
  languageSelect.closest('.language-switch').hidden = false;
  document.querySelector('.language-links').hidden = true;
}

const status = document.querySelector('#copy-status');
const copyMessages = {
  en: {
    label: 'Copy CSV', copied: 'Copied', selected: 'Text selected',
    buttonLabel: heading => `Copy CSV: ${heading}`,
    success: heading => `Copied CSV: ${heading}.`,
    fallback: 'CSV content selected. Use your device’s Copy command to copy it.',
  },
  ja: {
    label: 'サンプルをコピー', copied: 'コピーしました', selected: '選択しました',
    buttonLabel: heading => `${heading}のサンプルをコピー`,
    success: heading => `${heading}のサンプルをコピーしました。`,
    fallback: 'CSV の内容を選択しました。端末のコピー操作でコピーしてください。',
  },
  'zh-Hans': {
    label: '复制示例', copied: '已复制', selected: '已选中内容',
    buttonLabel: heading => `复制${heading}示例`,
    success: heading => `已复制${heading}示例。`,
    fallback: '已选中 CSV 内容，请使用系统的复制功能。',
  },
  'zh-Hant': {
    label: '複製範例', copied: '已複製', selected: '已選取內容',
    buttonLabel: heading => `複製${heading}範例`,
    success: heading => `已複製${heading}範例。`,
    fallback: '請使用系統的複製功能，複製已選取的 CSV 範例。',
  },
};
const copyText = copyMessages[document.documentElement.lang] || copyMessages['zh-Hant'];

for (const button of document.querySelectorAll('.copy-button')) {
  button.hidden = false;
  const example = button.closest('.code-example');
  const heading = example.previousElementSibling?.textContent || 'CSV';
  button.setAttribute('aria-label', copyText.buttonLabel(heading));
  let timer;
  button.addEventListener('click', async () => {
    clearTimeout(timer);
    status.textContent = '';
    try {
      await navigator.clipboard.writeText(example.querySelector('code').textContent);
      button.textContent = copyText.copied;
      status.textContent = copyText.success(heading);
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(example.querySelector('code'));
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = copyText.selected;
      status.textContent = copyText.fallback;
    }
    timer = setTimeout(() => { button.textContent = copyText.label; }, 2500);
  });
}

const links = [...document.querySelectorAll('nav a')];
const sections = links.map(link => document.querySelector(link.getAttribute('href')));
let scheduled = false;
function updateNavigation() {
  const active = sections.filter(section => section.getBoundingClientRect().top <= 160).pop();
  links.forEach((link, index) => {
    if (sections[index] === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); }
}, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();
