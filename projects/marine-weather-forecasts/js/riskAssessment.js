/**
 * Rule-Based Risk Assessment for Maritime Safety (Simplified for BMKG JSON)
 */

 export function assessRisk(data) {
  const wind = parseFloat(data.wind_speed_max) || 0;
  const waveCat = (data.wave_category || "").toLowerCase();
  const rainfall = (data.rainfall || "").toLowerCase();

  let riskScore = 0;
  const notes = [];

  notes.push(`Input → Wind: ${wind} kt | Wave Category: "${waveCat}" | Rainfall: "${rainfall}"`);

  // --- Wind assessment
  if (wind >= 15) {
    riskScore += 2;
    notes.push("High wind speed detected (≥15 kt).");
  } else if (wind >= 12) {
    riskScore += 1;
    notes.push("Moderate wind speed detected (12–14.9 kt).");
  } else {
    notes.push("Low wind speed detected (<12 kt).");
  }

  // --- Wave assessment
  let waveLevel = 0;
  if (waveCat.includes("rendah")) {
    waveLevel = 1;
    notes.push("Wave category: Rendah (Low).");
  } else if (waveCat.includes("sedang")) {
    waveLevel = 2;
    notes.push("Wave category: Sedang (Moderate).");
    riskScore += 1;
  } else if (waveCat.includes("tinggi")) {
    waveLevel = 3;
    notes.push("Wave category: Tinggi or Sangat Tinggi (High).");
    riskScore += 2;
  } else {
    notes.push("Unknown or missing wave category.");
  }


  // --- Rainfall assessment
  if (rainfall.includes("lebat")) {
    riskScore += 2;
    notes.push("Heavy rainfall detected.");
  } else if (rainfall.includes("sedang")) {
    riskScore += 1;
    notes.push("Moderate rainfall detected.");
  } else if (rainfall.includes("ringan")) {
    notes.push("Light rainfall detected.");
  } else {
    notes.push("No significant rainfall detected.");
  }

  // --- Categorization
  let riskLevel = "Safe";
  if (riskScore >= 4) {
    riskLevel = "Dangerous";
  } else if (riskScore >= 2) {
    riskLevel = "Caution";
  }

  notes.push(`Final Risk Level: ${riskLevel}`);

  return {
    level: riskLevel,
    explanation: notes.join(" | ")
  };
}
