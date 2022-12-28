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

Aurapan is the beautiful women's clothing e-commerce website built with **microservices** architecture, perform server-side rendering by **Next.js**, developing on **Google Cloud Platform** environment, integrated some CI/CD process by running automation test with **GitHub Action** workflow and deploy on **DigitalOcean** cluster with let's encrypt certificate.

# Table of contents

- [Aurapan](#aurapan)
- [Table of contents](#table-of-contents)
- [Demo](#demo)
- [Features](#features)
- [Usage](#usage)
- [Installation](#installation)
- [Setup Kubernetes Secret](#setup-kubernetes-secret)
- [Deployment](#deployment)
- [Disclaimer](#disclaimer)

# Demo

[(Back to top)](#table-of-contents)

<!-- The Live demo is currently _**terminated**_ due to the high-cost maintenance for paying Kubernetes cluster to host microservices website. -->

<!-- _You can still run it manually with docker-desktop on a local computer._ -->

[https://www.aurapan.com](https://www.aurapan.com/)

# Features

[(Back to top)](#table-of-contents)

- Fully operated **microservices-architecture** website with user, product, order, payment, and expiration services completely separated
- Stored all user, product, order, payment data in separated **MongoDB** collections
- Login with user authentication secured by encrypting password in **JWT** and **cookie**
- Account setting dashboard for a customer to update profile information or see all orders
- Admin management dashboard with authority to add, edit, delete a product, user, or order
- Rich detail of product information and multiple options that you can choose such as color, size
- Image display in a more fashionable design with **Swiper** library
- Full-featured shopping cart (add, edit, remove an item with ease!)
- Fully checkout process (login, add a shipping address, select payment method)
- Accept both **PayPal** and **Stripe** integration payment method
- Mark orders as a delivered option for admin
- Make a product review and rating and calculate new rating instantly
- Accept coupon promotion
- Easily navigate with a cool navigation bar and breadcrumb
- Implement **Optimistic concurrency control** concept with **Mongoose** to handle concurrency issue with event flow
- Optimize **Next.js** features to maximize better performance and quality in _lighthouse_ report
- Safely secure **HTTPS** protocol with let's encrypt certificate
- Integrate **Google Analytics 4** script and track significant events on the website
  <!-- - Integrate wishlist in user data (work in process...) -->
  <!-- - Product search feature (work in process...) -->
  <!-- - Sorting and filtering all product on store (work in process...) -->

Something might be a bit exaggerated but one certain thing is that I put all my ❤️ into creating this project.
happy browsing! 😊

# Usage

[(Back to top)](#table-of-contents)
### How to sign up an account
1. Browse to the [sign up page](https://www.aurapan.com/signup)
2. Enter your email, password, name, gender and age (can be anything as this is a fictional store)

### How to purchase products
Pay with Stripe method (recommended)
1. Using `4242 4242 4242 4242` for a card number
2. Using any date (must be later date from now) for `MM/YY`
3. Using any number for `CVC`

Pay with Paypal method
1. You'll need a Paypal account
2. [Create Paypal developer account](https://developer.paypal.com/tools/sandbox/accounts/)
3. Choose Paypal payment method and sign in with sandbox account to pay for an order (with fake money!)

### How to recieve an order
1. An order will change to `delivered` only by an admin
2. You will never get any real products (even if your order has been marked as `delivered`) 😛

### How to access admin dashboard
1. Sign in with an admin account
2. Access via management menu in profile dropdown menu

### How to add your favorite product to wishlist
Nope, you can't do it yet. Aurapan still doesn't support this feature. 😎

### How to perform CRUD operation on the product database (create, update, delete)
You need a permission to access this function as an admin.

# Installation

[(Back to top)](#table-of-contents)

**Running on Google Cloud Platform**

[![GCP Badge](https://img.shields.io/badge/-Google_Cloud-4285F4?style=flat&logo=googlecloud&logoColor=white)](https://cloud.google.com/gcp/)

1. clone _cloud_ branch on your computer
2. install [node.js](https://nodejs.org/en/), [skaffold](https://skaffold.dev/), [docker](https://www.docker.com/), [kubectl](https://kubernetes.io/docs/tasks/tools/)
3. sign up free account with $100 on google cloud and sign up docker hub account
4. create an image by run this command in every sub-folder that has Dockerfile
```
docker build -t <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME> .
```
5. push all images to docker hub by run this command
```
docker push <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME>
```
6. create a new project on GCP then enable _Kubernetes Engine API_ and _Cloud Build API_ after successfully enable api services, grant permission for _Cloud Build_ service account permission on _Cloud Build API_
7. create a new kubernetes cluster with minimum resource at 3 nodes (recommended), and select any region that closest to your location
8. install [GCP SDK](https://cloud.google.com/sdk/docs/install-sdk) to connect our images to GCP cluster context
9. open google cloud SDK and log in, initiate with and then choose the correct options to proceed
```
gcloud auth login
gcloud init
```
10. create kubernetes context in your desktop by run this command (your cluster name from GCP cluster that you created)
```
gcloud container clusters get-credentials <YOUR_CLUSTER_NAME>
```
11. see list of contexts and then selecting a new context by run these commands
```
kubectl config get-contexts
kubectl config use-context <CONTEXT_NAME>
```
12. install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start) and [ingress-nginx for GCP](https://kubernetes.github.io/ingress-nginx/deploy/#gce-gke)
13. find your load balancing port that GCP automatic generated in _Network Services_ tab in GCP
14. for _windows_ users; open host file at `C:\Windows\System32\drivers\etc\hosts`, for _mac_ users; open host file at `\etc\hosts` then edit by adding `YOUR_LOAD_BALANCING_PORT YOUR_CUSTOM_URL` and save as an admin (ex. `56.125.456.45 custom.com`)
15. config all yaml files to matches your GCP project ID
16. create all [kubernetes secrets](#setup-env)
17. run this command then authenticate GCP account via web browser
```
gcloud auth application-default login
```
18. make sure to use correct context before run this command at root directory
```
skaffold dev
```
19. open a web browser enter your custom URL with `https://` to see this project come to live!

**Running on Docker Desktop**

[![Docker Badge](https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)

1. clone _dev-mac_ branch on your computer
2. install [node.js](https://nodejs.org/en/), [skaffold](https://skaffold.dev/), [docker](https://www.docker.com/)
3. enable kubernetes in docker desktop preferences
4. create an image by run a command in every folder that has a _Dockerfile_
```
docker build -t <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME> .
```
5. push all images to docker hub by run a command in every folder that has a _Dockerfile_
```
docker push <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME>
```
6. see list of kubernetes contexts and then selecting a new context by running these commands
```
kubectl config get-contexts
kubectl config use-context docker-desktop
```
7. install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start) and enable kubernetes in Docker Desktop software
8. for _windows_ users; open host file at `C:\Windows\System32\drivers\etc\hosts`, for _mac_ users; open host file at `\etc\hosts` then edit by adding `127.0.0.1 YOUR_CUSTOM_URL` and save as an admin (ex. `127.0.0.1 custom.com`)
9. config all yaml files to matches your custom URL
10. create all [kubernetes secrets](#setup-env)
11. run `skaffold dev` in this project root directory, make sure to use correct context before run the command
12. open a web browser enter your custom URL with `https://` to see this project come to live!

# Setup Kubernetes Secret

[(Back to top)](#table-of-contents)

Create all these kubernetes secrets in kubernetes context

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

**Deploy on DigitalOcean**

[![DigitalOcean](https://img.shields.io/badge/DigitalOcean-0080FF?style=flat&logo=digitalocean&logoColor=white)](https://www.digitalocean.com/)

1. sign up free account with $200 for 60 days trial and create a kubernetes cluster in new project on Digital Ocean
2. generate new access token from Digital Ocean, install [doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/) and [kubectl](https://kubernetes.io/docs/tasks/tools/), then run
```
doctl auth init
```
3. connect with Digital Ocean k8s cluster context by running this command and authorize with your credentials
```
doctl kubernetes cluster kubeconfig save <YOUR_CLUSTER_NAME>
``` 
4. switch kubernetes context to the new context by running
```
kubectl config use-context <CONTEXT_NAME>
```
5. create _github workflow_ for build an initial docker image on push event at the _main_ branch and perform automate testing in every services on pull request event trigger with trying to merge with the _main_ branch

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

6. add github action secrets for _docker credentials_ and _digitalocean access token key_ at security setting in repository
```
DIGITALOCEAN_ACCESS_TOKEN = 
DOCKER_USERNAME = 
DOCKER_PASSWORD = 
```
7. edit files in every services then commit code to the _main_ branch for triggering **Github Action workflows** to build and push all images to your Docker Hub
8. install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean) for **DigitalOcean**
9. separate k8s folder to k8s-dev and k8s-prod then copy `ingress-srv.yaml` file to both folders and edit host URL to a new domain name
10. create github workflow for telling kubernetes cluster to use images we built by adding these lines

```
- uses: digitalocean/action-doctl@v2
  with:
    token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
- run: doctl kubernetes cluster kubeconfig save <YOUR_CLUSTER_NAME>
- run: kubectl rollout restart deployment <YOUR_DEPLOYMENT_NAME>
```

11. purchase a domain name with a promotion that can be very cheap as $1 for 1st year
12. config custom domain name nameserver with your domain name registor website by custom add this lines
```
ns1.digitalocean.com
ns2.digitalocean.com
ns3.digitalocean.com
```
13. add domain name in digital ocean at networking tab then create new record

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

14. add your cluster name at `deploy-manifests.yaml` file then redo step 7. again

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

15. change `do-loadbalancer-hostname` and `host` at file `infra/k8s-prod/ingress-srv.yaml` to your domain name
16. change url in `client/api/build-client.js` to your domain name
17. after that we will follow at step 4 of this guide [How to Set Up an Nginx Ingress with Cert-Manager on DigitalOcean Kubernetes](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-with-cert-manager-on-digitalocean-kubernetes) to make our website ready for **HTTPS** request with certificate issued by **Let's encrypt**
18. begin with install _cert-manager_ namespace by running command
```
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.7.1/cert-manager.yaml
```
19. change your directory to `infra/issuer/` there will be 2 files that you need to change _email_ and _name of a secret key_ as you wish then run command
```
kubectl create -f staging_issuer.yaml
``` 
```
kubectl create -f production_issuer.yaml
```
20. at file `infra/k8s-prod/ingress-srv.yaml` change _cert-manager.io/cluster-issuer_ to `"letsencrypt-staging"` then run this command at `infra/k8s-prod/` directory
```
kubectl apply -f ingress-srv.yaml
```
21. then change _cert-manager.io/cluster-issuer_ back to `"letsencrypt-prod"` and run this command at `infra/k8s-prod/` directory
```
kubectl apply -f ingress-srv.yaml
```
22. waiting around 5-15 minutes for setting up then browse to your website with **HTTPS** protocal

# Disclaimer

[(Back to top)](#table-of-contents)

All images are used for educational purposes in this fictional store 😉
