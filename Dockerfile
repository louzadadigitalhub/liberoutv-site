# Site estatico: o nginx serve os arquivos como estao.
FROM nginx:alpine
COPY . /usr/share/nginx/html
RUN rm -f /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/.gitignore && rm -rf /usr/share/nginx/html/.git
EXPOSE 80
