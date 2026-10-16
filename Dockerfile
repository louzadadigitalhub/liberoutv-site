# Site estatico servido pelo nginx. So entra na imagem o que e do site:
# arquivo novo na raiz precisa de uma linha COPY aqui.
FROM nginx:stable-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/seguranca.conf /etc/nginx/seguranca.conf
RUN rm -f /usr/share/nginx/html/*
COPY index.html downloads.html pagar.html pagos.html privacidade.html privacy.html termos.html terms.html /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY fonts/ /usr/share/nginx/html/fonts/
COPY img/ /usr/share/nginx/html/img/
# as paginas de politica nao declaram icone, e o navegador pede este endereco
COPY img/favicon.ico /usr/share/nginx/html/favicon.ico
# configuracao com erro derruba a construcao, e a versao anterior segue no ar
RUN nginx -t
EXPOSE 80
