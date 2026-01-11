# Gestion de Comptes et Transactions

Application web de gestion de comptes et transactions développée avec React, GraphQL et Apollo Client.

## Fonctionnalités

- Affichage de la liste des comptes
- Création de nouveaux comptes
- Visualisation des transactions
- Effectuer des dépôts, retraits et transferts
- Interface utilisateur moderne avec Material-UI



## Installation

1. Cloner le dépôt :
   ```bash
   git clone [URL_DU_REPO]
   cd [NOM_DU_PROJET]
   ```

2. Installer les dépendances :
   ```bash
   npm install --legacy-peer-deps
   ```

3. Configurer l'URL de l'API GraphQL :
   Modifiez le fichier `src/context/ApolloContext.js` pour pointer vers votre serveur GraphQL :
   ```javascript
   const httpLink = createHttpLink({
     uri: 'http://localhost:4000/graphql', // Mettez à jour cette URL si nécessaire
   });
   ```

## Démarrage

1. Démarrer l'application en mode développement :
   ```bash
   npm start
   ```

2. Ouvrez [http://localhost:3000](http://localhost:3000) pour voir l'application dans votre navigateur.

## Structure du projet

```
src/
├── components/
│   ├── accounts/
│   │   ├── AccountList.js
│   │   └── AccountForm.js
│   └── transactions/
│       ├── TransactionList.js
│       └── TransactionForm.js
├── context/
│   └── ApolloContext.js
├── App.js
└── index.js
```

## Technologies utilisées

- React
- Apollo Client (v3.8.0)
- GraphQL
- Material-UI (MUI)
- React Router (si nécessaire)

## Configuration requise du serveur GraphQL

L'application s'attend à ce que votre serveur GraphQL implémente les requêtes et mutations suivantes :

### Requêtes
- `accounts`: Récupère la liste des comptes
- `transactions`: Récupère l'historique des transactions

### Mutations
- `createAccount`: Crée un nouveau compte
- `createTransaction`: Effectue une opération (dépôt, retrait, virement)

## Dépannage

### Erreurs de connexion au serveur GraphQL
1. Vérifiez que le serveur GraphQL est en cours d'exécution
2. Vérifiez l'URL du serveur dans `ApolloContext.js`
3. Assurez-vous que CORS est correctement configuré sur le serveur

### Problèmes de dépendances
En cas d'erreurs liées aux dépendances, essayez :
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

<img width="1366" height="728" alt="React App - Google Chrome 11_01_2026 19_03_35" src="https://github.com/user-attachments/assets/5ade888d-0d2e-43d3-a1e1-8d10ebcdb3f7" />


```


Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
