FROM nginx:1.21.0-alpine

COPY ["default.conf.template","/etc/nginx/templates/"]
COPY ["nginx.conf", "/etc/nginx/"]