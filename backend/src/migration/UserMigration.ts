import Users from "../model/Users";
import settings from '../data/example-settings.json';

async function createTestUser() {
    const user = await Users.create({
        email: "frewin.christopher@gmail.com",
        token: "abc123",
        settings: settings
    });
    console.log("Test user's auto-generated ID: ", user.id);
    console.log("createdAt: ", user.createdAt);
    console.log("updatedAt: ", user.updatedAt);
}

async function migrateUsersTable() {
    try {
        await Users.sync({ force: true });
        console.log("Users table created successfully");
        await createTestUser();
    } catch (err) {
        console.log("An error occur while creating users table: " + err);
    }
}

migrateUsersTable();




