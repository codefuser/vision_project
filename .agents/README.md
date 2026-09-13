# Antigravity Workspace Customizations & Agent Rules

This directory contains workspace-level agent instructions for **VersoLyn (Vision Projector)**.

---

## 🛑 MANDATORY WORKFLOW RULES FOR EVERY CODING TASK

Every agent operating in this workspace must strictly follow these rules:

1. **Inspect `.knowledge/README.md` First**:
   Before starting any task, check [`.knowledge/README.md`](file:///d:/VisionProject/Vision%20Projector/.knowledge/README.md) to locate the domain, key source files, and active stores.
2. **Use `quickLookup`**:
   Consult the `"quickLookup"` dictionary in [`.knowledge/knowledge-graph.json`](file:///d:/VisionProject/Vision%20Projector/.knowledge/knowledge-graph.json) to locate only the 2–4 files needed for the task.
3. **Selective Reading**:
   Read only the relevant domain documentation in `.knowledge/<domain>/README.md` and the identified source files.
4. **No Full Codebase Scans**:
   Do not perform wide, recursive directory scans unless the task explicitly requires an exhaustive audit.
5. **Check Blast Radius & Dependencies**:
   Before editing any file, inspect [`.knowledge/relationships/README.md`](file:///d:/VisionProject/Vision%20Projector/.knowledge/relationships/README.md) to verify what stores, components, wire messages, or popups depend on it.
6. **Automatic Post-Task Updates**:
   After completing a task, update the relevant `.knowledge/` files immediately without waiting for prompt instructions.
7. **Synchronize New Entities**:
   Add newly created files, components, stores, database tables, or features to `knowledge-graph.json` (`nodes`, `edges`, `quickLookup`) and the domain READMEs.
8. **Token Efficiency**:
   Keep the knowledge base concise, dense, and structured for fast, low-token retrieval.
9. **Never Duplicate Code**:
   Never paste full source files into `.knowledge/`. Store architecture, invariants, data shapes, and contracts.
10. **Persistent Memory**:
    Treat `.knowledge/` as the project's living, authoritative persistent memory.
