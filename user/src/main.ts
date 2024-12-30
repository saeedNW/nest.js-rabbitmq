import { NestFactory } from "@nestjs/core";
import { UserModule } from "./modules/user/user.module";
import { RmqOptions, Transport } from "@nestjs/microservices";
import { ServiceExceptionFilter } from "./common/Filters/exception.filter";

async function bootstrap() {
	/**
	 * Initializes a microservice application using the `createMicroservice` method.
	 * This is required for setting up a microservice instead of a standard HTTP-based application.
	 */
	const app = await NestFactory.createMicroservice(UserModule, {
		// Define microservice transport layer
		transport: Transport.RMQ,
		options: {
			urls: [process.env.RABBIT_MQ_URL], // Define RabbitMQ connection URL
			queue: process.env.USER_SERVICE_QUEUE, // Define queue name
			queueOptions: {}, // Define queue options
		},
	} as RmqOptions);

	// initialize custom exception filter
	app.useGlobalFilters(new ServiceExceptionFilter());

	await app.listen();
	console.log(`User service is running`);
}
bootstrap();
