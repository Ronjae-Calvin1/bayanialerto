import { Link } from "react-router-dom";
import { useOnlineStatus } from "../offline/useOnlineStatus";

export function Home() {
  const online = useOnlineStatus();

  return (
    <div>
      <h1>Typhoon Prep</h1>
      <p>Status: {online ? "Online" : "Offline (using cached data)"}</p>

      <nav>
        <ul>
          <li><Link to="/before">Before</Link></li>
          <li><Link to="/during">During</Link></li>
          <li><Link to="/after">After</Link></li>
          <li><Link to="/map">Map (clinics, hospitals, evacuation centers)</Link></li>
          <li><Link to="/weather">Weather &amp; Warnings</Link></li>
        </ul>
      </nav>
    </div>
  );
}
