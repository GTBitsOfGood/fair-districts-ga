## [Fair District GA](https://www.fairdistrictsga.org)
In 2015, GOP legislators changed district lines 105 and 111 to make sure their representatives would stay in power after barely winning re-election the year prior. This practice is called "gerrymandering" and robs Georgian citizens the right for a fair vote. With sophisticated mapping technology, it is becoming easier for politicians to "rig" elections. Fair Districts GA is a non-profit that recruits volunteers to submit letters to newspapers in the hope of bringing more attention to the issue. 

The platform we will build will automate this assignment process. Recently, Fair Districts GA has been having a hard time managing all their data and the assignment process and would like to streamline the process.

## Tech Stack
* Next.js
* PostgreSQL
* Prisma (ORM on top of Postgres)

## Environment
Node 16.13.0 (you can use ```nvm``` to alter this)

## Set up
### Clone the repository and install necessary packages
```git clone``` the repo onto your local machine and run ```npm i``` or ```yarn i```

### Set up Local PostgreSQL Database
#### MacOS (brew required)
1. If you don't have brew, install it using the command below in your terminal. Brew is a package manager that makes installing applications *much easier*
    ```
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```
2. Make sure to update brew and that it is healthy by running the commands below. ```brew doctor``` should report no errors.
    ```
    brew update
    brew doctor
    ```
3. Run the command below to install PostgreSQL.
    ```
    brew install postgresql
    ```
4. If postgres is installed correct, the following command below should work. Please contact Manu if it doesn't work.
    ```
    psql --version
    ```
5. By default a database called ```postgres``` will be created. Type the following command to start ```psql```.
    ```
    psql postgres
    ```
6. Now, we will create a database called ```fair_districts```, so run the following
    ```
    CREATE DATABASE fair_districts;
    ```
7. To ensure the database is created, type ```\l``` and see if it appears in your terminal as a database.
#### Windows 
1. Follow this installation tutorial: [https://www.postgresqltutorial.com/install-postgresql/](https://www.postgresqltutorial.com/install-postgresql/)
2. Open up the psql terminal, and run the following command.
3.  ```
    CREATE DATABASE fair_districts;
    ```
4. To ensure the database is created, type ```\l``` and see if it appears in your terminal as a database.
#### Linux
1. Run the following commands.
    ```
    sudo apt-get update
    sudo apt-get install postgresql
    ```
2. Run this command to access the postgres user
    ```
    sudo -i -u postgres
    ```
3. Run the following command
   ```
   psql
   ```
4. Now, we will create a database called ```fair_districts```, so run the following
    ```
    CREATE DATABASE fair_districts;
    ```
5. To ensure the database is created, type ```\l``` and see if it appears in your terminal as a database.

### Set up Prisma and Google OAuth
1. Navigate to the repository you clone and run the following command
    ```
    npm install prisma --save-dev
    ```
2. Create a .env file and for your repo and type the following
    ```
    DATABASE_URL="postgresql://{USER}:{PASSWORD}@localhost:5432/fair_districts"
    NEXTAUTH_URL="http://localhost:3000"
    GOOGLE_CLIENT_ID="651451308980-n2ucut2m4sk6sqecs7ap6q0j43b79bv0.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET="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"
    ```
3. Run the following command (make sure your .env is working). This will make our database have the appropriate schemas and tables.
    ```
    npx prisma migrate dev
    ```
4. You can verify this by accessing the database and running the following command
    ```
    \c fair_district
    \dt
    ```

## You should be done at this point. Please contact Manu if you have any issues. Don't worry about email authentication for now.
You will be using Google OAuth to sign in to your localhost repos whenever you are building out features. On Vercel previews, I'm working to make email authentication working, because Google OAuth is *annoying*. I'll be setting up an SMTP server soon and update you accordingly.
  

## How to Contribute

To contribute to the repo, we will be using a rather simple system. For each issue that you work on, all you need to do is create a new branch in the following format [your-name]/[brief title of issue] (ex: manu/analytics-integration). You should make all your changes in that branch. 

As you make changes to your branch, because other developers will be working on the repository, I HIGHLY recommend running git stash to stash your local copy in memory and run git pull whenever you develop. This way in case there is an issue with git pull, you can always run git stash pop to return back locally.

Once you feel like your work is done, submit a pull request to merge your branch into the master branch, and I will review it. Please link it to the issue you are assigned and 


## Why SQL over NoSQL
The data provided was very structured and had natural relationships between different tables. Also, the data doesn't need to be horizontally scaled which means NoSQL isn't required here. SQL also provides more powerful analytics tools which keeps us flexible in case of changes
