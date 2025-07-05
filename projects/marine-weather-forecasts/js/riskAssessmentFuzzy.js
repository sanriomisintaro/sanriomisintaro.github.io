/**
 * Fuzzy Risk Assessment using only weather, wave_cat, wind_speed_max
 */

 export function assessRiskFuzzy(data) {
  const wind = parseFloat(data.wind_speed_max) || 0;
  const waveCat = (data.wave_category || "").toLowerCase();
  const rainfallDesc = (data.rainfall || "").toLowerCase();

  const explanation = [];

  explanation.push(`Input → Wind: ${wind} kt | Wave Category: "${waveCat}" | Rainfall: "${rainfallDesc}"`);

  // --- Wind membership
  const μWind = {
    low: membershipTrap(wind, 0, 0, 6, 12),
    medium: membershipTri(wind, 8, 12, 15),
    high: membershipTrap(wind, 13, 15, 20, 30)
  };

  explanation.push(`Wind → Low: ${μWind.low.toFixed(2)}, Medium: ${μWind.medium.toFixed(2)}, High: ${μWind.high.toFixed(2)}`);

  // --- Wave membership from wave_cat text
  const μWave = {
    calm: waveCat.includes("rendah") ? 1 : 0,
    moderate: waveCat.includes("sedang") ? 1 : 0,
    rough: (waveCat.includes("tinggi")) ? 1 : 0
  };
  explanation.push(`Wave → Calm: ${μWave.calm.toFixed(2)}, Moderate: ${μWave.moderate.toFixed(2)}, Rough: ${μWave.rough.toFixed(2)}`);

  // --- Rainfall membership
  const μRain = {
    heavy: rainfallDesc.includes("lebat") ? 1 : 0
  };
  explanation.push(`Rainfall → Heavy: ${μRain.heavy}`);

  // --- Rules
  let ruleDangerous = Math.max(μWind.high, μWave.rough);
  let ruleCaution = Math.max(
    Math.min(μWind.medium, μWave.moderate),
    μRain.heavy * 0.6
    );
  let ruleSafe = Math.min(μWind.low, μWave.calm) * (1 - μRain.heavy);

  // Fallback if all rules zero
  const epsilon = 0.01;
  if (ruleDangerous + ruleCaution + ruleSafe === 0) {
    ruleSafe = epsilon;
    explanation.push("No rule fired. Applied minimal safe fallback.");
  }

  explanation.push(`Rule Activations → Dangerous: ${ruleDangerous.toFixed(2)}, Caution: ${ruleCaution.toFixed(2)}, Safe: ${ruleSafe.toFixed(2)}`);

  // --- Defuzzification
  const numerator = (ruleSafe * 0.2) + (ruleCaution * 0.6) + (ruleDangerous * 0.9);
  const denominator = ruleSafe + ruleCaution + ruleDangerous + 1e-6;
  const riskScore = numerator / denominator;

  explanation.push(`Defuzzified Score: ${riskScore.toFixed(2)}`);

  // --- Categorization
  let riskLevel = "Safe";
  if (riskScore >= 0.6) {
    riskLevel = "Dangerous";
  } else if (riskScore >= 0.3) {
    riskLevel = "Caution";
  }

  explanation.push(`Final Risk Level: ${riskLevel}`);

  return {
    level: riskLevel,
    score: riskScore,
    explanation: explanation.join(" | ")
  };
}

/* --- Membership functions --- */
function membershipTrap(x, a, b, c, d) {
  if (x <= a) return 0;
  if (x >= d) return 0;
  if (x >= b && x <= c) return 1;
  if (x > a && x < b) return (x - a) / (b - a);
  if (x > c && x < d) return (d - x) / (d - c);
  return 0;
}

function membershipTri(x, a, b, c) {
  if (x <= a) return 0;
  if (x >= c) return 0;
  if (x === b) return 1;
  if (x > a && x < b) return (x - a) / (b - a);
  if (x > b && x < c) return (c - x) / (c - b);
  return 0;
}
