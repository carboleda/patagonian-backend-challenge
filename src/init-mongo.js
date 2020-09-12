db.createUser({
    user: 'carboleda',
    pwd: 'patagonian',
    roles: [
        {
            role: 'readWrite',
            db: 'challenge'
        }
    ]
});
