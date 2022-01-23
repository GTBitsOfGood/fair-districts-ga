## Fair District GA
In 2015, GOP legislators changed district lines 105 and 111 to make sure their representatives would stay in power after barely winning re-election the year prior. This practice is called "gerrymandering" and robs Georgian citizens the right for a fair vote. With sophisticated mapping technology, it is becoming easier for politicians to "rig" elections. Fair Districts GA is a non-profit that recruits volunteers to submit letters to newspapers in the hope of bringing more attention to the issue. 

The platform we will build will automate this assignment process. Recently, Fair Districts GA has been having a hard time managing all their data and the assignment process and would like to streamline the process.

## Tech Stack
* Next.js
* PostgreSQL
* Prisma (ORM on top of Postgres)

## Why SQL over NoSQL
The data provided was very structured and had natural relationships between different tables. Also, the data doesn't need to be horizontally scaled which means NoSQL isn't required here. SQL also provides more powerful analytics tools which keeps us flexible in case of changes

## Environment
Node 16.13.0 (important for prisma to work, you can use nvm to change node versions)

## Set up
1.) Git Clone
2.) Need to set up psql and prisma
3.) Need to set up other stuff

## How to Contribute

To contribute to the repo, we will be using a rather simple system. For each issue that you work on, all you need to do is create a new branch in the following format [your-name]/[brief title of issue] (ex: manu/analytics-integration). You should make all your changes in that branch. 

As you make changes to your branch, because other developers will be working on the repository, I HIGHLY recommend running git stash to stash your local copy in memory and run git pull whenever you develop. This way in case there is an issue with git pull, you can always run git stash pop to return back locally.

Once you feel like your work is done, submit a pull request to merge your branch into the master branch, and I will review it. Please link it to the issue you are assigned and 
