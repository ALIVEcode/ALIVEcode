import interpreteur.as.erreurs.ASErreur;

import java.util.stream.Stream;

public class TestInterpreteur {

    private static boolean test() {
        return Stream.of(
                //programme vide
                new Test()
                        .expect("")
                        .toEnd(),

                // commentaires
                new Test()
                        .expect("""
                                # ceci est un commentaire
                                """)
                        .and("""
                                (:
                                salut je suis un commentaire
                                sur plusieurs
                                lignes
                                :)
                                """
                        )
                        .and("""
                                (-:
                                 - Cette fonction additionne deux nombres et retourne le résultat
                                 - @param num1: le premier nombre
                                 - @param num2: le deuxième nombre
                                 - @retourne la somme deux deux nombres
                                :-)
                                """
                        )
                        .toEnd(),

                // variables
                new Test()
                        .expect("""
                                var a <- 23
                                afficher a
                                """
                        )
                        .and("""
                                var é = 23
                                afficher é
                                """
                        )
                        .toPrint("23")
                        .toEnd(),

                // missing variable
                new Test()
                        .expect("""
                                afficher a
                                """)
                        .toFail(new ASErreur.ErreurVariableInconnue("").getNomErreur())

        ).allMatch(Test::passTest);
    }

    public static void main(String[] args) {
        System.out.println("\n" + "-".repeat(20) + "\nFinal result: " + (TestInterpreteur.test() ? "Success!" : "Failure"));
    }
}




















