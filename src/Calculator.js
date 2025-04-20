import React, { useState, useRef, useEffect } from "react";
import "./styles.css";
import { calculateUndergraduate } from "./calculations";

export default function Calculator() {
  const [grades, setGrades] = useState({
    y2: [
      { credits: 15, grade: 30 }
    ],
    y3: [
      { credits: 15, grade: 30 }
    ],
  });

  const resultsRef = useRef(null);

  const [darkMode, setDarkMode] = useState(false);
  const [results, setResults] = useState({
    final: "0%",
    y2Avg: "0%",
    y3Avg: "0%",
    grade: "N/A",
    upgrade: "N/A",
  });

  const [error, setError] = useState(""); // New state for error message

  const [infoVisible, setInfoVisible] = useState(true);

  const addModule = (year) => {
    setGrades((prev) => ({
      ...prev,
      [year]: [...prev[year], { credits: 15, grade: 30 }],
    }));
  };

  useEffect(() => {
    document.title = "Swansea Grade Calculator";
  }, []);

  const removeModule = (year, index) => {
    setGrades((prev) => ({
      ...prev,
      [year]: prev[year].filter((_, i) => i !== index),
    }));
  };

  const updateModule = (year, index, field, value) => {
    const updatedModules = [...grades[year]];

    // If the input is empty, allow it to be empty (null or '')
    if (value === "") {
      updatedModules[index][field] = "";
    } else {
      updatedModules[index][field] = parseInt(value) || 0;
    }

    setGrades((prev) => ({ ...prev, [year]: updatedModules }));
  };

  const handleBlur = (year, index, field, value) => {
    const updatedModules = [...grades[year]];

    // Set defaults if input is empty string
  if (isNaN(value) || value === null || value === "") {
    if (field === "credits") {
      updatedModules[index][field] = 10;
    } else if (field === "grade") {
      updatedModules[index][field] = 30;
    }
  } else {
    // Otherwise apply the normal validation
    if (field === "credits" && value < 10) {
      updatedModules[index][field] = 10;
    } else if (field === "grade" && value < 30) {
      updatedModules[index][field] = 30;
    } else if (field === "credits" && value > 120) {
      updatedModules[index][field] = 120;
    } else if (field === "grade" && value > 100) {
      updatedModules[index][field] = 100;
    }
  }

    setGrades((prev) => ({ ...prev, [year]: updatedModules }));
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const clearModules = (year) => {
    setGrades((prev) => ({
      ...prev,
      [year]: [{ credits: 15, grade: 30 }],
    }));
  };

  const calculateGrades = () => {
    const y2Total = grades.y2.reduce(
      (sum, subject) => sum + subject.credits,
      0
    );
    const y3Total = grades.y3.reduce(
      (sum, subject) => sum + subject.credits,
      0
    );

    const defaultValue = {
      final: "0%",
      y2Avg: "0%",
      y3Avg: "0%",
      grade: "N/A",
      upgrade: "N/A",
    };

    // Error checking for total credits
    if (y2Total < 120 || y3Total < 120 || y3Total > 120 || y2Total > 120) {
      setError("Error: Year 2 and Year 3 must each have 120 credits.");
      setResults(defaultValue);
      return;
    } else {
      setError(""); // Clear error if valid
    }

    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }

    setResults(calculateUndergraduate(grades.y2, grades.y3));
  };

  useEffect(() => {
    // Toggle 'dark' class on body when darkMode changes
    if (darkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={`calculator-container ${darkMode ? "dark" : "light"}`}>
      {/* Theme Toggle */}
      <div className="theme-toggle">
        <button
          className={`theme-toggle-btn ${darkMode ? "dark-btn" : "light-btn"}`}
          onClick={toggleTheme}
        >
          {darkMode ? "🌞" : "🌙"}
        </button>
      </div>

      {/* Title */}
      <div className="title-box">
        <h1>Swansea University Degree Calculator</h1>
        <p className="subtitle">by Dafydd-Rhys Maund</p>
      </div>

      <div className="info-box-wrapper">
        <button
          className="toggle-info-btn"
          onClick={() => setInfoVisible(!infoVisible)}
        >
          {infoVisible ? "Hide Information Box" : "Show Information"}
        </button>
        {infoVisible && (
          <div className="info-box">
            <p>
              <strong>
                This is a non-official degree calculator for Swansea University
                and the results should not be considered definitive and are not
                for official use.
              </strong>
              <br />
              <br />
              It is designed for courses that adhere to the rules outset in this{" "}
              <a
                href="https://www.whatdotheyknow.com/request/undergraduate_degree_calculation/response/640870/attach/html/3/FOI%20Response%20151%2014%2015.pdf.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                FOI
              </a>{" "}
              request and the currently available information found{" "}
              <a
                href="https://myuni.swansea.ac.uk/academic-life/academic-regulations/undergraduate-award-regulations/ug-assessment-regs/ug-assessment-regs-section-3/"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              , please read '3.3 BORDERLINE CASES' for full context of 'Upgrade
              Eligibility'.
              <br /> <br />
              To retrieve module results, please refer to the{" "}
              <a
                href="https://intranet.swan.ac.uk/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Swansea University Intranet
              </a>
              . Enter your grades and relevant credits for Year 2 and Year 3
              modules to calculate your final degree grade based on the formula
              provided in the FOI response.
              <br /> <br />
              Unlike older solutions, this calculator handles differences in
              module credits, amount of modules and has working 'Upgrade
              Eligibility' functionality. You can add, remove or clear modules
              using the relevant buttons. It will also be capable of
              Postgraduate calculations once the formulas have been retrieved.
            </p>
            <p>
              Created by <strong>Dafydd-Rhys Maund (2003900)</strong> -{" "}
              <a
                href="https://github.com/dafydd-rhys"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>{" "}
              •{" "}
              <a
                href="https://www.linkedin.com/in/dafyddrhys/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Information Box */}

      <div className="dropdown-container">
        <label htmlFor="degree-type">Select Degree Type</label>
        <select id="degree-type" onChange={(e) => console.log(e.target.value)}>
          <option value="undergraduate">Undergraduate - Bachelors</option>
          <option value="masters">Undergraduate - Integrated Masters</option>
          <option value="masters">Postgraduate - Masters</option>
          <option value="phd">Postgraduate - PhD</option>
        </select>
      </div>

      {/* Year Sections */}
      <div className="year-sections-wrapper">
        {["y2", "y3"].map((year) => (
          <div className="year-section" key={year}>
            <div className="year-header">
              {year === "y2" ? "Year 2 - 120 Credits" : "Year 3 - 120 Credits"}
            </div>
            <div className="module-grid">
              {grades[year].map((module, index) => (
                <div className="module-card" key={index}>
                  <button
                    className="remove-btn"
                    onClick={() => removeModule(year, index)}
                  >
                    -
                  </button>
                  <h1 className="module-title">Module {index + 1}</h1>
                  <div className="module-fields">
                    <div className="form-group">
                      <label>Credits</label>
                      <input
                        type="number"
                        value={module.credits}
                        onChange={(e) =>
                          updateModule(year, index, "credits", e.target.value)
                        }
                        onBlur={(e) =>
                          handleBlur(
                            year,
                            index,
                            "credits",
                            parseInt(e.target.value)
                          )
                        }
                        min={15}
                        max={120}
                      />
                    </div>
                    <div className="form-group">
                      <label>Grade %</label>
                      <input
                        type="number"
                        value={module.grade === "" ? "" : module.grade}
                        onChange={(e) =>
                          updateModule(year, index, "grade", e.target.value)
                        }
                        onBlur={(e) =>
                          handleBlur(
                            year,
                            index,
                            "grade",
                            parseInt(e.target.value)
                          )
                        }
                        min={30}
                        max={100}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="module-buttons">
              <button className="add-btn" onClick={() => addModule(year)}>
                Add Module
              </button>
              <button className="clear-btn" onClick={() => clearModules(year)}>
                Clear Modules
              </button>
            </div>
          </div>
        ))}
        <div className="submit-container">
          {/* Error Message Display */}
          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="submit-container">
          <button className="submit-btn" onClick={calculateGrades}>
            Submit Results
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section" ref={resultsRef}>
        <div className="results-header">Results</div>
        <div className="results-body">
          <p>
            Final Grade:{" "}
            <span className="result-value">{results.final ?? "0%"}</span>
          </p>
          <p>
            Year 2 Average:{" "}
            <span className="result-value">{results.y2Avg ?? "0%"}</span>
          </p>
          <p>
            Year 3 Average:{" "}
            <span className="result-value">{results.y3Avg ?? "0%"}</span>
          </p>
          <p>
            Grade Decision:{" "}
            <span className="result-value">{results.grade || "N/A"}</span>
          </p>
          <p>
            Upgrade Eligibility:{" "}
            <span className="result-value">{results.upgrade || "N/A"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
