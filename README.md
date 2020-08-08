<p align="center"><img src="https://github.com/Kovee98/couchman/blob/develop/src/assets/logo-500x500.png" width="200" /></p>

# Couchman [![Build Status](https://travis-ci.com/Kovee98/couchman.svg?branch=develop)](https://travis-ci.com/Kovee98/couchman)
> A multi-instance CouchDB manager with filtering, sorting, and a simple view system. Meant to be simple, intuitive, and persistent.

## Goals
This project set out to accomplish a handful of core features:
- Multi-instance switching for easier management of multiple servers
- Filtering/sorting to make document management a breeze
- A simple view system that's quick and intuitive

## Getting Started
### Docker (recommended):
```
docker run -it -p 8080:8080 --rm --name couchman kovee98/couchman:latest
```

### Http Server
Couchman is a Vue app so it can be unzipped (see [releases](https://github.com/Kovee98/couchman/releases)) and served locally with your favorite http server.

## Security
**IMPORTANT:** As of now, Couchman stores everything in IndexDB stores as plain text. **Including passwords**. Couchman is not responsible for compromised passwords and/or subsequent data. A better and more secure approach to this is being researched and will hopefully be released in a future version of Couchman soon. Stay tooned!

## Contributing
PR's are not being accepted at this time. Please feel free to open an issue for any bugs or feature requests, though.
