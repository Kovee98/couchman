# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Settings page
- Ability to clear all app data
- Manual refresh buttons on the dbs/docs tables
- Attachment uploading, deleting, and viewing

### Improved
- Database/Document filtering input UX consistency
- View creation to use toggle buttons instead of manually typing out the columns to add to the view
- View name is required now
- Simplified retreival of the current connection object
- Updated codebase to follow stricter variable declaration practices for improved readability and maintainability
- Look and feel of the document editor

### Fixed
- Reactivation of current connection
- Documents not loading after a refresh
- Errors on connection switching
- Actions field showing up as an option when creating a view

## [1.0.1] - 2020-08-09
### Fixed
- Docker commands

## [1.0.0] - 2020-08-08
### Added
- Multi-connection management
- Document table with filtering and sorting
- Database table with filtering and sorting
- Simple view system
- Docker support
