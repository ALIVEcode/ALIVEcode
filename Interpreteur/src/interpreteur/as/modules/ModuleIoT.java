package interpreteur.as.modules;

import interpreteur.as.Objets.ASObjet;
import interpreteur.as.Objets.Nombre;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.data_manager.Data;
import interpreteur.executeur.Executeur;

public class ModuleIoT {
    static ASModule charger(Executeur executeurInstance) {
        return new ASModule(new ASObjet.Fonction[] {
                new ASObjet.Fonction("update",
                        new ASObjet.Fonction.Parametre[] {
                            new ASObjet.Fonction.Parametre(
                                    ASObjet.TypeBuiltin.texte.asType(),
                                    "projectId",
                                    null
                            ),
                            new ASObjet.Fonction.Parametre(
                                    ASObjet.TypeBuiltin.texte.asType(),
                                    "id",
                                    null
                            ),
                            new ASObjet.Fonction.Parametre(
                                    ASObjet.TypeBuiltin.tout.asType(),
                                    "value",
                                    null
                            )
                        }, ASObjet.TypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        Texte projectId = (Texte) this.getValeurParam("projectId");
                        Texte id = (Texte) this.getValeurParam("id");
                        ASObjet<?> valueAs = (ASObjet<?>) this.getValeurParam("value");

                        executeurInstance.addData(new Data(Data.Id.UPDATE_COMPONENT).addParam(projectId).addParam(id).addParam(valueAs.getValue()));
                        return new Nul();
                    }
                },
                new ASObjet.Fonction("get",
                        new ASObjet.Fonction.Parametre[] {
                                new ASObjet.Fonction.Parametre(
                                        ASObjet.TypeBuiltin.texte.asType(),
                                        "key",
                                        new ASObjet.Nul()
                                )
                        }, ASObjet.TypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        ASObjet<?> uncastedKey = (ASObjet<?>) this.getValeurParam("key");
                        if(uncastedKey instanceof Nul) {
                            return new Texte(executeurInstance.getContext().toString());
                        }

                        Texte key = (Texte) uncastedKey;

                        Object obj = executeurInstance.getContext().get(key.toString());
                        if(obj == null) {
                            throw new ModuleIoT.KeyNotPresent("Erreur, la clé " + key + " n'est pas présente dans l'objet de réponse.");
                        }
                        if(obj instanceof String) {
                            return new Texte(obj);
                        }
                        if(obj instanceof Number) {
                            return Nombre.cast((Number) obj);
                        }
                        if(obj instanceof Boolean) {
                            return new Booleen((Boolean) obj);
                        }
                        return new Nul();
                    }
                },
                new ASObjet.Fonction("getComponentValue",
                        new ASObjet.Fonction.Parametre[] {
                                new ASObjet.Fonction.Parametre(
                                        ASObjet.TypeBuiltin.texte.asType(),
                                        "projectId",
                                        null
                                ),
                                new ASObjet.Fonction.Parametre(
                                        ASObjet.TypeBuiltin.texte.asType(),
                                        "id",
                                        null
                                )
                        }, ASObjet.TypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        return new Nul();
                    }
                }
        });
    }

    private static class KeyNotPresent extends ASErreur.ErreurAliveScript {
        public KeyNotPresent(String message) {
            super(message, "ErreurCleDansContexte");
        }
    }
}
