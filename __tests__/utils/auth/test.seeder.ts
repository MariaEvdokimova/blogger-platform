import { add } from "date-fns/add";
import { getCollections } from "../../../src/db/mongo.db";
import { randomUUID } from "crypto";
import { ConfirmetionStatus } from "../../../src/users/entities/user.entity";

type RegisterUserPayloadType = {
    login: string,
    password: string,
    email: string,
    code?: string,
    expirationDate?: Date,
    confirmetionStatus?: ConfirmetionStatus
}

export type RegisterUserResultType = {
    id: string,
    login: string,
    email: string,
    passwordHash: string,
    createdAt: Date,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: ConfirmetionStatus
    }
}

export const testSeeder = {
  createUserDto() {
      return {
          login: 'testUser',
          email: 'test-user@gmail.com',
          password: '123456789'
      }
  },

  async insertUser(
        {
            login,
            password,
            email,
            code,
            expirationDate,
            confirmetionStatus
        }: RegisterUserPayloadType
    ): Promise<RegisterUserResultType> {
        const newUser = {
            login,
            email,
            passwordHash: password,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: code ?? randomUUID(),
                expirationDate: expirationDate ?? add(new Date(), {
                    minutes: 30,
                }),
                isConfirmed: confirmetionStatus ?? ConfirmetionStatus.unconfirmed
            }
        };

        const res = await getCollections().userCollection.insertOne(newUser)
        return {
            id: res.insertedId.toString(),
            ...newUser
        }
    }
}
