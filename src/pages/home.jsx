import { useState } from "react";
import Navbar from "../components/nav";
import Hero from "../components/hero";

function Home() {
  const [latestData, setLatestData] = useState({
    latest_page: null,
    latest_group: null,
  });

  return (
    <div className="hide-scrollbar">
      <Navbar onLatestDataFetched={setLatestData} />
      <Hero
        latestPage={latestData.latest_page}
        latestGroup={latestData.latest_group}
      />
    </div>
  );
}

export default Home;
