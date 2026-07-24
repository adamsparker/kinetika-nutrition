// ============================================================
// 1. DATA: категории и товары — загружаются из JSON, fallback
// ============================================================
let RAW = [];

const FALLBACK = [
    { cat: 'БАДЫ ФИРМЫ 21 CENTURY', items: [
            { code: '00639', name: '21 Century Calcium Magnesium Zinc+D3 90 tablets', price: 600 },
            { code: '00492', name: '21st Century zinc citrate 50 mg 60tabs', price: 800 }
        ] },
    { cat: 'CREATINE', items: [
            { code: '00642', name: '50bmg Creatine 300 gr', price: 800 },
            { code: '00789', name: '50bmg creatine 200 caps', price: 1000 }
        ] }
];

// ============================================================
// 2. МАППИНГ: фирменная категория → общая категория
// ============================================================
const CATEGORY_MAP = {
    'БАДЫ ФИРМЫ 21 CENTURY': 'БАДы',
    'БАДЫ ФИРМЫ 50BMG': 'БАДы',
    'БАДЫ ФИРМЫ NOW': 'БАДы',
    'БАДЫ ФИРМЫ SWANSON': 'БАДы',
    'БАДЫ ФИРМЫ DEBAVIT': 'БАДы',
    'БАДЫ ФИРМЫ FUEL UP': 'БАДы',
    'БАДЫ ФИРМЫ CALIFORNIA GOLD': 'БАДы',
    'БАДЫ ФИРМЫ LIFE EXTENSION': 'БАДы',
    'БАДЫ': 'БАДы',
    'CREATINE': 'Креатин',
    'PROTEIN WHEY': 'Протеин',
    'BCAA': 'BCAA',
    'AMINO АМИНОКИСЛОТЫ': 'Аминокислоты',
    'BETA ALANINE': 'Бета-аланин',
    'ARGININE': 'Аргинин',
    'L-CARNITINE': 'L-Карнитин',
    'L CITRULINE': 'Цитруллин',
    'GLUTAMINE': 'Глютамин',
    'ЖИРОСЖИГАТЕЛИ': 'Жиросжигатели',
    'ПРЕДТРЕНЫ': 'Предтрены',
    'ТЕСТОБУСТЕРЫ': 'Тестобустеры',
    'GAINERS(ГЕЙНЕРЫ)': 'Гейнеры',
    'ШЕЙКЕРЫ': 'Шейкеры',
    'PEPTIDES(Пептиды)': 'Пептиды',
    'ZPHC PEPTIDE ( ПЕПТИДЫ )': 'Пептиды',
    'MOUNJARO(МУНДЖАРО)': 'Мунджаро',
    'ZPHC RETATRUTIDE( РЕТАТРУТИД )': 'Ретатрутид',
    'SARMS ZPHC': 'SARMS',
    'SARMS 50BMG': 'SARMS',
    'SARMS ENVENOOM': 'SARMS',
    'SARMS EPIK LABS': 'SARMS',
    'SARMS MXA': 'SARMS',
    'SARMS': 'SARMS',
    'ZPHC SEMAGLUTIDE ( ОЗЕМПИК)': 'Семаглутид',
    'SYNTHOL (СИНТОЛ)': 'Синтол',
    'ГАНАДОТРОПИН (ХГЧ) HGH': 'Гонадотропин',
    'COLLAGEN(КОЛЛАГЕНЫ)': 'Коллаген',
};

const DEFAULT_MARKUPS_COMMON = {
    'БАДы': 45,
    'Креатин': 35,
    'Протеин': 25,
    'BCAA': 35,
    'Аминокислоты': 35,
    'Бета-аланин': 40,
    'Аргинин': 40,
    'L-Карнитин': 40,
    'Цитруллин': 40,
    'Глютамин': 35,
    'Жиросжигатели': 40,
    'Предтрены': 35,
    'Тестобустеры': 40,
    'Гейнеры': 25,
    'Шейкеры': 100,
    'Пептиды': 25,
    'Мунджаро': 20,
    'Ретатрутид': 20,
    'SARMS': 35,
    'Семаглутид': 20,
    'Синтол': 50,
    'Гонадотропин': 20,
    'Коллаген': 40,
};

const CAT_ICONS = {
    'БАДы': 'pill',
    'Креатин': 'barbell',
    'Протеин': 'drop',
    'BCAA': 'circle',
    'Аминокислоты': 'dna',
    'Бета-аланин': 'fire',
    'Аргинин': 'test-tube',
    'L-Карнитин': 'sneaker',
    'Цитруллин': 'heart',
    'Глютамин': 'circle',
    'Жиросжигатели': 'drop',
    'Предтрены': 'rocket',
    'Тестобустеры': 'lightning',
    'Гейнеры': 'barbell',
    'Шейкеры': 'flask',
    'Пептиды': 'microscope',
    'Мунджаро': 'target',
    'Ретатрутид': 'target',
    'SARMS': 'gear',
    'Семаглутид': 'syringe',
    'Синтол': 'circle',
    'Гонадотропин': 'brain',
    'Коллаген': 'sparkle',
};

// ============================================================
// 3. СТЕКИ
// ============================================================
const STACKS = [{
    name: "Глубокий сон и Антистресс",
    desc: "Научно обоснованная связка для улучшения качества сна и снижения уровня кортизола. Мелатонин регулирует циклы, магний расслабляет мышцы, а ашваганда помогает бороться со стрессом.",
    items: ['00582', '00966', '00279', '00182'],
    sources: [
        { label: "PubMed Melatonin", url: "https://pubmed.ncbi.nlm.nih.gov/31925873/" },
        { label: "PMC Magnesium", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6683096/" }
    ]
}, {
    name: "Максимальный фокус и Мозг",
    desc: "Стек для когнитивной поддержки. Тирозин для дофамина, Омега-3 для структуры мозга и Ежовик (Lions Mane) для нейропластичности.",
    items: ['00915', '00247', '00847', '00966'],
    sources: [
        { label: "NIH L-Tyrosine", url: "https://pubmed.ncbi.nlm.nih.gov/25615400/" },
        { label: "Omega-3 brain", url: "https://pubmed.ncbi.nlm.nih.gov/28734673/" }
    ]
}, {
    name: "Сила и Выносливость",
    desc: "Золотой стандарт спортивных добавок. Креатин для взрывной силы, Бета-аланин для выносливости и Цитруллин для мощного пампа и кровотока.",
    items: ['00642', '00844', '00845'],
    sources: [
        { label: "Creatine review", url: "https://pubmed.ncbi.nlm.nih.gov/28390713/" },
        { label: "Beta-alanine", url: "https://pubmed.ncbi.nlm.nih.gov/26053164/" }
    ]
}, {
    name: "Быстрое восстановление",
    desc: "Все необходимое после тяжелой тренировки. Изолят протеина, Глютамин для кишечника и иммунитета, BCAA для защиты мышц и Цинк для гормонального фона.",
    items: ['01276', '00646', '00765', '01131'],
    sources: [
        { label: "Protein timing", url: "https://pubmed.ncbi.nlm.nih.gov/28701356/" },
        { label: "Zinc and hormones", url: "https://pubmed.ncbi.nlm.nih.gov/28736837/" }
    ]
}, {
    name: "Жиросжигание + Энергия",
    desc: "Эффективная связка для сушки. Л-карнитин для транспорта жиров, термогеник для ускорения метаболизма и Омега-3 для поддержки здоровья сосудов.",
    items: ['00773', '01281', '00247'],
    sources: [
        { label: "L-Carnitine fat loss", url: "https://pubmed.ncbi.nlm.nih.gov/31591007/" },
        { label: "Omega-3 metabolism", url: "https://pubmed.ncbi.nlm.nih.gov/28734673/" }
    ]
}, {
    name: "Детокс и защита печени",
    desc: "Комбинация расторопши, NAC и омега-3 для поддержки детоксикационной функции печени и снижения окислительного стресса.",
    items: ['00359', '00446', '00247'],
    sources: [
        { label: "Milk thistle liver", url: "https://pubmed.ncbi.nlm.nih.gov/24859737/" },
        { label: "NAC hepatoprotection", url: "https://pubmed.ncbi.nlm.nih.gov/31808758/" }
    ]
}, {
    name: "Энергия и концентрация",
    desc: "Сочетание предтреника, L-тирозина и L-карнитина для повышения физической и умственной работоспособности.",
    items: ['00753', '00915', '00773'],
    sources: [
        { label: "Caffeine + tyrosine", url: "https://pubmed.ncbi.nlm.nih.gov/25615400/" },
        { label: "L-Carnitine brain", url: "https://pubmed.ncbi.nlm.nih.gov/31591007/" }
    ]
}, {
    name: "Иммунитет и костная система",
    desc: "Витамин D3, цинк и омега-3 — основа для крепкого иммунитета и здоровья костей.",
    items: ['00679', '01131', '00247'],
    sources: [
        { label: "Vitamin D immunity", url: "https://pubmed.ncbi.nlm.nih.gov/27377853/" },
        { label: "Zinc immune", url: "https://pubmed.ncbi.nlm.nih.gov/28736837/" }
    ]
}, {
    name: "Суставы и хрящи",
    desc: "Глюкозамин, хондроитин, МСМ и витамин D3 для поддержки суставов и профилактики дегенеративных изменений.",
    items: ['00846', '00679', '00247'],
    sources: [
        { label: "Glucosamine chondroitin", url: "https://pubmed.ncbi.nlm.nih.gov/22783724/" },
        { label: "MSM joint", url: "https://pubmed.ncbi.nlm.nih.gov/26555806/" }
    ]
}, {
    name: "Спокойствие и нервная система",
    desc: "Магний, L-теанин (в составе экстракта) и мелатонин для снижения тревожности и улучшения качества сна.",
    items: ['00966', '00582', '00279'],
    sources: [
        { label: "Magnesium anxiety", url: "https://pubmed.ncbi.nlm.nih.gov/31925873/" },
        { label: "Melatonin sleep", url: "https://pubmed.ncbi.nlm.nih.gov/29218496/" }
    ]
}, {
    name: "Мужское здоровье и Тестостерон",
    desc: "Трибулус для свободного тестостерона, цинк для гормонального баланса, ашваганда для снижения кортизола и витамин D3 для общей гормональной поддержки.",
    items: ['01136', '01131', '00664', '00679'],
    sources: [
        { label: "Tribulus testosterone", url: "https://pubmed.ncbi.nlm.nih.gov/22440915/" },
        { label: "Ashwagandha cortisol", url: "https://pubmed.ncbi.nlm.nih.gov/24252493/" }
    ]
}, {
    name: "Набор мышечной массы",
    desc: "Комплексная связка для максимального роста мышц. Креатин для силы, гейнер для калорий, BCAA для антикатаболизма и протеин для восстановления.",
    items: ['00642', '01069', '00765', '01276'],
    sources: [
        { label: "Creatine + mass", url: "https://pubmed.ncbi.nlm.nih.gov/28630601/" },
        { label: "Protein synthesis", url: "https://pubmed.ncbi.nlm.nih.gov/28701356/" }
    ]
}, {
    name: "Сердце и Сосуды",
    desc: "Коэнзим Q10 для энергии сердечной мышцы, Омега-3 для снижения воспаления, Таурин для нормализации давления и витамин B-комплекс для гомоцистеина.",
    items: ['00057', '00247', '01009', '00120'],
    sources: [
        { label: "CoQ10 heart", url: "https://pubmed.ncbi.nlm.nih.gov/28203624/" },
        { label: "Taurine cardiovascular", url: "https://pubmed.ncbi.nlm.nih.gov/27434532/" }
    ]
}, {
    name: "Кожа, Волосы и Ногти",
    desc: "Биотин для роста волос, коллаген для эластичности кожи, витамин C для синтеза коллагена и цинк для регенерации тканей.",
    items: ['00190', '01374', '00573', '01131'],
    sources: [
        { label: "Biotin hair", url: "https://pubmed.ncbi.nlm.nih.gov/28800024/" },
        { label: "Collagen skin", url: "https://pubmed.ncbi.nlm.nih.gov/28763481/" }
    ]
}, {
    name: "Пищеварение и Детокс",
    desc: "Хлорелла для выведения токсинов, инулин для микрофлоры, глутамин для кишечного барьера и ферменты для переваривания.",
    items: ['00032', '01091', '00646', '00562'],
    sources: [
        { label: "Chlorella detox", url: "https://pubmed.ncbi.nlm.nih.gov/22210520/" },
        { label: "Inulin gut", url: "https://pubmed.ncbi.nlm.nih.gov/23708212/" }
    ]
}, {
    name: "Антиоксидантная Защита",
    desc: "Астаксантин — мощнейший природный антиоксидант, альфа-липоевая кислота для клеточной защиты, ресвератрол для долголетия и витамин E для мембран клеток.",
    items: ['00375', '00939', '01334', '00410'],
    sources: [
        { label: "Astaxanthin ROS", url: "https://pubmed.ncbi.nlm.nih.gov/24630983/" },
        { label: "Resveratrol aging", url: "https://pubmed.ncbi.nlm.nih.gov/24556537/" }
    ]
}, {
    name: "Метаболизм и Контроль Веса",
    desc: "Хром для контроля сахара в крови, CLA для жиросжигания, L-карнитин для транспорта жиров и экстракт расторопши для поддержки печени.",
    items: ['00687', '01355', '01269', '00359'],
    sources: [
        { label: "Chromium glucose", url: "https://pubmed.ncbi.nlm.nih.gov/22275220/" },
        { label: "CLA body composition", url: "https://pubmed.ncbi.nlm.nih.gov/19640280/" }
    ]
}, {
    name: "Мозг и Память (Pro)",
    desc: "Гинкго билоба для микроциркуляции мозга, Ежовик для нейрогенеза, Альфа-ГПХ для холина и DHA для структуры нейронных мембран.",
    items: ['00602', '01130', '01292', '01315'],
    sources: [
        { label: "Ginkgo cognition", url: "https://pubmed.ncbi.nlm.nih.gov/20358966/" },
        { label: "Alpha GPC choline", url: "https://pubmed.ncbi.nlm.nih.gov/21414248/" }
    ]
}, {
    name: "Детокс + Энергия (Chlorophyll)",
    desc: "Хлорофилл для внутреннего очищения и антиоксидантной защиты, спирулина для микроэлементов и витамин B-комплекс для энергетического обмена.",
    items: ['01297', '00587', '00120', '01149'],
    sources: [
        { label: "Chlorophyll benefits", url: "https://pubmed.ncbi.nlm.nih.gov/22460439/" },
        { label: "Spirulina immunity", url: "https://pubmed.ncbi.nlm.nih.gov/20109441/" }
    ]
}, {
    name: "Anti-Aging и Долголетие",
    desc: "Коэнзим Q10 для энергии клеток, ресвератрол для активации сиртуинов, коллаген для тканей и астаксантин для защиты от окислительного старения.",
    items: ['00057', '01334', '01374', '00375'],
    sources: [
        { label: "CoQ10 aging", url: "https://pubmed.ncbi.nlm.nih.gov/28203624/" },
        { label: "Resveratrol sirtuins", url: "https://pubmed.ncbi.nlm.nih.gov/24556537/" }
    ]
}, {
    name: "Магний + Цинк + D3 (Минеральный баланс)",
    desc: "Три столпа мужского и женского здоровья. Магний для 300+ ферментативных реакций, цинк для иммунитета и гормонов, D3 для костей и настроения.",
    items: ['00966', '01131', '00679'],
    sources: [
        { label: "Magnesium 300 enzymes", url: "https://pubmed.ncbi.nlm.nih.gov/26817506/" },
        { label: "D3 zinc synergy", url: "https://pubmed.ncbi.nlm.nih.gov/29352123/" }
    ]
}, {
    name: "Предтреник + Восстановление",
    desc: "Полноценная связка для тренировочного процесса: предтреник для энергии и фокуса, креатин для силы, BCAA для защиты мышц во время нагрузки.",
    items: ['00753', '00642', '00765'],
    sources: [
        { label: "Pre-workout efficacy", url: "https://pubmed.ncbi.nlm.nih.gov/29565221/" },
        { label: "BCAA muscle", url: "https://pubmed.ncbi.nlm.nih.gov/28227803/" }
    ]
}, {
    name: "Зрение и Глаза",
    desc: "Черника для сетчатки, Омега-3 (DHA) для слезной железы, витамин A для сумеречного зрения и витамин E для защиты глазных тканей.",
    items: ['00909', '00247', '00527', '00410'],
    sources: [
        { label: "Bilberry vision", url: "https://pubmed.ncbi.nlm.nih.gov/20482633/" },
        { label: "DHA retina", url: "https://pubmed.ncbi.nlm.nih.gov/27615121/" }
    ]
}, {
    name: "Кости, Зубы и Опорно-двигательный",
    desc: "Кальций в цитратной форме для лучшего усвоения, магний для баланса, витамин D3 для абсорбции кальция и коллаген для связок и суставов.",
    items: ['01409', '00679', '01208', '01212'],
    sources: [
        { label: "Calcium citrate absorption", url: "https://pubmed.ncbi.nlm.nih.gov/15036060/" },
        { label: "Collagen joints", url: "https://pubmed.ncbi.nlm.nih.gov/26301554/" }
    ]
}, {
    name: "Гормональный Баланс (Женский)",
    desc: "Витамин D3, магний, витамин B-комплекс и инозитол — основа для женского гормонального здоровья, нормализации менструального цикла и хорошего самочувствия.",
    items: ['00679', '00966', '00120', '00334'],
    sources: [
        { label: "Inositol PCOS", url: "https://pubmed.ncbi.nlm.nih.gov/26608756/" },
        { label: "B-vitamins women", url: "https://pubmed.ncbi.nlm.nih.gov/27548510/" }
    ]
}, {
    name: "Рост и Восстановление Суставов",
    desc: "Глюкозамин+хондроитин+МСМ от NOW, коллаген-марин для восстановления хрящей и Animal Flex для комплексной защиты суставов.",
    items: ['01174', '01208', '00349'],
    sources: [
        { label: "Glucosamine MSM", url: "https://pubmed.ncbi.nlm.nih.gov/22783724/" },
        { label: "Animal Flex joints", url: "https://pubmed.ncbi.nlm.nih.gov/26301554/" }
    ]
}];

// ============================================================
// 4. СОСТОЯНИЕ
// ============================================================
let cart = JSON.parse(localStorage.getItem('k_cart') || '{}');
let markups = JSON.parse(localStorage.getItem('k_markups_common') || '{}');
let orders = JSON.parse(localStorage.getItem('k_orders') || '[]');
let favorites = JSON.parse(localStorage.getItem('k_favorites') || '[]');
let activeFilter = 'all';
let searchQuery = '';
let sortMode = 'default';
let brandFilter = 'all';
let statsPeriod = 'all';
let editingOrderIndex = -1;

const commonCatsSet = new Set(Object.values(CATEGORY_MAP));
const commonCatsList = ['all', ...Array.from(commonCatsSet)];

const commonCats = Object.keys(DEFAULT_MARKUPS_COMMON);
commonCats.forEach(c => {
    if (markups[c] === undefined) markups[c] = DEFAULT_MARKUPS_COMMON[c];
});

let allItems = [];

function getCommonCategory(firmCat) {
    return CATEGORY_MAP[firmCat] || firmCat;
}

function saveState() {
    localStorage.setItem('k_cart', JSON.stringify(cart));
    localStorage.setItem('k_markups_common', JSON.stringify(markups));
    localStorage.setItem('k_orders', JSON.stringify(orders));
    localStorage.setItem('k_favorites', JSON.stringify(favorites));
}

// ============================================================
// 5. ВСПОМОГАТЕЛЬНЫЕ
// ============================================================
function getRetail(item) {
    const commonCat = getCommonCategory(item.cat || item.firmCat);
    const m = markups[commonCat] !== undefined ? markups[commonCat] : 30;
    return Math.round(item.price * (1 + m / 100));
}

function formatPrice(p) {
    return p.toLocaleString('ru') + ' ₽';
}

function getItemByCode(code) {
    return allItems.find(i => i.code === code);
}

// ============================================================
// 6. ПАНЕЛИ
// ============================================================
function togglePanel(id) {
    document.getElementById('overlay').classList.add('active');
    document.getElementById(id).classList.add('active');
    document.body.classList.add('panel-open');
    if (id === 'orders-panel') renderOrders();
    if (id === 'order-form-panel') renderOrderFormSummary();
    if (id === 'settings-panel') renderSettings();
    if (id === 'stats-panel') renderStats();
    if (id === 'favorites-panel') renderFavorites();
}

function closeAllPanels() {
    document.getElementById('overlay').classList.remove('active');
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.body.classList.remove('panel-open');
}

// ============================================================
// 7. ФИЛЬТРЫ И ПОИСК
// ============================================================
function setFilter(cat) {
    activeFilter = cat;
    renderCategories();
    renderCatalog();
}

let searchTimer = null;
function handleSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        searchQuery = document.getElementById('search-input').value.toLowerCase();
        renderCatalog();
    }, 150);
}

// ============================================================
// 8. НАСТРОЙКИ
// ============================================================
function updateMarkup(cat, val) {
    markups[cat] = parseFloat(val) || 0;
    saveState();
    renderCatalog();
    renderCart();
    renderSettings();
}

function resetMarkups() {
    commonCats.forEach(c => markups[c] = DEFAULT_MARKUPS_COMMON[c]);
    saveState();
    renderSettings();
    renderCatalog();
    renderCart();
}

function renderSettings() {
    const list = document.getElementById('settings-list');
    list.innerHTML = commonCats.map(c => `
        <div class="setting-row">
            <div class="setting-label">${CAT_ICONS[c] ? `<i class="ph ph-${CAT_ICONS[c]}" style="margin-right: 6px;"></i>` : ''} ${c}</div>
            <div class="setting-input-wrap">
                <input type="number" value="${markups[c]}" oninput="updateMarkup('${c.replace(/'/g, "\\'")}', this.value)">
                <span>%</span>
            </div>
        </div>
    `).join('');
}

// ============================================================
// 9. КОРЗИНА
// ============================================================
function toggleInCart(code) {
    if (cart[code]) {
        delete cart[code];
    } else {
        const item = getItemByCode(code);
        if (item) cart[code] = { item, qty: 1 };
    }
    saveState();
    renderCatalog();
    renderCart();
}

function clearCart() {
    if (Object.keys(cart).length === 0) return;
    if (!confirm('Очистить корзину?')) return;
    cart = {};
    saveState();
    renderCatalog();
    renderCart();
}

function changeQty(code, delta) {
    if (!cart[code]) return;
    cart[code].qty = Math.max(1, cart[code].qty + delta);
    saveState();
    renderCart();
}

function copyOrder() {
    const items = Object.values(cart);
    if (items.length === 0) return;
    let text = "Мой заказ Kinetika Pro:\n\n";
    let totalRetail = 0;
    items.forEach(({ item, qty }) => {
        const retail = getRetail(item);
        totalRetail += retail * qty;
        text += `• ${item.name} (${item.code})\n  ${qty} шт x ${formatPrice(retail)} = ${formatPrice(retail * qty)}\n`;
    });
    text += `\nИтого к оплате: ${formatPrice(totalRetail)}`;
    navigator.clipboard.writeText(text).then(() => alert('Заказ скопирован в буфер обмена!'));
}

function renderCart() {
    const items = Object.values(cart);
    const totalQty = items.reduce((s, i) => s + i.qty, 0);
    document.getElementById('cart-badge').textContent = totalQty;
    // FAB badge
    const fab = document.getElementById('fab-cart');
    const fabBadge = document.getElementById('fab-badge');
    if (fab && fabBadge) {
        fabBadge.textContent = totalQty;
        fab.classList.toggle('hidden', totalQty === 0);
    }
    const content = document.getElementById('cart-content');
    if (items.length === 0) {
        content.innerHTML =
            `<div style="text-align:center; padding: 40px; color: var(--text-tertiary)">Корзина пуста</div>`;
        document.getElementById('cart-total-opt').textContent = '0 ₽';
        document.getElementById('cart-total-profit').textContent = '+ 0 ₽';
        document.getElementById('cart-total-retail').textContent = '0 ₽';
        return;
    }

    let totalOpt = 0,
        totalProfit = 0,
        totalRetail = 0;
    content.innerHTML = items.map(({ item, qty }) => {
        const retail = getRetail(item);
        const profit = (retail - item.price) * qty;
        totalOpt += item.price * qty;
        totalProfit += profit;
        totalRetail += retail * qty;
        return `
        <div class="cart-item">
            <div class="ci-info">
                <div class="ci-name">${item.name}</div>
                <div class="ci-prices">
                    <span class="ci-retail">${formatPrice(retail)}</span>
                    <span class="ci-opt">${formatPrice(item.price)}</span>
                </div>
            </div>
            <div class="ci-controls">
                <button class="qty-btn" onclick="event.stopPropagation(); changeQty('${item.code}', -1)">−</button>
                <span class="qty-val">${qty}</span>
                <button class="qty-btn" onclick="event.stopPropagation(); changeQty('${item.code}', 1)">+</button>
                <button class="btn-icon" style="width: 32px; height: 32px; color: var(--red)" onclick="event.stopPropagation(); toggleInCart('${item.code}')">
                    <i class="ph ph-trash"></i>
                </button>
            </div>
        </div>
        `;
    }).join('');
    document.getElementById('cart-total-opt').textContent = formatPrice(totalOpt);
    document.getElementById('cart-total-profit').textContent = '+ ' + formatPrice(totalProfit);
    document.getElementById('cart-total-retail').textContent = formatPrice(totalRetail);
}

// ============================================================
// 10. ЗАКАЗЫ
// ============================================================
function updateOrderStatus(index, newStatus) {
    if (!orders[index]) return;
    orders[index].status = newStatus;
    saveState();
    renderOrders();
}

function openOrderForm() {
    const items = Object.values(cart);
    if (items.length === 0) {
        alert('Корзина пуста. Добавьте товары.');
        return;
    }
    document.getElementById('order-name').value = '';
    document.getElementById('order-address').value = '';
    document.getElementById('order-phone').value = '';
    document.getElementById('order-notes').value = '';
    renderOrderFormSummary();
    togglePanel('order-form-panel');
}

function renderOrderFormSummary() {
    const container = document.getElementById('order-form-items-summary');
    const items = Object.values(cart);
    if (items.length === 0) {
        container.innerHTML = '<div style="color: var(--text-tertiary);">Корзина пуста</div>';
        return;
    }
    let html = '<div style="font-weight: 600; margin-bottom: 8px;">Состав заказа:</div>';
    let total = 0;
    items.forEach(({ item, qty }) => {
        const retail = getRetail(item);
        total += retail * qty;
        html += `<div style="display: flex; justify-content: space-between; font-size: 13px; padding: 2px 0; border-bottom: 1px solid var(--border-light);">
            <span>${item.name} × ${qty}</span>
            <span>${formatPrice(retail * qty)}</span>
        </div>`;
    });
    html +=
        `<div style="display: flex; justify-content: space-between; font-weight: 700; margin-top: 8px; color: var(--accent);">
            <span>Итого:</span>
            <span>${formatPrice(total)}</span>
        </div>`;
    container.innerHTML = html;
}

function saveOrder(e) {
    e.preventDefault();
    const name = document.getElementById('order-name').value.trim();
    const address = document.getElementById('order-address').value.trim();
    const phone = document.getElementById('order-phone').value.trim();
    const notes = document.getElementById('order-notes').value.trim();
    if (!name || !address || !phone) {
        alert('Заполните обязательные поля: Имя, Адрес, Телефон');
        return;
    }
    const items = Object.values(cart);
    if (items.length === 0) {
        alert('Корзина пуста');
        return;
    }
    let totalRetail = 0,
        totalOpt = 0,
        totalProfit = 0;
    const orderItems = items.map(({ item, qty }) => {
        const retail = getRetail(item);
        const profit = (retail - item.price) * qty;
        totalRetail += retail * qty;
        totalOpt += item.price * qty;
        totalProfit += profit;
        return { ...item, qty, retail, profit };
    });

    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        recipient: { name, address, phone, notes },
        items: orderItems,
        totalRetail,
        totalOpt,
        totalProfit,
        status: 'новый'
    };

    orders.unshift(order);
    saveState();
    cart = {};
    saveState();
    renderCart();
    renderOrders();
    closeAllPanels();
    alert('Заказ сохранён!');
}

function deleteOrder(index) {
    if (confirm('Удалить заказ?')) {
        orders.splice(index, 1);
        saveState();
        renderOrders();
    }
}

// ============================================================
// 10a. РЕДАКТИРОВАНИЕ ЗАКАЗА
// ============================================================
function openEditOrder(index) {
    const order = orders[index];
    if (!order) return;
    editingOrderIndex = index;
    document.getElementById('edit-order-index').value = index;
    document.getElementById('edit-order-name').value = order.recipient.name || '';
    document.getElementById('edit-order-address').value = order.recipient.address || '';
    document.getElementById('edit-order-phone').value = order.recipient.phone || '';
    document.getElementById('edit-order-notes').value = order.recipient.notes || '';

    const container = document.getElementById('edit-order-items');
    container.innerHTML = order.items.map((it, idx) => `
        <div class="edit-item-row" data-idx="${idx}">
            <span class="ei-name">${it.name}</span>
            <div class="ei-qty">
                <button type="button" class="qty-btn" onclick="editItemQty(${idx}, -1)">−</button>
                <input type="number" id="edit-qty-${idx}" value="${it.qty}" min="0" onchange="editItemQtyInput(${idx}, this.value)">
                <button type="button" class="qty-btn" onclick="editItemQty(${idx}, 1)">+</button>
            </div>
            <span class="ei-price">${formatPrice(it.retail * it.qty)}</span>
            <button type="button" class="ei-remove" onclick="editRemoveItem(${idx})">✕</button>
        </div>
    `).join('');
    togglePanel('edit-order-panel');
}

function editItemQty(idx, delta) {
    const order = orders[editingOrderIndex];
    if (!order || !order.items[idx]) return;
    const newQty = Math.max(0, order.items[idx].qty + delta);
    if (newQty === 0) {
        editRemoveItem(idx);
        return;
    }
    order.items[idx].qty = newQty;
    recalcOrderTotals(order);
    saveState();
    renderOrders();
    openEditOrder(editingOrderIndex);
}

function editItemQtyInput(idx, val) {
    const order = orders[editingOrderIndex];
    if (!order || !order.items[idx]) return;
    const newQty = Math.max(0, parseInt(val) || 0);
    if (newQty === 0) {
        editRemoveItem(idx);
        return;
    }
    order.items[idx].qty = newQty;
    recalcOrderTotals(order);
    saveState();
    renderOrders();
    openEditOrder(editingOrderIndex);
}

function editRemoveItem(idx) {
    const order = orders[editingOrderIndex];
    if (!order) return;
    order.items.splice(idx, 1);
    if (order.items.length === 0) {
        orders.splice(editingOrderIndex, 1);
        saveState();
        renderOrders();
        closeAllPanels();
        return;
    }
    recalcOrderTotals(order);
    saveState();
    renderOrders();
    openEditOrder(editingOrderIndex);
}

function recalcOrderTotals(order) {
    let totalRetail = 0,
        totalOpt = 0,
        totalProfit = 0;
    order.items.forEach(it => {
        const retail = getRetail(it);
        it.retail = retail;
        it.profit = (retail - it.price) * it.qty;
        totalRetail += retail * it.qty;
        totalOpt += it.price * it.qty;
        totalProfit += it.profit;
    });
    order.totalRetail = totalRetail;
    order.totalOpt = totalOpt;
    order.totalProfit = totalProfit;
}

function saveEditedOrder(e) {
    e.preventDefault();
    const idx = parseInt(document.getElementById('edit-order-index').value);
    const order = orders[idx];
    if (!order) return;

    order.recipient.name = document.getElementById('edit-order-name').value.trim();
    order.recipient.address = document.getElementById('edit-order-address').value.trim();
    order.recipient.phone = document.getElementById('edit-order-phone').value.trim();
    order.recipient.notes = document.getElementById('edit-order-notes').value.trim();

    if (!order.recipient.name || !order.recipient.address || !order.recipient.phone) {
        alert('Заполните обязательные поля: Имя, Адрес, Телефон');
        return;
    }

    saveState();
    renderOrders();
    closeAllPanels();
    alert('Заказ обновлён!');
}

// ============================================================
// 10b. ПЕЧАТЬ / PDF
// ============================================================
function printOrder(index) {
    const order = orders[index];
    if (!order) return;
    const el = document.getElementById('print-area');
    const dateStr = new Date(order.date).toLocaleString('ru-RU');
    let itemsHtml = order.items.map(it =>
        `<tr><td>${it.name}</td><td>${it.qty}</td><td>${formatPrice(it.retail)}</td><td>${formatPrice(it.retail * it.qty)}</td></tr>`
    ).join('');

    el.innerHTML = `
        <div class="print-header">Kinetika Pro — Заказ</div>
        <div class="print-order-id">Заказ #${String(order.id).slice(-6)}</div>
        <div class="print-recipient">
            <strong>Получатель:</strong> ${order.recipient.name}<br>
            <strong>Адрес:</strong> ${order.recipient.address}<br>
            <strong>Телефон:</strong> ${order.recipient.phone}<br>
            ${order.recipient.notes ? `<strong>Комментарий:</strong> ${order.recipient.notes}` : ''}
            <br><strong>Дата:</strong> ${dateStr}
        </div>
        <table class="print-items">
            <thead><tr><th>Товар</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr></thead>
            <tbody>${itemsHtml}</tbody>
        </table>
        <div class="print-total">Итого: ${formatPrice(order.totalRetail)}</div>
        <div style="margin-top:8px;font-size:14px;color:#555;">
            Опт: ${formatPrice(order.totalOpt)} &nbsp;|&nbsp; Прибыль: ${formatPrice(order.totalProfit)}
        </div>
        <div class="print-footer">Спасибо за заказ! Kinetika Pro</div>
    `;
    setTimeout(() => window.print(), 300);
}

// ============================================================
// 10c. ОТОБРАЖЕНИЕ ЗАКАЗОВ
// ============================================================
function renderOrders() {
    const container = document.getElementById('orders-content');
    if (orders.length === 0) {
        container.innerHTML =
            '<div style="text-align:center; padding: 40px; color: var(--text-tertiary);">Нет сохранённых заказов</div>';
        return;
    }
    container.innerHTML = orders.map((order, idx) => {
        const dateStr = new Date(order.date).toLocaleString('ru-RU');
        const statusClass = order.status === 'новый' ? 'new' : order.status === 'завершён' ? 'completed' :
            'canceled';
        const statusLabel = order.status === 'новый' ? '🟡 Новый' : order.status === 'завершён' ? '✅ Завершён' :
            '❌ Отменён';

        let statusButtons = '';
        if (order.status === 'новый') {
            statusButtons = `
                <button class="btn-status complete" onclick="event.stopPropagation(); updateOrderStatus(${idx}, 'завершён')">✅ Завершён</button>
                <button class="btn-status cancel" onclick="event.stopPropagation(); updateOrderStatus(${idx}, 'отменён')">❌ Отменён</button>
            `;
        } else {
            statusButtons = `
                <button class="btn-status reset" onclick="event.stopPropagation(); updateOrderStatus(${idx}, 'новый')">↩️ Вернуть</button>
            `;
        }

        return `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">Заказ #${String(order.id).slice(-6)}</span>
                <span class="order-date">${dateStr}</span>
            </div>
            <div class="order-recipient">${order.recipient.name}</div>
            <div style="font-size:12px; color:var(--text-tertiary);">${order.recipient.address} · ${order.recipient.phone}</div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; flex-wrap:wrap; gap:4px;">
                <span class="order-status ${statusClass}">${statusLabel}</span>
                <span class="order-total">${formatPrice(order.totalRetail)}</span>
            </div>
            <div class="order-details">
                <div style="font-weight:600; margin-bottom:4px;">Товары:</div>
                ${order.items.map(it => `
                    <div class="item-line">
                        <span>${it.name} × ${it.qty}</span>
                        <span>${formatPrice(it.retail * it.qty)}</span>
                    </div>
                `).join('')}
                <div style="display:flex; gap:12px; margin-top:8px; color:var(--text-secondary); font-size:12px; flex-wrap:wrap;">
                    <span>Опт: ${formatPrice(order.totalOpt)}</span>
                    <span>Прибыль: ${formatPrice(order.totalProfit)}</span>
                </div>
                ${order.recipient.notes ? `<div style="margin-top:4px; font-size:12px; color:var(--text-tertiary);">📝 ${order.recipient.notes}</div>` : ''}
            </div>
            <div class="order-actions">
                ${statusButtons}
                <button class="btn-secondary btn-sm" onclick="event.stopPropagation(); openEditOrder(${idx})" style="padding:6px 12px; font-size:12px;">
                    <i class="ph ph-pencil"></i> Редактировать
                </button>
                <button class="btn-secondary btn-sm" onclick="event.stopPropagation(); printOrder(${idx})" style="padding:6px 12px; font-size:12px;">
                    <i class="ph ph-printer"></i> Печать
                </button>
                <button class="btn-secondary btn-sm" onclick="event.stopPropagation(); deleteOrder(${idx})" style="padding:6px 12px; font-size:12px;">
                    <i class="ph ph-trash"></i> Удалить
                </button>
            </div>
        </div>
        `;
    }).join('');
}

// ============================================================
// 11. СТАТИСТИКА
// ============================================================
function setStatsPeriod(period) {
    statsPeriod = period;
    document.querySelectorAll('#stats-period-tabs .chip').forEach(el => {
        el.classList.toggle('active', el.dataset.period === period);
    });
    renderStats();
}

function renderStats() {
    const grid = document.getElementById('stats-grid');
    const extra = document.getElementById('stats-extra');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    let filtered = orders;
    if (statsPeriod === 'today') {
        filtered = orders.filter(o => new Date(o.date) >= today);
    } else if (statsPeriod === 'week') {
        filtered = orders.filter(o => new Date(o.date) >= weekAgo);
    } else if (statsPeriod === 'month') {
        filtered = orders.filter(o => new Date(o.date) >= monthAgo);
    }

    const totalOrders = filtered.length;
    const totalRevenue = filtered.reduce((s, o) => s + o.totalRetail, 0);
    const totalProfit = filtered.reduce((s, o) => s + o.totalProfit, 0);
    const avgCheck = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const completed = filtered.filter(o => o.status === 'завершён').length;
    const canceled = filtered.filter(o => o.status === 'отменён').length;
    const pending = filtered.filter(o => o.status === 'новый').length;

    grid.innerHTML = `
        <div class="stats-card">
            <span class="stat-value">${formatPrice(totalRevenue)}</span>
            <span class="stat-label">Выручка</span>
        </div>
        <div class="stats-card">
            <span class="stat-value">${totalOrders}</span>
            <span class="stat-label">Заказов</span>
        </div>
        <div class="stats-card">
            <span class="stat-value">${formatPrice(avgCheck)}</span>
            <span class="stat-label">Средний чек</span>
        </div>
        <div class="stats-card">
            <span class="stat-value" style="color:var(--green);">${formatPrice(totalProfit)}</span>
            <span class="stat-label">Прибыль</span>
        </div>
    `;

    extra.innerHTML = `
        <div style="display:flex; gap:16px; flex-wrap:wrap; margin-top:8px;">
            <span>✅ Завершённых: <strong>${completed}</strong></span>
            <span>🟡 В работе: <strong>${pending}</strong></span>
            <span>❌ Отменённых: <strong>${canceled}</strong></span>
            <span>📦 Всего: <strong>${totalOrders}</strong></span>
        </div>
        ${statsPeriod !== 'all' ? `<div style="margin-top:8px;color:var(--text-tertiary);font-size:12px;">Период: ${statsPeriod === 'today' ? 'сегодня' : statsPeriod === 'week' ? 'последние 7 дней' : 'последние 30 дней'}</div>` : ''}
    `;
}

// ============================================================
// 12. СТЕКИ
// ============================================================
function addStackToCart(stackIndex) {
    const stack = STACKS[stackIndex];
    stack.items.forEach(code => {
        if (!cart[code]) {
            const item = getItemByCode(code);
            if (item) cart[code] = { item, qty: 1 };
        }
    });
    saveState();
    renderCatalog();
    renderCart();
}

// ============================================================
// 13. КАТАЛОГ
// ============================================================
function renderCategories() {
    const bar = document.getElementById('categories-bar');
    const cats = ['all', 'stacks', ...Array.from(commonCatsSet)];
    const labels = { all: 'Все товары', stacks: 'Связки' };
    bar.innerHTML = cats.map(c => {
        const label = labels[c] || ((CAT_ICONS[c] ? `<i class="ph ph-${CAT_ICONS[c]}" style="margin-right: 4px;"></i>` : '') + c);
        return `
        <div class="cat-chip ${activeFilter === c ? 'active' : ''}" onclick="setFilter('${c}')">
            ${label}
        </div>`;
    }).join('');
}

// ============================================================
// LIGHTBOX
// ============================================================
function openLightbox(code) {
    const img = document.getElementById('lightbox-img');
    const codeEl = document.getElementById('lightbox-code');
    const webpSrc = `assets/${code}.webp`;
    const pngSrc = `assets/${code}.png`;
    img.src = webpSrc;
    img.onerror = function() {
        this.src = pngSrc;
        this.onerror = null;
    };
    codeEl.textContent = `Код: ${code}`;
    document.getElementById('lightbox').classList.add('active');
    document.body.classList.add('panel-open');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.classList.remove('panel-open');
    const img = document.getElementById('lightbox-img');
    img.src = '';
    img.onerror = null;
}

// Stack gallery lightbox
function openStackLightbox(stackIndex, e) {
    if (e) e.stopPropagation();
    const stack = STACKS[stackIndex];
    if (!stack) return;
    const items = stack.items.map(code => getItemByCode(code)).filter(Boolean);
    if (items.length === 0) return;

    document.getElementById('lb-gallery-title').textContent = stack.name;
    const container = document.getElementById('lb-gallery-images');
    const show = items.slice(0, 6);
    const gap = 8;
    const totalGap = gap * (show.length - 1);
    const maxW = Math.floor((window.innerWidth * 0.9 - totalGap) / show.length);

    container.innerHTML = show.map((item, i) => {
        const src = `assets/${item.code}.webp`;
        const fallback = `assets/${item.code}.png`;
        return `<img class="lb-gallery-img" src="${src}" alt="${item.name}"
                     style="max-width:${maxW}px;"
                     onerror="this.onerror=null; this.src='${fallback}';">`;
    }).join('');

    document.getElementById('stack-lightbox').classList.add('active');
    document.body.classList.add('panel-open');
}

function closeStackLightbox() {
    document.getElementById('stack-lightbox').classList.remove('active');
    document.body.classList.remove('panel-open');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (document.getElementById('stack-lightbox').classList.contains('active')) {
            closeStackLightbox();
        } else {
            closeLightbox();
        }
    }
});

// ============================================================
// КОПИРОВАНИЕ КОДА
// ============================================================
function copyCode(code, event) {
    event.stopPropagation();
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
            const el = event.currentTarget;
            const original = el.innerHTML;
            el.innerHTML = `<i class="ph ph-check"></i> ${code}`;
            setTimeout(() => { el.innerHTML = original; }, 1200);
        }).catch(() => {
            fallbackCopy(code);
        });
    } else {
        fallbackCopy(code);
    }
}

function fallbackCopy(code) {
    const ta = document.createElement('textarea');
    ta.value = code;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
        document.execCommand('copy');
        alert(`Код ${code} скопирован!`);
    } catch (e) {
        alert(`Не удалось скопировать. Код: ${code}`);
    }
    document.body.removeChild(ta);
}

// ============================================================
// 14. РЕНДЕР КАТАЛОГА
// ============================================================
function renderCatalog() {
    const container = document.getElementById('catalog-container');

    // Stacks tab
    if (activeFilter === 'stacks') {
        renderStacks(container);
        return;
    }

    let filtered = RAW.map(cat => ({
        ...cat,
        items: cat.items.filter(i =>
            (activeFilter === 'all' || getCommonCategory(cat.cat) === activeFilter) &&
            (brandFilter === 'all' || cat.cat.toUpperCase().includes(brandFilter.toUpperCase())) &&
            (i.name.toLowerCase().includes(searchQuery) || i.code.includes(searchQuery))
        )
    })).filter(cat => cat.items.length > 0);

    // Sort items within each category
    if (sortMode !== 'default') {
        filtered.forEach(cat => {
            if (sortMode === 'name-asc') cat.items.sort((a, b) => a.name.localeCompare(b.name));
            else if (sortMode === 'name-desc') cat.items.sort((a, b) => b.name.localeCompare(a.name));
            else if (sortMode === 'price-asc') cat.items.sort((a, b) => a.price - b.price);
            else if (sortMode === 'price-desc') cat.items.sort((a, b) => b.price - a.price);
        });
    }

    if (filtered.length === 0) {
        container.innerHTML =
            `<div style="text-align:center; padding: 40px; color: var(--text-tertiary)">Ничего не найдено</div>`;
        return;
    }

    const frag = document.createDocumentFragment();
    const temp = document.createElement('div');

    filtered.forEach(cat => {
        const commonCat = getCommonCategory(cat.cat);
        const icon = CAT_ICONS[commonCat] || 'pill';
        const sectionHtml = `
        <div class="section-title">${icon ? `<i class="ph ph-${icon}"></i>` : ''} ${cat.cat}</div>
        ${cat.items.map(item => {
            const retail = getRetail(item);
            const profit = retail - item.price;
            const inCart = !!cart[item.code];
            const isFav = isFavorite(item.code);
            const webpSrc = `assets/${item.code}.webp`;
            const pngSrc = `assets/${item.code}.png`;
            return `
            <div class="product-card ${inCart ? 'in-cart' : ''}" onclick="toggleInCart('${item.code}')">
                <div class="p-img" onclick="event.stopPropagation(); openLightbox('${item.code}')">
                    <img src="${webpSrc}" alt="${item.code}"
                         onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src='${pngSrc}';}else{this.style.display='none';this.nextElementSibling.style.display='flex';}">
                    <span class="fallback-icon" style="display:none;"><i class="ph ph-${icon}"></i></span>
                </div>
                <div class="p-info">
                    <div class="p-name">${item.name}</div>
                    <div class="p-meta">
                        <span class="code-copy" onclick="copyCode('${item.code}', event)">
                            <i class="ph ph-copy"></i> ${item.code}
                        </span>
                        <span class="p-opt-tag">ОПТ: ${item.price} ₽</span>
                    </div>
                </div>
                <div class="p-price-block">
                    <div class="p-retail">${retail} ₽</div>
                    <div class="p-profit">+${profit} ₽</div>
                </div>
                <button class="fav-btn ${isFav ? 'is-fav' : ''}" onclick="toggleFavorite('${item.code}', event)" title="${isFav ? 'Убрать из избранного' : 'В избранное'}">
                    <i class="ph ph-heart${isFav ? '-fill' : ''}"></i>
                </button>
            </div>
            `;
        }).join('')}`;
        temp.innerHTML = sectionHtml;
        while (temp.firstChild) frag.appendChild(temp.firstChild);
    });

    container.innerHTML = '';
    container.appendChild(frag);
}

// ============================================================
// 14a. РЕНДЕР СВЯЗОК (inline в каталоге)
// ============================================================
function renderStacks(container) {
    if (!container) container = document.getElementById('catalog-container');
    const IMG_COUNT = 3;

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matched = STACKS.filter(s =>
            s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
        );
        if (matched.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--text-tertiary)">Связки не найдены</div>`;
            return;
        }
        renderStackCards(container, matched, IMG_COUNT);
        return;
    }

    renderStackCards(container, STACKS, IMG_COUNT);
}

function renderStackCards(container, stacks, imgCount) {
    container.innerHTML = stacks.map((s, rawIdx) => {
        const idx = STACKS.indexOf(s);
        let totalRetail = 0, totalOpt = 0;
        const stackItems = s.items.map(code => getItemByCode(code)).filter(Boolean);
        stackItems.forEach(item => { totalRetail += getRetail(item); totalOpt += item.price; });

        // Overlapping images
        const imgs = stackItems.slice(0, imgCount);
        const overflow = stackItems.length - imgCount;
        const imgHtml = imgs.map((item, i) => {
            const src = `assets/${item.code}.webp`;
            const fallback = `assets/${item.code}.png`;
            return `<div class="si-img" style="z-index:${imgs.length - i}; left:${i * 22}px;">
                <img src="${src}" alt="${item.code}"
                     onerror="this.onerror=null; this.src='${fallback}'; this.onerror=function(){this.style.display='none'; this.nextElementSibling.style.display='flex';}">
                <span class="si-fallback" style="display:none;"><i class="ph ph-package"></i></span>
            </div>`;
        }).join('');
        const overflowBadge = overflow > 0
            ? `<div class="si-overflow" style="z-index:0; left:${imgs.length * 22}px;">+${overflow}</div>`
            : '';

        const sourcesHtml = s.sources && s.sources.length
            ? `<div class="stack-sources">${s.sources.map(src =>
                `<a href="${src.url}" target="_blank" rel="noopener" onclick="event.stopPropagation()"><i class="ph ph-book-open"></i> ${src.label}</a>`
            ).join('')}</div>`
            : '';

        return `
        <div class="stack-card" onclick="addStackToCart(${idx})">
            <div class="si-stack" onclick="openStackLightbox(${idx}, event)">
                ${imgHtml}${overflowBadge}
            </div>
            <div class="si-info">
                <div class="si-name">${s.name}</div>
                <div class="si-desc">${s.desc}</div>
                ${sourcesHtml}
                <div class="si-bottom">
                    <div class="si-prices">
                        <span class="si-retail">${formatPrice(totalRetail)}</span>
                        <span class="si-opt">Опт: ${formatPrice(totalOpt)}</span>
                    </div>
                    <span class="si-add"><i class="ph ph-plus"></i></span>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ============================================================
// 16. ИЗБРАННОЕ
// ============================================================
function toggleFavorite(code, event) {
    if (event) event.stopPropagation();
    const idx = favorites.indexOf(code);
    if (idx >= 0) {
        favorites.splice(idx, 1);
    } else {
        favorites.push(code);
    }
    saveState();
    renderCatalog();
    renderFavorites();
    updateFavBadge();
}

function isFavorite(code) {
    return favorites.includes(code);
}

function updateFavBadge() {
    const badge = document.getElementById('fav-badge');
    if (badge) badge.textContent = favorites.length;
}

function clearFavorites() {
    if (favorites.length === 0) return;
    if (!confirm('Очистить избранное?')) return;
    favorites = [];
    saveState();
    renderCatalog();
    renderFavorites();
    updateFavBadge();
}

function addFavoritesToCart() {
    favorites.forEach(code => {
        if (!cart[code]) {
            const item = getItemByCode(code);
            if (item) cart[code] = { item, qty: 1 };
        }
    });
    saveState();
    renderCatalog();
    renderCart();
}

function renderFavorites() {
    const content = document.getElementById('favorites-content');
    if (!content) return;
    if (favorites.length === 0) {
        content.innerHTML = '<div style="text-align:center; padding: 40px; color: var(--text-tertiary)">Нет избранных товаров</div>';
        return;
    }
    content.innerHTML = favorites.map(code => {
        const item = getItemByCode(code);
        if (!item) return '';
        const retail = getRetail(item);
        const profit = retail - item.price;
        const inCart = !!cart[code];
        return `
        <div class="fav-item">
            <div class="fi-info">
                <div class="fi-name">${item.name}</div>
                <div style="display:flex; gap:8px; align-items:center;">
                    <span class="fi-price">${formatPrice(retail)}</span>
                    <span class="fi-opt">Опт: ${formatPrice(item.price)}</span>
                </div>
            </div>
            <div class="fi-actions">
                <button class="btn-icon" style="width:32px; height:32px; color:${inCart ? 'var(--accent)' : 'var(--text-tertiary)'}"
                    onclick="toggleInCart('${code}')">
                    <i class="ph ph-shopping-cart"></i>
                </button>
                <button class="btn-icon" style="width:32px; height:32px; color:var(--red)"
                    onclick="toggleFavorite('${code}')">
                    <i class="ph ph-x"></i>
                </button>
            </div>
        </div>`;
    }).join('');
}

// ============================================================
// 17. СОРТИРОВКА И БРЕНДЫ
// ============================================================
function handleSort() {
    sortMode = document.getElementById('sort-select').value;
    renderCatalog();
}

function handleBrandFilter() {
    brandFilter = document.getElementById('brand-select').value;
    renderCatalog();
}

function populateBrandFilter() {
    const brands = new Set();
    RAW.forEach(cat => {
        const name = cat.cat;
        const parts = name.match(/ФИРМЫ\s+(.+)/i);
        if (parts) {
            brands.add(parts[1].trim());
        }
    });
    if (brands.size === 0) return;
    const select = document.getElementById('brand-select');
    select.innerHTML = '<option value="all">Все бренды</option>';
    Array.from(brands).sort().forEach(b => {
        select.innerHTML += `<option value="${b}">${b}</option>`;
    });
}

// ============================================================
// 19. ЭКСПОРТ ДАННЫХ
// ============================================================
function exportCartCSV() {
    const items = Object.values(cart);
    if (items.length === 0) { alert('Корзина пуста'); return; }
    let csv = 'Код,Название,Опт цена,Розница,Кол-во,Сумма\n';
    items.forEach(({ item, qty }) => {
        const retail = getRetail(item);
        csv += `${item.code},"${item.name}",${item.price},${retail},${qty},${retail * qty}\n`;
    });
    downloadFile('kinetika-cart.csv', csv, 'text/csv');
}

function exportCartJSON() {
    const items = Object.values(cart);
    if (items.length === 0) { alert('Корзина пуста'); return; }
    const data = items.map(({ item, qty }) => ({
        code: item.code,
        name: item.name,
        price: item.price,
        retail: getRetail(item),
        qty
    }));
    downloadFile('kinetika-cart.json', JSON.stringify(data, null, 2), 'application/json');
}

function exportOrdersCSV() {
    if (orders.length === 0) { alert('Нет заказов'); return; }
    let csv = 'ID,Дата,Получатель,Адрес,Телефон,Статус,Сумма розн,Опт,Прибыль\n';
    orders.forEach(o => {
        const date = new Date(o.date).toLocaleString('ru-RU');
        csv += `${o.id},"${date}","${o.recipient.name}","${o.recipient.address}","${o.recipient.phone}","${o.status}",${o.totalRetail},${o.totalOpt},${o.totalProfit}\n`;
    });
    downloadFile('kinetika-orders.csv', csv, 'text/csv');
}

function downloadFile(filename, content, mime) {
    const blob = new Blob(['\ufeff' + content], { type: mime + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function shareViaWhatsApp() {
    const text = buildShareText();
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

function shareViaTelegram() {
    const text = buildShareText();
    window.open('https://t.me/share/url?url=&text=' + encodeURIComponent(text), '_blank');
}

function buildShareText() {
    const items = Object.values(cart);
    if (items.length === 0) return 'Корзина пуста';
    let text = "🛒 Заказ Kinetika Pro:\n\n";
    let total = 0;
    items.forEach(({ item, qty }) => {
        const retail = getRetail(item);
        total += retail * qty;
        text += `• ${item.name} (${item.code})\n  ${qty} шт × ${formatPrice(retail)}\n`;
    });
    text += `\n💰 Итого: ${formatPrice(total)}`;
    return text;
}

// ============================================================
// 20. НАКЛАДНАЯ
// ============================================================
function openNakladnaya() {
    togglePanel('nakladnaya-panel');
    renderNakladnaya();
}

function renderNakladnaya() {
    const content = document.getElementById('nakladnaya-content');
    if (orders.length === 0) {
        content.innerHTML = '<div style="text-align:center; padding: 40px; color: var(--text-tertiary)">Нет заказов для накладных</div>';
        return;
    }
    content.innerHTML = orders.map((order, idx) => {
        const dateStr = new Date(order.date).toLocaleString('ru-RU');
        return `
        <div class="nak-card">
            <div class="nk-header">
                <span class="nk-id">Накладная #${String(order.id).slice(-6)}</span>
                <span class="nk-date">${dateStr}</span>
            </div>
            <div class="nk-recipient">
                <strong>${order.recipient.name}</strong><br>
                ${order.recipient.address}<br>
                Тел: ${order.recipient.phone}
            </div>
            <div class="nk-items">
                ${order.items.map(it => `
                    <div class="nk-item">
                        <span>${it.name} × ${it.qty}</span>
                        <span>${formatPrice(it.retail * it.qty)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="nk-total">
                <span>Итого:</span>
                <span>${formatPrice(order.totalRetail)}</span>
            </div>
            <div style="display:flex; gap:12px; margin-top:4px; font-size:11px; color:var(--text-secondary);">
                <span>Опт: ${formatPrice(order.totalOpt)}</span>
                <span>Прибыль: ${formatPrice(order.totalProfit)}</span>
            </div>
            <div class="nk-actions">
                <button class="btn-secondary btn-sm" onclick="printNakladnaya(${idx})" style="padding:6px 12px; font-size:12px;">
                    <i class="ph ph-printer"></i> Печать
                </button>
            </div>
        </div>`;
    }).join('');
}

function printNakladnaya(index) {
    const order = orders[index];
    if (!order) return;
    const el = document.getElementById('print-area');
    const dateStr = new Date(order.date).toLocaleString('ru-RU');
    let itemsHtml = order.items.map((it, i) =>
        `<tr><td>${i + 1}</td><td>${it.name}</td><td>${it.code}</td><td>${it.qty}</td><td>${formatPrice(it.retail)}</td><td>${formatPrice(it.retail * it.qty)}</td></tr>`
    ).join('');

    el.innerHTML = `
        <div class="print-header">НАКЛАДНАЯ</div>
        <div class="print-order-id">№ ${String(order.id).slice(-6)} от ${dateStr}</div>
        <div class="print-recipient">
            <strong>Поставщик:</strong> Kinetika Pro<br>
            <strong>Покупатель:</strong> ${order.recipient.name}<br>
            <strong>Адрес:</strong> ${order.recipient.address}<br>
            <strong>Телефон:</strong> ${order.recipient.phone}
            ${order.recipient.notes ? `<br><strong>Комментарий:</strong> ${order.recipient.notes}` : ''}
        </div>
        <table class="print-items">
            <thead><tr><th>№</th><th>Наименование</th><th>Код</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr></thead>
            <tbody>${itemsHtml}</tbody>
        </table>
        <div class="print-total">Итого: ${formatPrice(order.totalRetail)}</div>
        <div style="margin-top:8px;font-size:13px;color:#555;">
            Опт: ${formatPrice(order.totalOpt)} &nbsp;|&nbsp; Прибыль: ${formatPrice(order.totalProfit)}
        </div>
        <div style="margin-top: 30px; display: flex; justify-content: space-between; font-size: 12px; color: #888;">
            <div>Подпись поставщика: _______________</div>
            <div>Подпись покупателя: _______________</div>
        </div>
        <div class="print-footer">Kinetika Pro — Спортивное питание</div>
    `;
    setTimeout(() => window.print(), 300);
}

// ============================================================
// 15. ЗАГРУЗКА ДАННЫХ И ИНИЦИАЛИЗАЦИЯ
// ============================================================
async function loadCatalogData() {
    try {
        const res = await fetch('catalog-data.json');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        RAW = data;
    } catch (e) {
        console.warn('Не удалось загрузить catalog-data.json, используется fallback:', e);
        RAW = FALLBACK;
    }
    allItems = RAW.flatMap(c => c.items.map(i => ({ ...i, firmCat: c.cat })));
    populateBrandFilter();
    renderCategories();
    renderSettings();
    renderCatalog();
    renderCart();
    renderOrders();
    renderStats();
    renderFavorites();
    updateFavBadge();
}

loadCatalogData();
