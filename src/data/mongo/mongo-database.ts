import mongoose from "mongoose";

interface Options {
    mongoUrl: string;
    dbName: string;
}

export class MongoDatabase {
    static async connect(options: Options) {
        const { mongoUrl, dbName } = options;
         try {
            await mongoose.connect(mongoUrl, {
                dbName,
            });
            console.log('Connected to the database');
            return true;
         } catch (error) {
            console.error('Error connecting to the database', error);
            throw error;
         }

    }

    static async disconnect() {
        try {
            await mongoose.disconnect();
            console.log('Disconnected from the database');
            return true;
        } catch (error) {
            console.error('Error disconnecting from the database', error);
            throw error;
        }
    }
}