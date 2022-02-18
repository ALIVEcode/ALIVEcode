package interpreteur.as.lang.datatype;

import interpreteur.as.lang.ASFonctionModule;
import interpreteur.as.lang.ASScope;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.lang.ASType;
import interpreteur.ast.buildingBlocs.programmes.Boucle;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.function.Function;

public class ASFonction implements ASObjet<Object> {

    private final ASType typeRetour;
    private final ASFonctionModule.Parametre[] parametres;
    private final String nom;
    private ASScope scope;
    private String coordBlocName;
    private final Executeur executeurInstance;

    /**
     * @param nom        <li>
     *                   Nom de la fonction
     *                   </li>
     * @param typeRetour <li>
     *                   Nom du type de retour de la fonction (ex: <i>entier</i>, <i>texte</i>, <i>liste</i>, ect.)
     *                   </li>
     *                   <li>
     *                   le type du retour peut avoir plusieurs types
     *                   -> separer chaque type par un <b>|</b> (les espaces sont ignores)
     *                   <br> (ex: <i>texte | liste</i>, <i>entier | decimal</i>)
     *                   </li>
     *                   <li>
     *                   Mettre <b>null</b> si le type du retour n'a pas de type forcee
     *                   </li>
     */
    public ASFonction(String nom, ASType typeRetour, Executeur executeurInstance) {
        this.nom = nom;
        this.coordBlocName = "fonc_";
        this.typeRetour = typeRetour;
        this.parametres = new ASFonctionModule.Parametre[0];
        this.executeurInstance = executeurInstance;
    }

    /**
     * @param nom        <li>
     *                   Nom de la fonction
     *                   </li>
     * @param parametres
     * @param typeRetour <li>
     *                   Nom du type de retour de la fonction (ex: <i>entier</i>, <i>texte</i>, <i>liste</i>, ect.)
     *                   </li>
     *                   <li>
     *                   le type du retour peut avoir plusieurs types
     *                   -> separer chaque type par un <b>|</b> (les espaces sont ignores)
     *                   <br> (ex: <i>texte | liste</i>, <i>entier | decimal</i>)
     *                   </li>
     *                   <li>
     *                   Mettre <b>null</b> si le type du retour n'a pas de type forcee
     *                   </li>
     */
    public ASFonction(String nom, ASFonctionModule.Parametre[] parametres, ASType typeRetour, Executeur executeurInstance) {
        this.nom = nom;
        this.coordBlocName = "fonc_";
        this.parametres = parametres;
        this.typeRetour = typeRetour;
        this.executeurInstance = executeurInstance;
    }

    public String getNom() {
        return nom;
    }

    public ASType getTypeRetour() {
        return this.typeRetour;
    }

    public ASFonctionModule.Parametre[] getParams() {
        return this.parametres;
    }

    public ASScope getScope() {
        return scope;
    }

    public void setScope(ASScope scope) {
        this.scope = scope;
    }

    //private void declarerParams() {
    //    Arrays.stream(parametres).forEach(Fonction.Parametre -> scope.declarerVariable(new Variable(Fonction.Parametre.getNom(), null, Fonction.Parametre.getType())));
    //}

    // TODO ÇA
    // public ASObjet<?> getValeurParam(String nomParametre) {
    //     return this.parametres_appel.get(nomParametre);
    // }

    /**
     * @return true -> si les parametres sont initialisees <br> false -> s'il n'y a pas de parametres
     * @throws Error une erreur si un des tests n'est pas passe
     */
    public boolean testParams(ArrayList<?> paramsValeurs) {
        if (this.parametres.length == 0 && paramsValeurs.size() == 0) return false;

        int nonDefaultParams = (int) Arrays.stream(parametres).filter(param -> param.getValeurParDefaut() == null).count();

        if (paramsValeurs.size() < nonDefaultParams || paramsValeurs.size() > this.parametres.length) {
            if (nonDefaultParams == this.parametres.length) {
                throw new ASErreur.ErreurAppelFonction(this.nom, "Le nombre de param\u00E8tres donn\u00E9s est '" + paramsValeurs.size() +
                        "' alors que la fonction en prend '" + this.parametres.length + "'");
            } else {
                throw new ASErreur.ErreurAppelFonction(this.nom, "Le nombre de param\u00E8tres donn\u00E9s est '" + paramsValeurs.size() +
                        "' alors que la fonction en prend entre '" + nonDefaultParams + "' et '" + this.parametres.length + "'");
            }

        }
        for (int i = 0; i < paramsValeurs.size(); i++) {
            ASFonctionModule.Parametre parametre = this.parametres[i];
            if (parametre.getType().noMatch(((ASObjet<?>) paramsValeurs.get(i)).obtenirNomType())) {
                throw new ASErreur.ErreurType("Le param\u00E8tres '" + parametre.getNom() + "' est de type '" + parametre.getType().nom() +
                        "', mais l'argument pass\u00E9 est de type '" + ((ASObjet<?>) paramsValeurs.get(i)).obtenirNomType() + "'.");
            }
        }
        return true;
    }

    public void setCoordBlocName(String coordBlocName) {
        this.coordBlocName = coordBlocName;
    }

    public FonctionInstance makeInstance() {
        return new FonctionInstance(this);
    }

    public FonctionInstance makeJavaInstance(Function<ArrayList<ASObjet<?>>, ASObjet<?>> executer) {
        return new FonctionInstance(this) {
            @Override
            public ASObjet<?> executer(ArrayList<ASObjet<?>> paramsValeurs) {
                return executer.apply(paramsValeurs);
            }
        };
    }

    @Override
    public String toString() {
        return this.nom + "(" +
                String.join(", ", Arrays.stream(this.parametres).map(p -> p.getNom() + ": " + p.obtenirNomType())
                        .toArray(String[]::new)) +
                ") " +
                "\u2192 " + this.typeRetour.nom();
    }

    @Override
    public ASFonction getValue() {
        return this;
    }

    @Override
    public boolean boolValue() {
        return true;
    }

    @Override
    public String obtenirNomType() {
        return "fonctionType";
    }


    public static class FonctionInstance implements ASObjet<Object> {
        private final ASFonction fonction;
        private final ASScope.ScopeInstance scopeInstance;
        private Coordonnee coordReprise = null;

        public FonctionInstance(ASFonction fonction) {
            this.fonction = fonction;
            this.scopeInstance = fonction.getScope().makeScopeInstanceFromScopeParent();
        }

        public ASObjet<?> executer(ArrayList<ASObjet<?>> paramsValeurs) {
            if (fonction.testParams(paramsValeurs)) {

                for (int i = 0; i < fonction.parametres.length; i++) {
                    ASFonctionModule.Parametre param = fonction.parametres[i];
                    if (i < paramsValeurs.size()) {
                        scopeInstance.getVariable(param.getNom()).changerValeur(paramsValeurs.get(i));

                    } else {
                        if (param.getValeurParDefaut() == null) {
                            throw new ASErreur.ErreurAppelFonction(fonction.nom, "L'argument: " + param.getNom() + " n'a pas reçu de valeur" +
                                    "et ne poss\u00E8de aucune valeur par d\u00E9faut.");
                        }
                    }
                }
                //for (Fonction.Parametre param : fonction.parametres) {
                //    this.parametres_appel.computeIfAbsent(param.getNom(), (val) -> {
                //        if (param.getValeurParDefaut() == null) {
                //            throw new ASErreur.ErreurAppelFonction(fonction.nom, "L'argument: " + param.getNom() + " n'a pas reçu de valeur" +
                //                    "et ne poss\u00E8de aucune valeur par d\u00E9faut.");
                //        }
                //        return param.getValeurParDefaut();
                //    });
                //}
            }
            ASScope.pushCurrentScopeInstance(scopeInstance);

            Object valeur;
            ASObjet<?> asValeur;
            Coordonnee ancienneCoord = fonction.executeurInstance.obtenirCoordRunTime().copy();

            valeur = fonction.executeurInstance.executerScope(fonction.coordBlocName + fonction.nom, null, coordReprise == null ? null : coordReprise.toString());
            if (valeur instanceof String s) {
                //System.out.println("valeur: " + valeur);
                coordReprise = fonction.executeurInstance.obtenirCoordRunTime().copy();
                fonction.executeurInstance.setCoordRunTime(ancienneCoord.toString());
                throw new ASErreur.StopSendData(s);

            } else {
                asValeur = (ASObjet<?>) valeur;
            }

            coordReprise = null;

            Boucle.sortirScope(fonction.executeurInstance.obtenirCoordRunTime().toString());

            fonction.executeurInstance.setCoordRunTime(ancienneCoord.toString());
            ASScope.popCurrentScopeInstance();

            //System.out.println(this.typeRetour);
            //System.out.println(valeur);
            if (asValeur == null || fonction.typeRetour.noMatch(asValeur.obtenirNomType())) {
                throw new ASErreur.ErreurType("Le type retourner ' " + (asValeur == null ? "vide" : asValeur.obtenirNomType()) + " ' ne correspond pas "
                        + "au type de retour pr\u00E9cis\u00E9 dans la d\u00E9claration de la fonction ' " + fonction.typeRetour.nom() + " '.");

            }
            return asValeur;
        }

        @Override
        public Object getValue() {
            return this;
        }

        @Override
        public boolean boolValue() {
            return fonction.boolValue();
        }

        @Override
        public String obtenirNomType() {
            return fonction.obtenirNomType();
        }

        @Override
        public String toString() {
            return fonction.toString();
        }
    }


}























