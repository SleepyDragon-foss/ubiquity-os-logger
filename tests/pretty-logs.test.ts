import { PrettyLogs } from "../src/pretty-logs";
import { cleanLogString, cleanSpyLogs, tryError } from "../src/utils";

describe("PrettyLogs", () => {
  let logs: PrettyLogs;

  beforeEach(() => {
    logs = new PrettyLogs();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should log an 'ok' message", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation();
    const logReturn = logs.ok("This is an OK message");
    expect(logReturn).toBeUndefined();
    const cleanLogStrings = cleanSpyLogs(logSpy);
    expect(cleanLogStrings).toContain(cleanLogString("✓ This is an OK message"));
  });

  it("should log an 'info' message", () => {
    const logSpy = jest.spyOn(console, "info").mockImplementation();
    const logReturn = logs.info("This is an INFO message");
    expect(logReturn).toBeUndefined();
    const cleanLogStrings = cleanSpyLogs(logSpy);
    expect(cleanLogStrings).toContain(cleanLogString(" › This is an INFO message"));
  });

  it("should log an 'error' message", () => {
    const logSpy = jest.spyOn(console, "warn").mockImplementation();
    const logReturn = logs.error("This is an ERROR message");
    expect(logReturn).toBeUndefined();
    const cleanLogStrings = cleanSpyLogs(logSpy);
    expect(cleanLogStrings).toContain(cleanLogString(" ⚠ This is an ERROR message"));
  });

  it("should log a 'debug' message", () => {
    const logSpy = jest.spyOn(console, "debug").mockImplementation();
    const logReturn = logs.debug("This is a DEBUG message");
    expect(logReturn).toBeUndefined();
    const cleanLogStrings = cleanSpyLogs(logSpy);
    expect(cleanLogStrings).toContain(cleanLogString(" ›› This is a DEBUG message"));
  });

  it("should log a 'fatal' message", () => {
    const logSpy = jest.spyOn(console, "error").mockImplementation();
    const logReturn = logs.fatal("This is a FATAL message");
    expect(logReturn).toBeUndefined();
    const cleanLogStrings = cleanSpyLogs(logSpy);
    expect(cleanLogStrings).toContain(cleanLogString(" × This is a FATAL message"));
  });

  it("should log a 'verbose' message", () => {
    const logSpy = jest.spyOn(console, "debug").mockImplementation();
    const logReturn = logs.verbose("This is a VERBOSE message");
    expect(logReturn).toBeUndefined();
    const cleanLogStrings = cleanSpyLogs(logSpy);
    expect(cleanLogStrings).toContain(cleanLogString(" 💬 This is a VERBOSE message"));
  });

  it("should log metadata", () => {
    const logSpy = jest.spyOn(console, "debug").mockImplementation();
    const logReturn = logs.debug("This is a METADATA message", { thisIsMetadata: true, stuff: Array(5).fill("stuff"), moreStuff: { a: "a", b: "b" } });
    expect(logReturn).toBeUndefined();
    const cleanLogStrings = cleanSpyLogs(logSpy);
    expect(cleanLogStrings).toEqual([
      cleanLogString(` ›› This is a METADATA message${JSON.stringify({ thisIsMetadata: true, stuff: Array(5).fill("stuff"), moreStuff: { a: "a", b: "b" } })}`),
    ]);
  });

  it("should log metadata as a string", () => {
    const logSpy = jest.spyOn(console, "debug").mockImplementation();
    const logReturn = logs.debug("This is a METADATA message", "This is metadata as a string");
    expect(logReturn).toBeUndefined();
    const cleanLogStrings = cleanSpyLogs(logSpy);
    expect(cleanLogStrings).toEqual([cleanLogString(` ›› This is a METADATA message This is metadata as a string`)]);
  });

  it("should log an error and stack", () => {
    const logSpy = jest.spyOn(console, "debug").mockImplementation();
    const logReturn = logs.debug("This is a METADATA message", { error: tryError() });
    expect(logReturn).toBeUndefined();
    const cleanLogStrings = cleanSpyLogs(logSpy);
    expect(cleanLogStrings).toHaveLength(1);
    expect(cleanLogStrings[0]).toContain("ThisisaMETADATAmessage");
    expect(cleanLogStrings[0]).toContain(`"error":{}`);
    const errorRegex = /tryError\(.*?\)↳Object\.<anonymous>\(/;
    expect(cleanLogStrings[0]).toMatch(errorRegex);
  });
});
