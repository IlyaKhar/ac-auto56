# Сборка из корня репозитория: docker build -f server/Dockerfile .
FROM golang:1.22-alpine AS build
WORKDIR /src
COPY server/ ./
# Go 1.22 требует checksums: tidy создаёт go.sum в образе (или положи go.sum в репо для кэша слоя)
RUN go mod tidy && CGO_ENABLED=0 go build -ldflags="-s -w" -o /out/api ./cmd/api

FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app
COPY --from=build /out/api /app/api
COPY database/migrations /migrations
ENV MIGRATIONS_PATH=/migrations
EXPOSE 8080
ENTRYPOINT ["/app/api"]
