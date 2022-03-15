package language;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;
import java.util.stream.Collectors;

public record Language(JSONObject languageDict) {
    /**
     * To test the class
     */
    public static void main(String[] args) {
        var Fr = new Language(new JSONObject()
                .put("error", new JSONObject()
                        .put("type", new JSONObject()
                                .put("invalide3", "$0 est un type invalide: $1 ou $2 sont les types autorisés."))
                )
        );
        String a = Fr.convert("error.type.invalide3", "entier", "texte", "booleen");
        System.out.println(a);
    }

    public String convert(String translationPath, String... values) {
        JSONObject current = languageDict;
        String[] splittedPath = translationPath.split("\\.");
        try {
            // path until the last key
            for (int i = 0; i < splittedPath.length - 1; i++) {
                current = current.getJSONObject(splittedPath[i]);
            }
            return current.get(splittedPath[splittedPath.length - 1]) instanceof String s
                    ? formatConvertedString(s, values)
                    : translationPath;

        } catch (JSONException err) {
            return translationPath;
        }
    }

    private String formatConvertedString(String convertedString, String... values) {
        // matches the symbol $ (not preceded by a \) followed by a number
        var dollarSplitter = "(?<!\\\\)\\$(?=\\d)";
        var numSplitter = "(?<=\\d)(?=\\D)";
        var splitted = convertedString.split(dollarSplitter);

        // because the first element won't ever contain a variable, we don't parse it
        return splitted[0] + List.of(splitted)
                .subList(1, splitted.length)
                .stream()
                .map(s -> {
                    try {
                        // separates the index of the value from the text
                        String[] s_ = s.split(numSplitter, 2);
                        // get the value at the index
                        String value = values[Integer.parseInt(s_[0])];
                        // if there is text after the variable
                        String textAfter = s_.length > 1 ? s_[1] : "";

                        return value + textAfter;
                    } catch (NumberFormatException | ArrayIndexOutOfBoundsException err) {
                        // if something fails, just return the $ with the index like nothing happened
                        return "$" + s;
                    }
                })
                .collect(Collectors.joining());
    }
}





















