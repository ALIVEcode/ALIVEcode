import { AsScript } from "../../../Models/AsScript/as-script.entity";

export type AsScriptProps = {
	asScript: AsScript;
	onSave: (asScript: AsScript) => void;
};