# ===== Etapa 1: build com Maven =====
FROM maven:3.9.6-eclipse-temurin-21-jammy AS build
WORKDIR /app

# Copia so o pom primeiro pra aproveitar cache: se as dependencias nao mudaram,
# o "go-offline" nao reroda no proximo build (poupa minutos).
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Agora copia o codigo e empacota
COPY src ./src
RUN mvn clean package -DskipTests -B

# ===== Etapa 2: runtime so com JDK =====
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
