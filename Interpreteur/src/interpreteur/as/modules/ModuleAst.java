package interpreteur.as.modules;

import interpreteur.as.Objets.ASObjet;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.executeur.Executeur;

public class ModuleAst {
    static ASModule charger(Executeur executeurInstance) {
        return new ASModule(new ASObjet.Fonction[]{
            new ASObjet.Fonction("genererArbre", new ASObjet.Fonction.Parametre[] {
                    new ASObjet.Fonction.Parametre(new Type("texte"), "param", null)
            }, new Type("texte")) {
                @Override
                public ASObjet<?> executer() {
                    //List<Token> a = Executeur.getLexer().lex((String) this.getValeurParam("param").getValue());
                    //return new Texte(Executeur.getAst().parse(a).toString());
                    return null;
                }
            }
        });
    }
}
