import { useState } from "react";

// Static, offline-first content — this is the decision-tree replacement for a chatbot.
// TODO: move this into a JSON file (e.g. src/data/situations.json) as content grows.
const SITUATIONS = [
  {
    id: "flooding",
    title: "Flooding in my house",
    steps: [
      "Turn off electricity at the breaker if water is rising.",
      "Move to higher ground or the upper floor.",
      "Do not walk or drive through floodwater.",
      "Call your barangay or MDRRMO for rescue if trapped.",
    ],
  },
  {
    id: "power-out",
    title: "Power is out",
    steps: [
      "Use flashlights, not candles.",
      "Unplug major appliances to avoid surge damage.",
      "Keep the refrigerator closed.",
      "Charge your phone from a power bank.",
    ],
  },
  {
    id: "injury",
    title: "Someone is injured",
    steps: [
      "Check for safety before approaching.",
      "Apply first aid if trained.",
      "Call emergency services if available.",
      "Keep the person warm and still.",
    ],
  },
  {
    id: "evacuate",
    title: "I need to evacuate",
    steps: [
      "Bring your go-bag and documents.",
      "Turn off electricity and gas before leaving.",
      "Go to the nearest evacuation center (see Map).",
      "Inform a family member or neighbor where you're going.",
    ],
  },
];

export function During() {
  const [selected, setSelected] = useState<string | null>(null);
  const situation = SITUATIONS.find((s) => s.id === selected);

  return (
    <div>
      <h1>During the Typhoon</h1>
      <p>This page works fully offline.</p>

      <h2>I need help with...</h2>
      <ul>
        {SITUATIONS.map((s) => (
          <li key={s.id}>
            <button onClick={() => setSelected(s.id)}>{s.title}</button>
          </li>
        ))}
      </ul>

      {situation && (
        <div>
          <h3>{situation.title}</h3>
          <ol>
            {situation.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
