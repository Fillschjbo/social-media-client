import { login } from "./login";
import { logout } from "./logout";
import { save, remove } from "../../storage";
import { apiPath } from "../constants";
import { headers } from "../headers";

jest.mock("../../storage", () => ({
  save: jest.fn(),
  load: jest.fn(),
  remove: jest.fn(),
}));

globalThis.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Login function", () => {
  test("stores a token and profile when login is successful", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        accessToken: "valid-token",
        name: "Fillip",
        email: "filliperkul123@mail.com",
      }),
    };

    fetch.mockResolvedValueOnce(mockResponse);

    const profile = await login("filliperkul123@mail.com", "password123");

    expect(fetch).toHaveBeenCalledWith(`${apiPath}/social/auth/login`, {
      method: "post",
      body: JSON.stringify({
        email: "filliperkul123@mail.com",
        password: "password123",
      }),
      headers: headers("application/json"),
    });

    expect(save).toHaveBeenCalledWith("token", "valid-token");
    expect(save).toHaveBeenCalledWith("profile", {
      name: "Fillip",
      email: "filliperkul123@mail.com",
    });

    expect(profile).toEqual({
      name: "Fillip",
      email: "filliperkul123@mail.com",
    });
  });

  test("throws an error when the login fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Unauthorized",
    });

    await expect(
      login("filliperkul123@mail.com", "wrongpassword"),
    ).rejects.toThrow("Unauthorized");

    expect(save).not.toHaveBeenCalled();
  });
});

describe("Logout function", () => {
  test("clears the token and profile from local storage", () => {
    logout();

    expect(remove).toHaveBeenCalledWith("token");
    expect(remove).toHaveBeenCalledWith("profile");
  });
});
