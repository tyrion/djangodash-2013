djangodash-2013
===============


    $ virtualenv env
    $ . env/bin/activate
    $ git clone repo dash13

    $ sudo apt-get install postgres libpq-dev
    $ sudo -u postgres psql
    > CREATE DATABASE dash;
    > CREATE ROLE user LOGIN;
    # where `user` is the user that will execute uwsgi
    > \q
    # check that you can login with your user
    $ psql -d dash

    $ sudo apt-get install rabbitmq-server

    $ cd dash13
    $ pip install -r requirements/production.txt

    $ sudo -s
    $  export SECRET_KEY='random key'
    $  export AWS_ACCESS_KEY_ID=
    $  export AWS_SECRET_ACCESS_KEY
    
    # edit bakehouse.settings.production
    # change ALLOWED_HOSTS, AWS_STORAGE_BUCKET_NAME
    # and STATIC_URL

