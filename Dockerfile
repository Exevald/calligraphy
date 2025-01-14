FROM debian:11-slim

ADD ./bin/lexeme app/bin/
WORKDIR /app

EXPOSE 8080

ENTRYPOINT [ "/app/bin/lexeme" ]
CMD ["service"]