import { Logger } from "seyfert";
import { InvalidEnvironment } from "#mirai/errors";

const logger = new Logger({
  name: "[ENV]",
});

/**
 *
 * Validate Mirai environment variables.
 * @returns
 */
export function validateEnv() {
  logger.info("Validating '.env' file variables...");

  if (!process.env.TOKEN)
    throw new InvalidEnvironment(
      "The variable: 'TOKEN' in the '.env' cannot be empty or undefined."
    );

  return logger.info("I'm not able to found missing variables.");
}
