import { Collection, Db, MongoClient } from 'mongodb';
import { Blog } from '../blogs/types/blog';
import { appConfig } from '../core/config/config';
import { Post } from '../posts/types/post';
import { Comment } from '../comments/types/comment';
import { User } from '../users/entities/user.entity';
import { Blacklist } from '../auth/types/blacklist';
 
const BLOGS_COLLECTION_NAME = 'blogs';
const POST_COLLECTION_NAME = 'post';
const USER_COLLECTION_NAME = 'users';
const COMMENT_COLLECTION_NAME = 'comment';
const BLACKLIST_COLLECTION_NAME = 'blacklist';
 
export let client: MongoClient;
export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;
export let commentCollection: Collection<Comment>;
export let blacklistCollection: Collection<Blacklist>;
 
// Подключения к бд
export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(appConfig.DB_NAME);
 
  //Инициализация коллекций
  blogCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);
  postCollection = db.collection<Post>(POST_COLLECTION_NAME);
  userCollection = db.collection<User>(USER_COLLECTION_NAME);
  commentCollection = db.collection<Comment>(COMMENT_COLLECTION_NAME);  
  blacklistCollection = db.collection<Blacklist>(BLACKLIST_COLLECTION_NAME);
 
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Connected to the database');
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
};

// для тестов
export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }
  await client.close();
};

export async function dropDb() {
  try {
    const db = client.db(appConfig.DB_NAME);
    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({});
    }
  } catch (e: unknown) {
    console.error('❌ Error while clearing the DB:', e);
    await stopDb();
  }
};

export function getCollections() {
  const db = client.db(appConfig.DB_NAME);
  return {
    blogCollection: db.collection<Blog>(BLOGS_COLLECTION_NAME),
    postCollection: db.collection<Post>(POST_COLLECTION_NAME),
    userCollection: db.collection<User>(USER_COLLECTION_NAME),
    commentCollection: db.collection<Comment>(COMMENT_COLLECTION_NAME),
    blacklistCollection: db.collection<Blacklist>(BLACKLIST_COLLECTION_NAME),
  };
};
