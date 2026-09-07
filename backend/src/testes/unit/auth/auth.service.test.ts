// auth.service.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import { registerUser } from "../../../routes/v1/modules/auth/auth.service.js";
import * as repository from "../../../routes/v1/modules/auth/auth.repository.js";
import { issueAuthTokens } from "../../../routes/v1/modules/auth/auth.tokens.js";
import { ValidationError } from "../../../utils/errors.js";

vi.mock("../../../routes/v1/modules/auth/auth.repository.ts");
vi.mock("../../../routes/v1/modules/auth/auth.tokens.ts");
vi.mock("bcrypt");

describe("registerUser", () => {
  const validInput = {
    username: "walter123",
    email: "walter@email.com",
    password: "Senha1234",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("cria o usuário quando email e username estão livres", async () => {
    // Arrange: configuro o que cada dependência mockada deve devolver
    vi.mocked(repository.emailExists).mockResolvedValue(false);//mock precisa devolver false quando o email está livre. emailExists? → não → false
    vi.mocked(repository.usernameExists).mockResolvedValue(false);
    vi.mocked(bcrypt.hash).mockResolvedValue("hash-fake" as never);
    vi.mocked(issueAuthTokens).mockReturnValue({
      accessToken: "access-fake",
      refreshToken: "refresh-fake",
      refreshTokenHash: "refresh-hash-fake",
    });
    vi.mocked(repository.createUser).mockResolvedValue({
      id: "id-fake",
      username: "walter123",
    });

    // Act
    const result = await registerUser(validInput);

    // Assert
    expect(result.user).toEqual({
      id: "id-fake",
      username: "walter123",
      accessToken: "access-fake",
    });
    expect(result.refreshToken).toBe("refresh-fake");

    expect(bcrypt.hash).toHaveBeenCalledWith("Senha1234", 10);
    expect(repository.createUser).toHaveBeenCalledWith({
      id: expect.any(String),
      username: "walter123",
      email: "walter@email.com",
      passwordHash: "hash-fake",
      refreshTokenHash: "refresh-hash-fake",
    });
  });

  it("lança ValidationError quando o email já está em uso", async () => {
    vi.mocked(repository.emailExists).mockResolvedValue(true);
    vi.mocked(repository.usernameExists).mockResolvedValue(false);

    await expect(registerUser(validInput)).rejects.toThrow(ValidationError);
    expect(repository.createUser).not.toHaveBeenCalled();
  });

  it("lança ValidationError quando o username já está em uso", async () => {
    vi.mocked(repository.emailExists).mockResolvedValue(false);
    vi.mocked(repository.usernameExists).mockResolvedValue(true);

    await expect(registerUser(validInput)).rejects.toThrow(ValidationError);
  });

  it("acumula os dois issues quando email e username já estão em uso", async () => {
    vi.mocked(repository.emailExists).mockResolvedValue(true);
    vi.mocked(repository.usernameExists).mockResolvedValue(true);

    try {
      await registerUser(validInput);
      expect.unreachable("deveria ter lançado ValidationError");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).issues).toHaveLength(2);
    }
  });
});