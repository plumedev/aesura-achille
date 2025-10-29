# Vue3 + TypeScript + NuxtUI Starter Kit

Un starter moderne et complet pour débuter rapidement vos projets Vue3 avec TypeScript et NuxtUI.

## 🚀 Fonctionnalités

- **Vue 3** avec Composition API et `<script setup>`
- **TypeScript** pour un développement typé et robuste
- **NuxtUI** pour une interface utilisateur moderne et accessible
- **Vue Router** pour la navigation
- **Pinia** pour la gestion d'état
- **Vue I18n** pour l'internationalisation
- **Tailwind CSS** pour le styling utilitaire
- **Vite** pour un développement rapide
- **ESLint + Prettier** pour la qualité du code

## 📁 Structure du projet

```
src/
├── api/                    # Services API
│   └── example/           # API d'exemple
├── assets/                # Ressources statiques
│   ├── locales/          # Fichiers de traduction
│   └── styles/           # Styles CSS/SCSS
├── components/            # Composants réutilisables
│   └── ui/               # Composants UI personnalisés
├── composables/           # Logique métier réutilisable
│   └── utils/            # Utilitaires composables
├── config/                # Configuration globale
├── helpers/               # Fonctions utilitaires
├── interfaces/            # Interfaces TypeScript
├── plugins/               # Configuration des plugins
├── providers/             # Providers pour injection de dépendances
├── router/                # Configuration du routeur
├── stores/                # Stores Pinia
├── types/                 # Types TypeScript globaux
├── utils/                 # Utilitaires généraux
└── views/                 # Vues/Pages de l'application
    └── home-view/         # Vue d'accueil avec ses composables
```

## 🎨 Palette de Couleurs

Le projet utilise une palette simple et élégante avec :

- **Bleu** (`#60a5fa`) - Couleur principale
- **Rouge** (`#f87171`) - Couleur secondaire
- **Gris** - Couleurs neutres pour les arrière-plans et textes

Consultez `PALETTE_BRAND.md` pour plus de détails sur l'utilisation des couleurs.

## 🚀 Démarrage rapide

### Prérequis

- Node.js v20.19.0 ou supérieur
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone <votre-repo>
cd vue-ts-nuxtui-starter

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:8080`

### Commandes disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview

# Linter
npm run lint

# Formatage du code
npm run format
```

## 🔧 Configuration

### NuxtUI

La configuration NuxtUI se trouve dans `vite.config.ts`. Vous pouvez personnaliser les couleurs, thèmes et composants. Le projet utilise une palette personnalisée avec des couleurs bleu, rouge et gris.

### Vue I18n

Les traductions sont dans `src/assets/locales/` et `src/views/**/locales/`. Le starter est configuré pour le français par défaut.

### API

Un exemple d'API est fourni dans `src/api/example/`. L'architecture utilise des services avec des interfaces TypeScript pour une meilleure maintenabilité.

### Styles

Les styles sont organisés dans `src/assets/styles/` avec :

- `main.css` - Variables CSS personnalisées
- `scss/` - Styles SCSS modulaires
- Support complet de Tailwind CSS

## 📱 Exemple d'utilisation

Le starter inclut une page d'accueil de démonstration qui montre:

- Un appel API avec gestion d'état via composables
- L'utilisation des composants NuxtUI
- La gestion des erreurs et notifications
- L'affichage de la palette de couleurs personnalisée
- L'internationalisation avec Vue I18n

## 🎯 Architecture

### Composables

Le projet utilise des composables pour la logique métier réutilisable :

- `useRequest` - Gestion des requêtes API
- `useToast` - Notifications toast
- `useTheme` - Gestion du thème

### Stores

Gestion d'état avec Pinia :

- `exampleStore` - Store d'exemple
- `toastStore` - Gestion des notifications

### Composants

- Composants UI personnalisés dans `src/components/ui/`
- Intégration complète avec NuxtUI
- Support TypeScript complet

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- Vue.js team pour Vue 3
- NuxtUI team pour les composants UI
- Tailwind CSS pour le framework CSS
- La communauté open source pour tous les outils utilisés
