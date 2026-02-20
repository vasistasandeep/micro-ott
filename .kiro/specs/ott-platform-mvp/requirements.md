# Requirements Document

## Introduction

This document specifies the requirements for an OTT (Over-The-Top) streaming platform MVP designed for the Indian market. The platform supports Movies, TV Shows, and Sports content with a hybrid AVOD (ad-supported) and SVOD (subscription) monetization model. The system is designed for local development with Docker Compose while maintaining architectural patterns that enable future cloud scalability using microservices.

## Glossary

- **OTT_Platform**: The complete streaming system including web, mobile, backend services, and admin interfaces
- **Content_Service**: Microservice responsible for managing content metadata, catalog, and content discovery
- **User_Service**: Microservice responsible for user authentication, profile management, and authorization
- **Playback_Service**: Microservice responsible for video streaming, adaptive bitrate delivery, and playback state management
- **CMS**: Content Management System used by administrators to upload and manage content
- **DSF**: Dynamic Selection Framework - the content discovery engine providing personalized recommendations and continue watching
- **Video_Player**: Frontend component that renders HLS/DASH streams with adaptive bitrate switching
- **Profile**: Individual user identity within a single account (e.g., "Mom", "Kids")
- **Content_Item**: A movie, TV show episode, or sports event available for streaming
- **HLS**: HTTP Live Streaming protocol for adaptive bitrate video delivery
- **DASH**: Dynamic Adaptive Streaming over HTTP protocol
- **Transcoding_Service**: Service responsible for converting uploaded videos into multiple bitrate variants
- **AVOD**: Ad-supported Video On Demand (free tier with advertisements)
- **SVOD**: Subscription Video On Demand (paid tier without advertisements)
- **Metadata**: Descriptive information about content including title, description, genre, cast, language tracks
- **Engagement_Service**: Service responsible for tracking user viewing behavior and analytics

## Requirements

### Requirement 1: User Authentication and Authorization

**User Story:** As a viewer, I want to securely sign up and log in to the platform, so that I can access personalized content and maintain my viewing history.

#### Acceptance Criteria

1. THE User_Service SHALL implement JWT-based authentication with access and refresh tokens
2. WHEN a user provides valid credentials, THE User_Service SHALL return an access token valid for 15 minutes and a refresh token valid for 7 days
3. WHEN a user provides an expired access token with a valid refresh token, THE User_Service SHALL issue a new access token
4. IF a user provides invalid credentials, THEN THE User_Service SHALL return an authentication error without revealing whether the username or password was incorrect
5. THE User_Service SHALL hash passwords using bcrypt with a minimum cost factor of 12

### Requirement 2: Multi-Profile Support

**User Story:** As a family account holder, I want to create multiple profiles under one account, so that each family member can have personalized recommendations and viewing history.

#### Acceptance Criteria

1. THE User_Service SHALL allow creation of up to 5 profiles per account
2. WHEN a user logs in, THE OTT_Platform SHALL display a profile selection screen before accessing content
3. THE User_Service SHALL store profile-specific preferences including name, avatar, and content maturity level
4. WHEN a profile is selected, THE OTT_Platform SHALL scope all viewing history and recommendations to that profile