/**
 * A service for transforming text.
 */
export class TextTransformService {
    /**
     * Converts the given string to title case.
     * The string is first converted to lowercase, then each word is capitalized.
     *
     * @param name - The text string to transform.
     * @returns The text transformed to title case.
     */
    public static toTitleCase(name: string): string {
        return name
            .toLowerCase() // Ensure string is lowercase first
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}
