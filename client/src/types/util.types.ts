export interface DateFormatOptions {
    month: 'numeric' | 'long' | 'short' | '2-digit'
    day: 'numeric' | '2-digit'
    year: 'numeric' | '2-digit'
    hour?: '2-digit'
    minute?: '2-digit'
    locale: string
}