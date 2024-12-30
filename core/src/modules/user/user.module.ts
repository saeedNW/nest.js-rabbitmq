import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import {
	ClientProxyFactory,
	RmqOptions,
	Transport,
} from "@nestjs/microservices";

@Module({
	controllers: [UserController],
	providers: [
		{
			/**
			 * Add user microservice as a provider for user module
			 */
			provide: "USER_SERVICE",
			useFactory() {
				return ClientProxyFactory.create({
					// Define microservice transport layer
					transport: Transport.RMQ,
					options: {
						urls: [process.env.RABBIT_MQ_URL], // Define RabbitMQ connection URL
						queue: process.env.USER_SERVICE_QUEUE, // Define queue name
						queueOptions: {}, // Define queue options
					},
				} as RmqOptions);
			},
		},
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
	exports: ["USER_SERVICE", "TOKEN_SERVICE"],
})
export class UserModule {}
