const FreelanceToken = artifacts.require("FreelanceToken");

module.exports = function (deployer) {
  deployer.deploy(FreelanceToken, "FreelanceToken", "FREE", 1000000);
};
