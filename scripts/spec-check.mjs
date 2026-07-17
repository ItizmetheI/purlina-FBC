// CLIENT_SPEC.md evidence walk: renders the site headless in EN and TR and
// greps the live DOM for every load-bearing brochure string/number.
import puppeteer from 'puppeteer-core';

const URL = 'http://localhost:3000';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const EN = [
  'PURLINA', 'MATRIX CORE',
  'The Thermal Revolution Shaping the Future!',
  'Not Just Cooling,', 'But a Stable Environment for Evolution',
  'Servers', 'Pod', 'CDU', 'Hot Water Outlet', 'Cold Water Inlet',
  'Table of Contents',
  'Corporate Vision & Alkim Petrokimya',
  'The Invisible Strength', '14,500 m²', 'Istanbul Tuzla',
  '52.000 Tons', '270.000 Tons/Year', '60+ Tankers', '6 Warehouses',
  'Active Stock Capacity', 'Trade Volume', 'Special Distribution Fleet',
  'Next-Generation Thermal Management', 'third phase: thermal management',
  'This is not a cooling fluid; it is the stable environment in which processors operate.',
  'The Growth of Data Centers', '20%', '1% of global electricity',
  '5 zettabytes in 2010 to 180 zettabytes in 2025',
  'statista.com/statistics/871513',
  'Immersion Cooling Technology', 'Lower noise', 'Smaller footprint',
  '1,000× the volumetric thermal capacity of air', 'Lower PUE',
  'Higher hash rates', 'Near-zero water loss', 'Cooling without electricity',
  'single-phase dielectric immersion cooling fluid',
  'Redesigning the Thermal Environment',
  'High Insulation Strength', 'Thermal Stability', 'Pure Structure',
  'Molecular Structure', 'High electrical resistivity', 'High oxidation stability',
  'Long service life', 'Low volatility',
  'Technical Specifications', '>35 kV', '>10¹² Ω·m', '<0.01 mgKOH/g',
  '~2.0 kJ/kgK', '~0.13 W/mK', '240–265°C',
  'Synthetic Base Oil', 'Acid Number', '(Lower is better)',
  'X SERIES', 'Three separate viscosity segments',
  'Optimized for GPU-', 'balanced performance', '24/7',
  'L0.5', '0.837', '0.809', '0.819', '34.8', '9.19', '19.7',
  '254', '196', '248', '402', '336', '387',
  '(March 2026)',
  'Handling Precautions', 'Base Oil(s), Additives', 'DANGER',
  'May be fatal if swallowed and enters airways',
  'POISON CENTER', 'Do NOT induce vomiting',
  'PURE and AO Supported Versions', 'Pure Version', 'Neurological Protective Layer',
  'Energy and Water Efficiency', '48', '33', '30', '80',
  'Advantages of PURLINA MATRIX CORE', 'Cost advantage', 'High compatibility',
  'Safe and easy to use', 'fluorocarbons',
  'Applications of PURLINA MATRIX CORE', 'Cloud providers and hyperscale data centers',
  'Telecom providers', 'Colocation providers', 'Enterprises', 'Research institutes',
  'Blockchain operators', 'AI data centers', 'HPC centers', 'GPU training clusters',
  'Edge AI data centers', 'Modular data centers', 'Blockchain and crypto mining systems',
  'increase computing performance by up to', '40%',
  'The Stable Environment Processing the Future.',
  'Kimya Sanayicileri OSB Melek Aras Bulvarı, Aromatik Cd. No:61, 34956',
  '+90 (216) 593 24 61', '+90 (544) 395 91 66',
  'info@alkimpetrokimya.com', 'satis@alkimpetrokimya.com',
  '/alkim-petrokimya', 'alkimpetrokimya.com',
];

const TR = [
  'Geleceği İşleyen Termal Devrim!',
  'Soğutmanın Değil,', 'Evrimin Kararlı Ortamı',
  'İçindekiler',
  'Kurumsal Vizyon & Alkim Petrokimya',
  'Yarının', 'Kusursuz Formüllerine', 'Görünmez Güç',
  "14.500 m²", 'Operasyonel Gücümüz',
  '52.000 Ton', '270.000 Ton/Yıl', '60+ Tanker',
  '6 Ayrı Antrepo ile Kesintisiz Lojistik',
  'Yeni Nesil Isı Yönetimi', 'ısı yönetimi',
  'Bu bir soğutma sıvısı değildir; işlemcilerin çalıştığı kararlı ortamdır.',
  'Veri Merkezlerinin Büyümesi',
  '2010 yılında 5 zettabyte seviyesinden 2025 yılında 180 zettabyte',
  'Immersion Cooling Teknolojisi', 'Daha az gürültü', 'Daha düşük PUE',
  'Neredeyse sıfır su kaybı',
  'tek fazlı dielectric immersion soğutma akışkanıdır',
  'Termal Ortamın Yeniden Tasarlanması',
  'Yüksek İzolasyon Gücü', 'Termal Kararlılık', 'Saf Yapı',
  'Moleküler Yapı', 'Yüksek elektriksel direnç', 'Uzun servis ömrü',
  'Teknik Özellikleri', 'Parlama noktası',
  'X SERİSİ', 'viskozite segmenti',
  'Alevlenme Noktası', 'Otomatik Ateşleme Noktası', 'Hacim Direnci',
  '(Mart 2026)',
  'Kullanım Talimatları', 'Baz Yağ(lar), Katkı Maddeleri', 'TEHLİKELİ MADDE',
  'Yutulması ve solunum yollarına kaçması halinde ölümcül olabilir.',
  'ZEHİR DANIŞMA', 'KUSMAYA ZORLAMAYIN',
  'SAF ve AO Destekli Versiyonlar', 'Nörolojik Koruyucu Katman',
  'Enerji ve Su Verimliliği',
  'PURLINA MATRIX CORE Avantajları', 'Maliyet avantajı', 'Yüksek uyumluluk',
  'Güvenli ve kullanımı kolay',
  'PURLINA MATRIX CORE Kullanım Alanları', 'Bulut sağlayıcıları',
  'Telekom sağlayıcıları', 'Ortak yerleşim sağlayıcıları', 'İşletmeler',
  'Araştırma enstitüleri', 'Blockchain operatörleri',
  'Yapay zekâ veri merkezleri', 'HPC merkezleri', 'GPU eğitim kümeleri',
  'Modüler veri merkezleri', 'Blockchain ve kripto madencilik sistemleri',
  'Geleceği işleyen kararlı ortam.',
];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1500, height: 900 });

async function grab(lang) {
  await page.evaluateOnNewDocument((l) => localStorage.setItem('purlina-lang', l), lang);
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 3000));
  // textContent: copy presence; visibility is evidenced by shots/ screenshots
  return page.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
}

let fail = 0;
for (const [lang, list] of [['en', EN], ['tr', TR]]) {
  const text = await grab(lang);
  for (const needle of list) {
    const ok = text.includes(needle);
    if (!ok) { fail++; console.log(`FAIL [${lang}] ${needle}`); }
  }
  console.log(`${lang.toUpperCase()}: ${list.length - list.filter((n) => !text.includes(n)).length}/${list.length} strings present`);
}
await browser.close();
console.log(fail === 0 ? 'SPEC-CHECK: ALL PASS' : `SPEC-CHECK: ${fail} FAILURES`);
process.exit(fail === 0 ? 0 : 1);
