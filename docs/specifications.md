# Recipe Manager Application - Functional Specification

## Overview

A web application for casual users and home cooks to store favorite recipes and get meal ideas when planning ahead. The application focuses on recipe management with an emphasis on ingredient-based organization.

## User Roles

- **Casual Users/Home Cooks**: Individuals who want to store and organize personal recipes and get meal ideas based on ingredients.

## Core Features

### User Management

- User registration and login
- Authentication to ensure users only see their own recipes
- No profile management, theming, or notifications in MVP

### Recipe Management

- **Create** new recipes with:
  - Title (required)
  - Ingredients per serving (required)
  - Description (optional)
  - Preparation steps (optional)
  - Preparation time (optional)
  - Photos (optional)
- **View** recipes with all details
- **Edit** existing recipes
- **Delete** recipes
- **Search** recipes by name

### Ingredient-Based Features

- View most frequently used ingredients
- Search recipes by ingredient
- Filter recipes containing specific ingredients

### Future Features (post-MVP)

- Categorize recipes (entree, main dish, dessert)
- Tag recipes (vegetarian, fish, beef, pork, festive, etc.)

## Technical Requirements

- Frontend: React
  - Zustand for state management
  - Tailwind for css
- Backend: Node.js
  - Nestjs desployed on AWS Lambda function with direct url integration
  - AWS Cognito for user authentication
- Database: Neon (serverless PostgreSQL)
  - node-pg-migrate to handle migrations
  - pg (node-postgres) for the sql client
- CDN: AWS Cloudfront

## Not Included in MVP

- Social or sharing features
- Advanced profile management
- Theming options
- Notifications
- Unit conversion
- Timers
- Specialized print formatting
