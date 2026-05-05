# Déploiement Backend sur Render.com

## Configuration Render

### 1. Variables d'environnement
Dans le dashboard Render, allez dans **Environment** et ajoutez ces variables :

| Nom | Valeur |
|-----|--------|
| `PORT` | `10000` (Render utilise ce port par défaut) |
| `MONGODB_URI` | Votre URL MongoDB Atlas (ex: `mongodb+srv://user:password@cluster0...`) |
| `JWT_SECRET` | Votre secret JWT (ex: `mysecretkey123`) |
| `FRONTEND_URL` | URL de votre frontend sur Vercel (ex: `https://votre-app.vercel.app`) |
| `PAYTECH_API_KEY` | Votre clé API PayTech |
| `PAYTECH_SECRET_KEY` | Votre clé secrète PayTech |
| `ADMIN_EMAIL` | Email admin (ex: `admin@exemple.com`) |
| `EMAIL_USER` | Email pour les notifications |
| `EMAIL_PASS` | Mot de passe email |

### 2. Configuration du service
- **Root Directory** : `servers/`
- **Build Command** : `npm install`
- **Start Command** : `node server.js`
- **Instance Type** : Free

### 3. Déploiement
1. Poussez votre code sur GitHub/GitLab
2. Créez un nouveau service Web sur Render
3. Sélectionnez votre dépôt
4. Configurez les variables d'environnement
5. Déployez !

## Vérification
Une fois déployé, testez l'URL avec `/api/ping` (ex: `https://votre-backend.onrender.com/api/ping`)
