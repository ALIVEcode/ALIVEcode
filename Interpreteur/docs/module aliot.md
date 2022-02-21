# Module Aliot pour AliveScript

### Importer le module dans un script AliveScript

- Comme n'importe quel module d'alivescript, il suffit d'écrire `utiliser Aliot`

> Attention, si le projet n'est pas de type IoT, utiliser ce module résultera en une erreur

### Api:

- Aliot.doc
    - Document (json) du projet sous la forme d'un dictionnaire AliveScript

- Aliot.changerEtat(idComposant: texte | entier, valeur: tout) -> rien
    - Change l'état du composant dont l'id est `idComposant` selon la valeur passée en paramètre
    - Le type de `valeur` dépend du type de composant

- Aliot.changerDoc() -> rien
    - Remplace la valeur de du document de projet par celle d'`Aliot.doc`

- Aliot.ecouter(fonc: (chemin: texte, valeur: tout) -> rien, chemins: liste[texte]) -> rien
    - Enregistre la fonction pour qu'elle soit appelée lorsqu'un des champs dans le document de projet change
    - Param fonc:
        - Param chemin: chemin de ce qui a été modifié dans le document de projet
        - Param valeur: nouvelle valeur à l'endroit où pointe la valeur de `cheminChange` dans le document de projet
    - Param chemins:
        - Liste de chemins qui vont appeler la fonction `fonc` lorsque modifiés
    - Ex:
      ```
      utiliser Aliot
      
      fonction logChangementLumiere(chemin: texte, valeur: liste) -> rien
          var etatLumiere = 'allumées' si 'lumieres-actives' dans chemin sinon 'fermées' 
          var msg = format('les lumières {} sont maintenant {}', valeur, etatLumiere)
          Aliot.changerEtat('luminLog', msg)
      fin fonction
      
      Aliot.ecouter logChangementLumiere, ['/document/lumieres-actives', '/documents/lumieres-fermees']
      ```

- Aliot.surReception(fonc: (data: tout) -> rien, idAction: texte | entier) -> rien
    - Enregiste la fonction pour qu'elle soit appelée lorsque l'action avec l'id correspondant est enclenchée


- Aliot.declancher(idAction: texte | entier, data: tout) -> rien
  - Déclanche une action qui sera interceptée par une méthode AliotésurReception

