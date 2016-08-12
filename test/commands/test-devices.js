'use strict';

const assert = require('chai').assert;
const mkdirp = require('mkdirp');
const devicesCommand = require('../../lib/commands/devices').handler;
const rmdir = require('rimraf');
const fs = require('fs');

describe("thingssdk devices", () => {

  const validArguments = {
    port: "COM7",
    baud_rate: "115200",
    runtime: "espruino"
  };

  const otherValidArguments = {
    port: "COM3", 
    runtime: "espruino",
    baud_rate: 9600
  };

  const deviceCheckPath = "tmp/devices-json-check";

  before(done => {
    rmdir(deviceCheckPath, function (error) {
      mkdirp(deviceCheckPath, (err) => {
        done();
      });
    });
  });

  it("should create a `devices.json` in the correct folder", (done) => {
    mkdirp(deviceCheckPath, (err) => {
      process.chdir(deviceCheckPath);
      devicesCommand(validArguments, () => {
        const devices = JSON.parse(fs.readFileSync("./devices.json"));
        const expectedJson = {
          devices: {
            COM7: {
              runtime: "espruino",
              baud_rate: 115200
            }
          }
        };
        assert.deepEqual(devices, expectedJson, "devices.json didn't match expectedJson");
        process.chdir("../..");
        done();
      });
    });
  });


  it("should create a `devices.json` in the correct folder with different params", (done) => {
    mkdirp(deviceCheckPath, (err) => {
      process.chdir(deviceCheckPath);
      devicesCommand(otherValidArguments, () => {
        const devices = JSON.parse(fs.readFileSync("./devices.json"));
        const expectedJson = {
          devices: {
            COM3: {
              runtime: "espruino",
              baud_rate: 9600
            }
          }
        };
        assert.deepEqual(devices, expectedJson, "devices.json didn't match expectedJson");
        process.chdir("../..");
        done();
      });
    });
  });

  after(done => {
    rmdir(deviceCheckPath, function (error) {
      done();
    });
  });
});