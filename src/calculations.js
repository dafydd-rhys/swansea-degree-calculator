export const simulateMinimumAverageNeeded = (lvl6, lvl7) => {
  const CLASSIFICATIONS = [
    { name: "First Class Honours", target: 70 },
    { name: "Upper Second Class Honours", target: 60 },
    { name: "Lower Second Class Honours", target: 50 },
    { name: "Third Class Honours", target: 40 },
  ];

  // Helper to clone modules
  const cloneModules = (modules) => modules.map((mod) => ({ ...mod }));

  // Helper to calculate weighted banded classification
  const calculateFromModules = (lvl6, lvl7) =>
    calculateUndergraduate(cloneModules(lvl6), cloneModules(lvl7)).final.replace("%", "");

  // Get how many credits have been used per band so far
  const usedCredits = (mods) => mods.reduce((sum, mod) => sum + mod.credits, 0);

  const totalLvl6 = usedCredits(lvl6);
  const totalLvl7 = usedCredits(lvl7);

  const missingLvl6 = 120 - totalLvl6;
  const missingLvl7 = 120 - totalLvl7;

  const remainingCredits = [];

  if (missingLvl6 > 0) {
    remainingCredits.push({ level: 6, credits: missingLvl6 });
  }

  if (missingLvl7 > 0) {
    remainingCredits.push({ level: 7, credits: missingLvl7 });
  }

  // Try values between 30-100 to simulate needed average
  const simulateForTarget = (target) => {
    for (let testAvg = 30; testAvg <= 100; testAvg += 0.01) {
      const testLvl6 = [...lvl6];
      const testLvl7 = [...lvl7];

      remainingCredits.forEach((block) => {
        const testModule = {
          grade: testAvg,
          credits: block.credits,
        };
        if (block.level === 6) testLvl6.push(testModule);
        else testLvl7.push(testModule);
      });

      const final = parseFloat(calculateFromModules(testLvl6, testLvl7));

      if (final >= target) {
        return Math.round(testAvg * 100) / 100;
      }
    }
    return null;
  };

  // Run simulation for all targets
  const results = {};

  // Add a new key for each classification
  CLASSIFICATIONS.forEach((cls) => {
    const minAvg = simulateForTarget(cls.target);
    // Set the results in the desired format
    if (cls.name === "First Class Honours") {
      results.fc = minAvg
        ? `You need an average of ${minAvg}% in your remaining modules.`
        : "It is not possible to achieve First Class Honours with remaining credits.";
    } else if (cls.name === "Upper Second Class Honours") {
      results.scU = minAvg
        ? `You need an average of ${minAvg}% in your remaining modules.`
        : "It is not possible to achieve Upper Second Class Honours (2:1) with remaining credits.";
    } else if (cls.name === "Lower Second Class Honours") {
      results.scL = minAvg
        ? `You need an average of ${minAvg}% in your remaining modules.`
        : "It is not possible to achieve Lower Second Class Honours with remaining credits.";
    } else if (cls.name === "Third Class Honours") {
      results.tc = minAvg
        ? `You need an average of ${minAvg}% in your remaining modules.`
        : "It is not possible to achieve Third Class Honours with remaining credits.";
    }
  });

  return results;
};

export const calculateUndergraduate = (y2, y3) => {
  return totalCreditVal(y3, y2);
};

const totalCreditVal = (lvl7, lvl6) => {
  let credits6 = [];
  let credits7 = [];
  let bandA = [];
  let bandB = [];
  let bandC = [];
  let bandD = [];

  // LEVEL 7 (Y3) - Gather modules and their credit values
  lvl7.forEach((module) => {
    credits7.push({ grade: module.grade, credits: module.credits });
  });

  // Sort by grade (highest first)
  credits7.sort((a, b) => b.grade - a.grade);

  // Get BAND A (Top 80 credits @ Level 7)
  let totalCreditsBandA = 0;
  let bandAcreditTotal = 0;
  let remainingCredits7 = [];

  for (let i = 0; i < credits7.length; i++) {
    if (totalCreditsBandA < 80) {
      if (totalCreditsBandA + credits7[i].credits > 80) {
        const remainingCredits = 80 - totalCreditsBandA;
        bandA.push({
          grade: credits7[i].grade,
          credits: remainingCredits,
        });
        bandAcreditTotal += credits7[i].grade * remainingCredits;
        totalCreditsBandA += remainingCredits;

        // Add remaining credits to remainingCredits7
        const remainingModule = {
          grade: credits7[i].grade,
          credits: credits7[i].credits - remainingCredits,
        };
        remainingCredits7.push(remainingModule);
      } else {
        bandA.push(credits7[i]);
        totalCreditsBandA += credits7[i].credits;
        bandAcreditTotal += credits7[i].grade * credits7[i].credits;
      }
    } else {
      remainingCredits7.push(credits7[i]);  // Store remaining credits for Band B
    }
  }

  // Get BAND B (Next 40 credits @ Level 7, remaining modules after Band A)
  let totalCreditsBandB = 0;
  let bandBcreditTotal = 0;

  for (let i = 0; i < remainingCredits7.length; i++) {
    if (totalCreditsBandB < 40) {
      const remainingCredits = Math.min(40 - totalCreditsBandB, remainingCredits7[i].credits);
      bandB.push({
        grade: remainingCredits7[i].grade,
        credits: remainingCredits,
      });
      bandBcreditTotal += remainingCredits7[i].grade * remainingCredits;
      totalCreditsBandB += remainingCredits;
    }
  }

  // LEVEL 6 (Y2) - Gather modules and their credit values
  lvl6.forEach((module) => {
    credits6.push({ grade: module.grade, credits: module.credits });
  });

  // Sort by grade (highest first)
  credits6.sort((a, b) => b.grade - a.grade);

  // Get BAND C (Top 40 credits @ Level 6)
  let totalCreditsBandC = 0;
  let bandCcreditTotal = 0;
  let remainingCredits6 = [];

  for (let i = 0; i < credits6.length; i++) {
    if (totalCreditsBandC < 40) {
      if (totalCreditsBandC + credits6[i].credits > 40) {
        const remainingCredits = 40 - totalCreditsBandC;
        bandC.push({
          grade: credits6[i].grade,
          credits: remainingCredits,
        });
        bandCcreditTotal += credits6[i].grade * remainingCredits;
        totalCreditsBandC += remainingCredits;

        // Add remaining credits to remainingCredits6
        const remainingModule = {
          grade: credits6[i].grade,
          credits: credits6[i].credits - remainingCredits,
        };
        remainingCredits6.push(remainingModule);
      } else {
        bandC.push(credits6[i]);
        totalCreditsBandC += credits6[i].credits;
        bandCcreditTotal += credits6[i].grade * credits6[i].credits;
      }
    } else {
      remainingCredits6.push(credits6[i]);  // Store remaining credits for Band D
    }
  }

  // Get BAND D (Remaining credits @ Level 6, up to 80 credits)
  let totalCreditsBandD = 0;
  let bandDcreditTotal = 0;

  for (let i = 0; i < remainingCredits6.length; i++) {
    if (totalCreditsBandD < 80) {
      const remainingCredits = Math.min(80 - totalCreditsBandD, remainingCredits6[i].credits);
      bandD.push({
        grade: remainingCredits6[i].grade,
        credits: remainingCredits,
      });
      bandDcreditTotal += remainingCredits6[i].grade * remainingCredits;
      totalCreditsBandD += remainingCredits;
    }
  }

  // Calculate weighted averages for each band
  const bandResults = {
    bandA: (bandAcreditTotal / totalCreditsBandA) * 50 / 100, // Top 80 @ Level 7
    bandB: (bandBcreditTotal / totalCreditsBandB) * 16.67 / 100, // Remaining 40 @ Level 7
    bandC: (bandCcreditTotal / totalCreditsBandC) * 16.66 / 100, // Top 40 @ Level 6
    bandD: (bandDcreditTotal / totalCreditsBandD) * 16.67 / 100, // Remaining 80 @ Level 6
  };

  // Calculate final weighted average
  const final = Math.round(
    (bandResults.bandA + bandResults.bandB + bandResults.bandC + bandResults.bandD) * 100
  ) / 100;

  // Calculate year averages for Y2 and Y3
  const y2Avg =
    Math.round(
      (lvl6.reduce((sum, module) => sum + module.grade * module.credits, 0) /
        lvl6.reduce((sum, module) => sum + module.credits, 0)) * 100
    ) / 100;

  const y3Avg =
    Math.round(
      (lvl7.reduce((sum, module) => sum + module.grade * module.credits, 0) /
        lvl7.reduce((sum, module) => sum + module.credits, 0)) * 100
    ) / 100;

  // Determine grade band
  let grade = "";
  if (final >= 70) {
    grade = "First Class Honours";
  } else if (final >= 60) {
    grade = "Upper Second Class Honours (2:1)";
  } else if (final >= 50) {
    grade = "Lower Second Class Honours (2:2)";
  } else if (final >= 40) {
    grade = "Third Class Honours";
  } else {
    grade = "Fail";
  }

  // Determine if upgrade applies
  let upgrade = false;
  const allModules = [...lvl6, ...lvl7];

  if (final >= 68 && final < 70) {
    const highGradeCredits =
      allModules.filter((mod) => mod.grade >= 70).reduce((sum, mod) => sum + mod.credits, 0);

    if (highGradeCredits >= 120) {
      upgrade = true;
      grade = "First Class Honours (1st) - Upgraded";
    }
  } else if (final >= 58 && final < 60) {
    const highGradeCredits =
      allModules.filter((mod) => mod.grade >= 60).reduce((sum, mod) => sum + mod.credits, 0);

    if (highGradeCredits >= 120) {
      upgrade = true;
      grade = "Upper Second Class Honours (2:1) - Upgraded";
    }
  } else if (final >= 48 && final < 50) {
    const highGradeCredits =
      allModules.filter((mod) => mod.grade >= 50).reduce((sum, mod) => sum + mod.credits, 0);

    if (highGradeCredits >= 120) {
      upgrade = true;
      grade = "Lower Second Class Honours (2:2) - Upgraded";
    }
  } else if (final >= 38 && final < 40) {
    const highGradeCredits =
      allModules.filter((mod) => mod.grade >= 40).reduce((sum, mod) => sum + mod.credits, 0);

    if (highGradeCredits >= 120) {
      upgrade = true;
      grade = "Third Class Honours (3rd) - Upgraded";
    }
  }

  const results = {
    final: final + "%",
    y2Avg: y2Avg + "%",
    y3Avg: y3Avg + "%",
    grade: grade,
    upgrade: upgrade ? "Yes" : "No",
  };

  return results;
};

export default calculateUndergraduate;
