import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller";
import {
	ClientProxyFactory,
	RmqOptions,
	Transport,
} from "@nestjs/microservices";
import { UserModule } from "../user/user.module";

@Module({
	imports: [UserModule],
	controllers: [TaskController],
	providers: [
		{
			/**
			 * Add task microservice as a provider for task module
			 */
			provide: "TASK_SERVICE",
			useFactory() {
				return ClientProxyFactory.create({
					// Define microservice transport layer
					transport: Transport.RMQ,
					options: {
						urls: [process.env.RABBIT_MQ_URL], // Define RabbitMQ connection URL
						queue: process.env.TASK_SERVICE_QUEUE, // Define queue name
						queueOptions: {}, // Define queue options
					},
				} as RmqOptions);
			},
		},
	],
})
export class TaskModule {}
