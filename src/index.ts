import { Client, Database } from 'node-appwrite';

// initialise the client SDK
let client = new Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

//initialise the database SDK
const db = new Database(client);

const eventData = JSON.parse(process.env.APPWRITE_FUNCTION_EVENT_DATA);
const dataCollection = process.env.APPWRITE_DATA_COLLECTION;
const usersCollection = process.env.APPWRITE_USERS_COLLECTION;

const userId = eventData.userId;


async function run() {
    console.log(JSON.stringify(eventData));
    const dataObj = {
        userId: userId,
    };
    const res = await db.createDocument(dataCollection, dataObj, [`user:${userId}`], [`user:${userId}`]).then((res) => {
        return res;
    }).catch(err => {
        console.error(err);
        process.exit(5);
    });

    if (!res.$id) {
        console.error('Error creating document');
        process.exit(5);
        return;
    }

    const userObj = {
        userId: userId,
        data: res.$id,
        created: new Date().getTime(),
        branch: 'none'
    };

    await db.createDocument(usersCollection, userObj, [`user:${userId}`], []).catch((err) => {
        console.error(err);
        process.exit(5);
    });

}

run();
