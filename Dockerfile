# Multi-stage Dockerfile for FLEETORA Fleet Management System
# Production-ready for Google Cloud Run / Container Registry

# ==========================================
# Stage 1: Build React + Vite Frontend
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Build Spring Boot Java 17 Backend
# ==========================================
FROM eclipse-temurin:17-jdk-alpine AS backend-builder
WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

COPY src src

# Copy compiled React frontend assets into Spring Boot static resources
COPY --from=frontend-builder /app/frontend/dist src/main/resources/static

RUN ./mvnw clean package -DskipTests -B

# ==========================================
# Stage 3: Lightweight Production JRE Runtime
# ==========================================
FROM eclipse-temurin:17-jre-alpine AS runner
WORKDIR /app

# Non-root user for security
RUN addgroup -S fleetora && adduser -S fleetora -G fleetora
USER fleetora

COPY --from=backend-builder /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT} -jar app.jar"]
