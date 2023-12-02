# Node.js 이미지를 사용하여 Node.js 앱을 빌드합니다.
FROM node:18 AS builder

# 작업 디렉토리를 /app 으로 설정합니다.
WORKDIR /app

# package.json 및 package-lock.json 을 복사하여 종속성 설치에 사용합니다.
COPY package.json package-lock.json ./

# 종속성 설치
RUN npm install

# 앱 소스를 복사합니다.
COPY . .

# 앱을 빌드합니다.
RUN npm run build

# Nginx 이미지를 사용하여 정적 파일을 서비스합니다.
FROM nginx:alpine

# Nginx 설정을 복사합니다.
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 React 앱을 Nginx에 복사합니다.
COPY --from=builder /app/build /usr/share/nginx/html

# 80번 포트로 Nginx를 실행합니다.
# EXPOSE 80
EXPOSE 5442
# 컨테이너가 시작되면 Nginx를 실행합니다.
CMD ["nginx", "-g", "daemon off;"]
