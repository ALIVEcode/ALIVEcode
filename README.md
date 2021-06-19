# ALIVEweb

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
- ### Setup de python
    **Version de python requise: 3.8.0 - 3.8.8**
    Modules pip à installer
    - ##### Django
      ```cmd
      pip install django
      ```
      ou
      ```cmd
      python -m pip install django
      ```
    - ##### Django Rest Framework
      ```cmd
      pip install djangorestframework
      ```
      ou
      ```cmd
      python -m pip install djangorestframework
      ```
    - ##### Channels 
      ```cmd
      pip install channels
      ```
      ou
      ```cmd
      python -m pip install channels
      ```
    - ##### Pillow
      ```cmd
      pip install pillow
      ```
      ou
      ```cmd
      python -m pip install pillow
      ```
    - ##### Pyjnius
      Permet d'éxécuter du code java à partir de python
      
      Pyjnius requiert C++ build tools sur la machine:
      https://visualstudio.microsoft.com/fr/visual-cpp-build-tools/
      
      Pyjnius requiert un JDK (Java Development Kit)
      La version 15.0.2 est préférée:
      https://www.oracle.com/java/technologies/javase/jdk15-archive-downloads.html
     
      ```cmd
      pip install pyjnius
      ```
      ou
      ```cmd
      python -m pip install pyjnius
      ```
      
      En cas d'erreur(s):
      
      1. Changer la version du JDK pour la version 15.0.2  
      
      2. S'assurer que la version de python est de 3.8.0 à 3.8.8
         ```cmd
         python --version
         ```
      
      2. Ajouter aux variables d'environnement système la variable JAVA_HOME ET JDK_HOME qui pointe au dossier contenant le JDK. Exemple: (C:\Program Files\Java\jdk-15.0.2)  
         ![image](https://user-images.githubusercontent.com/62816157/116499802-0861c100-a87b-11eb-87dc-aa5205bbf797.png)
         ![image](https://user-images.githubusercontent.com/62816157/116497096-8ec6d480-a874-11eb-8a5d-e2a8facdd4d4.png)
       
      3. Si dans le message d'erreur on retrouve à quelque part PermissionError: [WinError 5] Accès refusé, il faut changer de place l'emplacement du JDK à un emplacement qui ne requiert pas de permissions windows. Exemple: (C:\Program Files\Java\jdk-15.0.2)  
      
      4. Si le problème persiste, demandez à Enric ou Mathis.

# Premier Pas
1. Démarrage du serveur localement
   ```cmd
   python manage.py runserver
   ```
   Allez sur un navigateur web moderne et essayer d'entrer dans la barre de recherche l'addresse suivante:  
    
   **localhost:8000**  
    
   Si toute l'installation s'est bien passée, la page d'accueil du site devrait apparaître! Bravo vous avez maintenant le site et pouvez commencer à prendre part au développement de la plateforme! 🎉🎉🎉
