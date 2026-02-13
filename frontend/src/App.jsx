import { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function App() {
  const [profileUrl, setProfileUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [stage, setStage] = useState("");
  const [progress, setProgress] = useState(0);

  const analyze = async () => {
    if (!profileUrl.includes("github.com")) {
      alert("Enter valid GitHub profile link");
      return;
    }

    setLoading(true);
    setData(null);
    setProgress(0);

    const steps = [
      "Connecting to GitHub...",
      "Scanning repositories...",
      "Reading documentation...",
      "Analyzing commit activity...",
      "Evaluating project quality...",
      "Comparing with world-class developers...",
      "Generating final recruiter report...",
    ];

    for (let i = 0; i < steps.length; i++) {
      setStage(steps[i]);
      setProgress((i + 1) * 14);
      await new Promise((r) => setTimeout(r, 800));
    }

    try {
      const res = await axios.post("http://localhost:5000/analyze", {
        profileUrl,
      });
      setData(res.data);
    } catch {
      alert("Backend error");
    }

    setLoading(false);
  };

  const chartData = data
    ? {
        labels: ["Docs", "Consistency", "Impact", "Structure", "Depth"],
        datasets: [
          {
            label: "Score",
            data: [
              data.documentationScore,
              data.consistencyScore,
              data.impactScore,
              data.structureScore,
              data.depthScore,
            ],
            backgroundColor: [
              "#58a6ff",
              "#3fb950",
              "#f78166",
              "#d2a8ff",
              "#ffcd4a",
            ],
          },
        ],
      }
    : null;

  return (
    <div className="container">
      <h1 className="title">GitHub Portfolio Analyzer Pro</h1>

      {/* INPUT */}
      <div className="inputBox">
        <input
          placeholder="Paste GitHub profile link..."
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
        />
        <button onClick={analyze}>Analyze</button>
      </div>

      {/* LOADING UI */}
      {loading && (
        <div className="card">
          <h2>AI Evaluating Profile</h2>

          <div className="progressBar">
            <div
              className="progressFill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="stage">{stage}</p>

          <div className="scanBox">
            <div className="scanLine"></div>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {data && (
        <>
          {/* SCORE */}
          <div className="card">
            <h2>{data.username}'s Portfolio Score</h2>
            <div className="score">{data.totalScore}/100</div>
            <p>{data.repoCount} repositories analyzed</p>
          </div>

          {/* HIREABILITY */}
          <div className="card">
            <h2>Hireability Meter</h2>

            <div className="progressBar">
              <div
                className="progressFill"
                style={{ width: `${data.totalScore}%` }}
              ></div>
            </div>

            <h3 className="hireText">
              {data.totalScore < 40 && "🚨 Beginner"}
              {data.totalScore >= 40 && data.totalScore < 70 && "⚡ Improving"}
              {data.totalScore >= 70 && data.totalScore < 85 && "🔥 Internship Ready"}
              {data.totalScore >= 85 && "🏆 Recruiter Ready"}
            </h3>
          </div>

          {/* CHART */}
          <div className="card">
            <h2>Score Breakdown</h2>
            <Bar data={chartData} />
          </div>

          {/* WORLD COMPARISON */}
          <div className="card">
            <h2>Comparison with World-Class GitHub</h2>

            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>You</th>
                  <th>World Class</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(data.comparison).map((k, i) => (
                  <tr key={i}>
                    <td>{k.toUpperCase()}</td>
                    <td className="you">{data.comparison[k].user}</td>
                    <td className="world">{data.comparison[k].world}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* GAP IMPROVEMENTS */}
          <div className="card">
            <h2>How to Reach World-Class Level</h2>
            <ul className="suggestions">
              {data.gapSuggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* RECRUITER SUGGESTIONS */}
          <div className="card">
            <h2>Recruiter Suggestions</h2>
            <ul className="suggestions">
              {data.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
