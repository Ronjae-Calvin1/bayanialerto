import { useState } from "react";
import { api } from "../api/client";
import { useOnlineStatus } from "../offline/useOnlineStatus";

const RECOVERY_STEPS = [
  "Check your home for structural damage before entering.",
  "Avoid downed power lines and report them.",
  "Document damage with photos for insurance/relief applications.",
  "Boil water before drinking if supply may be contaminated.",
  "Check on neighbors, especially elderly or disabled residents.",
];

export function After() {
  const online = useOnlineStatus();
  const [description, setDescription] = useState("");
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function draftReport() {
    setLoading(true);
    try {
      const result = await api.ask(description, "after"); // backbone: reuses ask endpoint as placeholder
      setReport(result.answer);
    } catch {
      setReport("Could not generate report (offline or backend unavailable). Your description is saved below.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>After the Typhoon</h1>

      <section>
        <h2>Recovery Checklist</h2>
        <ul>
          {RECOVERY_STEPS.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Damage Report Drafter (AI)</h2>
        <p>Status: {online ? "Online" : "Offline — draft will be saved locally, generate later"}</p>
        <textarea
          rows={5}
          cols={50}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what happened, in your own words..."
        />
        <br />
        <button onClick={draftReport} disabled={loading || !description}>
          {loading ? "Drafting..." : "Draft Report"}
        </button>

        {report && (
          <div>
            <h3>Draft</h3>
            <pre>{report}</pre>
          </div>
        )}
      </section>
    </div>
  );
}
