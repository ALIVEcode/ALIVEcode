package executeur;

import interpreteur.executeur.Executeur;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import result.Result;

public class ExectueurTest {

    @Test
    public void test() {
        String[] lines = """   
                var nb = "12"
                var nb2 = "74"
                                
                afficher((decimal(nb) + decimal(nb2)) / 2)
                                
                utiliser Math
                                
                afficher Math.sin(90)
                                
                """.split("\n");

        Executeur executeur = new Executeur();
        Object a = executeur.compiler(lines, true);
        Assertions.assertNotEquals("[]", a, a.toString());

        var result = executeur.executerMain(false);
        new Result(result).expectTo(
                Result.print((12 + 74) / 2.0),
                Result.print(Math.sin(Math.toRadians(90))),
                Result.end()
        );
        System.out.println(result);
    }
}

















