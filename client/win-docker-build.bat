@echo off
del dist/Dockerfile
copy Dockerfile dist\
docker login -u novaservice -p repgate
docker build -t novaservice/barber-service:gui dist
docker push novaservice/barber-service
