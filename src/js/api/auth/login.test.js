// Import the necessary modules and functions
import { login } from "./login"; // adjust path as needed
import { save } from "../../storage"; // adjust path as needed
import { apiPath } from "../constants";
import { headers } from "../headers";

// Mocking the `save` function
jest.mock("../../storage/save", () => ({
  save: jest.fn(),
}));

// Mocking `fetch` globally
globalThis.fetch = jest.fn();

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

describe("Login function", () => {
  // Test: The login function stores a token and profile when login is successful
  test("stores a token and profile when login is successful", async () => {
    // Define the mock response for fetch
    const mockResponse = {
      ok: true,
      json: async () => ({
        accessToken: "valid-token",
        name: "John Doe",
        email: "john@example.com",
      }),
    };

    // Mock fetch to resolve with the mockResponse
    fetch.mockResolvedValueOnce(mockResponse);

    // Call the login function with valid credentials
    const profile = await login("john@example.com", "password123");

    // Check that fetch was called with the correct URL and options
    expect(fetch).toHaveBeenCalledWith(`${apiPath}/social/auth/login`, {
      method: "post",
      body: JSON.stringify({
        email: "john@example.com",
        password: "password123",
      }),
      headers: headers("application/json"),
    });

    // Check that the save function was called with the correct token and profile
    expect(save).toHaveBeenCalledWith("token", "valid-token");
    expect(save).toHaveBeenCalledWith("profile", {
      name: "John Doe",
      email: "john@example.com",
    });

    // Ensure the returned profile does not contain the accessToken
    expect(profile).toEqual({
      name: "John Doe",
      email: "john@example.com",
    });
  });

  // Test: The login function throws an error when the response is not ok
  test("throws an error when the login fails", async () => {
    // Mock the fetch response for an error scenario
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Unauthorized",
    });

    // Expect the login function to throw an error
    await expect(login("john@example.com", "wrongpassword")).rejects.toThrow(
      "Unauthorized",
    );

    // Ensure that save was not called
    expect(save).not.toHaveBeenCalled();
  });
});
