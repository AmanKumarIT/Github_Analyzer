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
      "Connecting to GitHub servers...",
      "Scanning repositories...",
      "Reading README files...",
      "Analyzing commit history...",
      "Evaluating technical depth...",
      "Comparing with world-class developers...",
      "Generating AI recruiter verdict...",
    ];

    for (let i = 0; i < steps.length; i++) {
      setStage(steps[i]);
      setProgress((i + 1) * 14);
      await new Promise((r) => setTimeout(r, 700));
    }

    try {
      const res = await axios.post("http://localhost:5000/analyze", {
        profileUrl,
      });

      setData(res.data);
    } catch (err) {
      alert("Backend connection failed");
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
      <h1 className="title">AI GitHub Recruiter Analyzer</h1>

      {/* INPUT */}
      <div className="inputBox">
        <input
          placeholder="Paste GitHub profile link..."
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
        />
        <button onClick={analyze}>Analyze</button>
      </div>

      {/* LOADING */}
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

          {/* AI RECRUITER VERDICT */}
{data && data.aiReview && (
  <div className="card">
    <h2>AI Recruiter Verdict</h2>

    <div className="aiGrid">
      <div className="aiBox">
        <h3>Hiring Decision</h3>
        <p className="highlight">{data.aiReview?.decision}</p>
      </div>

      <div className="aiBox">
        <h3>Current Score</h3>
        <p className="highlight">{data.aiReview?.score}/100</p>
      </div>

      <div className="aiBox">
        <h3>Languages</h3>
        <p>{data.aiReview?.languages || "N/A"}</p>
      </div>
    </div>

    {/* Weakness */}
    <div className="aiSection">
      <h3>Key Weaknesses</h3>
      <ul>
        {(data.aiReview?.weaknesses || []).map((w, i) => (
          <li key={i}>• {w}</li>
        ))}
      </ul>
    </div>

    {/* Improvements */}
    <div className="aiSection">
      <h3>How to Improve</h3>
      <ul>
        {(data.aiReview?.improvements || []).map((i, idx) => (
          <li key={idx}>• {i}</li>
        ))}
      </ul>
    </div>

    {/* Next project */}
    <div className="aiSection">
      <h3>Best Project To Build Next</h3>
      <p className="nextProject">{data.aiReview?.nextProject}</p>
    </div>
  </div>
)}



          {/* WORLD COMPARISON */}
          <div className="card">
            <h2>Comparison with World-Class Developers</h2>

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
            <h2>How to Reach Top 1%</h2>
            <ul className="suggestions">
              {data.gapSuggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* BASIC SUGGESTIONS */}
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
