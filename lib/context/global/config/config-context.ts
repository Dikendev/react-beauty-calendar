import { createContext } from "react";
import type { ConfigStore } from "./config-store";

const ConfigContext = createContext<ConfigStore | null>(null);

export default ConfigContext;
