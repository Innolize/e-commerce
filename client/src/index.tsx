import * as ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { sendToVercelAnalytics } from "./vitals";

ReactDOM.render(<App />, document.getElementById("root"));

reportWebVitals(sendToVercelAnalytics);
