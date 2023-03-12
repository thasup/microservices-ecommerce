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

Aurapan is a beautiful women's clothing e-commerce website built with **microservices** architecture, perform server-side rendering by **Next.js**, developing on the **Google Cloud Platform** environment, integrated some CI/CD process by running automation test with **GitHub Action** workflow and deploy on **DigitalOcean** cluster with let's encrypt certificate.

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

[www.aurapan.com](https://www.aurapan.com/)

# Features

[(Back to top)](#table-of-contents)

- Fully operated **microservices-architecture** website with user, product, order, payment, and expiration services completely separated
- Stored all user, product, order, and payment data in separate **MongoDB** collections
- Login with user authentication secured by encrypting password in **JWT** and **cookie**
- Account setting dashboard for a customer to update profile information or see all orders
- Admin management dashboard with authority to add, edit, and delete a product, user, or order
- Rich detail of product information and multiple options that you can choose such as color, size
- Image display in a more fashionable design with **Swiper** library
- Full-featured shopping cart (add, edit, and remove an item with ease!)
- Fully checkout process (login, add a shipping address, select payment method)
- Accept both **PayPal** and **Stripe** integration payment method
- Mark orders as a delivered option for the admin
- Make a product review and rating and calculate a new rating instantly
- Accept coupon promotion
- Easily navigate with a cool navigation bar and breadcrumb
- Implement an **Optimistic concurrency control** concept with **Mongoose** to handle concurrency issues with event flow
- Optimize **Next.js** features to maximize better performance and quality in the _lighthouse_ report
- Safely secure **HTTPS** protocol with let's encrypt certificate
- Integrate **Google Analytics 4** script and track significant events on the website
  <!-- - Integrate wishlist in user data (work in process...) -->
  <!-- - Product search feature (work in process...) -->
  <!-- - Sorting and filtering all products on store (work in process...) -->

Something might be a bit exaggerated but one certain thing is that I put all my ❤️ into creating this project.
happy browsing! 😊

# Usage

[(Back to top)](#table-of-contents)
### How to sign up for an account
1. Browse to the [signup page](https://www.aurapan.com/signup)
2. Enter your email, password, name, gender and age (can be anything as this is a fictional store)

### How to purchase products
Pay with Stripe method (recommended)
1. Using `4242 4242 4242 4242` for a card number
2. Using any date (must be a later date from now) for `MM/YY`
3. Using any number for `CVC`

Pay with the Paypal method
1. You'll need a Paypal account
2. [Create the Paypal developer account](https://developer.paypal.com/tools/sandbox/accounts/)
3. Choose the Paypal payment method and sign in with sandbox account to pay for an order (with fake money!)

### How to receive an order
1. An order will change to `delivered` only by an admin
2. You will never get any real products (even if your order has been marked as `delivered`) 😛

### How to access the admin dashboard
1. Sign in with an admin account
2. Access via the management menu in the profile dropdown menu

### How to add your favorite product to your wishlist
Nope, you can't do it yet. Aurapan still doesn't support this feature. 😎

### How to perform CRUD operation on the product database (create, update, delete)
You need permission to access this function as an admin.

# Installation

[(Back to top)](#table-of-contents)

## Running on Google Cloud Platform

[![GCP Badge](https://img.shields.io/badge/-Google_Cloud-4285F4?style=flat&logo=googlecloud&logoColor=white)](https://cloud.google.com/gcp/)

1. clone _cloud_ branch on your computer

2. install [node.js](https://nodejs.org/en/), [skaffold](https://skaffold.dev/), [docker](https://www.docker.com/), [kubectl](https://kubernetes.io/docs/tasks/tools/)

3. sign up for a free account with $300 on the GCP and sign up for the docker hub account

4. create an image by running this command in every sub-folder that has Dockerfile
```
docker build -t <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME> .
```

5. push all images to the docker hub by running this command
```
docker push <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME>
```

6. create a new project on GCP then enable _Kubernetes Engine API_ and _Cloud Build API_ after successfully enabling API services, grant permission for the _Cloud Build_ service account permission on _Cloud Build API_

7. create a new Kubernetes cluster with the minimum resource at 3 nodes (recommended), and select any region that is closest to your location

8. install [GCP SDK](https://cloud.google.com/sdk/docs/install-sdk) to connect our images to GCP cluster context ([How to install Google Cloud SDK on macOS](https://stackoverflow.com/questions/31037279/gcloud-command-not-found-while-installing-google-cloud-sdk))

9. open google cloud SDK and log in, initiate with and then choose the correct options to proceed
```
gcloud auth login
gcloud init
```

10. create Kubernetes context in your desktop by running this command (your cluster name from the GCP cluster that you created)
```
gcloud container clusters get-credentials <YOUR_CLUSTER_NAME>
```

11. see the list of contexts and then select a new context by running these commands
```
kubectl config get-contexts
kubectl config use-context <CONTEXT_NAME>
```

12. install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start) and [ingress-nginx for GCP](https://kubernetes.github.io/ingress-nginx/deploy/#gce-gke)

13. find your load balancing port that GCP automatically generated in the _Network Services_ tab in GCP

14. for _windows_ users; open host file at `C:\Windows\System32\drivers\etc\hosts`, for _mac_ users; open host file at `\etc\hosts` then edit by adding `YOUR_LOAD_BALANCING_PORT YOUR_CUSTOM_URL` and save as an admin (ex. `56.125.456.45 custom.com`)

15. config all yaml file to matches your GCP project ID

16. create all [kubernetes secrets](#setup-env)

17. run this command then authenticate the GCP account via a web browser
```
gcloud auth application-default login
```

18. make sure to use the correct context before running this command at the root directory
```
skaffold dev
```

19. open a web browser and enter your custom URL with `https://` to see this project come to life!

## Running on Docker Desktop

[![Docker Badge](https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

1. clone _dev-mac_ branch on your computer

2. install [node.js](https://nodejs.org/en/), [skaffold](https://skaffold.dev/), [docker](https://www.docker.com/)

3. enable Kubernetes in docker desktop preferences

4. create an image by running a command in every folder that has a _Dockerfile_
```
docker build -t <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME> .
```

5. push all images to the docker hub by running a command in every folder that has a _Dockerfile_
```
docker push <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME>
```

6. see list of Kubernetes contexts and then select a new context by running these commands
```
kubectl config get-contexts
kubectl config use-context docker-desktop
```

7. install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start) and enable Kubernetes in Docker Desktop software

8. for _windows_ users; open host file at `C:\Windows\System32\drivers\etc\hosts`, for _mac_ users; open host file at `\etc\hosts` then edit by adding `127.0.0.1 YOUR_CUSTOM_URL` and save as an admin (ex. `127.0.0.1 custom.com`)

9. config all yaml file to match your custom URL

10. create all [kubernetes secrets](#setup-env)

11. run `skaffold dev` in this project root directory, and make sure to use the correct context before running the command

12. open a web browser and enter your custom URL with `https://` to see this project come to live!

# Setup Kubernetes Secret

[(Back to top)](#table-of-contents)

Create all these Kubernetes secrets in Kubernetes context

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

- Next.js
- TypeScript
- React-Bootstrap
- MongoDB
- Docker
- Kubernetes
- Github Action
- NATS Streaming Server
- Skaffold
- NPM package

# Disclaimer

[(Back to top)](#table-of-contents)

All images are used for educational purposes in this fictional store 😉
