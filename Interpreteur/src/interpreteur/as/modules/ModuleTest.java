package interpreteur.as.modules;

import interpreteur.as.lang.ASFonctionModule;
import interpreteur.as.lang.ASVariable;
import interpreteur.as.lang.datatype.ASObjet;
import interpreteur.as.lang.ASTypeBuiltin;
import interpreteur.as.lang.datatype.ASTexte;
import interpreteur.as.modules.core.ASModule;
import interpreteur.executeur.Executeur;

public class ModuleTest {
    public static ASModule charger(Executeur executeurInstance) {
        ASFonctionModule[] fonctions = new ASFonctionModule[]{
                new ASFonctionModule("dummy", ASTypeBuiltin.tout.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        //executeurInstance.addData(new Data(Data.Id.AFFICHER).addParam(executeurInstance.getContext()));
                        var context = executeurInstance.getContext();
                        var iotPayload = context.optString("iotPayload");
                        return new ASTexte(iotPayload);
                    }
                }
        };

        ASVariable[] variables = new ASVariable[]{
                new ASVariable("sonNom", new ASTexte("hey!"), ASTypeBuiltin.texte.asType())
                        .setGetter(() -> new ASTexte("oh!")).setReadOnly()
        };


        return new ASModule(fonctions, variables);
    }
}
