"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  /** Optional leading icon or emoji rendered before the label. */
  icon?: ReactNode;
  /** Optional secondary text shown after the label. */
  hint?: string;
  disabled?: boolean;
};

type SelectProps<T extends string = string> = {
  value: T | null;
  onChange: (value: T | null) => void;
  options: ReadonlyArray<SelectOption<T>>;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  /** Render a leading "no selection" row so users can clear the value. */
  clearable?: boolean;
  clearLabel?: string;
  /** Extra classes for the trigger button. */
  className?: string;
  /** Trigger height preset. Defaults to a 44px touch target. */
  size?: "sm" | "md";
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

type PanelBox = { top: number; left: number; width: number; maxHeight: number };

/**
 * Accessible, token-driven dropdown built on the project's proven portal +
 * listbox pattern. Keyboard support: Arrow keys, Home/End, Enter/Space,
 * Escape, and type-ahead. Replaces native `<select>` for a consistent,
 * smooth UI across the app.
 */
export function Select<T extends string = string>({
  value,
  onChange,
  options,
  placeholder = "Select…",
  id,
  disabled = false,
  clearable = false,
  clearLabel = "None",
  className,
  size = "md",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: SelectProps<T>) {
  const reactId = useId();
  const listboxId = `${id ?? reactId}-listbox`;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [panelBox, setPanelBox] = useState<PanelBox | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const typeaheadRef = useRef<{ query: string; at: number }>({
    query: "",
    at: 0,
  });

  // Build the navigable rows (optional clear row first), keeping a stable
  // index → value map for keyboard navigation and selection.
  const rows: { value: T | null; label: string; option?: SelectOption<T> }[] = [
    ...(clearable ? [{ value: null, label: clearLabel }] : []),
    ...options.map((o) => ({ value: o.value, label: o.label, option: o })),
  ];

  const selectedOption = options.find((o) => o.value === value) ?? null;
  const selectedRowIndex = rows.findIndex((r) => r.value === value);

  const updatePanelPosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const margin = 8;
    const maxHeight = Math.max(
      140,
      Math.min(288, window.innerHeight - r.bottom - margin * 2),
    );
    setPanelBox({ top: r.bottom + 6, left: r.left, width: r.width, maxHeight });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setPanelBox(null);
      return;
    }
    updatePanelPosition();
  }, [open, updatePanelPosition]);

  useEffect(() => {
    if (!open) return;
    const onReposition = () => updatePanelPosition();
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open, updatePanelPosition]);

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  // When opening, focus the listbox and highlight the current selection.
  useEffect(() => {
    if (!open) return;
    const initial = selectedRowIndex >= 0 ? selectedRowIndex : 0;
    setActiveIndex(initial);
    const raf = requestAnimationFrame(() => panelRef.current?.focus());
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  function openMenu() {
    if (disabled) return;
    setOpen(true);
  }

  function closeMenu(returnFocus = true) {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }

  function commit(index: number) {
    const row = rows[index];
    if (!row || row.option?.disabled) return;
    onChange(row.value);
    closeMenu();
  }

  function moveActive(delta: number) {
    setActiveIndex((prev) => {
      const len = rows.length;
      if (len === 0) return -1;
      let next = prev;
      for (let i = 0; i < len; i++) {
        next = (next + delta + len) % len;
        if (!rows[next]?.option?.disabled) return next;
      }
      return prev;
    });
  }

  function handleTypeahead(char: string) {
    const now = Date.now();
    const state = typeaheadRef.current;
    state.query = now - state.at > 700 ? char : state.query + char;
    state.at = now;
    const q = state.query.toLowerCase();
    const idx = rows.findIndex(
      (r) => !r.option?.disabled && r.label.toLowerCase().startsWith(q),
    );
    if (idx >= 0) setActiveIndex(idx);
  }

  function onTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (
      e.key === "ArrowDown" ||
      e.key === "ArrowUp" ||
      e.key === "Enter" ||
      e.key === " "
    ) {
      e.preventDefault();
      openMenu();
    }
  }

  function onPanelKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(rows.findIndex((r) => !r.option?.disabled));
        break;
      case "End":
        e.preventDefault();
        for (let i = rows.length - 1; i >= 0; i--) {
          if (!rows[i]?.option?.disabled) {
            setActiveIndex(i);
            break;
          }
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeIndex >= 0) commit(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        closeMenu();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        if (e.key.length === 1) handleTypeahead(e.key);
    }
  }

  const heightClass = size === "sm" ? "h-10" : "h-11";
  const activeId =
    activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined;

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => (open ? closeMenu(false) : openMenu())}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl border border-input bg-background px-3.5 text-left text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60",
          heightClass,
          className,
        )}
      >
        <span
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 truncate",
            selectedOption ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {selectedOption?.icon ? (
            <span className="shrink-0" aria-hidden>
              {selectedOption.icon}
            </span>
          ) : null}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronsUpDown
          className="size-4 shrink-0 text-muted-foreground opacity-70"
          aria-hidden
        />
      </button>

      {open && panelBox
        ? createPortal(
            <div
              ref={panelRef}
              id={listboxId}
              role="listbox"
              tabIndex={-1}
              aria-activedescendant={activeId}
              onKeyDown={onPanelKeyDown}
              className="animate-popover fixed z-[80] overflow-y-auto overscroll-contain rounded-xl border border-border bg-popover p-1 shadow-card-hover outline-none"
              style={{
                top: panelBox.top,
                left: panelBox.left,
                width: panelBox.width,
                maxHeight: panelBox.maxHeight,
              }}
            >
              {rows.map((row, idx) => {
                const isSelected = row.value === value;
                const isActive = idx === activeIndex;
                const isDisabled = row.option?.disabled ?? false;
                return (
                  <div
                    key={row.value ?? "__clear__"}
                    ref={(el) => {
                      optionRefs.current[idx] = el;
                    }}
                    id={`${listboxId}-opt-${idx}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={isDisabled || undefined}
                    onMouseEnter={() => !isDisabled && setActiveIndex(idx)}
                    onClick={() => commit(idx)}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      isActive && !isDisabled && "bg-muted",
                      isSelected && "font-semibold text-primary",
                      isDisabled && "cursor-not-allowed opacity-40",
                      !row.value && !isSelected && "text-muted-foreground",
                    )}
                  >
                    {row.option?.icon ? (
                      <span className="shrink-0" aria-hidden>
                        {row.option.icon}
                      </span>
                    ) : null}
                    <span className="min-w-0 flex-1 truncate">{row.label}</span>
                    {row.option?.hint ? (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {row.option.hint}
                      </span>
                    ) : null}
                    {isSelected ? (
                      <Check className="size-4 shrink-0 text-primary" aria-hidden />
                    ) : null}
                  </div>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
