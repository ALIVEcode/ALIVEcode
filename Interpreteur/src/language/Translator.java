package language;

import java.util.Hashtable;

public record Translator(String languageKey) {

    public static final Hashtable<String, Language> LANGUAGES = new Hashtable<>();

    public static void addLanguage(String languageKey, Language language) {
        LANGUAGES.put(languageKey, language);
    }

    public String t(String translationPath) {
        if (!LANGUAGES.containsKey(languageKey))
            return translationPath;
        return LANGUAGES.get(languageKey).convert(translationPath);
    }
}
