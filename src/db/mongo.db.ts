import { Collection, Db, MongoClient } from 'mongodb';
import { Blog } from '../blogs/types/blog';
import { SETTINGS } from '../core/settings/settings';
import { Post } from '../posts/types/post';
import { User } from '../users/types/user';
 
const BLOGS_COLLECTION_NAME = 'blogs';
const POST_COLLECTION_NAME = 'post';
const USER_COLLECTION_NAME = 'users';
 
export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;
 
// Подключения к бд
export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);
 
  //Инициализация коллекций
  blogCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);
  postCollection = db.collection<Post>(POST_COLLECTION_NAME);
  userCollection = db.collection<User>(USER_COLLECTION_NAME);
 
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Connected to the database');
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}


// для тестов
export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }
  await client.close();
}
