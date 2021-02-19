# cobbler-web
Our new seperate Angular based web interface for Cobbler

## Build
> Nodejs and npm are required in order to build
1. Clone git repo
2. Run 'npm install'
3. To serve website locally run 'ng serve --open'
4. To deploy website run 'ng build --prod' and copy dist directory to webserver.

## Testing
It is configured to use mock data when testing; **mocks\data.json** and **proxy.conf.json**  
To use mock data
```
npm run start:proxy:mock:server
```