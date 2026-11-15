import { describe, expect, it } from "vitest";
import { TestDriver } from "testdriverai/vitest/hooks";

describe("Wheelhouse Car Rental", () => {
  it("navigates through landing page and auth forms", async (context) => {
    const testdriver = TestDriver(context);

    const appUrl = process.env.APP_URL || "https://steps-attachment-enough-capital.trycloudflare.com";
    await testdriver.provision.chrome({ url: appUrl });

    const assertLanding = await testdriver.assert("The Wheelhouse landing page is visible with the Wheelhouse heading");
    expect(assertLanding).toBeTruthy();

    await testdriver.find("Log in button").click();

    const assertLogin = await testdriver.assert("The login page is visible with the Welcome back heading and email input");
    expect(assertLogin).toBeTruthy();

    await testdriver.find("Email input field").click();
    await testdriver.type("admin@carrental.com");

    await testdriver.find("Password input field").click();
    await testdriver.type(process.env.TD_SECRET || "Admin123!", { secret: true });

    await testdriver.find("Sign up link").click();

    const assertRegister = await testdriver.assert("The Create your account registration page is visible with First name, Last name, and Email fields");
    expect(assertRegister).toBeTruthy();

    await testdriver.find("Create account button").click();

    const assertValidation = await testdriver.assert("Validation error messages are visible for First name, Last name, Email, and Password");
    expect(assertValidation).toBeTruthy();
  });
});
