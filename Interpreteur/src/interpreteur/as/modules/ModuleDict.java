package interpreteur.as.modules;

import interpreteur.as.lang.ASFonctionModule;
import interpreteur.as.lang.datatype.ASObjet;
import interpreteur.as.lang.ASTypeBuiltin;
import interpreteur.as.modules.core.ASModule;
import interpreteur.executeur.Executeur;

public class ModuleDict {


    String dictCode = """
            fonction Dict.creer() -> fonctionType
                var clefs = {}
                var valeurs = {}
                fonction dict(clef: texte, valeur: tout = nul) -> tout
                    si clef dans clefs
                        var idx = indexDe(clef, clefs)
                        si valeur != nul
                            valeurs[idx] = valeur
                            retourner valeur
                        sinon
                            retourner valeurs[idx]
                        fin si
                    sinon si valeur != nul
                            clefs += clef
                            valeurs += valeur
                            retourner {clef, valeur}
                    sinon
                        retourner nul
                    fin si
                fin fonction
                retourner dict
            fin fonction
            """;

    //ASFonction creer = new ASFonction("creer", ASObjet.TypeBuiltin.fonctionType.asType()) {
    //    @Override
    //    public FonctionInstance makeInstance() {
    //        return makeJavaInstance((paramsValeur) -> {
//
    //            return null;
    //        });
    //    }
    //};

    static ASModule charger(Executeur executeurInstance) {
        return new ASModule(new ASFonctionModule[]{

                new ASFonctionModule("creer", new ASFonctionModule.Parametre[]{

                }, ASTypeBuiltin.fonctionType.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        return null;
                    }
                }
        });
    }
}















