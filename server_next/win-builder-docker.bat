@echo off
del docker\nova-0.1.war
copy build\libs\nova-0.1.war docker\
docker login -u novaservice -p repgate
docker build -t novaservice/barber-service:latest docker
docker push novaservice/barber-service
