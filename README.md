<!-- Add banner here -->

<!-- ![Project Preview](https://www.dropbox.com/s/2u3s4up6rukd7fk/entire_page.png?raw=1) -->

# microservices-ecommerce

<!-- Describe your project in brief -->
Aurapan is the beautiful women's clothes e-commerce website built with **microservices** architecture, perform server-side rendering by **Next.js**, developing on **Google Cloud Platform** environment, integrated some CI/CD process by running automation test with **GitHub Action** workflow and deploy on **DigitalOcean** cluster with let's encrypt certificate.

# Table of contents

- [Microservices Ecommerce](#microservices-ecommerce)
- [Table of contents](#table-of-contents)
- [Demo](#demo)
- [Features](#features)
- [Install](#install)
- [Setup ENV](#setup-env)
- [Deploy](#deploy)
- [Disclaimer](#disclaimer)

# Demo

[(Back to top)](#table-of-contents)

[Demo Link](https://www.aurapan.com/)

# Features

[(Back to top)](#table-of-contents)

- Fully operated microservices-architecture website with user, product, order, payment, and expiration services completely separated
- Stored all user, product, order, payment data in separated MongoDB collections
- Login with user authentication secured by encrypting password in JWT and cookie
- Account setting dashboard for a customer to update profile information or see all orders
- Admin management dashboard with authority to add, edit, delete a product, user, or order
- Rich detail of product information and multiple options that you can choose such as color, size
- Image display in a more fashionable design to attract attention
- Full-featured shopping cart (add, edit, remove an item with ease!)
- Fully checkout process (login, add a shipping address, select payment method)
- Accept both PayPal and Stripe integration payment method
- Mark orders as a delivered option for admin
- Make a product review and rating and calculate new rating instantly
- Accept coupon promotion input
- Easily navigate with a cool navigation bar and footer
- Optimize Next.js feature to maximize better performance and quality
- Safely secure HTTPS protocol with let's encrypt certificate
<!-- - Integrate wishlist in user data (work in process...) -->
<!-- - Product search feature (work in process...) -->

Something might be a bit exaggerated but one certain thing is that I put all my heart into creating this project. happy browsing! :D

# Install

[(Back to top)](#table-of-contents)

**Running on Google Cloud Platform**
1. clone `google-cloud` branch on your computer
2. install [node.js](https://nodejs.org/en/), [skaffold](https://skaffold.dev/), [docker](https://www.docker.com/), [kubectl](https://kubernetes.io/docs/tasks/tools/)
3. sign up free account with $100 on google cloud and sign up docker hub account
4. create an image by running `docker build -t <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME> .` in every folder that has Dockerfile
5. push al images to docker hub by running `docker push <YOUR_ACCOUNT_NAME>/<YOUR_IMAGE_NAME>` in every folder that you already created image
6. create a new project then enable `Kubernetes Engine API` and `Cloud Build API` then enable `Cloud Build` service account permission
7. create a new kubernetes cluster with minimum resource, 3 nodes, and select any region that closest to you
8. install `GCP SDK` to connect our images to GCP cluster context
9. open google cloud SDK and log in by running `gcloud auth login` then initiate with `gcloud init` command, choose the correct options to proceed
10. create kubernetes context in your desktop by running `gcloud container clusters get-credentials <YOUR_CLUSTER_NAME>` (your cluster name from GCP cluster that you created)
11. see list of contexts by running `kubectl config get-contexts`, select new context by running `kubectl config use-context <CONTEXT_NAME>`
12. install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start) and [ingress-nginx for GCP](https://kubernetes.github.io/ingress-nginx/deploy/#gce-gke)
13. find your load balancing port that GCP automatic generated in `Network Services` tab in GCP
14. for `windows` users, open host file `C:\Windows\System32\drivers\etc\hosts` to edit by adding `YOUR_LOAD_BALANCING_PORT YOUR_EXAMPLE_URL` and save as an admin (ex. `56.125.456.45 example.com`)
15. config all yaml files to matches your example URL
16. create all [kubernetes secrets](#setup-env)
17. run `skaffold dev` in this project root directory, make sure to use correct context before run command
18. check all pods in a cluster by running `kubectl get pods`
19. open a web browser enter your example URL to see this project come to live! 


**Running on Docker Desktop**
1. work in process...

# Setup ENV

[(Back to top)](#table-of-contents)

**MONGO_URI_USER, MONGO_URI_PRODUCT, MONGO_URI_ORDER, MONGO_URI_PAYMENT** : [MongoDB](https://www.mongodb.com/)

**JWT_KEY** : --whatever you want--

**STRIPE_KEY** : [Stripe](https://stripe.com/)

**PAYPAL_CLIENT_ID** : [Paypal](https://developer.paypal.com/home)

Create all these secrets in kubernetes secret by run this command line

`kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<YOUR SECRET>`

# Deploy

[(Back to top)](#table-of-contents)

**Deploy on DigitalOcean**
1. sign up free account with $100 and 60 days trial
2. create a Kubernetes cluster in new project
3. generate new token, install [doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/) and [kubectl](https://kubernetes.io/docs/tasks/tools/)
4. connect with digitalOcean k8s cluster context by running `doctl kubernetes cluster kubeconfig save <YOUR_CLUSTER_NAME>` and authorize with your credentials
5. switch kubernetes context to the new context by running `kubectl config use-context <CONTEXT_NAME>`
6. create `github workflow` for initial build an docker image on push event on `main` branch and perform automation testing by running `jest` script in every services on pull request event trigger with trying to merge with `main` branch
7. add github action secret for docker credentials
8. purchase a domain name with a promotion that can be very cheap as $1 for 1st year
9. Separate k8s folder to k8s-dev and k8s-prod then copy `ingress-srv.yaml` file to both folders and edit host URL to a new domain name
10. create `github workflow` for telling kubernetes cluster to use images we built by adding this
```
- uses: digitalocean/action-doctl@v2
  with:
    token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
- run: doctl kubernetes cluster kubeconfig save <YOUR_CLUSTER_NAME>
- run: kubectl rollout restart deployment <YOUR_DEPLOYMENT_NAME>
```
11. add github action secret for digitalocean token key
12. config domain name nameserver with your domain name registor website by custom add `ns1.digitalocean.com`, `ns2.digitalocean.com`. `ns3.digitalocean.com`
13. add domain name in digital ocean at networking tab then create new record
```
// A record
HOSTNAME: @
WILL DIRECT TO: select your-load-balancer
TTL: 30

// CNAME record
HOSTNAME: www
IN AN ALIAS OF: @
TTL: 30
```
14. waiting for 5-10 minutes for websie to setup
15. browsing to your website with `HTTP` protocal
16. if you want to browse with `HTTPS` this link is for you to follow [How to Set Up an Nginx Ingress with Cert-Manager on DigitalOcean Kubernetes](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-with-cert-manager-on-digitalocean-kubernetes)

# Disclaimer

[(Back to top)](#table-of-contents)

All images are used for educational purposes in this fictional clothing store ;)
