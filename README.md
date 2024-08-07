# Telegram Miniapp Particle Network Starter

This repository provides a starter template for quickly setting up a Telegram Mini-app that integrates an EVM-compatible wallet using Account Abstraction with the Particle Network SDKs. 

> **Telegram Mini-Apps** are lightweight applications embedded directly within the Telegram messenger platform.

## Project Overview

This Mini-app serves as a demo, showcasing the integration of a Particle Auth-based wallet directly within Telegram. 

Built with:

- [@telegram-apps/create-mini-app](https://docs.telegram-mini-apps.com/packages/telegram-apps-create-mini-app)
- Next.js
- TypeSctipt
- Tailwind CSS
- [Particle Auth SDK](https://developers.particle.network/docs/building-with-particle-auth)
- [Particle AA SDK](https://developers.particle.network/reference/introduction-to-smart-waas)
- ethers.js

The main features include:

- **User Authentication**: Users can log in using Telegram, providing a streamlined authentication process integrated with Particle Auth.

- **Wallet Information Display**: Once logged in, users can view various wallet information, this to showcase UX features.

- **Gasless Transactions**: The app allows users to send gasless transactions of a native token to any address of their choice, demonstrating the capabilities of the Particle Network Account Abstraction SDK.

> Try the live <a href="https://t.me/particle_auth_demo_bot/particle" target="_blank" rel="noopener noreferrer">demo on Telegram</a>.

### App development

This project is based on Next.js. Here is a list of the main files you need to understand to get started:

- [/src/app/layout.tsx](https://github.com/soos3d/tg-miniapp-particle-starter/blob/main/src/app/layout.tsx): defines the root layout for the Telegram mini-app, setting global metadata, applying styles, and ensuring responsive design by wrapping the app's content in the Root component with proper viewport configuration.

- [src/components/Root/index.tsx](https://github.com/soos3d/tg-miniapp-particle-starter/blob/main/src/components/Root/index.tsx): The `Root` component sets up the app's main environment by configuring Particle Auth, binding theme and viewport CSS variables, and managing app states through a series of nested providers and hooks. This is the file you want to edit to add custom configuration to Particle Auth.

- [src/components/Home/index.tsx](https://github.com/soos3d/tg-miniapp-particle-starter/blob/main/src/components/Home/index.tsx): The `Home` component manages the user interface for the Telegram mini-app, handling wallet connections, smart account initialization, and navigation through tabs. This is the file you want to edit to configure the Samrt Account, the header of the app, and manage the interactive portions within the tabs.

- [src/components/EVMDemo/index.tsx](https://github.com/soos3d/tg-miniapp-particle-starter/blob/main/src/components/EVMDemo/index.tsx): The `EVMDemo` component allows users to interact with Ethereum blockchains via a smart account. The interaction is a gasless native token transfer. This is the file you edit to display more or less information and add features. This component it imported in the tabs component in `Home`.

## Getting Started

To get started with this project, follow the instructions below to set up and deploy your own Telegram Mini-app integrated with a Particle Network wallet.

### Create Bot and Mini App

Before you start, make sure you have already created a Telegram Bot.
Here is
a [comprehensive guide](https://docs.telegram-mini-apps.com/platform/creating-new-app) on how to
do it, you can stop at the step asking for a URL, you will need to deploy your app first.

### Create Particle App

You need create a Particle-Telegram app on [Dashboard](https://dashboard.particle.network/), and get the config from project information.   

Create `.env` file in the root directory and replace the placeholders.   

```env
NEXT_PUBLIC_PROJECT_ID='PROJECT_ID'
NEXT_PUBLIC_CLIENT_KEY='CLIENT_KEY'
NEXT_PUBLIC_APP_ID='APP_ID'
```

### Clone Repository:

```sh
git clone
```

### Install Dependencies

```Bash
yarn install
```

### Included Scripts

This project contains the following scripts:

- `dev`. Runs the application in development mode.
- `dev:https`. Runs the application in development mode using self-signed SSL certificate.
- `build`. Builds the application for production.
- `build:dev`. Builds the application for development.
- `start`. Starts the Next.js server in production mode.
- `lint`. Runs [eslint](https://eslint.org/) to ensure the code quality meets the required
  standards.

To run a script, use the `yarn` command:

```Bash
yarn {script}
# Example: yarn dev
```

## Run the Mini-app

Although Mini Apps are designed to be opened
within [Telegram applications](https://docs.telegram-mini-apps.com/platform/about#supported-applications),
you can still develop and test them outside of Telegram during the development process.

To run the application in the development mode, use the `dev` script:

```bash
yarn dev
```

After this, you will see a similar message in your terminal:

```bash
▲ Next.js 14.2.3
- Local:        http://localhost:3000

✓ Starting...
✓ Ready in 2.9s
```

To view the application, you need to open the `Local`
link (`http://localhost:3000` in this example) in your browser.

It is important to note that some libraries in this template, such as `@telegram-apps/sdk`, are not
intended for use outside of Telegram.

Nevertheless, they appear to function properly. This is because the `src/hooks/useTelegramMock.ts`
file, which is imported in the application's `Root` component, employs the `mockTelegramEnv`
function to simulate the Telegram environment. This trick convinces the application that it is
running in a Telegram-based environment. Therefore, be cautious not to use this function in
production mode unless you fully understand its implications.

### Run Inside Telegram

Although it is possible to run the application outside of Telegram, it is recommended to develop it
within Telegram for the most accurate representation of its real-world functionality.

To run the application inside Telegram, [@BotFather](https://t.me/botfather) requires an exposed link. Deploy the app in Vercel or expose your HTTP development server using [Ngrok](https://ngrok.com/).

## Deploy

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more
details.
