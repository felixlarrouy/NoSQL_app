# Inspections Restaurant Web App

## Introduction

We have a dataset comprised of inspections of NYC restaurants. This WebApp allows you to find restaurants and their inspections based on some criteria such as the borough, the grade, the inspection code...

## Installation

If you don't have Node.js installed on your computer, you can download it [here](https://nodejs.org/en/).

Clone the project:
```sh
❯ git clone https://github.com/felixlarrouy/NoSQL_app.git
```

Install npm dependencies:
```sh
❯ npm install
```

Run the web application:
```sh
❯ npm start
```

## Usage

### Main page

![main-page](./img/main-page.png)

You can select filters on the left side to display the corresponding restaurants.

![main-page-select-filter](./img/main-page-select-filter.png)

![main-page-results](./img/main-page-results.png)

When the table of restaurants is displayed, you can click on a restaurant (i.e row of the restaurant) to display all the inspections of this restaurant.

![main-page-inspections](./img/main-page-inspections.png)

### Developer mode

You can choose which type of query you want to run :

* find

![dev-page-find](./img/dev-page-find.png)

* aggregate

![dev-page-aggregate](./img/dev-page-aggregate.png)

* distinct.

![dev-page-distinct](./img/dev-page-distinct.png)

You can then type the parameters in the form(s) like you would do in a mongo IDE. The results will be displayed in a JSON.

![dev-page-results](./img/dev-page-results.png)
