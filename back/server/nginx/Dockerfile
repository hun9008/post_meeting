FROM nginx

COPY webapp ./webapp
COPY conf/nginx.conf ./conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]