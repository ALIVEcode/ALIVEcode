import org.json.JSONObject;
import org.junit.Assert;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestDefiTranslation {
    private static final String json = """
            {
                "error": {
                    "base-error": "Ceci est une erreur standard",
                    "type": {
                        "unknown-type": "Ce type est inconnu",
                        "int": {
                            "to-big": "L'entier est trop gros",
                            "to-small": "L'entier est trop petit"
                        },
                    },
                },
                "alivescript": "AliveScript",
                "function": {
                    "call": {
                         "nb-parameter": {
                             "to-small": "Le nombre de param\u00E8tres est trop petit",
                             "to-big": "Le nombre de param\u00E8tres est trop grand"
                         },
                         "call-type": "Un argument ne match pas le type du param\u00E8tre"
                    },
                    "creation": {}
                }
            }
            """;

    /**
     * Json dans cette variable
     */
    private final JSONObject jsonFile = new JSONObject(json);

    @Test
    public void test() {
        //----------------- Tests -----------------//
        var defi = new TestDefiTranslation();
        assertEquals("", defi.t(""));
        assertEquals("error.type.int", defi.t("error.type.int"));

        assertEquals("L'entier est trop petit", defi.t("error.type.int.to-small"));

        assertEquals("AliveScript", defi.t("alivescript"));

        assertEquals("function.type", defi.t("function.type"));

        assertEquals("function.call.nb-parameter.to-bi", defi.t("function.call.nb-parameter.to-bi"));

        assertEquals("Le nombre de param\u00E8tres est trop grand", defi.t("function.call.nb-parameter.to-big"));

        assertEquals("function.call.creation", defi.t("function.call.creation"));

        assertEquals("12345678", defi.t("12345678"));

        assertEquals(
                "Remplacer la section \\u00e0 compl\\u00E9ter de votre bord",
                defi.t("Remplacer la section \\u00e0 compl\\u00E9ter de votre bord")
        );
        assertEquals("null", defi.t("null"));

        assertEquals("...............", defi.t("..............."));
    }

    /**
     * Remplacer la section \u00e0 compl\u00E9ter de votre bord
     * <p>
     * En cas de la moindre erreur -> retourne le path et affiche l'erreur dans stderr<br>
     * {@code System.err.println(String);}
     *
     * @param path
     * @return
     */
    public String t(String path) {
        //----------------- À compléter -----------------//
        String[] tokens = path.split("\\.");
        JSONObject head = jsonFile;
        try {
            for (int i = 0; i < tokens.length - 1; i++) {
                String token = tokens[i];
                head = (JSONObject) head.get(token);
            }
            return (String) head.get(tokens[tokens.length-1]);
        } catch (Exception e) {
            return path;
        }
    }
}


















