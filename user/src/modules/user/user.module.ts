import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schema/user.schema";
import { resolve } from "path";
import {
	ClientProxyFactory,
	RmqOptions,
	Transport,
} from "@nestjs/microservices";

@Module({
	imports: [
		/** Load environment variables from the specified .env file through 'ConfigModule' */
		ConfigModule.forRoot({
			envFilePath: resolve("../.env"),
			isGlobal: true,
		}),

		/** Initialize database connection */
		MongooseModule.forRoot("mongodb://127.0.0.1:27017/todo_microservice"),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	controllers: [UserController],
	providers: [
		UserService,
		{
			/**
			 * Add token microservice as a provider for user module
			 */
			provide: "TOKEN_SERVICE",
			useFactory() {
				return ClientProxyFactory.create({
					// Define microservice transport layer
					transport: Transport.RMQ,
					options: {
						urls: [process.env.RABBIT_MQ_URL], // Define RabbitMQ connection URL
						queue: process.env.TOKEN_SERVICE_QUEUE, // Define queue name
						queueOptions: {}, // Define queue options
					},
				} as RmqOptions);
			},
		},
	],
})
export class UserModule {}
