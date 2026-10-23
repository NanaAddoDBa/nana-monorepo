FROM node:22-alpine
ENV NODE_ENV=production PORT=8080
WORKDIR /workspace
COPY apps/rent-car-api/package.json /workspace/apps/rent-car-api/package.json
RUN cd /workspace/apps/rent-car-api && npm install --omit=dev --no-audit --no-fund
COPY packages/rental-contracts/src /workspace/packages/rental-contracts/src
COPY apps/rent-car-api/src /workspace/apps/rent-car-api/src
WORKDIR /workspace/apps/rent-car-api
USER node
EXPOSE 8080
CMD ["node", "--experimental-strip-types", "src/server.ts"]
