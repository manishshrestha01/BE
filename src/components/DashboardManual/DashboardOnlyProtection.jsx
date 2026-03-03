import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const COPY_KEY_COMBOS = new Set(["a", "c", "x"]);

const isEditableTarget = (target) => {
  if (!(target instanceof HTMLElement)) return false;

  if (target.isContentEditable) return true;

  const editableSelector =
    'input, textarea, [contenteditable=""], [contenteditable="true"], [role="textbox"]';
  return Boolean(target.closest(editableSelector));
};

const isInsideScope = (scopeEl, event) => {
  if (!scopeEl) return false;
  if (!(event.target instanceof Node)) return false;
  return scopeEl.contains(event.target);
};

const DashboardOnlyProtection = ({ enabled, scopeRef }) => {
  const location = useLocation();

  useEffect(() => {
    const scopeEl = scopeRef?.current;

    if (!enabled || !location.pathname.startsWith("/dashboard") || !scopeEl) {
      return undefined;
    }

    const protectedScope = scopeEl.querySelector(".desktop-content") || scopeEl;

    const blockScopedEvent = (event) => {
      if (!isInsideScope(protectedScope, event)) return;
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
    };

    const blockScopedCopyShortcuts = (event) => {
      if (!isInsideScope(protectedScope, event)) return;
      if (isEditableTarget(event.target)) return;
      if (!event.ctrlKey && !event.metaKey) return;

      const key = String(event.key || "").toLowerCase();
      if (COPY_KEY_COMBOS.has(key)) {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", blockScopedCopyShortcuts, true);
    document.addEventListener("copy", blockScopedEvent, true);
    document.addEventListener("cut", blockScopedEvent, true);
    document.addEventListener("selectstart", blockScopedEvent, true);
    document.addEventListener("contextmenu", blockScopedEvent, true);
    document.addEventListener("dragstart", blockScopedEvent, true);

    return () => {
      document.removeEventListener("keydown", blockScopedCopyShortcuts, true);
      document.removeEventListener("copy", blockScopedEvent, true);
      document.removeEventListener("cut", blockScopedEvent, true);
      document.removeEventListener("selectstart", blockScopedEvent, true);
      document.removeEventListener("contextmenu", blockScopedEvent, true);
      document.removeEventListener("dragstart", blockScopedEvent, true);
    };
  }, [enabled, location.pathname, scopeRef]);

  return null;
};

export default DashboardOnlyProtection;
