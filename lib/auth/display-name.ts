/**
 * Derives display fields from a username. Until users fill in their profile,
 * we synthesise first/last name + initial from the handle:
 *
 *   - If the handle has a space, split on the first one:
 *       "John Doe" → first: "John", last: "Doe"
 *   - Otherwise, the whole handle is the first name and there is no last name.
 *
 *   - Initial = first letter of the first name, uppercased. Falls back to "?".
 *
 * Handles common separators inside handles ("john_doe", "john-doe") so the
 * displayed first name reads naturally rather than `john_doe`.
 */
export type DisplayName = {
  firstName: string;
  lastName: string | null;
  initial: string;
};

export function deriveDisplayName(username: string | null | undefined): DisplayName {
  if (!username) {
    return { firstName: "Guest", lastName: null, initial: "?" };
  }

  const trimmed = username.trim();
  if (!trimmed) {
    return { firstName: "Guest", lastName: null, initial: "?" };
  }

  let firstName: string;
  let lastName: string | null = null;

  if (/\s/.test(trimmed)) {
    const [first, ...rest] = trimmed.split(/\s+/);
    firstName = first;
    lastName = rest.length > 0 ? rest.join(" ") : null;
  } else {
    const parts = trimmed.split(/[_-]+/).filter(Boolean);
    firstName = parts[0] ?? trimmed;
    lastName = parts.length > 1 ? parts.slice(1).join(" ") : null;
  }

  const initial = firstName.charAt(0).toUpperCase() || "?";
  return { firstName, lastName, initial };
}
