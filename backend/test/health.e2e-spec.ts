import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { HealthController } from "../src/health/health.controller";
import { HealthService } from "../src/health/health.service";

describe("HealthController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: {
            readiness: async () => ({ status: "ready" }),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/health/live (GET)", async () => {
    await request(app.getHttpServer()).get("/health/live").expect(200);
  });

  it("/health/ready (GET)", async () => {
    await request(app.getHttpServer()).get("/health/ready").expect(200);
  });
});
