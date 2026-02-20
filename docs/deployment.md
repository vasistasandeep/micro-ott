# Deployment Guide

## Local Development

See [Getting Started](./getting-started.md) for local setup instructions.

## Docker Deployment

### Build Images

```bash
# Build all service images
docker-compose -f docker-compose.prod.yml build
```

### Run Production Stack

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Kubernetes Deployment (Future)

### Prerequisites

- Kubernetes cluster (EKS, GKE, or AKS)
- kubectl configured
- Helm 3+

### Deploy Infrastructure

```bash
# Create namespace
kubectl create namespace ott-platform

# Deploy PostgreSQL
helm install postgres bitnami/postgresql \
  --namespace ott-platform \
  --set auth.database=ott_catalog \
  --set auth.username=ott_user

# Deploy MongoDB
helm install mongodb bitnami/mongodb \
  --namespace ott-platform

# Deploy Redis
helm install redis bitnami/redis \
  --namespace ott-platform
```

### Deploy Services

```bash
# Apply Kubernetes manifests
kubectl apply -f infrastructure/kubernetes/
```

## AWS Deployment

### Architecture

- **ECS/Fargate**: Container orchestration
- **RDS PostgreSQL**: Managed database
- **DocumentDB**: MongoDB-compatible
- **ElastiCache**: Redis
- **S3**: Video storage
- **CloudFront**: CDN
- **ALB**: Load balancing

### Terraform Setup (Future)

```bash
cd infrastructure/terraform
terraform init
terraform plan
terraform apply
```

## Environment Variables

### Production Environment

```bash
# Database
POSTGRES_HOST=<rds-endpoint>
POSTGRES_PORT=5432
POSTGRES_DB=ott_catalog
POSTGRES_USER=<username>
POSTGRES_PASSWORD=<secure-password>

MONGODB_URI=mongodb://<documentdb-endpoint>:27017/ott_activity
REDIS_URL=redis://<elasticache-endpoint>:6379

# JWT
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>

# Services (internal)
AUTH_SERVICE_URL=http://auth-service:3001
CATALOG_SERVICE_URL=http://catalog-service:3002
STREAMING_SERVICE_URL=http://streaming-service:3003

# CDN
CDN_URL=https://d1234567890.cloudfront.net

# Application
NODE_ENV=production
LOG_LEVEL=info
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Enable database encryption at rest
- [ ] Set up VPC and security groups
- [ ] Configure IAM roles with least privilege
- [ ] Enable CloudWatch logging
- [ ] Set up monitoring and alerts
- [ ] Configure backup and disaster recovery

## Monitoring

### Prometheus Metrics

Services expose metrics at `/metrics` endpoint:
- Request rate
- Response time
- Error rate
- Database connection pool stats

### Grafana Dashboards

Import pre-built dashboards from `infrastructure/grafana/`

### CloudWatch (AWS)

- Application logs
- Container metrics
- Database metrics
- Custom metrics

## Scaling

### Horizontal Scaling

All services are stateless and can be scaled horizontally:

```bash
# Kubernetes
kubectl scale deployment catalog-service --replicas=5

# ECS
aws ecs update-service --service catalog-service --desired-count 5
```

### Auto-scaling

Configure based on:
- CPU utilization > 70%
- Memory utilization > 80%
- Request rate

## Backup & Recovery

### Database Backups

- PostgreSQL: Daily automated snapshots
- MongoDB: Point-in-time recovery
- Redis: AOF persistence enabled

### Disaster Recovery

- RTO (Recovery Time Objective): 1 hour
- RPO (Recovery Point Objective): 15 minutes
- Multi-AZ deployment for high availability

## CI/CD Pipeline

GitHub Actions workflow:
1. Lint and test
2. Build Docker images
3. Push to registry
4. Deploy to staging
5. Run integration tests
6. Deploy to production (manual approval)

## Health Checks

All services expose health endpoints:

```bash
GET /health
```

Response:
```json
{
  "status": "ok",
  "service": "catalog-service",
  "uptime": 3600,
  "database": "connected"
}
```
