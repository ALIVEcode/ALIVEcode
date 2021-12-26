package interpreteur.as.modules.builtins;

import interpreteur.as.Objets.Nombre;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.Objets.ASObjet;
import interpreteur.as.modules.ASModule;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.executeur.Executeur;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class BuiltinsNombreUtils {

    public static ASObjet.Fonction[] fonctions = new ASObjet.Fonction[]{
            new ASObjet.Fonction("entier", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "txt", null),
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.entier.asType(), "base", new ASObjet.Entier(10))
            }, new Type("entier")) {
                @Override
                public Entier executer() {
                    String valeur = this.getParamsValeursDict().get("txt").toString();
                    int base = (Integer) this.getParamsValeursDict().get("base").getValue();
                    try {
                        return new Entier(Integer.parseInt(valeur, base));
                    } catch (NumberFormatException ignored) {
                        throw new ASErreur.ErreurType("impossible de convertir '" + valeur + "' en nombre entier de base " + base);
                    }
                }
            },

            new ASObjet.Fonction("abs", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(new Type("nombre"), "x", null)
            }, new Type("nombre")) {
                @Override
                public ASObjet<?> executer() {
                    return new Decimal(Math.abs(((Number) this.getValeurParam("x").getValue()).doubleValue()));
                }
            },

            new ASObjet.Fonction("decimal", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "txt", null)
            }, new Type("decimal")) {
                @Override
                public Decimal executer() {
                    try {
                        return new Decimal(Double.parseDouble(this.getParamsValeursDict().get("txt").toString()));
                    } catch (NumberFormatException ignored) {
                        throw new ASErreur.ErreurType("impossible de convertir '" + this.getParamsValeursDict().get("element").toString() + "' en nombre decimal");
                    }
                }
            },


            new ASObjet.Fonction("nombre", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(ASObjet.TypeBuiltin.texte.asType(), "txt", null)
            }, new Type("decimal")) {
                @Override
                public Nombre executer() {
                    String nb = this.getParamsValeursDict().get("txt").toString();
                    if (!Nombre.estNumerique(nb))
                        throw new ASErreur.ErreurType("Impossible de convertir " + nb + " en nombre entier ou d\u00E9cimal.");

                    boolean estDecimal = nb.contains(".");
                    if (estDecimal) return new Decimal(Double.parseDouble(nb));
                    else return new Entier(Integer.parseInt(nb));
                }
            },


            new ASObjet.Fonction("bin", new ASObjet.Fonction.Parametre[]{
                    new ASObjet.Fonction.Parametre(new Type("entier"), "nb", null)
            }, new Type("texte")) {
                @Override
                public Texte executer() {
                    return new Texte(Integer.toBinaryString((Integer) this.getValeurParam("nb").getValue()));
                }
            }
    };
    public static List<ASObjet.Constante> constantes = Collections.emptyList();

    public ASModule charger(Executeur executeurInstance) {
        return null;
    }
}

















