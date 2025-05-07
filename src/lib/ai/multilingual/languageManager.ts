/**
 * Language Management System for Multilingual Support
 */

import { auditLogger } from "../../auth/audit";

export interface Language {
  code: string; // ISO 639-1 language code (e.g., 'en', 'es', 'fr')
  name: string; // Language name in English
  localName: string; // Language name in its own language
  direction: "ltr" | "rtl"; // Text direction
  enabled: boolean; // Whether the language is enabled in the system
  supportLevel: "full" | "partial" | "machine"; // Level of support
}

export interface Region {
  code: string; // ISO 3166-1 alpha-2 country code
  name: string; // Region name in English
  languages: string[]; // ISO 639-1 language codes supported in this region
  defaultLanguage: string; // Default language for this region
  dateFormat: string; // Date format (e.g., 'MM/DD/YYYY', 'DD/MM/YYYY')
  timeFormat: string; // Time format (e.g., '12h', '24h')
  numberFormat: {
    decimal: string; // Decimal separator
    thousands: string; // Thousands separator
    currencySymbol: string; // Currency symbol
    currencyCode: string; // ISO 4217 currency code
    symbolPosition: "before" | "after"; // Position of currency symbol
  };
}

export interface TranslationOptions {
  interpolation?: Record<string, string>; // Values to interpolate into the translation
  context?: string; // Context for disambiguation
  count?: number; // For pluralization
  fallbackLanguage?: string; // Fallback language if translation is missing
  formatParams?: Record<string, any>; // Parameters for formatting (dates, numbers, etc.)
  returnDetails?: boolean; // Whether to return details about the translation process
}

export interface TranslationResult {
  text: string; // The translated text
  details?: {
    sourceLanguage: string;
    targetLanguage: string;
    usedFallback: boolean;
    machineTranslated: boolean;
    confidence: number; // 0-1 confidence score for machine translation
    missingKeys: string[];
  };
}

export interface UserLanguagePreferences {
  userId: string;
  primaryLanguage: string;
  secondaryLanguages: string[];
  region: string;
  dateFormat?: string; // Override region default
  timeFormat?: string; // Override region default
  useRegionalFormats: boolean;
  lastUpdated: Date;
}

class LanguageManager {
  private languages = new Map<string, Language>();
  private regions = new Map<string, Region>();
  private translations = new Map<string, Record<string, string>>();
  private userPreferences = new Map<string, UserLanguagePreferences>();
  private storageKey = "captivite_language_preferences";
  private defaultLanguage = "en";
  private defaultRegion = "US";

  constructor() {
    // Initialize with default languages and regions
    this.initializeDefaultLanguages();
    this.initializeDefaultRegions();

    // Load user preferences from localStorage in browser environment
    if (typeof window !== "undefined") {
      try {
        const storedPreferences = localStorage.getItem(this.storageKey);
        if (storedPreferences) {
          const parsedPreferences = JSON.parse(storedPreferences);
          Object.entries(parsedPreferences).forEach(
            ([userId, prefs]: [string, any]) => {
              // Convert string dates back to Date objects
              prefs.lastUpdated = new Date(prefs.lastUpdated);
              this.userPreferences.set(
                userId,
                prefs as UserLanguagePreferences,
              );
            },
          );
        }
      } catch (error) {
        console.error(
          "Failed to load language preferences from storage:",
          error,
        );
      }
    }
  }

  /**
   * Initialize default supported languages
   */
  private initializeDefaultLanguages(): void {
    const defaultLanguages: Language[] = [
      {
        code: "en",
        name: "English",
        localName: "English",
        direction: "ltr",
        enabled: true,
        supportLevel: "full",
      },
      {
        code: "es",
        name: "Spanish",
        localName: "Español",
        direction: "ltr",
        enabled: true,
        supportLevel: "full",
      },
      {
        code: "fr",
        name: "French",
        localName: "Français",
        direction: "ltr",
        enabled: true,
        supportLevel: "full",
      },
      {
        code: "de",
        name: "German",
        localName: "Deutsch",
        direction: "ltr",
        enabled: true,
        supportLevel: "full",
      },
      {
        code: "zh",
        name: "Chinese (Simplified)",
        localName: "中文",
        direction: "ltr",
        enabled: true,
        supportLevel: "partial",
      },
      {
        code: "ja",
        name: "Japanese",
        localName: "日本語",
        direction: "ltr",
        enabled: true,
        supportLevel: "partial",
      },
      {
        code: "ar",
        name: "Arabic",
        localName: "العربية",
        direction: "rtl",
        enabled: true,
        supportLevel: "partial",
      },
      {
        code: "pt",
        name: "Portuguese",
        localName: "Português",
        direction: "ltr",
        enabled: true,
        supportLevel: "full",
      },
      {
        code: "ru",
        name: "Russian",
        localName: "Русский",
        direction: "ltr",
        enabled: true,
        supportLevel: "partial",
      },
      {
        code: "hi",
        name: "Hindi",
        localName: "हिन्दी",
        direction: "ltr",
        enabled: true,
        supportLevel: "machine",
      },
    ];

    // Add languages to the map
    defaultLanguages.forEach((lang) => {
      this.languages.set(lang.code, lang);
    });
  }

  /**
   * Initialize default regions
   */
  private initializeDefaultRegions(): void {
    const defaultRegions: Region[] = [
      {
        code: "US",
        name: "United States",
        languages: ["en", "es"],
        defaultLanguage: "en",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12h",
        numberFormat: {
          decimal: ".",
          thousands: ",",
          currencySymbol: "$",
          currencyCode: "USD",
          symbolPosition: "before",
        },
      },
      {
        code: "GB",
        name: "United Kingdom",
        languages: ["en"],
        defaultLanguage: "en",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h",
        numberFormat: {
          decimal: ".",
          thousands: ",",
          currencySymbol: "£",
          currencyCode: "GBP",
          symbolPosition: "before",
        },
      },
      {
        code: "FR",
        name: "France",
        languages: ["fr"],
        defaultLanguage: "fr",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h",
        numberFormat: {
          decimal: ",",
          thousands: " ",
          currencySymbol: "€",
          currencyCode: "EUR",
          symbolPosition: "after",
        },
      },
      {
        code: "DE",
        name: "Germany",
        languages: ["de"],
        defaultLanguage: "de",
        dateFormat: "DD.MM.YYYY",
        timeFormat: "24h",
        numberFormat: {
          decimal: ",",
          thousands: ".",
          currencySymbol: "€",
          currencyCode: "EUR",
          symbolPosition: "after",
        },
      },
      {
        code: "JP",
        name: "Japan",
        languages: ["ja"],
        defaultLanguage: "ja",
        dateFormat: "YYYY/MM/DD",
        timeFormat: "24h",
        numberFormat: {
          decimal: ".",
          thousands: ",",
          currencySymbol: "¥",
          currencyCode: "JPY",
          symbolPosition: "before",
        },
      },
      {
        code: "CN",
        name: "China",
        languages: ["zh"],
        defaultLanguage: "zh",
        dateFormat: "YYYY/MM/DD",
        timeFormat: "24h",
        numberFormat: {
          decimal: ".",
          thousands: ",",
          currencySymbol: "¥",
          currencyCode: "CNY",
          symbolPosition: "before",
        },
      },
      {
        code: "BR",
        name: "Brazil",
        languages: ["pt"],
        defaultLanguage: "pt",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h",
        numberFormat: {
          decimal: ",",
          thousands: ".",
          currencySymbol: "R$",
          currencyCode: "BRL",
          symbolPosition: "before",
        },
      },
      {
        code: "IN",
        name: "India",
        languages: ["en", "hi"],
        defaultLanguage: "en",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "12h",
        numberFormat: {
          decimal: ".",
          thousands: ",",
          currencySymbol: "₹",
          currencyCode: "INR",
          symbolPosition: "before",
        },
      },
    ];

    // Add regions to the map
    defaultRegions.forEach((region) => {
      this.regions.set(region.code, region);
    });
  }

  /**
   * Get all available languages
   */
  getLanguages(enabledOnly: boolean = true): Language[] {
    const allLanguages = Array.from(this.languages.values());
    return enabledOnly
      ? allLanguages.filter((lang) => lang.enabled)
      : allLanguages;
  }

  /**
   * Get all available regions
   */
  getRegions(): Region[] {
    return Array.from(this.regions.values());
  }

  /**
   * Get a specific language by code
   */
  getLanguage(code: string): Language | undefined {
    return this.languages.get(code);
  }

  /**
   * Get a specific region by code
   */
  getRegion(code: string): Region | undefined {
    return this.regions.get(code);
  }

  /**
   * Set or update user language preferences
   */
  async setUserPreferences(
    preferences: Partial<UserLanguagePreferences> & { userId: string },
  ): Promise<UserLanguagePreferences> {
    // Get existing preferences or create new ones
    const existingPrefs = this.userPreferences.get(preferences.userId) || {
      userId: preferences.userId,
      primaryLanguage: this.defaultLanguage,
      secondaryLanguages: [],
      region: this.defaultRegion,
      useRegionalFormats: true,
      lastUpdated: new Date(),
    };

    // Update with new preferences
    const updatedPrefs: UserLanguagePreferences = {
      ...existingPrefs,
      ...preferences,
      lastUpdated: new Date(),
    };

    // Validate language and region
    if (!this.languages.has(updatedPrefs.primaryLanguage)) {
      updatedPrefs.primaryLanguage = this.defaultLanguage;
    }

    if (!this.regions.has(updatedPrefs.region)) {
      updatedPrefs.region = this.defaultRegion;
    }

    // Filter out invalid secondary languages
    updatedPrefs.secondaryLanguages = updatedPrefs.secondaryLanguages.filter(
      (lang) =>
        this.languages.has(lang) && lang !== updatedPrefs.primaryLanguage,
    );

    // Save updated preferences
    this.userPreferences.set(updatedPrefs.userId, updatedPrefs);
    this.persistPreferences();

    // Log the update
    await auditLogger.log({
      userId: updatedPrefs.userId,
      action: "language_preferences_updated",
      resource: "language",
      details: {
        primaryLanguage: updatedPrefs.primaryLanguage,
        region: updatedPrefs.region,
      },
      status: "success",
    });

    return updatedPrefs;
  }

  /**
   * Get user language preferences
   */
  getUserPreferences(userId: string): UserLanguagePreferences {
    // Return existing preferences or default ones
    return (
      this.userPreferences.get(userId) || {
        userId,
        primaryLanguage: this.defaultLanguage,
        secondaryLanguages: [],
        region: this.defaultRegion,
        useRegionalFormats: true,
        lastUpdated: new Date(),
      }
    );
  }

  /**
   * Detect language from text
   */
  async detectLanguage(
    text: string,
  ): Promise<{ code: string; confidence: number }> {
    // In a real implementation, this would use a proper language detection service
    // This is a simplified version for demonstration purposes

    // Simple language detection based on character sets and common words
    const langScores: Record<string, number> = {};

    // Initialize scores for supported languages
    this.languages.forEach((lang) => {
      langScores[lang.code] = 0;
    });

    // Check for language-specific characters
    if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text)) {
      // Japanese/Chinese characters
      langScores.ja += 0.5;
      langScores.zh += 0.5;
    }

    if (/[\u0600-\u06FF]/.test(text)) {
      // Arabic characters
      langScores.ar += 0.8;
    }

    if (/[\u0900-\u097F]/.test(text)) {
      // Hindi characters
      langScores.hi += 0.8;
    }

    if (/[\u0400-\u04FF]/.test(text)) {
      // Cyrillic characters (Russian)
      langScores.ru += 0.8;
    }

    // Check for common words in different languages
    const commonWords: Record<string, string[]> = {
      en: ["the", "is", "and", "of", "to", "in", "that", "it", "with", "for"],
      es: ["el", "la", "de", "que", "y", "en", "un", "ser", "se", "no"],
      fr: ["le", "la", "de", "et", "à", "en", "un", "être", "que", "pour"],
      de: ["der", "die", "das", "und", "zu", "in", "den", "mit", "ist", "für"],
      pt: ["o", "a", "de", "que", "e", "em", "um", "para", "com", "não"],
      // Add more languages as needed
    };

    const words = text.toLowerCase().split(/\s+/);

    // Count occurrences of common words for each language
    Object.entries(commonWords).forEach(([lang, wordList]) => {
      const matches = words.filter((word) => wordList.includes(word));
      if (matches.length > 0) {
        langScores[lang] += (matches.length / wordList.length) * 0.5;
      }
    });

    // Find the language with the highest score
    let bestLang = this.defaultLanguage;
    let bestScore = 0.1; // Default minimal score

    Object.entries(langScores).forEach(([lang, score]) => {
      if (score > bestScore) {
        bestLang = lang;
        bestScore = score;
      }
    });

    // If no clear winner, default to English
    if (bestScore < 0.2) {
      bestLang = this.defaultLanguage;
      bestScore = 0.3; // Low confidence
    }

    return { code: bestLang, confidence: Math.min(bestScore, 1.0) };
  }

  /**
   * Translate text to the target language
   */
  async translate(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string,
    options: TranslationOptions = {},
  ): Promise<TranslationResult> {
    // In a real implementation, this would use a proper translation service
    // This is a simplified version for demonstration purposes

    // If source language is not provided, detect it
    if (!sourceLanguage) {
      const detection = await this.detectLanguage(text);
      sourceLanguage = detection.code;
    }

    // If source and target are the same, return the original text
    if (sourceLanguage === targetLanguage) {
      return {
        text,
        details: options.returnDetails
          ? {
              sourceLanguage,
              targetLanguage,
              usedFallback: false,
              machineTranslated: false,
              confidence: 1.0,
              missingKeys: [],
            }
          : undefined,
      };
    }

    // Check if we have translations for this language pair
    const translationKey = `${sourceLanguage}_${targetLanguage}`;
    const translations = this.translations.get(translationKey);

    // If we have a direct translation for this text
    if (translations && translations[text]) {
      let translatedText = translations[text];

      // Handle interpolation if needed
      if (options.interpolation) {
        Object.entries(options.interpolation).forEach(([key, value]) => {
          translatedText = translatedText.replace(
            new RegExp(`{{${key}}}`, "g"),
            value,
          );
        });
      }

      return {
        text: translatedText,
        details: options.returnDetails
          ? {
              sourceLanguage,
              targetLanguage,
              usedFallback: false,
              machineTranslated: false,
              confidence: 1.0,
              missingKeys: [],
            }
          : undefined,
      };
    }

    // Try fallback language if specified
    if (
      options.fallbackLanguage &&
      options.fallbackLanguage !== sourceLanguage
    ) {
      const fallbackKey = `${options.fallbackLanguage}_${targetLanguage}`;
      const fallbackTranslations = this.translations.get(fallbackKey);

      if (fallbackTranslations && fallbackTranslations[text]) {
        let translatedText = fallbackTranslations[text];

        // Handle interpolation if needed
        if (options.interpolation) {
          Object.entries(options.interpolation).forEach(([key, value]) => {
            translatedText = translatedText.replace(
              new RegExp(`{{${key}}}`, "g"),
              value,
            );
          });
        }

        return {
          text: translatedText,
          details: options.returnDetails
            ? {
                sourceLanguage,
                targetLanguage,
                usedFallback: true,
                machineTranslated: false,
                confidence: 0.8,
                missingKeys: [],
              }
            : undefined,
        };
      }
    }

    // If no translation is available, use machine translation simulation
    // In a real implementation, this would call an actual translation API
    const machineTranslatedText = this.simulateMachineTranslation(
      text,
      sourceLanguage,
      targetLanguage,
    );

    return {
      text: machineTranslatedText,
      details: options.returnDetails
        ? {
            sourceLanguage,
            targetLanguage,
            usedFallback: false,
            machineTranslated: true,
            confidence: 0.6,
            missingKeys: [text],
          }
        : undefined,
    };
  }

  /**
   * Format a date according to user preferences
   */
  formatDate(date: Date, userId: string, format?: string): string {
    const prefs = this.getUserPreferences(userId);
    const region = this.getRegion(prefs.region);

    // Determine format to use
    let dateFormat = format;
    if (!dateFormat) {
      if (prefs.dateFormat) {
        dateFormat = prefs.dateFormat;
      } else if (region && prefs.useRegionalFormats) {
        dateFormat = region.dateFormat;
      } else {
        dateFormat = "MM/DD/YYYY"; // Default fallback
      }
    }

    // In a real implementation, this would use a proper date formatting library
    // This is a simplified version for demonstration purposes
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    let formattedDate = dateFormat
      .replace("DD", day)
      .replace("MM", month)
      .replace("YYYY", year.toString());

    return formattedDate;
  }

  /**
   * Format a time according to user preferences
   */
  formatTime(date: Date, userId: string, format?: string): string {
    const prefs = this.getUserPreferences(userId);
    const region = this.getRegion(prefs.region);

    // Determine format to use
    let timeFormat = format;
    if (!timeFormat) {
      if (prefs.timeFormat) {
        timeFormat = prefs.timeFormat;
      } else if (region && prefs.useRegionalFormats) {
        timeFormat = region.timeFormat;
      } else {
        timeFormat = "12h"; // Default fallback
      }
    }

    // In a real implementation, this would use a proper time formatting library
    // This is a simplified version for demonstration purposes
    const hours24 = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    if (timeFormat === "24h") {
      return `${hours24.toString().padStart(2, "0")}:${minutes}`;
    } else {
      // 12-hour format
      const hours12 = hours24 % 12 || 12;
      const ampm = hours24 < 12 ? "AM" : "PM";
      return `${hours12}:${minutes} ${ampm}`;
    }
  }

  /**
   * Format a number according to user preferences
   */
  formatNumber(
    number: number,
    userId: string,
    options?: { decimals?: number; currency?: boolean },
  ): string {
    const prefs = this.getUserPreferences(userId);
    const region = this.getRegion(prefs.region);

    if (!region || !prefs.useRegionalFormats) {
      // Default formatting if no region or regional formats not used
      return number.toLocaleString("en-US", {
        minimumFractionDigits: options?.decimals || 0,
        maximumFractionDigits: options?.decimals || 0,
      });
    }

    const { decimal, thousands, currencySymbol, symbolPosition } =
      region.numberFormat;

    // Format the number
    const parts = number.toFixed(options?.decimals || 0).split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
    const decimalPart = parts.length > 1 ? decimal + parts[1] : "";

    let formattedNumber = integerPart + decimalPart;

    // Add currency symbol if requested
    if (options?.currency) {
      formattedNumber =
        symbolPosition === "before"
          ? currencySymbol + formattedNumber
          : formattedNumber + " " + currencySymbol;
    }

    return formattedNumber;
  }

  /**
   * Add translations to the system
   */
  addTranslations(
    sourceLanguage: string,
    targetLanguage: string,
    translations: Record<string, string>,
  ): void {
    const key = `${sourceLanguage}_${targetLanguage}`;
    const existingTranslations = this.translations.get(key) || {};

    this.translations.set(key, {
      ...existingTranslations,
      ...translations,
    });
  }

  /**
   * Simulate machine translation (for demonstration purposes)
   */
  private simulateMachineTranslation(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
  ): string {
    // This is a very simplified simulation of machine translation
    // In a real implementation, this would call an actual translation API

    // Just add a prefix/suffix to show it's a simulated translation
    return `[${targetLanguage}] ${text} [translated from ${sourceLanguage}]`;
  }

  /**
   * Persist user preferences to localStorage
   */
  private persistPreferences(): void {
    if (typeof window !== "undefined") {
      try {
        const prefsObj = Object.fromEntries(this.userPreferences.entries());
        localStorage.setItem(this.storageKey, JSON.stringify(prefsObj));
      } catch (error) {
        console.error("Failed to store language preferences:", error);
      }
    }
  }
}

export const languageManager = new LanguageManager();
