#Setup environment

    **Install packages

#Prisma

    **Define database model
    **Configure with Postgresql

#Docker

    **Creat Dockerfile and docker compose file
    **Configure services for app, database, caching

#Nestjs module

    **Generate modules for User, Booking, Homestay, HomeAvailable, Payment, Transaction
    **Create Prisma Service === Global
    **Implement CRUD

#Implement features

    **Fix docker use Postgis to search homestay
    **Implement search function with coordinates
    **Implement search available homestay with date
    **Implement payment method via Stripe
    **Implement authentication SSO with Google

#Non-functional

    **Implement caching via Redis
    **Implement message queue via RabbitMQ

#Advantages and Disadvantages of raw locks in Postgresql

    +Ensuring data integrity
    +Preventing multiple transactions try to update the same data simultaneously

    -Deadlocks: many transactions are waiting for each other to release locks
    -Complexity: managing raw locks and to be aware of lock levels
    -Performance impact: increase latency due to other transactions to wait
