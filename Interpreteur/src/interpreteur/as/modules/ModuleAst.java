package interpreteur.as.modules;

import interpreteur.as.lang.ASFonctionModule;
import interpreteur.as.lang.datatype.ASObjet;
import interpreteur.as.modules.core.ASModule;
import interpreteur.as.lang.ASType;
import interpreteur.executeur.Executeur;

public class ModuleAst {
    static ASModule charger(Executeur executeurInstance) {
        return new ASModule(new ASFonctionModule[]{
            new ASFonctionModule("genererArbre", new ASFonctionModule.Parametre[] {
                    new ASFonctionModule.Parametre(new ASType("texte"), "param", null)
            }, new ASType("texte")) {
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
