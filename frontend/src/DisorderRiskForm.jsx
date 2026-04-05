// src/DisorderRiskForm.jsx
import "./DisorderRiskForm.css";
import { useState } from "react";

const RISK_LABELS = {
  Healthy:  "No significant risk detected.",
  Mild:     "Low-level risk indicators present.",
  Moderate: "Consider speaking with a professional.",
  Severe:   "Please consult a healthcare provider.",
};

export default function DisorderRiskForm() {
  const [stress, setStress] = useState(5);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runInference(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      age: parseInt(e.target.age.value),
      gender: e.target.gender.value,
      weight: parseFloat(e.target.weight.value),
      height: parseFloat(e.target.height.value),
      sleep_hr: parseInt(e.target.sleep_hr.value),
      avg_work_hour: parseInt(e.target.avg_work_hour.value),
      stress_score: stress,
      mental_condition: e.target.mental_condition.value,
    };

    try {
      const res = await fetch("http://localhost/api/disorder_risk_inference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data.risk_type);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  const riskKey = result ? result.toLowerCase() : null;

  return (
    <div className="page">
      <div className="container">

        <div className="header">
          <p className="eyebrow">Sleep health assessment</p>
          <h1 className="title">Disorder risk checker</h1>
          <p className="subtitle">
            Fill in your details below to receive a personalised risk assessment.
          </p>
        </div>

        <form onSubmit={runInference} className="form">

          {/* Personal info */}
          <fieldset className="fieldset">
            <legend className="legend">Personal info</legend>
            <div className="grid2">
              <div className="field">
                <label className="label">Age <span className="hint">— 6–80</span></label>
                <input name="age" type="number" min="6" max="80" placeholder="28" required className="input" />
              </div>
              <div className="field">
                <label className="label">Gender</label>
                <select name="gender" required className="input">
                  <option value="">Select...</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="field">
                <label className="label">Weight <span className="hint">— kg</span></label>
                <input name="weight" type="number" step="0.1" placeholder="65.0" required className="input" />
              </div>
              <div className="field">
                <label className="label">Height <span className="hint">— metres</span></label>
                <input name="height" type="number" step="0.01" placeholder="1.72" required className="input" />
              </div>
            </div>
          </fieldset>

          <div className="divider" />

          {/* Lifestyle */}
          <fieldset className="fieldset">
            <legend className="legend">Lifestyle</legend>
            <div className="grid2">
              <div className="field">
                <label className="label">Sleep hours <span className="hint">— per night</span></label>
                <input name="sleep_hr" type="number" min="0" max="24" placeholder="7" required className="input" />
              </div>
              <div className="field">
                <label className="label">Work hours <span className="hint">— per day</span></label>
                <input name="avg_work_hour" type="number" min="0" max="24" placeholder="8" required className="input" />
              </div>
            </div>
            <div className="stress-section">
              <div className="stress-header">
                <label className="label">Perceived stress</label>
                <span className="stress-val">{stress} / 10</span>
              </div>
              <input
                type="range" min="0" max="10" step="1"
                value={stress}
                onChange={e => setStress(+e.target.value)}
                className="slider"
              />
              <div className="slider-hints">
                <span>None</span><span>Extreme</span>
              </div>
            </div>
          </fieldset>

          <div className="divider" />

          {/* Mental health */}
          <fieldset className="fieldset">
            <legend className="legend">Mental health</legend>
            <div className="field">
              <label className="label">Current condition</label>
              <select name="mental_condition" required className="input">
                <option value="">Select...</option>
                <option value="healthy">Healthy</option>
                <option value="anxiety">Anxiety</option>
                <option value="depress">Depression</option>
                <option value="both">Both (anxiety + depression)</option>
              </select>
            </div>
          </fieldset>

          {/* Error */}
          {error && <div className="error-box">{error}</div>}

          {/* Result */}
          {result && (
            <div className={`result-box ${riskKey}`}>
              <span className={`result-tag ${riskKey}`}>{result}</span>
              <span className="result-desc">{RISK_LABELS[result]}</span>
            </div>
          )}

          <button type="submit" disabled={loading} className="button">
            {loading ? "Analysing..." : "Analyse risk"}
          </button>

        </form>
      </div>
    </div>
  );
}
