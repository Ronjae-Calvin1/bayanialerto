import { useEffect, useState } from "react";
import { api } from "../api/client";
import { getCache, setCache, CACHE_KEYS } from "../offline/db";
import { useOnlineStatus } from "../offline/useOnlineStatus";
import type { HouseholdInput, PrepPlan } from "../types";

const DEFAULT_HOUSEHOLD: HouseholdInput = {
  household_size: 1,
  has_infant: false,
  has_elderly: false,
  has_pets: false,
  has_medical_needs: false,
};

export function Before() {
  const online = useOnlineStatus();
  const [household, setHousehold] = useState<HouseholdInput>(DEFAULT_HOUSEHOLD);
  const [plan, setPlan] = useState<PrepPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // On mount, try to load a previously cached plan so something shows offline.
  useEffect(() => {
    getCache<PrepPlan>(CACHE_KEYS.prepPlan).then((cached) => {
      if (cached) setPlan(cached);
    });
  }, []);

  async function generatePlan() {
    setLoading(true);
    setError(null);
    try {
      if (!online) throw new Error("Offline: showing last saved plan, if any.");
      const result = await api.getPrepPlan(household);
      setPlan(result);
      await setCache(CACHE_KEYS.prepPlan, result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Before the Typhoon</h1>

      <section>
        <h2>Personalized Prep Plan (AI)</h2>

        <label>
          Household size:{" "}
          <input
            type="number"
            min={1}
            value={household.household_size}
            onChange={(e) =>
              setHousehold({ ...household, household_size: Number(e.target.value) })
            }
          />
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={household.has_infant}
            onChange={(e) => setHousehold({ ...household, has_infant: e.target.checked })}
          />
          Has infant
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={household.has_elderly}
            onChange={(e) => setHousehold({ ...household, has_elderly: e.target.checked })}
          />
          Has elderly member
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={household.has_pets}
            onChange={(e) => setHousehold({ ...household, has_pets: e.target.checked })}
          />
          Has pets
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={household.has_medical_needs}
            onChange={(e) =>
              setHousehold({ ...household, has_medical_needs: e.target.checked })
            }
          />
          Has medical equipment/needs
        </label>
        <br />

        <button onClick={generatePlan} disabled={loading}>
          {loading ? "Generating..." : "Generate Prep Plan"}
        </button>

        {error && <p>{error}</p>}

        {plan && (
          <div>
            <h3>Your Checklist</h3>
            <ul>
              {plan.checklist.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            {plan.notes && <p>Note: {plan.notes}</p>}
          </div>
        )}
      </section>
    </div>
  );
}
