export const StringUtils = {
    capitalize(text: string): string {
        const firstLetter = this.returnFirstChar(text);
        return `${firstLetter}${text.slice(1, text.length)}`;
    },

    returnFirstChar(text: string): string {
        return text.charAt(0).toUpperCase();
    },
};
