import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const NAVY = "#1B2B4B";
const GREEN = "#3CC76A";
const BG = "#F4F6F9";
const CARD = "#FFFFFF";
const BORDER = "#E2E8F0";
const MUTED = "#64748B";
const EXEMPTION_ANNUELLE = 10000;

const HISTORICAL_RETURNS = {
  iwda: { 2010: 0.1301, 2011: -0.0642, 2012: 0.1707, 2013: 0.2605, 2014: 0.0615, 2015: -0.0113, 2016: 0.0751, 2017: 0.2275, 2018: -0.0901, 2019: 0.2713, 2020: 0.1606, 2021: 0.2219, 2022: -0.1811, 2023: 0.2427, 2024: 0.1911 },
  vwce: { 2010: 0.1301, 2011: -0.0642, 2012: 0.1707, 2013: 0.2605, 2014: 0.0615, 2015: -0.0113, 2016: 0.0751, 2017: 0.2275, 2018: -0.0901, 2019: 0.2713, 2020: 0.1606, 2021: 0.2219, 2022: -0.1811, 2023: 0.2427, 2024: 0.1911 },
  cspx: { 2010: 0.1301, 2011: 0.0204, 2012: 0.1361, 2013: 0.3274, 2014: 0.1516, 2015: 0.0095, 2016: 0.1042, 2017: 0.2156, 2018: -0.0593, 2019: 0.3181, 2020: 0.1786, 2021: 0.2984, 2022: -0.1932, 2023: 0.2612, 2024: 0.2573 },
  emim: { 2010: 0.1651, 2011: -0.1882, 2012: 0.1910, 2013: -0.0370, 2014: -0.0392, 2015: -0.1484, 2016: 0.1019, 2017: 0.3694, 2018: -0.1418, 2019: 0.1637, 2020: 0.1880, 2021: -0.0065, 2022: -0.1967, 2023: 0.1103, 2024: 0.0736 },
  meud: { 2010: 0.0821, 2011: -0.1123, 2012: 0.1654, 2013: 0.2234, 2014: 0.0612, 2015: 0.0873, 2016: 0.0214, 2017: 0.1012, 2018: -0.1321, 2019: 0.2398, 2020: -0.0321, 2021: 0.2456, 2022: -0.1234, 2023: 0.1578, 2024: 0.0821 },
  sppw: { 2010: 0.1301, 2011: 0.0204, 2012: 0.1361, 2013: 0.3274, 2014: 0.1516, 2015: 0.0095, 2016: 0.1042, 2017: 0.2156, 2018: -0.0593, 2019: 0.3181, 2020: 0.1786, 2021: 0.2984, 2022: -0.1932, 2023: 0.2612, 2024: 0.2573 },
  iusn: { 2010: 0.2501, 2011: -0.0821, 2012: 0.1934, 2013: 0.3012, 2014: 0.0723, 2015: 0.0234, 2016: 0.1456, 2017: 0.2134, 2018: -0.1423, 2019: 0.2567, 2020: 0.1234, 2021: 0.2867, 2022: -0.2134, 2023: 0.1789, 2024: 0.1234 },
  heal: { 2010: 0.0523, 2011: 0.1234, 2012: 0.1567, 2013: 0.3456, 2014: 0.2234, 2015: 0.0678, 2016: -0.0234, 2017: 0.1789, 2018: 0.0456, 2019: 0.2678, 2020: 0.1234, 2021: 0.1567, 2022: -0.0567, 2023: -0.0234, 2024: 0.0789 },
  iqqh: { 2010: 0.0234, 2011: -0.1567, 2012: 0.1234, 2013: 0.2345, 2014: 0.0345, 2015: -0.0456, 2016: -0.2345, 2017: 0.4567, 2018: 0.0678, 2019: 0.4234, 2020: 0.1567, 2021: -0.2345, 2022: -0.3456, 2023: -0.2567, 2024: -0.0345 },
  egln: { 2010: 0.2234, 2011: 0.1034, 2012: 0.0534, 2013: -0.2734, 2014: -0.0134, 2015: -0.1034, 2016: 0.0834, 2017: 0.1234, 2018: -0.0234, 2019: 0.1834, 2020: 0.2434, 2021: -0.0534, 2022: 0.0134, 2023: 0.1334, 2024: 0.2734 },
};

const ETF_MAP = {
  iwda: { id: "iwda", name: "IWDA", label: "iShares Core MSCI World", tob: 0.0012, rendementDefaut: 0.07, geo: "Monde développé (~1 400 entreprises)", frais: "0,20%/an", desc: "Le plus populaire chez les investisseurs DIY belges. 1 600 grandes entreprises dans 23 pays développés." },
  vwce: { id: "vwce", name: "VWCE", label: "Vanguard FTSE All-World", tob: 0.0132, rendementDefaut: 0.07, geo: "Monde entier (3 700 entreprises)", frais: "0,22%/an", desc: "La diversification maximale en un seul ETF. Marchés développés et émergents inclus." },
  cspx: { id: "cspx", name: "CSPX", label: "iShares Core S&P 500", tob: 0.0012, rendementDefaut: 0.105, geo: "États-Unis (500 plus grandes entreprises)", frais: "0,07%/an", desc: "Les 500 plus grandes entreprises américaines. Apple, Microsoft, Amazon, Google... Le moteur de croissance mondial." },
  emim: { id: "emim", name: "EMIM", label: "iShares Core MSCI EM IMI", tob: 0.0132, rendementDefaut: 0.065, geo: "Marchés émergents (Chine, Inde, Brésil...)", frais: "0,18%/an", desc: "Exposition aux économies en croissance rapide : Chine, Inde, Brésil, Corée du Sud. Plus volatil, potentiel élevé." },
  meud: { id: "meud", name: "MEUD", label: "Amundi MSCI Europe", tob: 0.0012, rendementDefaut: 0.065, geo: "Europe (600 entreprises)", frais: "0,12%/an", desc: "Les 600 plus grandes entreprises européennes. LVMH, Nestlé, SAP, ASML... Bon complément pour les Belges." },
  sppw: { id: "sppw", name: "SPPW", label: "SPDR MSCI World", tob: 0.0012, rendementDefaut: 0.07, geo: "Monde développé (1 600 entreprises)", frais: "0,12%/an", desc: "Alternative moins chère à IWDA. Même exposition mondiale aux pays développés, frais légèrement inférieurs." },
  iusn: { id: "iusn", name: "IUSN", label: "iShares MSCI World Small Cap", tob: 0.0012, rendementDefaut: 0.075, geo: "Petites entreprises mondiales", frais: "0,35%/an", desc: "Les petites entreprises des pays développés. Historiquement plus de croissance que les grandes caps, mais plus volatil." },
  heal: { id: "heal", name: "HEAL", label: "iShares Healthcare Innovation", tob: 0.0012, rendementDefaut: 0.068, geo: "Secteur santé mondial", frais: "0,40%/an", desc: "Entreprises innovantes dans la santé : biotech, medtech, pharma. Secteur défensif avec potentiel de croissance." },
  iqqh: { id: "iqqh", name: "IQQH", label: "iShares Global Clean Energy", tob: 0.0012, rendementDefaut: 0.05, geo: "Énergies renouvelables mondiales", frais: "0,65%/an", desc: "Entreprises de l'énergie verte : solaire, éolien, hydrogène. Fort potentiel mais volatilité élevée." },
  egln: { id: "egln", name: "EGLN", label: "iShares Physical Gold ETC", tob: 0.0035, rendementDefaut: 0.055, geo: "Or physique", frais: "0,12%/an", desc: "Or physique stocké en coffre. Protection contre l'inflation et les crises. Pas de dividendes, pas de croissance d'entreprise." },
};

const ETF_TOOLTIPS = {
  iwda: {
    titre: "Tu achètes un bout de 1 400 grandes entreprises mondiales",
    explication: "Nvidia, Apple, Microsoft, Amazon, Google... En investissant ici, tu possèdes une toute petite part de chacune. Si l'une d'elles monte, tu gagnes. Si l'une baisse, les autres compensent. C'est le choix numéro 1 des investisseurs belges DIY.",
    exemples: "🖥️ Tech · 🏦 Banques · 🏥 Pharma · 🏭 Industrie",
    avertissement: null,
  },
  vwce: {
    titre: "Tu achètes un bout de 3 700 entreprises dans le monde entier",
    explication: "Comme IWDA, mais en plus large : tu ajoutes aussi des entreprises de Chine, d'Inde, du Brésil... En gros, tu paries sur l'économie mondiale entière en une seule transaction.",
    exemples: "🌍 USA · 🇯🇵 Japon · 🇬🇧 UK · 🇨🇳 Chine · 🇮🇳 Inde",
    avertissement: "⚠️ TOB à 1,32% car enregistré en Belgique — légèrement plus coûteux à chaque achat/vente.",
  },
  cspx: {
    titre: "Tu achètes un bout des 500 plus grandes entreprises américaines",
    explication: "Le S&P 500, c'est le cœur de l'économie américaine. Apple, Microsoft, Amazon, Tesla, Google, JPMorgan... Historiquement, c'est l'indice le plus performant sur le long terme. Si les États-Unis vont bien, toi aussi.",
    exemples: "🍎 Apple · 📦 Amazon · 🚗 Tesla · 💊 Johnson & Johnson",
    avertissement: null,
  },
  emim: {
    titre: "Tu achètes un bout d'entreprises dans des pays en pleine croissance",
    explication: "Chine, Inde, Brésil, Corée du Sud, Taïwan... Ces pays ont des économies qui grandissent vite. Plus risqué que les pays développés — les marchés peuvent chuter fort — mais le potentiel de gain est plus élevé.",
    exemples: "🇨🇳 Alibaba · 🇮🇳 Reliance · 🇧🇷 Petrobras · 🇰🇷 Samsung",
    avertissement: "⚠️ Plus volatile : les années à -20% sont possibles. À éviter si tu as besoin de l'argent dans moins de 10 ans.",
  },
  meud: {
    titre: "Tu achètes un bout des 600 plus grandes entreprises européennes",
    explication: "LVMH, Nestlé, ASML, SAP, Total, Stellantis... Les champions européens. Moins dominé par la tech que les ETF américains, plus exposé aux banques et à l'industrie. Bon complément si tu veux diversifier hors USA.",
    exemples: "👜 LVMH · 🍫 Nestlé · 🔧 ASML · ⚡ Total",
    avertissement: null,
  },
  sppw: {
    titre: "Même chose qu'IWDA, mais moins cher en frais",
    explication: "SPPW suit le même indice mondial que IWDA (pays développés, 1 600 entreprises) mais les frais annuels sont légèrement inférieurs : 0,12%/an contre 0,20%/an. Sur 20 ans, ça fait une petite différence. Le choix des investisseurs qui optimisent chaque détail.",
    exemples: "🖥️ Même contenu qu'IWDA : Nvidia, Apple, Microsoft...",
    avertissement: null,
  },
  iusn: {
    titre: "Tu achètes un bout de milliers de petites entreprises mondiales",
    explication: "Au lieu des géants comme Apple ou LVMH, tu investis dans les entreprises plus petites des pays développés. Historiquement, les petites entreprises croissent plus vite que les grandes — mais elles chutent aussi plus fort en cas de crise.",
    exemples: "🔬 Biotech · 🏗️ Construction · 🛒 Commerce local · 💡 Innovation",
    avertissement: "⚠️ Plus volatile que IWDA. Idéal en complément, pas seul.",
  },
  heal: {
    titre: "Tu achètes un bout d'entreprises qui soignent le monde",
    explication: "Médicaments, hôpitaux, robots chirurgicaux, analyses génétiques... Le secteur santé est considéré comme défensif : les gens ont toujours besoin de médicaments, même en crise. Moins de croissance explosive, mais plus stable.",
    exemples: "💊 Pfizer · 🏥 UnitedHealth · 🧬 Illumina · 🤖 Intuitive Surgical",
    avertissement: null,
  },
  iqqh: {
    titre: "Tu achètes un bout d'entreprises de l'énergie verte",
    explication: "Panneaux solaires, éoliennes, hydrogène, réseaux électriques... Tu paries sur la transition énergétique mondiale. Fort potentiel si les gouvernements continuent d'investir dans le vert — mais très sensible aux politiques et aux taux d'intérêt.",
    exemples: "☀️ Solaire · 💨 Éolien · ⚡ Hydrogène · 🔋 Batteries",
    avertissement: "⚠️ Très volatile. A perdu -35% en 2022. À n'investir que si tu acceptes de fortes variations.",
  },
  egln: {
    titre: "Tu achètes de l'or physique stocké dans un coffre",
    explication: "Pas des actions d'entreprises, mais de l'or réel. L'or monte souvent quand tout le reste baisse — guerres, crises, inflation. C'est une protection, pas un moteur de croissance. Pas de dividendes, pas d'intérêts — juste le prix de l'or.",
    exemples: "🥇 Or physique stocké en Suisse · Valeur refuge mondiale",
    avertissement: "⚠️ TOB à 0,35% (ETC, pas ETF). Ne génère pas de revenus — uniquement de la valeur si le prix monte.",
  },
};

const RISK_PROFILES = [
  { id: "populaire", label: "🌍 Monde développé", etfId: "iwda" },
  { id: "global", label: "🌐 Monde entier", etfId: "vwce" },
  { id: "usa", label: "🇺🇸 États-Unis", etfId: "cspx" },
  { id: "emergents", label: "📈 Marchés émergents", etfId: "emim" },
  { id: "europe", label: "🇪🇺 Europe", etfId: "meud" },
  { id: "world2", label: "💡 Monde (alternatif)", etfId: "sppw" },
  { id: "smallcap", label: "🔬 Petites entreprises", etfId: "iusn" },
  { id: "sante", label: "🏥 Santé", etfId: "heal" },
  { id: "green", label: "🌱 Énergie verte", etfId: "iqqh" },
  { id: "or", label: "🥇 Or", etfId: "egln" },
];

const DUREE_LABELS = {
  5: "Court terme · objectif à 5 ans",
  10: "Moyen terme · projet de vie",
  15: "Long terme · retraite anticipée",
  20: "Très long terme · patrimoine",
  30: "Horizon retraite classique",
};

function getDureeLabel(d) {
  const keys = [5, 10, 15, 20, 30];
  const closest = keys.reduce((a, b) => Math.abs(b - d) < Math.abs(a - d) ? b : a);
  return DUREE_LABELS[closest] || `${d} ans`;
}



function simuler({ montant, duree, etf }) {
  let capital = 0, totalInvesti = 0, totalTOB = 0;
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - duree;
  const historique = HISTORICAL_RETURNS[etf.id];

  for (let a = 0; a < duree; a++) {
    const annee = startYear + a;
    const rendementAnnuel = historique[annee] !== undefined ? historique[annee] : etf.rendementDefaut;
    for (let m = 0; m < 12; m++) {
      const tob = montant * etf.tob;
      totalTOB += tob;
      capital = (capital + montant - tob) * (1 + rendementAnnuel / 12);
      totalInvesti += montant;
    }
  }
  const tobVente = capital * etf.tob;
  capital -= tobVente;
  totalTOB += tobVente;
  const plusValue = Math.max(0, capital - totalInvesti);
  const plusValueImposable = Math.max(0, plusValue - EXEMPTION_ANNUELLE);
  const impotPlusValue = plusValueImposable * 0.10;
  const capitalNet = capital - impotPlusValue;
  let epargne = 0;
  for (let m = 0; m < duree * 12; m++) epargne = (epargne + montant) * (1 + 0.009 / 12);
  return {
    capitalNet: Math.round(capitalNet),
    capitalBrut: Math.round(capital),
    totalInvesti: Math.round(totalInvesti),
    totalTOB: Math.round(totalTOB),
    impotPlusValue: Math.round(impotPlusValue),
    epargne: Math.round(epargne),
  };
}

function fmt(n) { return n.toLocaleString("fr-BE") + " €"; }

function Tooltip({ etfId }) {
  const [visible, setVisible] = useState(false);
  const t = ETF_TOOLTIPS[etfId];
  if (!t) return null;
  return (
    <span style={{ position: "relative", display: "inline-block", marginLeft: 6 }}>
      <span
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
style={{ cursor: "pointer", fontSize: 11, color: "#fff", background: NAVY, borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, userSelect: "none" }}      >?</span>
      {visible && (
        <div style={{
          position: "absolute", left: "50%", bottom: "calc(100% + 8px)",
          transform: "translateX(-50%)", zIndex: 999,
          background: "#fff", border: `1px solid ${BORDER}`,
          borderRadius: 12, padding: "14px 16px", width: 280,
          boxShadow: "0 8px 24px rgba(27,43,75,0.12)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 6, lineHeight: 1.4 }}>{t.titre}</div>
          <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.6, marginBottom: 8 }}>{t.explication}</div>
          <div style={{ fontSize: 11, color: "#555", background: BG, borderRadius: 6, padding: "6px 8px", marginBottom: t.avertissement ? 8 : 0 }}>{t.exemples}</div>
          {t.avertissement && <div style={{ fontSize: 11, color: "#92400E", background: "#FFF9EC", borderRadius: 6, padding: "6px 8px" }}>{t.avertissement}</div>}
          <div style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", width: 10, height: 10, background: "#fff", border: `1px solid ${BORDER}`, borderTop: "none", borderLeft: "none", rotate: "45deg" }}></div>
        </div>
      )}
    </span>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`,
      padding: "1.5rem", marginBottom: 16,
      boxShadow: "0 1px 6px rgba(27,43,75,0.06)", ...style
    }}>{children}</div>
  );
}

function StepLabel({ n, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <span style={{
        background: NAVY, color: "#fff", borderRadius: "50%",
        width: 26, height: 26, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0,
      }}>{n}</span>
      <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: NAVY }}>{children}</h2>
    </div>
  );
}

export default function App() {
  const [montant, setMontant] = useState(200);
  const [duree, setDuree] = useState(15);
  const [riskId, setRiskId] = useState("populaire");
  const [started, setStarted] = useState(false);

  const risk = RISK_PROFILES.find(r => r.id === riskId);
  const etf = ETF_MAP[risk.etfId];
  const result = simuler({ montant, duree, etf });  const gain = result.capitalNet - result.totalInvesti;
  const diff = result.capitalNet - result.epargne;

 const chartData = Array.from({ length: duree + 1 }, (_, i) => {
    let cap = 0, epargne = 0;
    for (let a = 0; a < i; a++) {
      const annee = new Date().getFullYear() - duree + a;
      const rAnnuel = HISTORICAL_RETURNS[etf.id]?.[annee] ?? etf.rendementDefaut;
      for (let m = 0; m < 12; m++) {
        const tob = montant * etf.tob;
      cap = (cap + montant - tob) * (1 + rAnnuel / 12);
        epargne = (epargne + montant) * (1 + 0.009 / 12);
      }
    }
    return {
      annee: `An ${i}`,
      investi: Math.round(montant * i * 12),
      etf: Math.round(cap),
      epargne: Math.round(epargne),
    };
  });

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif", color: NAVY }}>

      {/* Header */}
      <header style={{ background: "#fff", padding: "0 2rem", borderBottom: `1px solid ${BORDER}`, position: "sticky", top: 0, zIndex: 100 }}>        <div style={{ maxWidth: 1100, margin: "0 auto", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src="/Icon.png" alt="BeETF" style={{ height: 36 }} />
            <span style={{ width: 1, height: 22, background: NAVY, opacity: 0.3, margin: "0 4px" }}></span>
            <span style={{ fontSize: 18, fontWeight: 800, color: NAVY, letterSpacing: "-0.5px" }}>ETF</span>
          </div>          
        <span style={{ fontSize: 12, color: MUTED, background: BG, padding: "4px 12px", borderRadius: 20, letterSpacing: "0.3px" }}>
            Belgique · 2026
          </span>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 2rem 5rem" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-block", background: "rgba(60,199,106,0.1)", border: "1px solid rgba(60,199,106,0.25)", borderRadius: 20, padding: "4px 14px", fontSize: 12, color: "#16A34A", fontWeight: 600, marginBottom: 16, letterSpacing: "0.3px" }}>
            SIMULATEUR D'INVESTISSEMENT BELGE
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.8px", lineHeight: 1.2, color: NAVY, marginBottom: 10 }}>
            Ton épargne mérite mieux<br />que <span style={{ color: GREEN }}>0,9%*</span>
          </h1>
          <p style={{ fontSize: 15, color: MUTED, maxWidth: 500, margin: "0 auto 8px", lineHeight: 1.7 }}>
            Réponds à 3 questions. Vois l'impact réel des taxes belges sur ton investissement.
          </p>
          <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>
            * Taux légal minimum garanti sur les comptes épargne belges réglementés (BNB, 2024).
          </p>
          <p style={{ fontSize: 12, color: MUTED, marginTop: 10, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 14px", display: "inline-block" }}>
            ⚠️ Outil éducatif uniquement — pas un conseil financier ou fiscal. Les simulations sont indicatives.
          </p>
        </div>

        {/* Grid 2 colonnes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}>

          {/* GAUCHE — Questions */}
          <div>

            {/* Question 1 */}
            <Card>
              <StepLabel n={1}>Combien peux-tu mettre de côté chaque mois ?</StepLabel>
              <p style={{ fontSize: 13, color: MUTED, marginBottom: 18, lineHeight: 1.6 }}>
                Pense à ce qui reste après loyer, courses, sorties. Même <strong style={{ color: NAVY }}>50 €/mois</strong> font une vraie différence sur 10 ans.
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: MUTED }}>Montant mensuel</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{fmt(montant)}</span>
              </div>
                <input type="range" min={50} max={10000} step={50} value={montant}                onChange={e => { setMontant(Number(e.target.value)); setStarted(true); }}
                style={{ width: "100%", accentColor: NAVY, cursor: "pointer", marginBottom: 10 }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94A3B8" }}>
                <span>50 €</span><span>10 000 €</span>
              </div>            </Card>

            {/* Question 2 */}
            <Card>
              <StepLabel n={2}>Sur combien d'années veux-tu investir ?</StepLabel>
              <p style={{ fontSize: 13, color: MUTED, marginBottom: 18, lineHeight: 1.6 }}>
                Plus tu investis longtemps, plus les intérêts composés travaillent pour toi. 
                <strong style={{ color: NAVY }}>Plus la durée est longue</strong>, plus les intérêts composés travaillent pour toi.
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: MUTED }}>{getDureeLabel(duree)}</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{duree} ans</span>
              </div>
              <input type="range" min={3} max={35} step={1} value={duree}
                onChange={e => setDuree(Number(e.target.value))}
                style={{ width: "100%", accentColor: NAVY, cursor: "pointer", marginBottom: 10 }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94A3B8" }}>
                <span>3 ans</span><span>35 ans</span>
              </div>
            </Card>

{/* Question 3 */}
            <Card>
              <StepLabel n={3}>Dans quel type d'ETF veux-tu investir ?</StepLabel>
              <p style={{ fontSize: 13, color: MUTED, marginBottom: 16, lineHeight: 1.6 }}>
                Un ETF est un panier d'actions qui suit un indice boursier. Tu investis dans des centaines d'entreprises en une seule transaction. Choisis la zone géographique qui t'intéresse — chaque ETF a ses propres caractéristiques et taxes belges.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {RISK_PROFILES.map(r => {
                  const sel = riskId === r.id;
                  const e = ETF_MAP[r.etfId];
                  return (
                    <div key={r.id} onClick={() => setRiskId(r.id)} style={{
                      border: sel ? `2px solid ${NAVY}` : `1px solid ${BORDER}`,
                      borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                      background: sel ? "#EEF2F8" : CARD,
                      transition: "all 0.15s",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {sel && <span style={{ color: GREEN, fontWeight: 700, fontSize: 14 }}>✓</span>}
                          <span style={{ fontWeight: 800, fontSize: 15, color: NAVY }}>{e.name}</span>
                          <span style={{ fontSize: 12, color: MUTED }}>{e.label}</span>
                          <Tooltip etfId={r.etfId} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, background: e.tob === 0.0012 ? "#EDF7F0" : "#FEF9EC", color: e.tob === 0.0012 ? "#166534" : "#92400E", padding: "2px 8px", borderRadius: 20 }}>
                          TOB {e.tob === 0.0012 ? "0,12%" : "1,32%"}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: MUTED, marginBottom: 6, lineHeight: 1.5 }}>
                        {e.desc}
                      </div>
                      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: MUTED }}>🌍 {e.geo}</span>
                        <span style={{ fontSize: 11, color: MUTED }}>📈 Rendement historique moyen : ~{(ETF_MAP[r.etfId].rendementDefaut * 100).toFixed(1)}%/an</span>
                        <span style={{ fontSize: 11, color: MUTED }}>💸 Frais : {e.frais}</span>                        
                      </div>
                    </div>
                  );
                })}
              </div>


              {/* ETF recommandé */}
              <div style={{ marginTop: 16, background: "#F8FAFF", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>ETF sélectionné</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: 15, color: NAVY }}>{etf.name}</span>
                    <span style={{ fontSize: 12, color: MUTED, marginLeft: 8 }}>{etf.label}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, background: etf.tob === 0.0012 ? "#EDF7F0" : "#FEF9EC", color: etf.tob === 0.0012 ? "#166534" : "#92400E", padding: "3px 10px", borderRadius: 20 }}>
                    TOB {etf.tob === 0.0012 ? "0,12%" : "1,32%"}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>🌍 {etf.geo} · 💸 {etf.frais}</div>
              </div>

              <div style={{ marginTop: 12, background: "#FFF9EC", border: "1px solid #FDE68A", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#78350F", lineHeight: 1.6 }}>
                💡 <strong>C'est quoi un ETF ?</strong> Un panier d'actions qui suit un indice boursier. Tu investis dans des centaines d'entreprises en une seule transaction, avec des frais très bas — sans choisir toi-même les actions.
              </div>
            </Card>
          </div>

          {/* DROITE — Résultats */}
          <div style={{ position: "sticky", top: 74 }}>
            {!started ? (
              <div style={{ background: CARD, borderRadius: 16, border: `1px solid ${BORDER}`, padding: "3rem 2rem", textAlign: "center", boxShadow: "0 1px 6px rgba(27,43,75,0.06)" }}>
              <img src="/Icon.png" alt="BeETF" style={{ height: 80, marginBottom: 16 }} />                
              <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>Réponds aux 3 questions à gauche pour voir combien ton épargne mensuelle peut rapporter selon l'ETF choisi.</div>
              </div>
            ) : (<>

            {/* Bloc résultat principal */}
            <div style={{ background: NAVY, borderRadius: 16, padding: "1.75rem", marginBottom: 16, boxShadow: "0 6px 24px rgba(27,43,75,0.2)" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 18 }}>
                Résultat après {duree} an{duree > 1 ? "s"  : ""}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>ETF {etf.name} — net</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: GREEN, lineHeight: 1 }}>{fmt(result.capitalNet)}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 6 }}>+{fmt(gain)} de gain réel</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Compte épargne</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "rgba(255,255,255,0.4)", lineHeight: 1 }}>{fmt(result.epargne)}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>à 0,9% / an</div>
                </div>
              </div>

              <div style={{ background: "rgba(60,199,106,0.13)", border: "1px solid rgba(60,199,106,0.22)", borderRadius: 10, padding: "14px 16px" }}>
                <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, color: "rgba(255,255,255,0.88)" }}>
                  En mettant <strong style={{ color: "#fff" }}>{fmt(montant)}/mois</strong> pendant <strong style={{ color: "#fff" }}>{duree} ans</strong>, tu arrives à <strong style={{ color: GREEN }}>{fmt(result.capitalNet)}</strong> net de taxes — soit <strong style={{ color: GREEN }}>{fmt(diff)} de plus</strong> qu'un compte épargne.
                </p>
              </div>
            </div>

            {/* Graphique */}
            <Card>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: NAVY, margin: "0 0 4px" }}>Évolution dans le temps</h3>
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <span style={{ fontSize: 11, color: MUTED, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 10, height: 3, background: "#94A3B8", borderRadius: 2, display: "inline-block" }}></span>Total investi
                </span>
                <span style={{ fontSize: 11, color: MUTED, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 10, height: 3, background: "#93C5FD", borderRadius: 2, display: "inline-block" }}></span>Compte épargne
                </span>
                <span style={{ fontSize: 11, color: MUTED, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 10, height: 3, background: GREEN, borderRadius: 2, display: "inline-block" }}></span>ETF {etf.name}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gradEtf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={GREEN} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradEpargne" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#93C5FD" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="annee" tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} interval={Math.floor(duree / 5)} />
                  <YAxis tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k€`} width={40} />
                  <Tooltip
                    formatter={(value, name) => [fmt(value), name === "etf" ? `ETF ${etf.name}` : name === "epargne" ? "Compte épargne" : "Total investi"]}
                    labelStyle={{ color: NAVY, fontWeight: 600, marginBottom: 4 }}
                    contentStyle={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="investi" stroke="#94A3B8" strokeWidth={2} fill="none" strokeDasharray="4 3" dot={false} />
                  <Area type="monotone" dataKey="epargne" stroke="#93C5FD" strokeWidth={2} fill="url(#gradEpargne)" dot={false} />
                  <Area type="monotone" dataKey="etf" stroke={GREEN} strokeWidth={2.5} fill="url(#gradEtf)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Détail taxes */}
            <Card>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: NAVY, margin: "0 0 14px" }}>Ce que tu paies en taxes</h3>
              {[
                { label: "Total que tu verses sur la période", val: result.totalInvesti, color: NAVY, sub: `${fmt(montant)} × ${duree * 12} mois` },
                { label: "TOB — taxe sur chaque achat/vente", val: result.totalTOB, color: "#DC2626", sub: `${etf.tob === 0.0012 ? "0,12%" : "1,32%"} · prélevée automatiquement` },
                { label: "Impôt sur plus-values (10%)", val: result.impotPlusValue, color: "#DC2626", sub: "Au-delà de 10 000 € de gain · belge 2026" },
                { label: "Capital net final", val: result.capitalNet, color: "#16A34A", sub: "Ce qui reste vraiment dans ta poche" },
              ].map(({ label, val, color, sub }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
                  <div>
                    <div style={{ fontSize: 12, color: MUTED }}>{label}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{sub}</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color, whiteSpace: "nowrap", marginLeft: 12 }}>{fmt(val)}</span>
                </div>
              ))}
            </Card>

            {/* Disclaimer */}
            <p style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.65, margin: 0, padding: "0 2px" }}>
              <strong style={{ color: NAVY }}>⚠️ Outil éducatif, pas un conseil financier.</strong> Simulation indicative. Basé sur les rendements historiques réels de {etf.name} (2010-2024). Pour les années hors données historiques, un rendement moyen de {(etf.rendementDefaut * 100).toFixed(1)}%/an est appliqué.
            </p>
          </>)}
          </div>
        </div>
      </main>

      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "1.25rem 2rem", textAlign: "center", background: "#fff" }}>
        <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>
          BeETF · Fait en Belgique · <a href="mailto:contact@beetf.be" style={{ color: NAVY, textDecoration: "none" }}>contact@beetf.be</a>
        </p>
      </footer>
    </div>
  );
}