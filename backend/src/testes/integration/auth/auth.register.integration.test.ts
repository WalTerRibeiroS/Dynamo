import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../../app.js"
import * as repository from "../../../routes/v1/modules/auth/auth.repository.js";
import { uuidv7 } from "uuidv7";
import { resetDatabase } from "../../resetDatabase.js"

describe("POST /api/v1/auth/register (integração)", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  const validPayload = {
    username: "walter123",
    email: "walter@email.com",
    password: "Senha1234",
  };

  it("cadastra o usuário e retorna 201 com dados públicos + accessToken", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(validPayload);

    expect(response.status).toBe(201);
    expect(response.body.data.createdUser).toMatchObject({
      id: expect.any(String),
      username: "walter123",
      accessToken: expect.any(String),
    });
    expect(response.body.data.createdUser).not.toHaveProperty("password_hash");
    expect(response.body.data.createdUser).not.toHaveProperty("refresh_token_hash");
  });

  it("seta o cookie httpOnly de refreshToken", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(validPayload);

    const cookies = response.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies?.[0]).toMatch(/^refreshToken=/);
    expect(cookies?.[0]).toMatch(/HttpOnly/i);
  });

  //teste para verificar se o schema do zod esta funcionando
  it("retorna erro de validação quando o email é malformado", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({ ...validPayload, email: "não-é-email" });

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
  });

  //teste real com o banco de dados para ver como o service responde
  //diferente de mockar os results ou emitar como o banco vai reagir
  it("retorna erro de negócio quando o email já está em uso", async () => {
    await repository.createUser({
      id:uuidv7(), 
      username:"walter", 
      email: validPayload.email, 
      passwordHash: "hash-fake", 
      refreshTokenHash: "refresh-hash-fake",
    });

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(validPayload);

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
  });
});