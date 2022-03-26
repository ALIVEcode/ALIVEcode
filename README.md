# ALIVEcode

Plateforme Web faite par le laboraoire LRIMa du collège Maisonneuve touchant plusieurs facettes scientifiques.

## Table des matières:

- [Branches](#branches)
- [Installation](#installation)
- [Premiers Pas](#premier-pas)

# **Branches:**

- ### ALIVE PLAY
  ##### Branche consacrée à l'apprentissage de la programmation chez les jeunes en montrant des résultats réels à l'aide des véhicules ALIVE ainsi qu'à l'apprentissage de diverses matières
  ![image](https://user-images.githubusercontent.com/62816157/114948080-58249f00-9e1c-11eb-9afe-4081a82fd066.png?raw=true)
- ### ALIVE Mind Controller
  ##### Branche consacrée à la recherche sur l'activité cérébrale et la concentration d'une personne
  ![image](https://user-images.githubusercontent.com/62816157/116498951-f41cc480-a878-11eb-852f-a89c6088d7b3.png)
  ![image](https://user-images.githubusercontent.com/62816157/116499031-2c240780-a879-11eb-97fd-b83f4e7f1510.png)
- ### ALIVE Augmented Perception
  ##### Branche consacrée à la recherche scientifique sur les véhicules intelligent avec perception augmentée
  ![image](https://user-images.githubusercontent.com/62816157/116498903-d3ed0580-a878-11eb-87b0-5873aac01291.png)
  ![image](https://user-images.githubusercontent.com/62816157/116499088-4a8a0300-a879-11eb-9dae-4ccb92721c06.png)
- ### ALIVE Injected Prevention
  ##### Branche consacrée à la recherche scientifique sur la sécurité réseau et des véhicules autonomes contre des attaques externes

# Installation

- ### Setup de Nodejs

  **Version de nodejs recommandée: v14.7.5 à v16.13.2**

  - ##### Installation des librairies

    ```cmd
    cd backend
    npm install

    cd frontend
    npm install
    ```

  - En cas d'erreur(s):

    1. S'assurer que la version de node est de v14.7.5 à v16.13.2

    ```cmd
     node --version
    ```

    2. Si le problème persiste, demandez à @MoSk3 ou @Ecoral360, ou postez une issue sur le repo.

- ### Setup des fichiers

  - #### .env (backend ET frontend!)

    ##### .env backend

    1.  Allez dans le répertoire ALIVEcode/backend
    2.  Copiez-collez dans le même répertoire le fichier _.env.example_ et renommez le _.env_.
    3.  Modifiez certaines valeurs au besoin.

    ##### .env frontend

    1.  Allez dans le répertoire ALIVEcode/frontend
    2.  Copiez-collez dans le même répertoire le fichier _.env.example_ et renommez le _.env_.
    3.  Modifiez certaines valeurs au besoin.

- ### Setup de la base de données (postgreSQL)

  - ##### Setup avec docker (recommandé)

    1. Installer docker desktop: https://docs.docker.com/desktop/windows/install/
    2. Installer wsl (Windows subsystem for linux) ça permet d'exécuter des applications linux avec docker https://docs.microsoft.com/en-us/windows/wsl/install-win10#step-4---download-the-linux-kernel-update-package
    3. Ouvrir le cmd et faire les commandes suivantes:

    ```
    docker pull postgres
    docker run -p 5432:5432 -td --name alivecode-backend-postgres -e POSTGRES_PASSWORD=motdepasse -d postgres
    ```

    6. Selon votre mot de passe mis dans la commande, changez les infos dans le .env du backend
    7. Sur docker desktop vous verrez maintenant dans vos containers une instance du serveur postgreSQL en cours, vous pouvez la démarrer ou la stopper à votre guise
       ![image](https://user-images.githubusercontent.com/62816157/133109379-a30dccd0-a93f-406c-bc36-51540d93efc5.png)

  - ##### Setup sans docker
    1. Installer postgres https://www.postgresql.org/download/
    2. Les prochaines étapes dépendent beaucoup plus de vous, fournissez les informations que vous souhaitez à l'installateur et référez vous à un guide d'installation de posgtreSQL

# Premier Pas

1. Démarrage du serveur localement

- #### Démarrage du backend

```cmd
cd backend
```

Si vous souhaitez exécuter le backend avec toutes les fonctionnalités de développement (file watcher, console logs):

```
 npm run dev
```

Sinon :

```
 npm start
```

- #### Démarrage du frontend

```cmd
 cd frontend
 npm start
```

Une fois fait, lancez à nouveau le site.

**Si aucune erreur n'apparaît:**
Allez sur un navigateur web moderne et essayer d'entrer dans la barre de recherche l'addresse suivante:

**localhost:3000**

Si toute l'installation s'est bien passée, la page d'accueil du site devrait apparaître et vous devriez pouvoir vous créer un compte! Bravo vous avez maintenant le site et pouvez commencer à prendre part au développement de la plateforme! 🎉🎉🎉
