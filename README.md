# LNJ Coiffure — Logiciel de Caisse

Application de caisse professionnelle pour salon de coiffure.
React + Vite + Supabase (base de données publique) + déploiement automatique GitHub Pages.

**Aucune installation locale de Node.js n'est nécessaire** : GitHub construit l'application pour toi, automatiquement, à chaque modification.

---

## 🗂️ Structure du projet

```
lnj-coiffure/
├── .github/workflows/deploy.yml   # Déploiement automatique GitHub Pages
├── supabase/schema.sql            # Schéma de la base de données
├── src/
│   ├── screens/                   # Accueil, Main (caisse), Gerant, PinLogin
│   ├── components/
│   │   ├── ui/                    # Modal, SuccessOverlay, PriceRangeModal
│   │   └── gerant/                # GerantStats, Rapports, TarifsEditor, Reglages
│   ├── data/tarifs.js             # Tarifs par défaut (secours hors-ligne)
│   ├── utils/
│   │   ├── supabaseClient.js      # Connexion à la base de données
│   │   ├── db.js                  # Toutes les requêtes (lecture/écriture)
│   │   ├── format.js              # Dates, montants
│   │   └── pdf.js                 # Génération des rapports PDF
│   ├── styles/global.css          # Design system "Atelier Moderne"
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Étape 1 — Créer la base de données (Supabase)

1. Va sur **[supabase.com](https://supabase.com)** → crée un compte gratuit
2. Clique **"New Project"** → nomme-le `lnj-coiffure` → choisis un mot de passe → région **Europe (Paris/Frankfurt)**
3. Une fois le projet créé, va dans **SQL Editor** (menu de gauche)
4. Clique **"New query"**, colle tout le contenu du fichier **`supabase/schema.sql`**, puis clique **Run**
   → Cela crée les 4 tables (transactions, closures, tarifs, settings) et insère les tarifs de départ.
5. Va dans **Project Settings → API**
   → Note ton **Project URL** et ta clé **anon public**

---

## 🚀 Étape 2 — Publier sur GitHub (sans rien installer)

1. Va sur **[github.com](https://github.com)** → connecte-toi
2. Clique **"New repository"** → nomme-le exactement **`lnj-coiffure`** → coche **Public** → **Create repository**
3. Sur la page du dépôt vide, clique **"uploading an existing file"**
4. Glisse **tous les fichiers et dossiers** de ce projet (sauf `node_modules` et `.env` s'ils existent)
5. Clique **Commit changes**

### Ajouter les clés Supabase en secret (sécurisé)

6. Dans le dépôt GitHub → **Settings → Secrets and variables → Actions**
7. Clique **"New repository secret"** → ajoute :
   - Nom : `VITE_SUPABASE_URL` → Valeur : ton Project URL Supabase
   - Nom : `VITE_SUPABASE_ANON_KEY` → Valeur : ta clé anon public

### Activer GitHub Pages

8. Dans **Settings → Pages** → Source : sélectionne **"GitHub Actions"**
9. Va dans l'onglet **Actions** du dépôt → le déploiement démarre automatiquement (≈ 2 min)
10. Une fois terminé (coche verte ✅), ton appli est en ligne à :
    ```
    https://TON-NOM-UTILISATEUR.github.io/lnj-coiffure/
    ```

---

## 📱 Étape 3 — Installer sur la tablette

1. Ouvre le lien ci-dessus dans **Safari** (iPad) ou **Chrome** (Android)
2. Appuie sur **Partager** → **"Sur l'écran d'accueil"**
3. L'appli s'installe comme une vraie application, avec son icône

---

## 🔄 Pour modifier l'application plus tard

Toute modification de fichier sur GitHub (édition directe dans le navigateur, via le bouton crayon ✏️) relance automatiquement le déploiement. Pas besoin d'ordinateur ni de Node.js.

---

## 🔑 Accès Gérant
PIN par défaut : **1234** (modifiable depuis Gérant → Réglages, sauvegardé dans la base de données).

---

## 💾 Données & historique des factures

Toutes les transactions et clôtures sont stockées dans **Supabase** (base de données réelle, jamais perdue) :
- Visible depuis n'importe quel appareil connecté
- Historique complet consultable dans **Gérant → Rapports**
- Recherche par coiffeuse ou par date
- Export PDF disponible à tout moment, même pour une journée passée

---

## 💻 (Optionnel) Développement en local

Si un jour tu as accès à un ordinateur où installer Node.js :

```bash
npm install
cp .env.example .env   # puis renseigne tes clés Supabase dans .env
npm run dev
```
