var config = {
    // ...
    cors: {
      enabled: true,
      origins: ['*'],
      methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
      headers: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
    }
  };