FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

COPY --from=ghcr.io/jdx/mise:2026.10.4@sha256:1e0a39bc5a3b089b9b9305b6cd53e5d32ed5327e6241db5ec412fc2eabd44b02 /usr/local/bin/mise /usr/local/bin/mise

RUN mise --version
