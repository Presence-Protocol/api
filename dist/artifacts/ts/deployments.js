"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDeployments = loadDeployments;
const _1 = require(".");
const _deployments_testnet_json_1 = __importDefault(require("../../deployments/.deployments.testnet.json"));
const _deployments_devnet_json_1 = __importDefault(require("../../deployments/.deployments.devnet.json"));
function toDeployments(json) {
    const contracts = {
        PoapNFT: {
            ...json.contracts["PoapNFT"],
            contractInstance: _1.PoapNFT.at(json.contracts["PoapNFT"].contractInstance.address),
        },
        PoapCollection: {
            ...json.contracts["PoapCollection"],
            contractInstance: _1.PoapCollection.at(json.contracts["PoapCollection"].contractInstance.address),
        },
        PoapFactory: {
            ...json.contracts["PoapFactory"],
            contractInstance: _1.PoapFactory.at(json.contracts["PoapFactory"].contractInstance.address),
        },
    };
    return {
        ...json,
        contracts: contracts,
    };
}
function loadDeployments(networkId, deployerAddress) {
    const deployments = networkId === "testnet"
        ? _deployments_testnet_json_1.default
        : networkId === "devnet"
            ? _deployments_devnet_json_1.default
            : undefined;
    if (deployments === undefined) {
        throw Error("The contract has not been deployed to the " + networkId);
    }
    const allDeployments = Array.isArray(deployments)
        ? deployments
        : [deployments];
    if (deployerAddress === undefined) {
        if (allDeployments.length > 1) {
            throw Error("The contract has been deployed multiple times on " +
                networkId +
                ", please specify the deployer address");
        }
        else {
            return toDeployments(allDeployments[0]);
        }
    }
    const result = allDeployments.find((d) => d.deployerAddress === deployerAddress);
    if (result === undefined) {
        throw Error("The contract deployment result does not exist");
    }
    return toDeployments(result);
}
