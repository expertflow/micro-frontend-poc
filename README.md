# Microfrontend Angular Module Federation POC

This repository contains a proof-of-concept (POC) demonstrating the use of Angular with Module Federation to create a microfrontend architecture. It includes three Angular projects: one host application and two remote microfrontend applications that share frontend modules using the `@angular-architects/module-federation` library. Additionally, it implements communication between the host and microfrontends using `postMessage` and `BehaviorSubject`.

## Table of Contents

- Overview
- Project Structure
- Prerequisites
- Setup Instructions
- Running the Applications
- Project Details
  - Host App (host-app)
  - Microfrontend 1 (mfe1)
  - Microfrontend 2 (mfe2)
- Module Federation Configuration
- Communication Techniques
  - PostMessage
  - BehaviorSubject
- Contributing
- License

## Overview

This POC showcases how to implement a microfrontend architecture in Angular using Module Federation. The `host-app` acts as the main application that dynamically loads modules from two remote microfrontends (`mfe1` and `mfe2`). The microfrontends expose specific modules or components, which are consumed by the host application. Communication between the host and microfrontends is achieved using `postMessage` for direct messaging and `BehaviorSubject` for shared state management.

- **host-app**: The main application that integrates remote microfrontends.
- **mfe1**: A remote microfrontend exposing an `OrderModule` and implementing communication.
- **mfe2**: A remote microfrontend exposing a component.

## Project Structure

```
microfrontend-angular-poc/
├── host-app/               # Host application
├── mfe1/                   # Microfrontend 1 (remote)
├── mfe2/                   # Microfrontend 2 (remote)
├── README.md               # This file
```

## Prerequisites

Ensure you have the following installed:

- **Angular CLI**: 14.2.13
- **Node.js**: 16.20.2
- **npm**: 8.19.4
- A modern web browser (e.g., Chrome, Firefox)

## Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/microfrontend-angular-poc.git
   cd microfrontend-angular-poc
   ```

2. **Install Dependencies**: Navigate to each project folder (`host-app`, `mfe1`, `mfe2`) and run:

   ```bash
   npm install
   ```

3. **Create the Projects** (if starting from scratch): Use the following commands to create and configure the projects:

   ```bash
   # Create host-app
   ng new host-app
   cd host-app
   ng add @angular-architects/module-federation@14.3.0 --type=host --project=host-app --port=4000
   cd ..
   
   # Create mfe1
   ng new mfe1
   cd mfe1
   ng add @angular-architects/module-federation@14.3.0 --type=remote --project=mfe1 --port=4100
   cd ..
   
   # Create mfe2
   ng new mfe2
   cd mfe2
   ng add @angular-architects/module-federation@14.3.0 --type=remote --project=mfe2 --port=4200
   cd ..
   ```

## Running the Applications

1. **Start the Applications**: Run each application in a separate terminal:

   ```bash
   # Start host-app
   cd host-app
   ng serve
   ```

   ```bash
   # Start mfe1
   cd mfe1
   ng serve
   ```

   ```bash
   # Start mfe2
   cd mfe2
   ng serve
   ```

2. **Access the Host Application**: Open your browser and navigate to `http://localhost:4000`. You will see the host application with links to load `mfe1` and `mfe2`.

## Project Details

### Host App (host-app)

- **Port**: 4000
- **Purpose**: Acts as the main application that consumes remote modules from `mfe1` and `mfe2`.
- **Key Files**:
  - `src/app/app-routing.module.ts`: Defines routes for the home page and lazy-loaded remote modules.
  - `src/app/app.component.html`: Contains navigation links to `mfe1` and `mfe2`.
  - `src/app/app.component.ts`: Implements communication using `postMessage` and `BehaviorSubject`.
  - `webpack.config.js`: Configures Module Federation to consume `mfe1` and shared dependencies.

### Microfrontend 1 (mfe1)

- **Port**: 4100
- **Purpose**: Exposes an `OrderModule` that includes an `OrderComponent` and implements communication.
- **Key Files**:
  - `src/app/order/order.module.ts`: Defines the `OrderModule` exposed via Module Federation.
  - `src/app/order/order.component.ts`: Implements communication using `postMessage` and `BehaviorSubject`.
  - `src/app/app-routing.module.ts`: Configures routing to load the `OrderModule`.
  - `webpack.config.js`: Exposes the `OrderModule` and shares dependencies.

### Microfrontend 2 (mfe2)

- **Port**: 4200
- **Purpose**: Exposes a component `AppComponent`.
- **Key Files**:
  - `src/app/app.component.ts`: The main component exposed via Module Federation.
  - `webpack.config.js`: Exposes the `AppComponent` and shares dependencies.

## Module Federation Configuration

Module Federation is configured in the `webpack.config.js` files of each project:

- **host-app**: Declares `mfe1` as a remote and shares dependencies.
- **mfe1**: Exposes the `OrderModule` and shares dependencies.
- **mfe2**: Exposes the `AppComponent` and shares dependencies.

The `@angular-architects/module-federation` library ensures singleton sharing of dependencies to avoid conflicts.

## Communication Techniques

This POC implements two communication techniques between the host application and microfrontends:

### PostMessage

- **Description**: Uses the `postMessage` API to enable direct messaging between the host and microfrontends.
- **Implementation**:
  - In `host-app` (`app.component.ts`):
    - Listens for messages from `mfe1` using `window.addEventListener('message', ...)`.
    - Sends messages to `mfe1` using `window.parent.postMessage`.
    - Filters messages by origin (`http://localhost:4000`) and ignores Webpack-specific messages.
  - In `mfe1` (`order.component.ts`):
    - Listens for messages from the host using `window.addEventListener('message', ...)`.
    - Sends messages to the host using `window.parent.postMessage`.
    - Filters messages by origin (`http://localhost:4000`) and ignores Webpack-specific messages.
- **Usage**: Allows bidirectional communication for simple data exchange (e.g., strings).

### BehaviorSubject

- **Description**: Uses RxJS `BehaviorSubject` to share state between the host and microfrontends.
- **Implementation**:
  - In `host-app` (`app.component.ts`):
    - Creates a `BehaviorSubject` and attaches it to the `window` object as `sharedSubject`.
    - Subscribes to `sharedSubject` to receive updates from microfrontends.
  - In `mfe1` (`order.component.ts`):
    - Checks for the existence of `sharedSubject` on the `window` object.
    - Emits new values to `sharedSubject` using `.next()`.
- **Usage**: Facilitates reactive state sharing, allowing components to respond to state changes.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.