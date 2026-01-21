import PC from "./PC.jsx";
import Mobile from "./Mobile.jsx";

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const isMobile = params.get("mobile");

  return isMobile ? <Mobile /> : <PC />;
}
