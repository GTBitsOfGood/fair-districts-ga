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
* ```git clone``` the repo onto your local machine and run ```npm i``` or ```yarn i```

### Set up Local PostgreSQL Database
* Installation will vary by machine OS. For brevity, I linked resources below. Make sure you have the ```psql``` command available from your terminal.
* Installation will vary by machine, however I recommend this resource
* https://blog.timescale.com/blog/how-to-install-psql-on-mac-ubuntu-debian-windows/
* Set up prisma by running npm install prisma --save-dev

### Set up local env

### Other stuff


## How to Contribute

To contribute to the repo, we will be using a rather simple system. For each issue that you work on, all you need to do is create a new branch in the following format [your-name]/[brief title of issue] (ex: manu/analytics-integration). You should make all your changes in that branch. 

As you make changes to your branch, because other developers will be working on the repository, I HIGHLY recommend running git stash to stash your local copy in memory and run git pull whenever you develop. This way in case there is an issue with git pull, you can always run git stash pop to return back locally.

Once you feel like your work is done, submit a pull request to merge your branch into the master branch, and I will review it. Please link it to the issue you are assigned and 


## Why SQL over NoSQL
The data provided was very structured and had natural relationships between different tables. Also, the data doesn't need to be horizontally scaled which means NoSQL isn't required here. SQL also provides more powerful analytics tools which keeps us flexible in case of changes
