const readEnvVars = () => {
  const expected = ["ENV1"];
  return expected.reduce((acc, envVar) => {
    const val = process.env[envVar];
    if (!val) {
      throw new Error(`Environment variable ${envVar} is not set.`);
    }
    return { ...acc, [envVar]: val };
  }, {});
};

const main = () => {
  readEnvVars();
};

main();
