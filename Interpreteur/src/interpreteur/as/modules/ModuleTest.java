package interpreteur.as.modules;

import interpreteur.as.Objets.ASObjet;
import interpreteur.executeur.Executeur;

public class ModuleTest {
    public static ASModule charger(Executeur executeurInstance) {
        ASObjet.Fonction[] fonctions = new ASObjet.Fonction[]{
                new ASObjet.Fonction("dummy", ASObjet.TypeBuiltin.tout.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        //executeurInstance.addData(new Data(Data.Id.AFFICHER).addParam(executeurInstance.getContext()));
                        var context = executeurInstance.getContext();
                        var iotPayload = context.optString("iotPayload");
                        return new ASObjet.Texte(iotPayload);
                    }
                }
        };

        ASObjet.Variable[] variables = new ASObjet.Variable[]{
                new ASObjet.Variable("sonNom", new ASObjet.Texte("hey!"), ASObjet.TypeBuiltin.texte.asType())
                        .setGetter(() -> new ASObjet.Texte("oh!")).setReadOnly()
        };


        return new ASModule(fonctions, variables);
    }
}
