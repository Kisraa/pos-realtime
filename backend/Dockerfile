# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY Pos.Api/Pos.Api.csproj Pos.Api/
RUN dotnet restore Pos.Api/Pos.Api.csproj

# Copy everything else and build
COPY . .
WORKDIR /src/Pos.Api
RUN dotnet build -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Install wget for healthcheck
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

COPY --from=publish /app/publish .

# Expose port
EXPOSE 5000
EXPOSE 5001

ENTRYPOINT ["dotnet", "Pos.Api.dll"]
