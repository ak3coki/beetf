import { useState } from "react";

const ETF_PROFILES = [
  { id: "iwda", name: "IWDA — MSCI World", tob: 0.0012, rendement: 0.07 },
  { id: "vwce", name: "VWCE — World All Cap", tob: 0.0012, rendement: 0.07 },
  { id: "emim", name: "EMIM — Marchés émergents", tob: 0.0132, rendement: 0.065 },
];

const COMPTE_EPARGNE_TAUX = 0.009;
const PLUS_VALUE_TAUX = 0.10;
const EXEMPTION_ANNUELLE = 10000;

function simuler({ montant, duree, etf }) {
  let capital = 0;
  let totalInvesti = 0;
  let totalTOB = 0;

  for (let annee = 1; annee <= duree; annee++) {
    for (let mois = 0; mois < 12; mois++) {
      const tob = montant * etf.tob;
      const montantNet = montant - tob;
      totalTOB += tob;
      capital = (capital + montantNet) * (1 + etf.rendement / 12);
      totalInvesti += montant;
    }
  }

  const plusValue = Math.max(0, capital - totalInvesti);
  const exemptionTotale = EXEMPTION_ANNUELLE * duree;
  const plusValueImposable = Math.max(0, plusValue - exemptionTotale);
  const impotPlusValue = plusValueImposable * PLUS_VALUE_TAUX;
  const capitalNet = capital - impotPlusValue;

  let epargne = 0;
  for (let mois = 0; mois < duree * 12; mois++) {
    epargne = (epargne + montant) * (1 + COMPTE_EPARGNE_TAUX / 12);
  }

  return {
    capitalBrut: Math.round(capital),
    capitalNet: Math.round(capitalNet),
    totalInvesti: Math.round(totalInvesti),
    totalTOB: Math.round(totalTOB),
    impotPlusValue: Math.round(impotPlusValue),
    epargne: Math.round(epargne),
  };
}

export default function App() {
  const [revenu, setRevenu] = useState(3000);
  const [depenses, setDepenses] = useState(2000);
  const [montant, setMontant] = useState(300);
  const [duree, setDuree] = useState(15);
  const [etfId, setEtfId] = useState("iwda");

  const marge = revenu - depenses;
  const etf = ETF_PROFILES.find((e) => e.id === etfId);
  const result = simuler({ montant, duree, etf });
  const gain = result.capitalNet - result.totalInvesti;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>BeETF</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>Simule ce que ton épargne peut vraiment rapporter, taxes belges incluses.</p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Ta situation</h2>

        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: "#444" }}>Revenu mensuel net : <strong>{revenu} €</strong></span>
          <input type="range" min={500} max={10000} step={100} value={revenu}
            onChange={(e) => setRevenu(Number(e.target.value))}
            style={{ display: "block", width: "100%", marginTop: 6 }} />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: "#444" }}>Dépenses mensuelles : <strong>{depenses} €</strong></span>
          <input type="range" min={500} max={10000} step={100} value={depenses}
            onChange={(e) => setDepenses(Number(e.target.value))}
            style={{ display: "block", width: "100%", marginTop: 6 }} />
        </label>

        <div style={{ background: "#f0f7f0", borderRadius: 8, padding: "10px 14px", fontSize: 14 }}>
          Marge disponible : <strong style={{ color: marge >= 0 ? "#1a7a1a" : "#c0392b" }}>{marge} €/mois</strong>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Ton investissement</h2>

        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: "#444" }}>Montant investi par mois : <strong>{montant} €</strong></span>
          <input type="range" min={10} max={Math.max(10, marge)} step={10} value={Math.min(montant, Math.max(10, marge))}
            onChange={(e) => setMontant(Number(e.target.value))}
            style={{ display: "block", width: "100%", marginTop: 6 }} />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: "#444" }}>Durée : <strong>{duree} ans</strong></span>
          <input type="range" min={1} max={40} step={1} value={duree}
            onChange={(e) => setDuree(Number(e.target.value))}
            style={{ display: "block", width: "100%", marginTop: 6 }} />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: "#444", display: "block", marginBottom: 6 }}>ETF :</span>
          <select value={etfId} onChange={(e) => setEtfId(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #ddd", fontSize: 14 }}>
            {ETF_PROFILES.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </label>
      </section>

      <section style={{ background: "#fafafa", borderRadius: 12, padding: "1.5rem", border: "1px solid #eee" }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Résultat après {duree} ans</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div style={{ background: "#fff", borderRadius: 8, padding: "12px 14px", border: "1px solid #eee" }}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Capital net (après taxes)</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#1a7a1a" }}>{result.capitalNet.toLocaleString("fr-BE")} €</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 8, padding: "12px 14px", border: "1px solid #eee" }}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Compte épargne (0,9%)</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#888" }}>{result.epargne.toLocaleString("fr-BE")} €</div>
          </div>
        </div>

        <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7, background: "#fff", borderRadius: 8, padding: "12px 14px", border: "1px solid #eee", marginBottom: 12 }}>
          En investissant <strong>{montant} €/mois</strong> pendant <strong>{duree} ans</strong>, tu accumules <strong style={{ color: "#1a7a1a" }}>{result.capitalNet.toLocaleString("fr-BE")} €</strong> net de taxes — soit <strong>{gain.toLocaleString("fr-BE")} €</strong> de gain réel.
          Sur un compte épargne, le même effort te donnerait <strong>{result.epargne.toLocaleString("fr-BE")} €</strong>.
        </div>

        <div style={{ fontSize: 12, color: "#999", borderTop: "1px solid #eee", paddingTop: 12 }}>
          Taxes payées : TOB {result.totalTOB.toLocaleString("fr-BE")} € · Plus-value {result.impotPlusValue.toLocaleString("fr-BE")} € · Total investi {result.totalInvesti.toLocaleString("fr-BE")} €
        </div>
      </section>

      <p style={{ fontSize: 11, color: "#bbb", marginTop: 24, textAlign: "center" }}>
        Simulation indicative. Rendement 7%/an non garanti. Fiscalité belge 2026.
      </p>
    </div>
  );
}