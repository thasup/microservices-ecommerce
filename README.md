<!-- Add banner here -->

![Project Preview](docs/aurapan-shop-banner-1.jpg)

# Aurapan

<!-- Describe your project in brief -->

<!-- [![deploy-manifests](https://github.com/thasup/microservices-ecommerce/actions/workflows/deploy-manifests.yaml/badge.svg)](https://github.com/thasup/microservices-ecommerce/actions/workflows/deploy-manifests.yaml) -->

[![deploy-client](https://github.com/thasup/microservices-ecommerce/actions/workflows/deploy-client.yaml/badge.svg)](https://github.com/thasup/microservices-ecommerce/actions/workflows/deploy-client.yaml)
[![deploy-user](https://github.com/thasup/microservices-ecommerce/actions/workflows/deploy-user.yml/badge.svg)](https://github.com/thasup/microservices-ecommerce/actions/workflows/deploy-user.yml)
[![deploy-product](https://github.com/thasup/microservices-ecommerce/actions/workflows/deploy-product.yaml/badge.svg)](https://github.com/thasup/microservices-ecommerce/actions/workflows/deploy-product.yaml)
[![deploy-order](https://github.com/thasup/microservices-ecommerce/actions/workflows/deploy-order.yaml/badge.svg)](https://github.com/thasup/microservices-ecommerce/actions/workflows/deploy-order.yaml)
[![deploy-payment](https://github.com/thasup/microservices-ecommerce/actions/workflows/deploy-payment.yaml/badge.svg)](https://github.com/thasup/microservices-ecommerce/actions/workflows/deploy-payment.yaml)

Aurapan is a women's clothing e-commerce website that features a fully operational **microservices architecture**. Built on the **Next.js** framework for the client-side, while the server-side is developed with **TypeScript and Express** framework, the website is developed on the **Google Cloud Platform** environment and integrated with automation testing through **GitHub Action** workflows. Deployed on a **DigitalOcean** cluster with a Let's Encrypt certificate, Aurapan delivers a secure and seamless shopping experience.

# Table of contents

- [Aurapan](#aurapan)
- [Table of contents](#table-of-contents)
- [Demo](#demo)
- [Features](#features)
- [Usage](#usage)
- [Installation](#installation)
- [Setup Kubernetes Secret](#setup-kubernetes-secret)
- [Deployment](#deployment)
- [Technology](#technology)
- [Disclaimer](#disclaimer)

# Demo

[(Back to top)](#table-of-contents)

<!-- The Live demo is currently _**terminated**_ due to the high-cost maintenance for paying Kubernetes cluster to host the microservices website. -->

<!-- _You can still run it manually with docker-desktop on a local computer._ -->

To experience Aurapan, please visit [www.aurapan.com](https://www.aurapan.com/). 

# Features

[(Back to top)](#table-of-contents)

Aurapan's features include:

- A fully operational **microservices-architecture** website with user, product, order, payment, and expiration services completely separated.
- All user, product, order, and payment data is stored in separate **MongoDB** collections.
- User authentication secured by encrypting passwords using **JWT** and cookies.
- A customer account settings dashboard to update profile information or see all orders.
- An admin management dashboard with the authority to add, edit, and delete a product, user, or order.
- Detailed product information with multiple options, such as color and size, displayed in a fashionable design with the **Swiper** library.
- A full-featured shopping cart, including the ability to add, edit, and remove items.
- A fully functional checkout process, including login, shipping address selection, and payment method selection.
- Acceptance of both **PayPal and Stripe** integration payment methods.
- Ability for an admin to mark orders as delivered.
- The ability for customers to make product reviews and ratings with instant calculation of new ratings.
- The ability to accept coupon promotions.
- A cool navigation bar and breadcrumb for easy navigation.
- Implementation of the **Optimistic concurrency control** concept with Mongoose to handle concurrency issues with event flow.
- Optimization of **Next.js** features to maximize performance and quality in the Lighthouse report.
- A safely secured **HTTPS protocol** with Let's Encrypt certificate.
- Integration of **Google Analytics 4** script to track significant events on the website.
  <!-- - Integrate wishlist in user data (work in process...) -->
  <!-- - Product search feature (work in process...) -->
  <!-- - Sorting and filtering all products on store (work in process...) -->

	<!--
	Something might be a bit exaggerated but one certain thing is that I put all my ❤️ into creating this project.
	happy browsing! 😊
	-->

# Usage

[(Back to top)](#table-of-contents)

This readme file provides an overview of the usage of the Aurapan website. Here are some instructions on how to use the website's features:

## Sign up for an account
1. To create an account, visit the [signup page](https://www.aurapan.com/signup).
2. Enter your email, password, name, gender, and age (these can be fictional since Aurapan is a fictional store).

## Purchase products
### Pay with Stripe method (recommended)
1. Use the following card number: `4242 4242 4242 4242`.
2. Use any future date for `MM/YY`.
3. Use any number for `CVC`.

### Pay with the PayPal method
1. You will need a PayPal account.
2. Create a PayPal developer account by visiting [https://developer.paypal.com/tools/sandbox/accounts/](https://developer.paypal.com/tools/sandbox/accounts/).
3. Choose the PayPal payment method and sign in with your sandbox account to pay for an order (with fake money).

## Receive an order
1. Only an admin can change an order status to `delivered`.
2. You will never receive any real products (even if your order has been marked as `delivered`). 😛

## Access the admin dashboard
1. To access the admin dashboard, sign in with an admin account.
2. Access the dashboard through the management menu in the profile dropdown menu.

## Add a product to your wishlist
Unfortunately, this feature is not yet available on Aurapan. 😎

## Perform CRUD operations on the product database (create, update, delete)
To perform CRUD operations on the product database, you need permission to access this function as an admin.

# Installation

[(Back to top)](#table-of-contents)

## Running on Google Cloud Platform

[![GCP Badge](https://img.shields.io/badge/-Google_Cloud-4285F4?style=flat&logo=googlecloud&logoColor=white)](https://cloud.google.com/gcp/)

Follow these steps to run the project on Google Cloud Platform:

1. Clone the _cloud_ branch to your local machine.

2. Install [Node.js](https://nodejs.org/en/), [Skaffold](https://skaffold.dev/), [Docker](https://www.docker.com/), and [kubectl](https://kubernetes.io/docs/tasks/tools/).

3. Sign up for a free account with $300 on GCP and create a Docker Hub account.

4. In every sub-folder that has a Dockerfile, create an image using the following command:
```
docker build -t <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME> .
```

5. Push all images to the Docker Hub using the following command:

```
docker push <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME>
```

6. Create a new project on GCP and enable _Kubernetes Engine API_ and _Cloud Build API_. After successfully enabling API services, grant permission for the _Cloud Build_ service account permission on _Cloud Build API_.

7. Create a new Kubernetes cluster with the minimum resource of 3 nodes (recommended) and select the region closest to your location.

8. Install [GCP SDK](https://cloud.google.com/sdk/docs/install-sdk) to connect our images to the GCP cluster context. (Learn how to install Google Cloud SDK on macOS [here](https://stackoverflow.com/questions/31037279/gcloud-command-not-found-while-installing-google-cloud-sdk))

9. Open the Google Cloud SDK and log in. Initiate and then choose the correct options to proceed by running the following commands:

```
gcloud auth login
gcloud init
```

10. Create a Kubernetes context on your desktop by running this command (replace `<YOUR_CLUSTER_NAME>` with the name of the cluster you created on GCP):

```
gcloud container clusters get-credentials <YOUR_CLUSTER_NAME>
```

11. See the list of contexts and then select a new context by running these commands:

```
kubectl config get-contexts
kubectl config use-context <CONTEXT_NAME>
```

12. Install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start) and [ingress-nginx for GCP](https://kubernetes.github.io/ingress-nginx/deploy/#gce-gke).

13. Find your load balancing port, which GCP automatically generated, in the _Network Services_ tab in GCP.

14. For _Windows_ users, open the host file at `C:\Windows\System32\drivers\etc\hosts`. For _Mac_ users, open the host file at `\etc\hosts`. Then, edit the file by adding `YOUR_LOAD_BALANCING_PORT YOUR_CUSTOM_URL` and save as an administrator (e.g., `56.125.456.45 custom.com`).

15. Configure all the YAML files to match your GCP project ID.

16. Create all [Kubernetes secrets](#setup-env).

17. Run the following command and authenticate the GCP account via a web browser:

```
gcloud auth application-default login
```

18. Ensure that you are using the correct context before running this command at the root directory:

```
skaffold dev
```

19. Open a web browser and enter your custom URL with `https://` to see the project come to life

## Running on Docker Desktop

[![Docker Badge](https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

Follow the below steps to run this project on Docker Desktop:

1. Clone the `dev` branch on your computer.

2. Install the following software: 
   * [Node.js](https://nodejs.org/en/)
   * [Skaffold](https://skaffold.dev/)
   * [Docker](https://www.docker.com/)

3. Enable Kubernetes in Docker Desktop preferences.

4. Create an image by running the following command in every folder that has a `Dockerfile`:

```
docker build -t <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME> .
```

5. Push all images to Docker Hub by running the following command in every folder that has a `Dockerfile`:

```
docker push <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME>
```

6. View the list of Kubernetes contexts and select a new context by running these commands:

```
kubectl config get-contexts
kubectl config use-context docker-desktop
```

7. Install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start) and enable Kubernetes in Docker Desktop software.

8. For Windows users, open the host file at `C:\Windows\System32\drivers\etc\hosts`. For Mac users, open the host file at `/etc/hosts`. Then, add `127.0.0.1 YOUR_CUSTOM_URL` and save the file as an admin. For example, `127.0.0.1 custom.com`.

9. Configure all `yaml` files to match your custom URL.

10. Create all [Kubernetes secrets](#setup-kubernetes-secret).

11. Run `skaffold dev` in the root directory of this project, and make sure to use the correct context before running the command.

12. Open a web browser and enter your custom URL with `https://` to see this project come to life!

# Setup Kubernetes Secret

[(Back to top)](#table-of-contents)

Create all these Kubernetes secrets in the Kubernetes context:

**MONGO_URI_USER, MONGO_URI_PRODUCT, MONGO_URI_ORDER, MONGO_URI_PAYMENT** : [MongoDB](https://www.mongodb.com/)
```
kubectl create secret generic mongo-secret \
"--from-literal=MONGO_URI_PRODUCT=<YOUR_MONGO_DB_URI>" \
"--from-literal=MONGO_URI_USER=<YOUR_MONGO_DB_URI>" \
"--from-literal=MONGO_URI_ORDER=<YOUR_MONGO_DB_URI>" \
"--from-literal=MONGO_URI_PAYMENT=<YOUR_MONGO_DB_URI>"
```

**JWT_KEY : --whatever you want--**
```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<YOUR SECRET>
```

**STRIPE_KEY** : [Stripe](https://stripe.com/)
```
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<YOUR_STRIPE_KEY>
```

**PAYPAL_CLIENT_ID** : [Paypal](https://developer.paypal.com/home)
```
kubectl create secret generic paypal-secret --from-literal=PAYPAL_CLIENT_ID=<YOUR_PAYPAL_CLIENT_ID>
```

# Deployment

[(Back to top)](#table-of-contents)

## Deploy on DigitalOcean

[![DigitalOcean](https://img.shields.io/badge/DigitalOcean-0080FF?style=flat&logo=digitalocean&logoColor=white)](https://www.digitalocean.com/)

1. sign up a free account with a $200 for 60 days trial and create a Kubernetes cluster in a new project on Digital Ocean

2. generate a new access token on Digital Ocean to connect with Digital Ocean via doctl, go to the _API_ menu then click _generate a new token_, set expiration date and enable both read and write scopes, copy the _token code_ for use in the next step

3. install [doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/) and [kubectl](https://kubernetes.io/docs/tasks/tools/), then run
```
doctl auth init --access-token <API_TOKEN_CODE>
```

4. connect with Digital Ocean k8s cluster context by running this command and authorize with your credentials
```
doctl kubernetes cluster kubeconfig save <YOUR_CLUSTER_NAME>
``` 

5. switch Kubernetes context to the new context by running
```
kubectl config use-context <CONTEXT_NAME>
```

6. setup all Kubernetes secrets following [this step](#setup-kubernetes-secret)

7. create _GitHub _workflow_ for building an initial docker image on push event at the _main_ branch and perform automated testing in every service on pull request event trigger with trying to merge with the _main_ branch

```
name: deploy-client

on:
  push:
    # watch for pull request into main branch
    branches:
      - main

    # watch for changes in client folder
    paths:
      - "client/**"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      # build an image
      - run: cd client && docker build -t <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME> .

      # login on docker hub
      - run: docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
        env:
          DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
          DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}

      # push an image to docker hub
      - run: docker push <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME>
```

8. generate another new access token on Digital Ocean for authentication via GitHub Action, go to the _API_ menu then click _generate a new token_, set expiration date and enable both read and write scopes, copy the _token code_ for use in the next step as a `DIGITALOCEAN_ACCESS_TOKEN` 

9. add GitHub action secrets for _docker credentials_ and _digitalocean access token key_ at the security setting in the repository
```
DIGITALOCEAN_ACCESS_TOKEN = 
DOCKER_USERNAME = 
DOCKER_PASSWORD = 
```

10. edit files in every service then commit code to the _main_ branch for triggering **Github Action workflows** to build and push all images to your Docker Hub

11. install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean) to automatically create **DigitalOcean Load Balancer**

12. separate k8s folder to k8s-dev and k8s-prod then copy `ingress-srv.yaml` file to both folders and edit the host URL to a new domain name

13. create a GitHub workflow for telling the Kubernetes cluster to use images we built by adding these lines

```
- uses: digitalocean/action-doctl@v2
  with:
    token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
- run: doctl kubernetes cluster kubeconfig save <YOUR_CLUSTER_NAME>
- run: kubectl rollout restart deployment <YOUR_DEPLOYMENT_NAME>
```

14. purchase a domain name with a promotion that can be very cheap as $1 for the 1st year such as Namecheap, Porkbun, or Dynadot

15. config custom domain name nameserver with your domain name registration website by custom adding these lines
```
ns1.digitalocean.com
ns2.digitalocean.com
ns3.digitalocean.com
```

16. add a domain name in the Digital Ocean at networking tab then create a new record

```
// A record
HOSTNAME: @
WILL DIRECT TO: <YOUR_LOAD_BALANCER>
TTL: 30

// CNAME record
HOSTNAME: www
IN AN ALIAS OF: @
TTL: 30
```

17. add your cluster name at `deploy-manifests.yaml` file then redo step 7. again

```
name: deploy-manifests

on:
  push:
    # watch for pull request into main branch
    branches:
      - main

    # watch for changes in infra folder
    paths:
      - "infra/**"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      # use and cliententicate doctl
      - uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

      # use and cliententicate doctl
      - run: doctl kubernetes cluster kubeconfig save <YOUR_CLUSTER_NAME>

      # apply deployment yaml files (k8s-prod is for production!)
      - run: kubectl apply -f infra/k8s && kubectl apply -f infra/k8s-prod
```

18. change `do-loadbalancer-hostname` and `host` at file `infra/k8s-prod/ingress-srv.yaml` to your domain name

19. change the URL in `client/api/build-client.js` to your domain name

20. after that, we will follow step 4 of this guide [How to Set Up an Nginx Ingress with Cert-Manager on DigitalOcean Kubernetes](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-with-cert-manager-on-digitalocean-kubernetes) to make our website ready for **HTTPS** requests with the certificate issued by **Let's encrypt**

21. begin with installing the _cert-manager_ namespace by running the command
```
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.7.1/cert-manager.yaml
```

22. change your directory to `infra/issuer/` there will be 2 files that you need to change the _email_ and _name of a secret key_ as you wish then run the command
```
kubectl create -f staging_issuer.yaml
``` 
```
kubectl create -f production_issuer.yaml
```

23. at file `infra/k8s-prod/ingress-srv.yaml` change _cert-manager.io/cluster-issuer_ to `"letsencrypt-staging"` then run this command at `infra/k8s-prod/` directory
```
kubectl apply -f ingress-srv.yaml
```

24. then change _cert-manager.io/cluster-issuer_ back to `"letsencrypt-prod"` and run this command at `infra/k8s-prod/` directory
```
kubectl apply -f ingress-srv.yaml
```

25. waiting around 2-15 minutes for setting up then browse your website with **HTTPS** protocol

# Technology

[(Back to top)](#table-of-contents)

This project is built using the following technologies:

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [React-Bootstrap](https://react-bootstrap.github.io/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/)
- [Github Action](https://github.com/features/actions)
- [NATS Streaming Server](https://docs.nats.io/nats-streaming-concepts/intro)
- [Skaffold](https://skaffold.dev/)
- [NPM package](https://www.npmjs.com/)

# Disclaimer

[(Back to top)](#table-of-contents)

All images used in this project are for educational purposes only. 😘

