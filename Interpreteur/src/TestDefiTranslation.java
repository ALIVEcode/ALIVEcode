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

        assertEquals("Le nombre de param\u00E8tres est trop grand", defi.t(" function.call.nb-parameter.to-big "));

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
        /*
         * Premièrement, félicitation pour avoir réussi!!!
         *
         * Premièrement, mes commentaires se veulent constructifs et le but est d'apprendre
         * Aussi, ton code est loin d'être mauvais, alors ce sont plus des suggestions d'amélioration
         * que de vraies critiques.
         *
         *
         * PS: my bad, mes tests ne couvraient pas tous les edges cases, par exemple, si la personne écrit:
         *  " function.call.nb-parameter.to-big ", cela devrait quand même fonctionner (tu iras voir la fonction
         *  <String>.trim() pour ça)
         *
         */
        String[] tokens = path.split("\\.");
        JSONObject head = jsonFile;
        try {
            /*
             * Pourrait être changé pour une foreach loop, look it up ;) (ça ressemble plus à python)
             */
            for (int i = 0; i < tokens.length - 1; i++) {
                String token = tokens[i];
                head = (JSONObject) head.get(token);
            }
            /*
             * Tu pourrais utiliser head.getString pour être plus concis
             */
            return (String) head.get(tokens[tokens.length - 1]);
        } catch (Exception e) {
            /*
             * Commen en python, c'est une mauvaise pratique de catch toutes les exceptions, car si
             *  ton code a une erreur qu'il est pas supposé avoir, elle devrait être lancé pour que tu le saches
             *  conseil: remplace Exception par les exceptions possibles. S'il y en a plusieurs, sépare les par
             *  le symbole '|'
             *  ex:
             *  catch (NumberFormatException | ClassNotFoundException | AutreExeption err) {
             *  ...
             *  }
             */
            return path;
        }
    }
}


















