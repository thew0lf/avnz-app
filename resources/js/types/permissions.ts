/**
 * Represents a single permission entry in the system.
 */
export interface Permission {
    /** Unique identifier (stringified MongoDB ObjectId) */
    id: string;

    /** Human-readable name of the permission */
    name: string;

    /** Guard name (e.g. web, api) */
    guard_name: string;

    /** ISO timestamp when this permission was created */
    created_at: string;

    /** ISO timestamp when this permission was last updated */
    updated_at: string;
}
