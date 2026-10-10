import { mountShell } from "../shared/ui.js";
import { mountModePage } from "../steal/shell.js";

mountShell({ active: "steal", title: "Steal — Normal Flow" });
mountModePage("normal");
