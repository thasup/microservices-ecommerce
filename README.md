<!-- Add banner here -->

![Project Preview](docs/aurapan-shop-banner-1.jpg)

# microservices-ecommerce

<!-- Describe your project in brief -->

Aurapan is the beautiful women's clothes e-commerce website built with **microservices** architecture, perform server-side rendering by **Next.js**, developing on **Google Cloud Platform** environment, integrated some CI/CD process by running automation test with **GitHub Action** workflow and deploy on **DigitalOcean** cluster with let's encrypt certificate.

# Table of contents

- [Microservices Ecommerce](#microservices-ecommerce)
- [Table of contents](#table-of-contents)
- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
- [Setup ENV](#setup-env)
- [Deployment](#deployment)
- [Disclaimer](#disclaimer)

# Demo

[(Back to top)](#table-of-contents)

[Demo Link](https://www.aurapan.com/)

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

# Installation

[(Back to top)](#table-of-contents)

**Running on Google Cloud Platform**

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
8. install **GCP SDK** to connect our images to GCP cluster context
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
15. config all yaml files to matches your custom URL
16. create all [kubernetes secrets](#setup-env)
17. run this command then authenticate GCP account via web browser
```
gcloud auth application-default login
```
18. make sure to use correct context before run this command at root directory
```
skaffold dev
```
19. open a web browser enter your custom URL to see this project come to live!

**Running on Docker Desktop**

1. clone _dev-mac_ branch on your computer
2. install [node.js](https://nodejs.org/en/), [skaffold](https://skaffold.dev/), [docker](https://www.docker.com/)
3. enable kubernetes in docker desktop preferences
4. create an image by run this command in every folder that has _Dockerfile_
```
docker build -t <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME> .
```
5. push all images to docker hub by run this command in every folder that has _Dockerfile_
```
docker push <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME>
```
6. see list of kubernetes contexts and then selecting a new context by running these commands
```
kubectl config get-contexts
kubectl config use-context docker-desktop
```
7. install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start) and [ingress-nginx for GCP](https://kubernetes.github.io/ingress-nginx/deploy/#gce-gke)
8. for _windows_ users; open host file at `C:\Windows\System32\drivers\etc\hosts`, for _mac_ users; open host file at `\etc\hosts` then edit by adding `127.0.0.1 YOUR_CUSTOM_URL` and save as an admin (ex. `127.0.0.1 custom.com`)
9. config all yaml files to matches your custom URL
10. create all [kubernetes secrets](#setup-env)
11. run `skaffold dev` in this project root directory, make sure to use correct context before run the command
12. open a web browser enter your custom URL to see this project come to live!

# Setup ENV

[(Back to top)](#table-of-contents)

**MONGO_URI_USER, MONGO_URI_PRODUCT, MONGO_URI_ORDER, MONGO_URI_PAYMENT** : [MongoDB](https://www.mongodb.com/)

**JWT_KEY** : --whatever you want--

**STRIPE_KEY** : [Stripe](https://stripe.com/)

**PAYPAL_CLIENT_ID** : [Paypal](https://developer.paypal.com/home)

Create all these secrets in kubernetes secret by run this command for example

```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<YOUR SECRET>
```

# Deployment

[(Back to top)](#table-of-contents)

**Deploy on DigitalOcean**

1. sign up free account with $100 and 60 days trial and create a kubernetes cluster in new project
2. generate new token, install [doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/) and [kubectl](https://kubernetes.io/docs/tasks/tools/)
3. connect with digitalOcean k8s cluster context by running this command and authorize with your credentials
```
doctl kubernetes cluster kubeconfig save <YOUR_CLUSTER_NAME>
``` 
4. switch kubernetes context to the new context by running
```
kubectl config use-context <CONTEXT_NAME>
```
5. create _github workflow_ for initial build an docker image on push event on _main_ branch and perform automate testing by running jest script in every services on pull request event trigger with trying to merge with _main_ branch

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

6. add github action secret for _docker credentials_ and _digitalocean token key_
7. edit files in every services then commit code to _main_ branch for triggering **Github Action workflow** to build and push all images to our cluster
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

14. add your cluster name at `deploy-manifests.yaml` file then redo 9. again

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
20. at file `infra/k8s-prod/ingress-srv.yaml` change `cert-manager.io/cluster-issuer` to `"letsencrypt-staging"` then run this command at `infra/k8s-prod/` directory
```
kubectl apply -f ingress-srv.yaml
```
21. then change `cert-manager.io/cluster-issuer` back to `"letsencrypt-prod"` and run this command at `infra/k8s-prod/` directory
```
kubectl apply -f ingress-srv.yaml
```
22. waiting around 5-15 minutes for setting up then browse to your website with **HTTPS** protocal

# Disclaimer

[(Back to top)](#table-of-contents)

All images are used for educational purposes in this fictional store 😉
