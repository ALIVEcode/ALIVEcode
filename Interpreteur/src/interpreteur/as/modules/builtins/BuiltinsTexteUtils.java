package interpreteur.as.modules.builtins;

import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.Objets.ASObjet;
import interpreteur.as.modules.ASModule;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.executeur.Executeur;

import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

public class BuiltinsTexteUtils {
    public static ASObjet.Fonction[] fonctions = new ASObjet.Fonction[]{

            new ASObjet.Fonction("texte", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.tout.asType(), "element", null)
            }, ASObjet.TypeBuiltin.texte.asType()) {
                @Override
                public Texte executer() {
                    return new Texte(this.getValeurParam("element").toString());
                }
            },

            new ASObjet.Fonction("maj", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "txt", null)
            }, ASObjet.TypeBuiltin.texte.asType()) {
                @Override
                public ASObjet.Texte executer() {
                    return new Texte(this.getParamsValeursDict().get("txt").getValue().toString().toUpperCase());
                }
            },

            new ASObjet.Fonction("minus", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "txt", null)
            }, new Type("texte")) {
                @Override
                public ASObjet.Texte executer() {
                    return new Texte(this.getParamsValeursDict().get("txt").getValue().toString().toLowerCase());
                }
            },

            new ASObjet.Fonction("remplacer", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "txt", null),
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "sequence", null),
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "remplacement", null)
            }, ASObjet.TypeBuiltin.texte.asType()) {
                @Override
                public ASObjet.Texte executer() {
                    String txt = this.getParamsValeursDict().get("txt").getValue().toString();
                    String pattern = this.getParamsValeursDict().get("sequence").getValue().toString();
                    String remplacement = this.getParamsValeursDict().get("remplacement").getValue().toString();
                    return new Texte(txt.replace(pattern, remplacement));
                }
            },

            new ASObjet.Fonction("remplacerRe", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "txt", null),
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "pattern", null),
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "remplacement", null)
            }, ASObjet.TypeBuiltin.texte.asType()) {
                @Override
                public ASObjet.Texte executer() {
                    String txt = this.getParamsValeursDict().get("txt").getValue().toString();
                    String pattern = this.getParamsValeursDict().get("pattern").getValue().toString();
                    String remplacement = this.getParamsValeursDict().get("remplacement").getValue().toString();
                    return new Texte(txt.replaceAll(pattern, remplacement));
                }
            },

            new ASObjet.Fonction("match", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "txt", null),
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "pattern", null)
            }, ASObjet.TypeBuiltin.booleen.asType()) {
                @Override
                public ASObjet.Booleen executer() {
                    String txt = this.getParamsValeursDict().get("txt").getValue().toString();
                    String pattern = this.getParamsValeursDict().get("pattern").getValue().toString();
                    return new Booleen(txt.matches(pattern));
                }
            },

            new ASObjet.Fonction("estNumerique", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "txt", null)
            }, ASObjet.TypeBuiltin.booleen.asType()) {
                @Override
                public ASObjet.Booleen executer() {
                    try {
                        Integer.parseInt(this.getParamsValeursDict().get("txt").getValue().toString());
                        return new Booleen(true);
                    } catch (NumberFormatException ignored) {
                    }
                    return new Booleen(false);
                }
            },

            /*
             * format:
             * 		@params t:
             * 			-> type: texte
             * 			-> valeur par defaut: null (n'en a pas, il est donc obligatoire de lui en donner une lors de l'appel de la fonction)
             *
             *      @params valeurs:
             *          -> type: liste
             *          -> valeur par defaut : null (n'en a pas, il est donc obligatoire de lui en donner une lors de l'appel de la fonction)
             *
             * 		@type_retour texte
             *
             * 		@return un texte où les {} sont remplacés par les valeurs dans la liste
             */
            new ASObjet.Fonction("format", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "txt", null),
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.liste.asType(), "valeurs", null)
            }, ASObjet.TypeBuiltin.texte.asType()) {
                @Override
                public ASObjet<?> executer() {
                    String texte = ((Texte) this.getValeurParam("txt")).getValue();
                    Iterator<ASObjet<?>> valeurs = ((Liste) this.getValeurParam("valeurs")).getValue().iterator();

                    while (texte.contains("{}")) {
                        if (valeurs.hasNext()) {
                            texte = texte.replaceFirst("[{][}]", valeurs.next().toString());
                        } else {
                            throw new ASErreur.ErreurFormatage("Le nombre de {} doit etre egal au nombre de valeur dans la liste");
                        }
                    }

                    if (texte.contains("{}"))
                        throw new ASErreur.ErreurFormatage("Le nombre de {} doit etre egal au nombre de valeur dans la liste");

                    return new Texte(texte);
                }
            }
    };

    public static ASModule charger(Executeur executeurInstance) {
        return new ASModule(fonctions);
    }
}

















