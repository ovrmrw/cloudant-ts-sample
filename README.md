# cloudant-ts-sample
TypeScript library for Cloudant.

---

This is a sample code for read/write [IBM Cloudant](https://cloudant.com/) Database.

Base Project -> [ovrmrw/ts-babel-node-sample](https://github.com/ovrmrw/ts-babel-node-sample)

||My Environments|
|:--|:--|
|OS|Windows 10 Pro 64bit or 7 Pro 32bit|
|Editor|VSCode (stable)|
|node --version|v6.3.1|

### Setup
```
$ npm install
```

### Create a database named 'alice' on the Cloudant Dashboard

- Access "https://{your_account}.cloudant.com/dashboard.html".
- Click Create Database button. 
- Input name as 'alice', then click Create button.

### Set a permission to the database just for _reader and _writer

- Click the Key Icon for the database 'alice'.
- Click Generate API Key button in order to add a new permission.
- Set _reader and _writer permissions to the new API Key.

### Set your credentials
Create a file named '.env' at root directory. And write as below, replace `{your_account}`, `{your_api_key}` and `{your_api_password}` for your environment.
```
CLOUDANT_USERNAME={your_account}
CLOUDANT_API_KEY={your_api_key}
CLOUDANT_API_PASSWORD={your_api_password}
```

### Run
```
$ npm start
```
