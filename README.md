# About

This is a POC on running nodejs microservices using skaffold

you need to have kubernetes, ingress and skaffold on your system

to start the app run `skaffold dev` and go to browser and type `posts.com`

to quit the app just press ctrl + c

## Docker build

`docker build -t tarunbhartiya7/posts:0.0.1 .`
`docker push tarunbhartiya7/posts`

## Kubectl

`kubectl apply -f posts.yaml`
`kubectl get pods`
`kubectl delete -f infra/k8s/`
`kubectl apply -f infra/k8s/`
`kubectl apply -f .`
`kubectl describe pod posts`
`kubectl delete pod posts`
`kubectl logs posts`
`kubectl exec -it posts sh`

`kubectl get deployments`
`kubectl describe deployment posts-depl`
`kubectl delete deployment posts-depl`
`kubectl rollout restart deployment posts-depl`

`kubectl get services`
`kubectl describe service posts-srv`

`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.2.0/deploy/static/provider/cloud/deploy.yaml` - install ingress nginx

`imagePullPolicy: Never` -> This will ensure that Kubernetes will use the image built locally from your image cache instead of attempting to pull from a registry OR you can add a tag just like we did for posts
with 0.0.1

## Skaffold

`skaffold dev`