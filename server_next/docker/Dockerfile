FROM openjdk:8u191-alpine

MAINTAINER h2osis(sokolovep@gmail.com/sokolovep@yandex.ru)

ADD nova-0.1.war /srv/nova-0.1.war

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/srv/nova-0.1.war"]