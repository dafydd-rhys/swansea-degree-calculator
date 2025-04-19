// calculations.js
export const calculateUndergraduate = (y2, y3) => {
  const splitY2 = split(y2);
  const splitY3 = split(y3);

  // Now call totalCreditVal with the split arrays to calculate results
  return totalCreditVal(splitY3, splitY2);
};

const split = (yearData) => {
  let splitModules = [];

  yearData.forEach((module) => {
    const creditChunks = module.credits / 15;

    if (creditChunks >= 1 && module.credits % 15 === 0) {
      for (let i = 0; i < creditChunks; i++) {
        splitModules.push({ grade: module.grade });
      }
    } else {
      splitModules.push(module);
    }
  });

  return splitModules;
};

const totalCreditVal = (lvl7, lvl6) => {
  let credits6 = [];
  let credits7 = [];
  let bandA = [];
  let bandB = [];
  let bandC = [];
  let bandD = [];

  // LEVEL 7 (Y3)
  lvl7.forEach((module) => {
    credits7.push(creditValue(module.grade)); // Calculate credit value based on grade
  });

  credits7.sort((a, b) => b - a);

  // Get BAND A (Top 80 @ Level 7)
  for (let i = 0; i < 5; i++) {
    bandA.push(credits7[i]);
  }
  bandA.push((credits7[5] / 15) * 5);

  // Get BAND B (Remaining 40 @ Level 7)
  for (let i = 6; i < 8; i++) {
    bandB.push(credits7[i]);
  }
  bandB.push((credits7[5] / 15) * 10);

  // LEVEL 6 (Y2)
  lvl6.forEach((module) => {
    credits6.push(creditValue(module.grade));
  });

  credits6.sort((a, b) => b - a);

  // Get BAND C (Top 40 @ Level 6)
  for (let i = 0; i < 2; i++) {
    bandC.push(credits6[i]);
  }
  bandC.push((credits6[2] / 15) * 10);

  // Get BAND D (Remaining 40 @ Level 6)
  for (let i = 3; i < 8; i++) {
    bandD.push(credits6[i]);
  }
  bandD.push((credits6[2] / 15) * 5);

  // Calculate and set final band values
  const bandResults = {
    bandA: bandCalculate(bandA, 50, 80),
    bandB: bandCalculate(bandB, 16.67, 40),
    bandC: bandCalculate(bandC, 16.66, 40),
    bandD: bandCalculate(bandD, 16.67, 80),
  };

  const final =
    Math.round(
      (bandResults.bandA +
        bandResults.bandB +
        bandResults.bandC +
        bandResults.bandD) *
        1000
    ) / 1000;
  const y2Avg =
    Math.round(
      (lvl6.reduce((sum, module) => sum + module.grade, 0) / lvl6.length) * 1000
    ) / 1000;
  const y3Avg =
    Math.round(
      (lvl7.reduce((sum, module) => sum + module.grade, 0) / lvl7.length) * 1000
    ) / 1000;
    
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

  let upgrade = false;
  const allModules = [...lvl6, ...lvl7];

  if (final >= 68 && final < 70) {
    const highGradeCredits =
      allModules.filter((mod) => mod.grade >= 70).length * 15;

    if (highGradeCredits >= 120) {
      upgrade = true;
      grade = "First Class Honours (1st) - Upgraded";
    }
  } else if (final >= 58 && final < 60) {
    const highGradeCredits =
      allModules.filter((mod) => mod.grade >= 60).length * 15;

    if (highGradeCredits >= 120) {
      upgrade = true;
      grade = "Upper Second Class Honours (2:1) - Upgraded";
    }
  } else if (final >= 48 && final < 50) {
    const highGradeCredits =
      allModules.filter((mod) => mod.grade >= 50).length * 15;

    if (highGradeCredits >= 120) {
      upgrade = true;
      grade = "Lower Second Class Honours (2:2) - Upgraded";
    }
  } else if (final >= 38 && final < 40) {
    const highGradeCredits =
      allModules.filter((mod) => mod.grade >= 40).length * 15;

    if (highGradeCredits >= 120) {
      upgrade = true;
      grade = "Third Class Honours (3rd) - Upgraded";
    }
  }

  const results = {
    final: final + "%",
    y2Avg: y2Avg,
    y3Avg: y3Avg,
    grade: grade,
    upgrade: upgrade ? "Yes" : "No",
  };

  return results;
};

const creditValue = (grade) => {
  return grade * 15; 
};

const bandCalculate = (band, multiplier, credits) => {
  let total = 0;
  band.forEach((mod) => {
    total += mod;
  });
  total = ((total / credits) * multiplier) / 100;
  return total;
};

export default calculateUndergraduate;
